// Kaioken Clash (Unity) · Técnicas especiales con forma propia: rayo (Kamehameha), esfera, ráfaga, lluvia de ki que converge,
// Hakai, Kienzan, Makankosappo, espada de ki, Genkidama, Hellzone, mirada de Jiren, barrera y meteoros.
using System.Collections.Generic;
using UnityEngine;

namespace Kaioken
{
    public class Projectile
    {
        public Fighter owner;
        public Vector3 pos, vel;
        public float dmg, r, homing, life, spd, delay;
        public string kind;
        public Color color;
        public GameObject go;
        public bool dead, isU, full;

        public Projectile(Fighter o, Vector3 p, Vector3 v, float d, Color c, float radius, float hom, string k, GameObject mesh = null)
        {
            owner = o; pos = p; vel = v; dmg = d; color = c; r = radius; homing = hom; kind = k; spd = v.magnitude;
            go = mesh ?? MakeOrb(c, radius);
            go.transform.position = p;
        }

        public static GameObject MakeOrb(Color c, float r)
        {
            var g = new GameObject("ki");
            MeshGen.Part(MeshGen.Sphere, Pal.Additive(Color.white), g.transform, Vector3.zero, Vector3.one * r * 1.1f, false, "núcleo");
            MeshGen.Part(MeshGen.Sphere, Pal.Additive(new Color(c.r, c.g, c.b, .6f)), g.transform, Vector3.zero, Vector3.one * r * 2.6f, false, "brillo");
            return g;
        }

        public void Update(float dt)
        {
            life += dt;
            var t = owner != null ? owner.opp : null;
            if (t != null && !t.Down && homing > 0 && life >= delay)
            {
                var want = (t.Chest - pos).normalized * spd;
                vel = Vector3.Lerp(vel, want, Mathf.Min(1, homing * dt));
                if (vel.sqrMagnitude > 1e-6f) vel = vel.normalized * spd; // no pierde velocidad al girar
            }
            pos += vel * dt;
            go.transform.position = pos;
            if (kind == "disc") go.transform.Rotate(0, 900 * dt, 0);
            if (Random.value < .5f) Fx.Spawn(pos, Vector3.zero, color, r * 1.2f, .15f);
            var w = Match.Cur.world;
            foreach (var e in Match.Cur.fighters)
            {
                if (e.team == owner.team || e.Down) continue;
                if (Vector3.Distance(pos, e.Chest) < r + .7f * e.giant)
                {
                    bool ok = Fighter.Hit(owner, e, dmg, isU ? "ult" : kind == "blast" ? "blast" : "special", kind == "ball" ? 26 : 0, full);
                    if (kind == "ball") Fx.Explosion(pos, r * 1.4f, color); else Fx.Sparks(pos, color, 8, 8);
                    if (ok || kind != "blast") { dead = true; return; }
                }
            }
            float g = w.GroundY(pos.x, pos.z);
            if (!float.IsNegativeInfinity(g) && pos.y < g) { dead = true; if (kind == "ball") Fx.Explosion(pos, r * 1.4f, color); else Fx.Sparks(pos, color, 5, 6); return; }
            foreach (var rk in w.rocks)
                if (rk.alive && (pos.x - rk.x) * (pos.x - rk.x) + (pos.z - rk.z) * (pos.z - rk.z) < (rk.r + r) * (rk.r + r) && pos.y < rk.top && pos.y > rk.y0)
                { dead = true; Fx.Sparks(pos, color, 6, 6); return; }
            if (life > (kind == "ball" ? 6 : 3.2f)) dead = true;
        }

        public void Destroy() { if (go != null) Object.Destroy(go); }
    }

    /// <summary>Rayo continuo (Kamehameha, Final Flash…): crece desde la mano hacia el rival y hace daño al tocarlo.</summary>
    public class Beam
    {
        public Fighter owner; public Vector3 origin, dir; public float head, speed, w, dmg, t; public Color color; public bool alive = true, spiral, isU, full;
        readonly Transform core, glow; readonly List<GameObject> rings = new List<GameObject>();
        public GameObject root;

        public Beam(Fighter o, Vector3 from, Vector3 d, float width, float damage, Color c, bool sp, bool ult, bool fullKi)
        {
            owner = o; origin = from; dir = d.normalized; w = width; dmg = damage; color = c; spiral = sp; isU = ult; full = fullKi;
            speed = sp ? 120 : ult ? 62 : 75;
            root = new GameObject("rayo");
            core = MeshGen.Part(MeshGen.Cylinder, Pal.Additive(Color.white), root.transform, Vector3.zero, Vector3.one, false, "núcleo").transform;
            glow = MeshGen.Part(MeshGen.Cylinder, Pal.Additive(new Color(c.r, c.g, c.b, .65f)), root.transform, Vector3.zero, Vector3.one, false, "brillo").transform;
        }

