// Kaioken Clash (Unity) · Cinemáticas del modo historia con aire de película: bandas negras, cortes con fundido, planos por encima
// del hombro, acercamientos lentos, grúas, títulos grandes y los momentos clave (telequinesis, explosión, danza de la fusión,
// fusión, despertar del Ultra Instinto, guerreros que salen del suelo).
using System.Collections.Generic;
using UnityEngine;

namespace Kaioken
{
    public class CineActor { public string id; public Body body; public CharDef ch; public Vector3 pos, to; public float face, g0, riseT = -1, liftT = -1, bornT = -1; public string pose = "idle"; public bool hasTo, gone, dragon; public float auraLv; }

    public class CinePlayer
    {
        public CineDef sc;
        public World world;
        public int i = -1;
        public float t, typed, fade;
        public bool done;
        public string camMode = "two", lastWho = "";
        public readonly Dictionary<string, CineActor> cast = new Dictionary<string, CineActor>();
        readonly CameraRig rig;
        bool cut;
        float danceT = -1; CineActor dL, dR; Vector3 danceMid;
        CineActor uiA; float uiT;
        public Shot Cur { get { return i >= 0 && i < sc.shots.Count ? sc.shots[i] : null; } }

        public CinePlayer(CineDef def, CameraRig r)
        {
            sc = def; rig = r;
            world = WorldBuilder.Build(def.world, def.v);
            Sound.Music(world.music);
            foreach (var c in def.cast) MakeActor(c.c, c.f, c.x, c.z, c.s, c.under, c.hidden);
            foreach (var a in cast.Values)
            {
                CineActor other = null;
                foreach (var b in cast.Values) if (b != a && !b.dragon) { other = b; break; }
                if (other != null) { var d = other.pos - a.pos; a.face = Mathf.Atan2(d.x, d.z); }
            }
            Next();
        }

        CineActor MakeActor(string id, string form, float x, float z, float s, bool under, bool hidden)
        {
            var a = new CineActor { id = id, pos = new Vector3(x * 1.3f, 0, z * 1.3f) };
            if (id == "shenlong" || id == "sshenlong") { a.dragon = true; a.body = Dragon(id == "sshenlong", x, z); }
            else
            {
                a.ch = GameData.Char(id);
                if (a.ch == null) return null;
                a.body = CharBuilder.Build(a.ch, world.root);
                a.body.aura = new Aura(a.body.root, a.body.height);
                var f = a.ch.forms[a.ch.FormIndex(form)];
                CharBuilder.ApplyForm(a.body, f);
                a.body.aura.SetColor(f.aura);
                a.body.root.localScale = Vector3.one * s;
            }
            float g = world.GroundY(a.pos.x, a.pos.z);
            a.g0 = float.IsNegativeInfinity(g) ? world.spawnY : g;
            a.pos.y = under ? a.g0 - 6 : a.g0;
            if (hidden || under) a.body.root.gameObject.SetActive(false);
            cast[id] = a;
            return a;
        }

