// Kaioken Clash (Unity) · Luchador: movimiento 3D libre (vuelo), combos, ki, especiales, transformaciones, Kaioken y daño por poder.
// La fórmula de daño es la de la web: daño = base × (poder atacante / poder defensor)^0,55, con «muro de poder» si es 20 veces menor.
using System.Collections.Generic;
using UnityEngine;

namespace Kaioken
{
    public struct FInput
    {
        public Vector3 move;          // dirección en el mundo (ya relativa a la cámara)
        public bool up, down, guard, charge;
        public bool light, heavy, ki, special, special2, ult, transUp, transDown, vanish, kaioken;
    }

    public class Fighter
    {
        public CharDef ch;
        public Body body;
        public int idx, team;
        public bool cpu, isBoss;
        public float hp, maxHp, ki = 3, invuln, stun, fatigue;
        public int formIdx, kkL, combo, comboHits;
        public double basePower;
        public List<int> allowed;
        public string state = "idle", ver;
        public Vector3 pos, vel;
        public float face, stT, atkT, cool, chargeSnd, koT;
        public Fighter opp;
        public AI ai;
        public FInput inp;
        public bool lockOn = true;
        Special sp;
        int pendingForm = -1;
        string pose = "idle";
        public float giant = 1;
        public float minHpFrac;

        public FormDef Form { get { return ch.forms[Mathf.Clamp(formIdx, 0, ch.forms.Count - 1)]; } }
        public double RealPower { get { return basePower * Form.mult * (kkL > 0 ? kkL : 1); } }
        public double Power { get { return RealPower; } }
        public bool Down { get { return state == "ko"; } }
        public float Height { get { return body.height * giant; } }
        public Vector3 Chest { get { return pos + Vector3.up * Height * .62f; } }
        public Vector3 Fwd { get { return new Vector3(Mathf.Sin(face), 0, Mathf.Cos(face)); } }
        public Vector3 Hand(int side) { var r = new Vector3(Fwd.z, 0, -Fwd.x); return Chest + Fwd * .5f + r * (side * .3f); }

        public Fighter(CharDef c, int index, int teamId, Transform parent)
        {
            ch = c; idx = index; team = teamId;
            body = CharBuilder.Build(c, parent);
            body.aura = new Aura(body.root, body.height);
            basePower = c.basePower;
            maxHp = hp = GameData.MaxHp;
            SetForm(0, true);
        }

        public bool Allowed(int i) { return allowed == null || allowed.Contains(i); }

        public void SetForm(int i, bool silent = false)
        {
            formIdx = Mathf.Clamp(i, 0, ch.forms.Count - 1);
            CharBuilder.ApplyForm(body, Form, Match.Cur != null ? Match.Cur.OutfitFor(this) : null);
            body.aura.SetColor(kkL > 0 ? new Color(1, .2f, .2f) : Form.aura);
            body.aura.bolt = Form.bolt;
            giant = Form.giant > 0 ? Form.giant : 1;
            body.root.localScale = Vector3.one * giant;
            if (!silent) { Fx.Sparks(Chest, Form.aura, 30, 14, .35f); Fx.Shake = Mathf.Max(Fx.Shake, .6f); Sound.Play("transform"); }
        }

        public void Reset(Vector3 at, float faceAng)
        {
            pos = at; vel = Vector3.zero; face = faceAng; state = "idle"; stun = 0; sp = null; pendingForm = -1; kkL = 0; combo = 0; comboHits = 0;
            hp = maxHp; ki = 3; fatigue = 0;
            SetForm(allowed != null && allowed.Count > 0 ? allowed[0] : 0, true);
            Sync(0);
        }