        public void Update(float dt)
        {
            t += dt;
            if (!alive) return;
            head = Mathf.Min(head + speed * dt, 160);
            var tip = origin + dir * head;
            root.transform.position = origin + dir * head * .5f;
            root.transform.rotation = Quaternion.FromToRotation(Vector3.up, dir);
            core.localScale = new Vector3(w * .55f, head * .5f, w * .55f);
            glow.localScale = new Vector3(w * 1.25f * (1 + Mathf.Sin(t * 40) * .06f), head * .5f, w * 1.25f);
            Fx.Spawn(tip, Random.onUnitSphere * 3, color, w * 1.6f, .15f);
            if (spiral && Random.value < dt * 30)
            {
                var ring = MeshGen.Part(MeshGen.Torus(w * 1.4f, .05f), Pal.Additive(new Color(1, .95f, .6f, .9f)), null, origin + dir * Random.Range(0, head), Vector3.one, false, "aro");
                ring.transform.rotation = Quaternion.FromToRotation(Vector3.up, dir);
                Object.Destroy(ring, .3f);
            }
            foreach (var e in Match.Cur.fighters)
            {
                if (e.team == owner.team || e.Down) continue;
                var rel = e.Chest - origin; float along = Vector3.Dot(rel, dir);
                if (along < 0 || along > head) continue;
                if ((rel - dir * along).magnitude < w + .6f * e.giant)
                {
                    Fighter.Hit(owner, e, dmg, isU ? "ult" : "special", 30, full);
                    Fx.Explosion(e.Chest, w * 2.2f, color);
                    alive = false; break;
                }
            }
            if (head >= 160) alive = false;
        }

        public void Destroy() { if (root != null) Object.Destroy(root); }
    }

    public class Special
    {
        readonly Fighter f; readonly TechDef s; readonly bool isU, full;
        public string pose = "beamCharge"; public bool done;
        float t; int fired; string phase = "charge"; GameObject held; Beam beam; readonly List<GameObject> orbs = new List<GameObject>();
        Vector3 mark; bool marked;

        public Special(Fighter fighter, TechDef tech, bool ult, bool fullKi) { f = fighter; s = tech; isU = ult; full = fullKi; }

        float Pow(float def) { return s.pow > 0 ? s.pow : def; }

        public void Update(float dt)
        {
            t += dt;
            switch (s.type)
            {
                case "beam":
                case "spiral": BeamUpdate(s.type == "spiral" || s.thin); break;
                case "ball":
                case "genki":
                case "hakai":
                case "disc": BallUpdate(); break;
                case "rain":
                case "hellzone": RainUpdate(); break;
                case "sword":
                case "rush": SwordUpdate(dt); break;
                case "glare":
                    pose = "charge";
                    if (!marked && f.opp != null) { marked = true; mark = f.opp.Chest; Fx.Spawn(mark, Vector3.zero, s.color, 3, .45f); }
                    if (t >= .45f && phase == "charge") { phase = "done"; Fx.Explosion(mark, isU ? 2.4f : 1.4f, s.color); if (f.opp != null && Vector3.Distance(f.opp.Chest, mark) < 3.5f) Fighter.Hit(f, f.opp, Pow(isU ? 2600 : 1300), isU ? "ult" : "special", 20, full); }
                    if (t > .65f) done = true;
                    break;
                case "barrier":
                    pose = "charge";
                    if (t >= .3f && phase == "charge") { phase = "done"; Fx.Spawn(f.Chest, Vector3.zero, s.color, isU ? 14 : 10, .45f, 4); foreach (var e in Match.Cur.fighters) if (e.team != f.team && Vector3.Distance(e.Chest, f.Chest) < (isU ? 8 : 6)) Fighter.Hit(f, e, Pow(1200), "special", 30, full); }
                    if (t > .7f) done = true;
                    break;
                case "meteors":
                    pose = "raise";
                    while (fired < (int)Mathf.Min(isU ? 12 : 7, t / 1.2f * (isU ? 12 : 7)) && f.opp != null)
                    {
                        fired++;
                        var from = f.opp.pos + new Vector3(Random.Range(-9, 9), Random.Range(26, 34), Random.Range(-9, 9));
                        var rock = new GameObject("meteoro");
                        MeshGen.Part(MeshGen.Sphere, Pal.Toon(new Color(.35f, .22f, .16f)), rock.transform, Vector3.zero, Vector3.one * 1.6f, true, "roca");
                        MeshGen.Part(MeshGen.Sphere, Pal.Additive(new Color(1, .5f, .2f, .6f)), rock.transform, Vector3.zero, Vector3.one * 3, false, "fuego");
                        Match.Cur.AddProjectile(new Projectile(f, from, (f.opp.Chest - from).normalized * 34, Pow(1400) / 4, new Color(1, .5f, .2f), .9f, .5f, "ball", rock));
                    }
                    if (t > 1.4f) done = true;
                    break;
                default: // ráfaga de ki y absorción
                    pose = ((int)(t * 10) % 2 == 0) ? "blastR" : "blastL";
                    while (fired < Mathf.Min(9, (int)(t / .1f))) { fired++; f.FireBlast(Pow(110), s.color, fired % 2 == 0 ? 1 : -1, .8f, 52); }
                    if (t >= .9f) done = true;
                    break;
            }
        }