        /// <summary>Shenlong (verde) o Súper Shenlong (dorado y con alas): cuerpo de serpiente de esferas, cabeza con cuernos y bigotes.</summary>
        Body Dragon(bool sup, float x, float z)
        {
            var b = new Body { root = new GameObject(sup ? "Súper Shenlong" : "Shenlong").transform };
            b.root.SetParent(world.root, false);
            b.root.position = new Vector3(x * 1.3f, 0, z * 1.3f);
            var body = Pal.Toon(sup ? new Color(1, .76f, .23f) : new Color(.23f, .66f, .29f)); var belly = Pal.Toon(sup ? new Color(1, .54f, .16f) : new Color(.91f, .85f, .54f));
            float S = sup ? 2.2f : 1;
            Vector3 last = Vector3.zero;
            for (int i = 0; i < 60; i++)
            {
                float k = i / 59f;
                var p = new Vector3(Mathf.Sin(k * 7.5f) * 6 * S, k * 34 * S, Mathf.Cos(k * 5.2f) * 4 * S - k * 8 * S);
                float r = (.5f + 1.7f * Mathf.Pow(k, .6f)) * S;
                MeshGen.Part(MeshGen.Sphere, i % 6 < 2 ? belly : body, b.root, p, Vector3.one * r * 2, i % 3 == 0, "cuerpo");
                last = p;
            }
            var head = new GameObject("cabeza").transform; head.SetParent(b.root, false); head.localPosition = last; head.localScale = Vector3.one * S * 2;
            MeshGen.Part(MeshGen.Sphere, body, head, Vector3.zero, new Vector3(2.2f, 1.6f, 2.6f), true, "cráneo");
            MeshGen.Part(MeshGen.Capsule, body, head, new Vector3(0, -.2f, 2), new Vector3(1.4f, .9f, 1.6f), true, "hocico");
            foreach (var s in new[] { -1f, 1f })
            {
                MeshGen.Part(MeshGen.Sphere, Pal.Additive(new Color(1, .1f, .1f)), head, new Vector3(s * .7f, .4f, 1.1f), new Vector3(.5f, .35f, .3f), false, "ojo");
                var h = MeshGen.Part(MeshGen.Cone(.25f, 3.4f), Pal.Toon(new Color(1, .95f, .75f)), head, new Vector3(s * .7f, 1, -.8f), Vector3.one, true, "cuerno");
                h.transform.localRotation = Quaternion.Euler(-60, 0, s * 20);
                var w = MeshGen.Part(MeshGen.Cylinder, Pal.Toon(new Color(1, .95f, .75f)), head, new Vector3(s * 2.5f, -.2f, 2.8f), new Vector3(.08f, 2.2f, .08f), false, "bigote");
                w.transform.localRotation = Quaternion.Euler(0, 0, s * 70);
                if (sup) { var wing = MeshGen.Part(MeshGen.Cube, Pal.Additive(new Color(1, .8f, .3f, .7f)), b.root, last + new Vector3(s * 14 * S, -10 * S, -4), new Vector3(22 * S, .3f, 9 * S), false, "ala"); wing.transform.localRotation = Quaternion.Euler(0, s * 15, s * 18); }
            }
            b.headT = head;
            return b;
        }

        public void Tap() { var s = Cur; if (s != null && typed < s.say.Length) { typed = 1e9f; return; } Next(); }