        // ---------- daño ----------
        public static bool Hit(Fighter att, Fighter def, float baseDmg, string kind, float knock = 0, bool full = false)
        {
            if (def.Down || def.invuln > 0 || Match.Cur == null || Match.Cur.phase != "fight") return false;
            if (def.state == "transform") { Fx.Sparks(def.Chest, def.Form.aura, 5, 8); return false; }
            // esquiva instintiva (Ultra Instinto, Whis, Gogeta)
            float dodge = def.Form.ui + def.ch.evade;
            if (dodge > 0 && kind != "ult" && Random.value < dodge)
            {
                var side = new Vector3(def.Fwd.z, 0, -def.Fwd.x) * (Random.value < .5f ? 1 : -1);
                def.vel = side * 18; def.state = "dodge"; def.stT = .25f;
                Match.Pop(def, "¡ESQUIVA!", new Color(.9f, .95f, 1f));
                return false;
            }
            double R = att.Power / System.Math.Max(1, def.Power);
            float dmg;
            if (R <= 1.0 / 20)
            {
                if (!(kind == "ult" && full)) { Match.Pop(def, "SIN EFECTO", Color.gray); Fx.Sparks(def.Chest, Color.white, 4, 6); return false; }
                dmg = baseDmg * .1f;
            }
            else
            {
                if (kind == "blast" && R <= .25) { Match.Pop(def, "DESVIADO", Color.gray); return false; }
                dmg = baseDmg * Mathf.Clamp((float)System.Math.Pow(R, .55), .02f, 40f) * Mathf.Max(.4f, 1 - .06f * att.comboHits);
            }
            if (att.cpu && !def.cpu) dmg *= Match.Cur.DiffDmg;
            bool guarding = def.state == "guard" && Vector3.Dot(def.Fwd, (att.pos - def.pos).normalized) > .2f && kind != "ult";
            if (guarding) dmg *= .25f;
            def.hp -= dmg;
            if (def.hp < def.maxHp * def.minHpFrac) def.hp = def.maxHp * def.minHpFrac;
            att.comboHits++; att.ki = Mathf.Min(GameData.KiMax, att.ki + (kind == "light" ? .1f : .2f)); def.ki = Mathf.Min(GameData.KiMax, def.ki + .08f);
            bool big = kind != "light";
            Fx.Sparks(def.Chest, guarding ? new Color(.6f, .85f, 1f) : (big ? new Color(1, .88f, .55f) : Color.white), big ? 16 : 9, big ? 18 : 11, big ? .4f : .25f);
            Fx.Shake = Mathf.Max(Fx.Shake, big ? .6f : .2f);
            Match.Cur.hitstop = Mathf.Max(Match.Cur.hitstop, kind == "light" ? .04f : .09f);
            Sound.Play(big ? "hitH" : "hitL");
            if (R >= 4 && big) Match.Pop(def, Random.value < .5f ? "¡BAKOOM!" : "¡DOOM!", Color.white);
            if (!guarding && def.state != "transform")
            {
                def.sp = null;
                if (knock > 0) { var d = (def.pos - att.pos); d.y = 0; d.Normalize(); d.y = .2f; def.vel = d.normalized * knock * (1 + .3f * Mathf.Log10(Mathf.Max(1, (float)R))); def.state = "knock"; def.stT = .6f; }
                else { def.state = "hit"; def.stT = .3f; def.vel = att.Fwd * 3; }
            }
            if (def.hp <= 0) { def.hp = 0; def.KO(); }
            return true;
        }

        public void KO()
        {
            state = "ko"; koT = 0; sp = null; kkL = 0;
            Match.Pop(this, "¡K.O.!", new Color(1, .4f, .3f));
            Match.Cur.OnKO(this);
        }

        // ---------- transformaciones y Kaioken ----------
        int NextForm(int dir)
        {
            int[] ord = ch.order;
            int n = ch.forms.Count;
            var list = new List<int>();
            if (ord != null) list.AddRange(ord); else for (int i = 0; i < n; i++) list.Add(i);
            int p = list.IndexOf(formIdx), kk = -1;
            for (int k = p + dir; k >= 0 && k < list.Count; k += dir)
            {
                int i = list[k];
                if (!Allowed(i)) continue;
                if (dir > 0 && ch.forms[i].kk) { if (kk < 0) kk = i; continue; } // al subir se prefiere la siguiente forma que no sea Kaioken
                return i;
            }
            return kk;
        }