        void BeamUpdate(bool thin)
        {
            float dur = isU ? 1.2f : .55f;
            if (phase == "charge")
            {
                pose = "beamCharge";
                Fx.Spawn(f.Hand(-1) + Random.onUnitSphere * 1.5f, Vector3.zero, s.color, .2f, .25f);
                if (t >= dur)
                {
                    phase = "fire"; t = 0;
                    var from = f.Hand(0); var to = f.opp != null ? f.opp.Chest : from + f.Fwd * 20;
                    float w = s.w > 0 ? s.w : (thin ? .22f : isU ? 1.15f : .55f);
                    beam = new Beam(f, from, to - from, w, Pow(isU ? 2800 : thin ? 1100 : 1400), s.color, s.type == "spiral", isU, full);
                    Match.Cur.beams.Add(beam);
                    Sound.Play("beam");
                }
            }
            else { pose = "beamFire"; if (beam == null || !beam.alive || t > 3) { if (beam != null) beam.alive = false; done = true; } }
        }

        void BallUpdate()
        {
            bool genki = s.type == "genki", hakai = s.type == "hakai", disc = s.type == "disc";
            float R = s.size > 0 ? s.size : genki ? (isU ? 6 : 3) : hakai ? (isU ? 2.2f : 1.3f) : disc ? (isU ? 2.2f : 1.1f) : (isU ? 3.6f : .9f);
            float dur = genki ? 2f : disc ? .6f : hakai ? .7f : (isU ? 1.4f : .6f);
            if (phase == "charge")
            {
                pose = hakai ? "blastR" : "raise";
                if (held == null)
                {
                    if (hakai)
                    {
                        held = new GameObject("hakai");
                        MeshGen.Part(MeshGen.Sphere, Pal.Toon(new Color(.08f, 0, .12f)), held.transform, Vector3.zero, Vector3.one * 2, false, "núcleo");
                        MeshGen.Part(MeshGen.Sphere, Pal.Additive(new Color(.7f, .25f, 1f, .5f)), held.transform, Vector3.zero, Vector3.one * 2.3f, false, "brillo");
                        for (int i = 0; i < 3; i++) { var rg = MeshGen.Part(MeshGen.Torus(1.35f + i * .12f, .025f), Pal.Additive(new Color(.85f, .5f, 1f, .8f)), held.transform, Vector3.zero, Vector3.one, false, "anillo"); rg.transform.localRotation = Random.rotation; }
                    }
                    else if (disc)
                    {
                        held = new GameObject("kienzan");
                        MeshGen.Part(MeshGen.Cylinder, Pal.Additive(new Color(s.color.r, s.color.g, s.color.b, .85f)), held.transform, Vector3.zero, new Vector3(2, .03f, 2), false, "disco");
                        MeshGen.Part(MeshGen.Torus(1, .05f), Pal.Additive(Color.white), held.transform, Vector3.zero, Vector3.one, false, "filo");
                    }
                    else held = Projectile.MakeOrb(genki ? new Color(.5f, .8f, 1f) : s.color, 1);
                }
                float k = Mathf.Min(1, t / dur);
                held.transform.position = hakai ? f.Hand(1) + f.Fwd * .6f : f.pos + Vector3.up * (f.Height + R + .5f);
                held.transform.localScale = disc ? new Vector3(R * k + .05f, 1, R * k + .05f) : Vector3.one * (R * k + .05f);
                if (genki) Fx.Spawn(held.transform.position + Random.onUnitSphere * Random.Range(20, 40), (held.transform.position - f.pos) * .0f, new Color(.6f, .85f, 1f), .3f, .5f);
                if (t >= dur)
                {
                    phase = "throw"; t = 0;
                    var from = held.transform.position; var to = f.opp != null ? f.opp.Chest : from + f.Fwd * 20;
                    float speed = genki ? 15 : disc ? 46 : hakai ? 24 : (isU ? 24 : 32);
                    var pr = new Projectile(f, from, (to - from).normalized * speed, Pow(genki ? 3600 : isU ? 2700 : 1300), hakai ? new Color(.7f, .25f, 1f) : s.color, R * (disc ? .8f : 1), disc ? 1.6f : .8f, disc ? "disc" : "ball", held) { isU = isU, full = full };
                    Match.Cur.AddProjectile(pr);
                    held = null;
                    Sound.Play("beam");
                }
            }
            else { pose = "throw"; if (t > .35f) done = true; }
        }