        public void Next()
        {
            i++; t = 0; typed = 0;
            if (i >= sc.shots.Count) { done = true; return; }
            var s = Cur; CineActor o; cast.TryGetValue(s.who, out o);
            if (o != null && !o.dragon && !string.IsNullOrEmpty(s.pose)) o.pose = s.pose;
            if (s.poses != null) foreach (var kv in s.poses) { CineActor a; if (cast.TryGetValue(kv.Key, out a)) a.pose = kv.Value as string; }
            if (s.aura != null) foreach (var kv in s.aura) { CineActor a; if (cast.TryGetValue(kv.Key, out a)) a.auraLv = kv.Value is double ? (float)(double)kv.Value : 1; }
            if (!string.IsNullOrEmpty(s.form))
            {
                CineActor ft = o != null && !o.dragon ? o : null;
                if (ft == null && !string.IsNullOrEmpty(s.fw)) cast.TryGetValue(s.fw, out ft);
                if (ft == null) foreach (var a in cast.Values) if (!a.dragon && !a.gone) { ft = a; break; }
                if (ft != null) { var f = ft.ch.forms[ft.ch.FormIndex(s.form)]; CharBuilder.ApplyForm(ft.body, f); ft.body.aura.SetColor(f.aura); ft.auraLv = 1.2f; ft.pose = "transform"; Fx.Sparks(ft.pos + Vector3.up, f.aura, 30, 14); Fx.Shake = .6f; Sound.Play("transform"); }
            }
            string fx = s.fx ?? "";
            if (fx.Contains("flash")) fade = -.8f;
            if (fx.Contains("shake")) Fx.Shake = 1.2f;
            if (fx.StartsWith("beam") || fx.StartsWith("hit") || fx.StartsWith("boom"))
            {
                var parts = fx.Split(':'); CineActor tg;
                if (parts.Length > 1 && cast.TryGetValue(parts[1], out tg))
                {
                    if (o != null && !o.dragon) o.pose = fx.StartsWith("beam") ? "beamFire" : "punchR";
                    tg.pose = "hit"; Fx.Explosion(tg.pos + Vector3.up * 1.2f, fx.StartsWith("hit") ? 1 : 2.5f, Color.white); Sound.Play("boom");
                }
            }
            if (s.rise != null) foreach (var id in s.rise) { CineActor a; if (cast.TryGetValue(id, out a)) { a.body.root.gameObject.SetActive(true); a.riseT = 0; } }
            if (!string.IsNullOrEmpty(s.lift)) { CineActor a; if (cast.TryGetValue(s.lift, out a)) { a.liftT = 0; a.pose = "hit"; } }
            if (!string.IsNullOrEmpty(s.explode)) { CineActor a; if (cast.TryGetValue(s.explode, out a)) { Fx.Explosion(a.pos + Vector3.up, 3.5f, new Color(1, .8f, .5f)); fade = -1; a.body.root.gameObject.SetActive(false); a.gone = true; Sound.Play("boom"); } }
            if (s.dance != null && s.dance.Count == 2)
            {
                CineActor a, b;
                if (cast.TryGetValue(s.dance[0], out a) && cast.TryGetValue(s.dance[1], out b))
                {
                    dL = a.pos.x <= b.pos.x ? a : b; dR = dL == a ? b : a; danceMid = (a.pos + b.pos) * .5f; danceT = 0;
                    dL.to = danceMid + Vector3.left * 4; dR.to = danceMid + Vector3.right * 4; dL.hasTo = dR.hasTo = true;
                }
            }
            if (!string.IsNullOrEmpty(s.mergeInto) && s.mergeFrom != null)
            {
                var mid = Vector3.zero; int n = 0;
                foreach (var id in s.mergeFrom) { CineActor a; if (cast.TryGetValue(id, out a)) { mid += a.pos; n++; a.body.root.gameObject.SetActive(false); a.gone = true; } }
                if (n > 0) mid /= n;
                danceT = -1;
                var nw = MakeActor(s.mergeInto, s.mergeForm, mid.x / 1.3f, mid.z / 1.3f, 1, false, false);
                if (nw != null) { nw.auraLv = 1.3f; nw.pose = "powerup"; nw.bornT = 1.2f; }
                fade = -1; Fx.Sparks(mid + Vector3.up, new Color(1, .95f, .6f), 40, 16); Fx.Shake = 1.4f;
            }
            if (!string.IsNullOrEmpty(s.uiwake)) { cast.TryGetValue(s.uiwake, out uiA); uiT = 0; fade = -.6f; }
            if (!string.IsNullOrEmpty(s.hide)) { CineActor a; if (cast.TryGetValue(s.hide, out a)) a.body.root.gameObject.SetActive(false); }
            if (!string.IsNullOrEmpty(s.show)) { CineActor a; if (cast.TryGetValue(s.show, out a)) a.body.root.gameObject.SetActive(true); }
            // plano: corte seco con fundido cuando cambia el tipo de plano o el que habla en un primer plano
            string want = string.IsNullOrEmpty(s.cam) ? "two" : s.cam, m = want;
            if (want == "close" && o != null && !o.dragon && Listener(o) != null && (i * 7 + s.who.Length) % 3 == 1) m = "over";
            if (m != camMode || (want == "close" && lastWho != s.who)) { cut = true; if (fade >= 0) fade = .35f; }
            camMode = m; lastWho = s.who;
        }