        void TryTransform(int dir)
        {
            int j = NextForm(dir);
            if (j < 0) { if (dir > 0) Match.Pop(this, "Sin más formas", Color.gray); return; }
            float cost = Mathf.Max(0, ch.forms[j].cost - Form.cost) * .5f;
            if (dir > 0 && ki < cost) { Match.Pop(this, "Ki insuficiente", new Color(.6f, .9f, 1f)); return; }
            if (dir > 0) ki -= cost;
            pendingForm = j; state = "transform"; stT = dir > 0 ? 1.1f : .3f; vel = Vector3.zero;
            if (dir > 0) { Match.Cur.CineTransform(this); Sound.Play("charge"); }
        }

        bool CanKaioken { get { return ch.id == "goku" || ch.id == "vegetto"; } }

        void CycleKaioken()
        {
            if (!CanKaioken || Form.kk) return;
            int[] lv = { 0, 3, 10, 20 };
            int i = System.Array.IndexOf(lv, kkL);
            kkL = lv[(i + 1) % lv.Length];
            if (kkL > 0) { ki = Mathf.Max(0, ki - .4f); Match.Pop(this, "¡KAIOKEN x" + kkL + "!", new Color(1, .3f, .3f)); Fx.Sparks(Chest, new Color(1, .2f, .2f), 24, 12); Sound.Play("transform"); }
            body.aura.SetColor(kkL > 0 ? new Color(1, .2f, .25f) : Form.aura);
        }