        void RainUpdate()
        {
            bool hz = s.type == "hellzone";
            int N = isU ? (hz ? 16 : 40) : (hz ? 10 : 26);
            float D = hz ? 1.1f : 1.1f;
            pose = t < .2f ? "raise" : ((int)(t * 12) % 2 == 0 ? "blastR" : "blastL");
            int n = Mathf.Min(N, (int)(t / D * N));
            var r = new Vector3(f.Fwd.z, 0, -f.Fwd.x);
            while (fired < n)
            {
                fired++;
                if (hz && f.opp != null)
                {
                    float a = fired / (float)N * Mathf.PI * 3.2f;
                    var p = f.opp.Chest + new Vector3(Mathf.Cos(a) * 6, Random.Range(-1, 2.5f), Mathf.Sin(a) * 6);
                    var pr = new Projectile(f, p, (f.opp.Chest - p).normalized * 36, Pow(isU ? 240 : 150), s.color, .45f, 4, "blast") { delay = (N - fired) * .1f };
                    pr.vel = Vector3.zero; pr.spd = 36; pr.delay = .6f;
                    Match.Cur.AddProjectile(pr);
                }
                else
                {
                    float yaw = Random.Range(-1.3f, 1.3f), pitch = Random.Range(.25f, 1.2f);
                    var d = (f.Fwd * Mathf.Cos(yaw) * Mathf.Cos(pitch) + r * Mathf.Sin(yaw) * Mathf.Cos(pitch) + Vector3.up * Mathf.Sin(pitch)).normalized;
                    var pr = new Projectile(f, f.Hand(fired % 2 == 0 ? 1 : -1), d * Random.Range(34, 42), Pow(isU ? 110 : 80), s.color, .6f, 9, "blast") { delay = .28f };
                    Match.Cur.AddProjectile(pr);
                }
                if (fired % 3 == 0) Sound.Play("blast");
            }
            if (t >= D + .2f) done = true;
        }

        void SwordUpdate(float dt)
        {
            var o = f.opp;
            if (held == null && s.type == "sword")
            {
                held = new GameObject("espada");
                Transform hand;
                if (f.body.J.TryGetValue("wrR", out hand)) held.transform.SetParent(hand, false);
                MeshGen.Part(MeshGen.Cube, Pal.Additive(Color.white), held.transform, new Vector3(0, -.55f, 0), new Vector3(.05f, 1f, .1f), false, "hoja");
                MeshGen.Part(MeshGen.Cube, Pal.Additive(new Color(s.color.r, s.color.g, s.color.b, .6f)), held.transform, new Vector3(0, -.58f, 0), new Vector3(.16f, 1.15f, .22f), false, "brillo");
                phase = "dash"; t = 0;
            }
            if (phase == "charge") { pose = "windup"; if (t > .3f) { phase = "dash"; t = 0; } return; }
            if (phase == "dash")
            {
                pose = "fly";
                if (o == null) { Finish(); return; }
                var to = o.Chest - f.Chest; float d = to.magnitude;
                f.pos += to.normalized * Mathf.Min(d, 70 * dt);
                Fx.Spawn(f.Chest, Vector3.zero, s.color, .8f, .2f);
                if (d < 2.4f) { phase = "slash"; t = 0; fired = 0; }
                else if (t > .8f) Finish();
                return;
            }
            if (phase == "slash")
            {
                int hits = isU ? 4 : 3;
                pose = fired % 2 == 0 ? "punchR" : "uppercut";
                if (t >= .12f && fired < hits)
                {
                    t = 0; fired++;
                    if (o != null && Vector3.Distance(o.pos, f.pos) < 4.5f) Fighter.Hit(f, o, Pow(isU ? 2600 : 1300) / hits, isU ? "ult" : "special", fired == hits ? 24 : 0, full);
                }
                if (fired >= hits && t > .15f) Finish();
            }
        }

        void Finish() { if (held != null) Object.Destroy(held); done = true; }
    }
}