        CineActor Listener(CineActor o)
        {
            CineActor best = null; float bd = 1e9f;
            foreach (var a in cast.Values) { if (a == o || a.dragon || a.gone || !a.body.root.gameObject.activeSelf) continue; float d = Vector3.Distance(a.pos, o.pos); if (d < bd) { bd = d; best = a; } }
            return best;
        }

        public void Update(float dt)
        {
            if (done) return;
            var s = Cur; t += dt;
            typed = Mathf.Min(s.say.Length, typed + dt * 42);
            if (typed >= s.say.Length && t > Mathf.Max(2.4f, s.say.Length * .055f + 1.4f)) { Next(); if (done) return; s = Cur; }
            fade = fade > 0 ? Mathf.Max(0, fade - dt * 2.5f) : Mathf.Min(0, fade + dt * 2f);
            foreach (var a in cast.Values)
            {
                if (a.dragon) { a.body.root.rotation = Quaternion.Euler(0, Mathf.Sin(Time.time * .3f) * 12, 0); continue; }
                if (a.gone) continue;
                if (a.hasTo) { a.pos.x = Mathf.Lerp(a.pos.x, a.to.x, 1 - Mathf.Exp(-3 * dt)); a.pos.z = Mathf.Lerp(a.pos.z, a.to.z, 1 - Mathf.Exp(-3 * dt)); }
                if (a.riseT >= 0) { a.riseT += dt; float k = Mathf.Min(1, a.riseT / 1.6f); a.pos.y = a.g0 - 6 + 6 * (1 - Mathf.Pow(1 - k, 3)); if (k < 1 && Random.value < dt * 30) Fx.Spawn(new Vector3(a.pos.x, a.g0 + .2f, a.pos.z) + Random.insideUnitSphere, Vector3.up * 3, new Color(.8f, .78f, .85f, .6f), 1, .8f); if (k >= 1) a.riseT = -1; }
                if (a.liftT >= 0) { a.liftT += dt; float k = Mathf.Min(1, a.liftT / 1.4f); a.pos.y = a.g0 + 4.5f * k; if (Random.value < dt * 25) Fx.Spawn(a.pos + Vector3.up + Random.insideUnitSphere * .6f, Vector3.zero, new Color(.75f, .45f, 1f), .3f, .3f); }
                if (a.bornT >= 0) { a.bornT -= dt; if (Random.value < dt * 40) Fx.Spawn(a.pos + Random.insideUnitSphere * 1.2f + Vector3.up, Vector3.up * 5, new Color(1, .95f, .6f), .4f, .5f); if (a.bornT < 0) a.pose = "victory"; }
                if (a == dL || a == dR)
                {
                    string ph = danceT < .95f ? "A" : danceT < 1.9f ? "B" : "C";
                    a.pose = "fuse" + ph + (a == dL ? "M" : "");
                    if (ph == "B") a.to = danceMid + (a == dL ? Vector3.left : Vector3.right) * 2.5f;
                    if (ph == "C") a.to = danceMid + (a == dL ? Vector3.left : Vector3.right) * 1.35f;
                    a.face = Mathf.Atan2(rig.cam.transform.position.x - a.pos.x, rig.cam.transform.position.z - a.pos.z);
                }
                a.body.root.position = a.pos;
                a.body.root.rotation = Quaternion.Euler(0, a.face * Mathf.Rad2Deg, 0);
                a.body.anim.target = a.pose;
                a.body.anim.Update(dt);
                a.body.aura.target = a.auraLv > 0 ? a.auraLv : (a.pose == "charge" || a.pose == "transform" || a.pose == "powerup" ? 1 : 0);
                a.body.aura.Update(dt);
            }
            if (danceT >= 0) danceT += dt;
            if (uiA != null && uiT < 6) { uiT += dt; for (int k = 0; k < 3; k++) { float an = Time.time * 4 + k * 2.1f; Fx.Spawn(uiA.pos + new Vector3(Mathf.Cos(an) * 1.2f, .3f + (Time.time * 1.5f + k * .33f) % 1 * 2.4f, Mathf.Sin(an) * 1.2f), Vector3.up, new Color(.85f, .9f, 1f), .2f, .5f); } }
            CameraShot(s, dt);
        }