        // ---------- bucle ----------
        public void Update(float dt)
        {
            var w = Match.Cur.world;
            invuln -= dt; cool -= dt; stT -= dt;
            if (Down) { koT += dt; vel *= .95f; vel.y -= 20 * dt; pose = "down"; Move(dt, w); Sync(dt); return; }
            if (opp == null || opp.Down) opp = Match.Cur.NearestEnemy(this);
            var to = opp != null ? opp.pos - pos : Fwd; to.y = 0;
            float dist = opp != null ? Vector3.Distance(pos, opp.pos) : 99;
            // ki de la forma y Kaioken
            if (Form.cost > 0 && state != "transform") { ki -= Form.cost * .002f * GameData.KiMax * dt; if (ki <= 0) { ki = 0; SetForm(allowed != null ? allowed[0] : 0); Match.Pop(this, "SIN KI", Color.gray); } }
            if (Form.hpDrain > 0) hp = Mathf.Max(maxHp * .05f, hp - maxHp * Form.hpDrain * dt);
            if (kkL > 0)
            {
                float d = (kkL >= 20 ? .07f : kkL >= 10 ? .035f : .015f) * (Form.mult > 1 ? 1.6f : 1);
                hp -= maxHp * d * dt;
                if (hp < maxHp * .06f) { hp = maxHp * .05f; kkL = 0; Match.Pop(this, "EL CUERPO NO AGUANTA", new Color(1, .7f, .45f)); body.aura.SetColor(Form.aura); }
            }
            bool lockFace = state != "knock" && state != "dodge";
            bool freeFace = !lockOn && inp.move.sqrMagnitude > .04f && (state == "idle" || state == "move") && dist > 7;
            if (lockFace)
            {
                float want = freeFace ? Mathf.Atan2(inp.move.x, inp.move.z) : (to.sqrMagnitude > .01f ? Mathf.Atan2(to.x, to.z) : face);
                face = Mathf.LerpAngle(face * Mathf.Rad2Deg, want * Mathf.Rad2Deg, 1 - Mathf.Exp(-14 * dt)) * Mathf.Deg2Rad;
            }
            Vector3 wantVel = Vector3.zero;
            float spd = Mathf.Clamp(Mathf.Pow((float)(Power / System.Math.Max(1, opp != null ? opp.Power : Power)), .25f), .6f, 2.5f) * (1 - .3f * fatigue);
            bool free = false;
            var P = inp;
            if (P.kaioken) CycleKaioken();
            switch (state)
            {
                case "idle":
                case "move":
                case "guard":
                case "charge":
                    if (Match.Cur.phase != "fight") { pose = "idle"; break; }
                    if (P.ult) { DoSpecial("ult"); break; }
                    if (P.special) { DoSpecial("s1"); break; }
                    if (P.special2) { DoSpecial("s2"); break; }
                    if (P.transUp) { TryTransform(1); break; }
                    if (P.transDown) { TryTransform(-1); break; }
                    if (P.vanish && ki >= .5f && opp != null) { ki -= .5f; pos = opp.pos - opp.Fwd * 2f; Fx.Sparks(Chest, Color.white, 10, 8); Sound.Play("tele"); break; }
                    if (P.light && cool <= 0) { combo = combo % 5 + 1; StartAttack(combo); break; }
                    if (P.heavy && cool <= 0) { StartAttack(6); break; }
                    if (P.ki && ki >= .25f && cool <= 0) { ki -= .25f; cool = .22f; FireBlast(120, Form.aura, combo % 2 == 0 ? 1 : -1); pose = "blastR"; break; }
                    if (P.guard) { state = "guard"; pose = "guard"; break; }
                    if (P.charge) { state = "charge"; pose = "charge"; ki = Mathf.Min(GameData.KiMax, ki + 1.3f * dt); fatigue = Mathf.Max(0, fatigue - .1f * dt); body.aura.target = 1; break; }
                    state = "idle"; free = true;
                    break;
                case "attack":
                    atkT += dt; free = false;
                    if (!attackHit && atkT >= atkHitAt)
                    {
                        attackHit = true;
                        if (opp != null && dist < 2.2f * giant + 1 && Vector3.Dot(Fwd, to.normalized) > .2f)
                        {
                            bool fin = atkStep == 5 || atkStep == 6;
                            Hit(this, opp, atkStep == 6 ? 300 : 120, atkStep == 6 ? "heavy" : "light", fin ? 22 : 0);
                        }
                    }
                    if (dist > 1.6f && opp != null) wantVel = to.normalized * 9;
                    if (atkT >= atkDur) { state = "idle"; cool = atkStep == 5 || atkStep == 6 ? .35f : .05f; if (atkStep >= 5) combo = 0; }
                    break;
                case "special":
                    if (sp == null) { state = "idle"; break; }
                    sp.Update(dt); pose = sp.pose;
                    if (sp.done) { sp = null; state = "idle"; }
                    break;
                case "transform":
                    pose = "transform"; body.aura.target = 1.2f;
                    if (Random.value < dt * 40) Fx.Spawn(pos + new Vector3(Random.Range(-1.2f, 1.2f), Random.Range(0, .5f), Random.Range(-1.2f, 1.2f)), Vector3.up * Random.Range(6, 14), ch.forms[Mathf.Max(0, pendingForm)].aura, .3f, .6f);
                    if (stT <= 0) { if (pendingForm >= 0) SetForm(pendingForm); pendingForm = -1; state = "idle"; }
                    break;
                case "hit": pose = "hit"; vel *= Mathf.Max(0, 1 - 6 * dt); if (stT <= 0) state = "idle"; break;
                case "knock":
                    pose = "knock"; vel *= Mathf.Max(0, 1 - 1.6f * dt);
                    if (stT <= 0 && vel.magnitude < 10) { state = "idle"; invuln = .5f; }
                    break;
                case "dodge": pose = "dodgeL"; vel *= Mathf.Max(0, 1 - 5 * dt); if (stT <= 0) state = "idle"; break;
                case "victory": pose = "victory"; vel = Vector3.zero; break;
            }
            if (state != "charge" && !(state == "special")) body.aura.target = Form.auraOn || Form.mult >= 40 || kkL > 0 ? .42f : 0;
            if (free)
            {
                var mv = P.move; mv.y = 0;
                if (mv.sqrMagnitude > 1) mv.Normalize();
                if (opp != null && dist < 1.6f && Vector3.Dot(mv, to.normalized) > 0) mv -= to.normalized * Vector3.Dot(mv, to.normalized);
                wantVel = mv * 15 * spd;
                wantVel.y = ((P.up ? 1 : 0) - (P.down ? 1 : 0)) * 11 * spd;
                float ml = mv.magnitude;
                pose = ml > .3f ? (Vector3.Dot(mv, Fwd) < -.3f * ml ? "back" : "fly") : "idle";
                if (ml > .3f && Form.mult >= 40 && Random.value < .3f) Fx.Spawn(Chest, -mv * 2, Form.aura, .3f, .2f);
            }
            if (state != "knock" && state != "hit" && state != "dodge") vel = Vector3.Lerp(vel, wantVel, 1 - Mathf.Exp(-10 * dt));
            if (state == "charge" || state == "guard" || state == "transform") vel *= Mathf.Max(0, 1 - 10 * dt);
            Move(dt, w);
            fatigue = Mathf.Clamp01(fatigue + (state == "attack" ? .04f : -.08f) * dt);
            Sync(dt);
        }