        void CameraShot(Shot s, float dt)
        {
            CineActor o; cast.TryGetValue(s.who, out o);
            var live = new List<CineActor>(); foreach (var a in cast.Values) if (!a.dragon && !a.gone) live.Add(a);
            var cen = Vector3.zero; foreach (var a in live) cen += a.pos; if (live.Count > 0) cen /= live.Count;
            Vector3 tp, lk;
            if (camMode == "shen" || (o != null && o.dragon))
            {
                CineActor d = null; foreach (var a in cast.Values) if (a.dragon) d = a;
                var hp = d != null ? d.body.headT.position : cen + Vector3.up * 20;
                tp = hp + new Vector3(-8, -10, 22); lk = hp + Vector3.down * 2;
            }
            else if (camMode == "sky") { tp = cen + new Vector3(0, 2.5f, 22); lk = cen + Vector3.up * 10; }
            else if (camMode == "over" && o != null)
            {
                var L = Listener(o);
                if (L != null) { var d = o.pos - L.pos; d.y = 0; d.Normalize(); var side = new Vector3(d.z, 0, -d.x); tp = L.pos - d * 1.8f + side * .8f + Vector3.up * 1.75f; lk = o.pos + Vector3.up * 1.5f; }
                else { tp = o.pos + new Vector3(0, 1.6f, 3); lk = o.pos + Vector3.up * 1.4f; }
                tp = Vector3.Lerp(tp, lk, Mathf.Clamp(t / 6, 0, .18f));
            }
            else if (camMode == "close" && o != null)
            {
                var fw = new Vector3(Mathf.Sin(o.face), 0, Mathf.Cos(o.face)); var r = new Vector3(fw.z, 0, -fw.x);
                tp = o.pos + fw * 2.6f + r * .7f + Vector3.up * 1.6f; lk = o.pos + Vector3.up * 1.5f;
                tp = Vector3.Lerp(tp, lk, Mathf.Clamp01(t / 5) * .32f); // acercamiento lento
            }
            else if (camMode == "low" && o != null)
            {
                var fw = new Vector3(Mathf.Sin(o.face), 0, Mathf.Cos(o.face));
                tp = o.pos + fw * 3.6f + Vector3.up * (.4f + Mathf.Clamp01(t / 4) * .6f); lk = o.pos + Vector3.up * 1.7f;
            }
            else if (camMode == "wide") { float a = Time.time * .12f; tp = cen + new Vector3(Mathf.Cos(a) * 18, 7 + Mathf.Clamp01(t / 5) * 3.5f, Mathf.Sin(a) * 18); lk = cen + Vector3.up * 1.5f; }
            else
            {
                Vector3 ab = Vector3.right; float sep = 4;
                if (live.Count > 1) { ab = live[1].pos - live[0].pos; ab.y = 0; sep = ab.magnitude; ab.Normalize(); }
                var n = new Vector3(-ab.z, 0, ab.x);
                tp = cen + n * (5 + sep * .8f) + Vector3.up * 2 + ab * ((Mathf.Clamp01(t / 5) - .5f) * 2.4f); lk = cen + Vector3.up * 1.3f;
            }
            float gy = world.GroundY(tp.x, tp.z); if (!float.IsNegativeInfinity(gy) && tp.y < gy + .8f) tp.y = gy + .8f;
            rig.Shot(tp, lk, dt, cut); cut = false;
        }

        public void Dispose() { world.Destroy(); }
    }
}