        int atkStep; float atkDur, atkHitAt; bool attackHit;
        static readonly string[] atkPoses = { "punchL", "punchR", "kick", "kickHigh", "uppercut", "windup" };

        void StartAttack(int step)
        {
            atkStep = step; atkT = 0; attackHit = false;
            atkDur = step >= 5 ? .4f : .26f; atkHitAt = step >= 5 ? .14f : .08f;
            pose = atkPoses[Mathf.Clamp(step - 1, 0, 5)];
            if (step == 6) pose = "uppercut";
            state = "attack";
            Sound.Play("swing");
        }

        public void FireBlast(float dmg, Color c, int side, float homing = 1.2f, float speed = 48)
        {
            var from = Hand(side);
            var target = opp != null ? opp.Chest : from + Fwd * 10;
            Match.Cur.AddProjectile(new Projectile(this, from, (target - from).normalized * speed, dmg, c, .3f, homing, "blast"));
            Sound.Play("blast");
        }

        void DoSpecial(string which)
        {
            var t = which == "ult" ? ch.ult : which == "s2" ? ch.s2 : ch.s1;
            if (t == null) return;
            float cost = which == "ult" ? 4 : t.type == "barrage" ? 1 : 2;
            if (ki < cost) { Match.Pop(this, "Ki insuficiente (" + cost + ")", new Color(.6f, .9f, 1f)); return; }
            bool full = which == "ult" && ki >= GameData.KiMax - .01f;
            ki -= cost;
            sp = new Special(this, t, which == "ult", full);
            state = "special";
            Match.Pop(this, t.name + "!", t.color);
            if (which == "ult") Match.Cur.CineUlt(this);
        }

        void Move(float dt, World w)
        {
            pos += vel * dt;
            float g = w.GroundY(pos.x, pos.z);
            if (!float.IsNegativeInfinity(g) && pos.y < g) { pos.y = g; if (vel.y < 0) vel.y = 0; }
            if (w.noGround && pos.y < -30) pos.y = -30;
            if (pos.y > w.maxY) pos.y = w.maxY;
            float hr = Mathf.Sqrt(pos.x * pos.x + pos.z * pos.z);
            if (hr > w.bound) { pos.x *= w.bound / hr; pos.z *= w.bound / hr; }
            foreach (var r in w.rocks)
            {
                if (!r.alive) continue;
                float dx = pos.x - r.x, dz = pos.z - r.z, dd = Mathf.Sqrt(dx * dx + dz * dz);
                if (dd < r.r + .4f && pos.y < r.top - .1f && pos.y > r.y0 - 2)
                {
                    if (r.top - pos.y < 1.6f) pos.y = r.top;
                    else { float k = (r.r + .4f) / Mathf.Max(dd, .01f); pos.x = r.x + dx * k; pos.z = r.z + dz * k; }
                }
            }
            if (opp != null && !opp.Down)
            {
                var d = pos - opp.pos; d.y = 0;
                if (d.magnitude < 1.1f) { if (d.sqrMagnitude < 1e-4f) d = Vector3.right; pos += d.normalized * (1.1f - d.magnitude) * .5f; }
            }
        }

        void Sync(float dt)
        {
            body.root.position = pos;
            body.root.rotation = Quaternion.Euler(Down ? -80 : state == "knock" ? -25 : 0, face * Mathf.Rad2Deg, 0);
            body.anim.target = pose;
            body.anim.Update(dt * (Match.Cur != null ? Match.Cur.timeScale : 1));
            body.aura.Update(dt);
            if (kkL > 0 && Random.value < dt * 10) Fx.Spawn(pos + new Vector3(Random.Range(-.5f, .5f), Random.Range(0, Height), Random.Range(-.5f, .5f)), Vector3.up * 4, new Color(1, .2f, .2f), .3f, .4f);
        }

        public void Destroy() { if (body != null && body.root != null) Object.Destroy(body.root.gameObject); }
    }
}
