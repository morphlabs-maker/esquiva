// Kaioken Clash (Unity) · Una pelea: mundo, luchadores, proyectiles, rayos, rondas, objetivo de la historia y momentos de cámara.
using System.Collections.Generic;
using UnityEngine;

namespace Kaioken
{
    public class Pop { public Fighter f; public string text; public Color color; public float t; }

    public class Match
    {
        public static Match Cur;
        public World world;
        public readonly List<Fighter> fighters = new List<Fighter>();
        public readonly List<Projectile> projectiles = new List<Projectile>();
        public readonly List<Beam> beams = new List<Beam>();
        public static readonly List<Pop> pops = new List<Pop>();
        public string phase = "intro", mode = "cpu", result = "", message = "", sub = "";
        public float t, msgT, hitstop, timeScale = 1, timer = 99, introT, survive;
        public int winnerTeam = -1, diff = 1;
        public NodeDef node;
        public System.Action<bool> onEnd;
        public Fighter player;
        public CameraRig rig;
        float cineT; Fighter cineF; string cineKind;
        public float DiffDmg { get { return new[] { .55f, .8f, 1f, 1.15f }[Mathf.Clamp(diff, 0, 3)]; } }

        public Match(int worldIndex, int variant, CameraRig r)
        {
            Cur = this; rig = r;
            world = WorldBuilder.Build(worldIndex, variant);
            Sound.Music(world.music);
        }

        public Fighter Add(CharDef ch, int team, bool cpu, Spec spec = null, string versionArc = null)
        {
            var f = new Fighter(ch, fighters.Count, team, world.root) { cpu = cpu };
            if (spec != null)
            {
                if (spec.basePower > 0) f.basePower = spec.basePower;
                f.maxHp = f.hp = GameData.MaxHp * spec.hp;
                if (spec.forms != null) { f.allowed = new List<int>(); foreach (var id in spec.forms) f.allowed.Add(ch.FormIndex(id)); }
                if (!string.IsNullOrEmpty(spec.f)) { int fi = ch.FormIndex(spec.f); if (f.allowed == null) f.allowed = new List<int> { fi }; else if (!f.allowed.Contains(fi)) f.allowed.Insert(0, fi); else { f.allowed.Remove(fi); f.allowed.Insert(0, fi); } }
            }
            else if (versionArc != null)
            {
                // versión del arco: poder base y formas de entonces (la de la Saga Saiyajin de Goku solo tiene el Kaioken)
                var v = GameData.Version(ch.id, versionArc);
                if (v != null)
                {
                    f.ver = v.arc; f.basePower = v.basePower; f.allowed = new List<int>();
                    foreach (var id in v.forms) { int i = ch.FormIndex(id); if (ch.forms[i].id == id && !f.allowed.Contains(i)) f.allowed.Add(i); }
                    if (f.allowed.Count == 0) f.allowed.Add(0);
                }
            }
            if (cpu) f.ai = new AI(f, diff);
            fighters.Add(f);
            return f;
        }

        public Dictionary<string, int> OutfitFor(Fighter f) { return null; }

        public void Start()
        {
            int n0 = 0, n1 = 0;
            foreach (var f in fighters)
            {
                int k = f.team == 0 ? n0++ : n1++;
                var p = new Vector3((f.team == 0 ? -1 : 1) * 8, 0, (k - .5f) * 5 * (k > 0 ? 1 : 0));
                float g = world.GroundY(p.x, p.z); p.y = (float.IsNegativeInfinity(g) ? world.spawnY : g) + 1.5f;
                f.Reset(p, f.team == 0 ? Mathf.PI / 2 : -Mathf.PI / 2);
            }
            foreach (var f in fighters) f.opp = NearestEnemy(f);
            phase = "intro"; introT = 0; t = 0;
            if (node != null && node.goalType == "survive") survive = node.goalT;
            Show("¡PELEA!", node != null ? node.name : world.name, 1.4f);
            if (player != null) rig.yaw = player.team == 0 ? Mathf.PI / 2 : -Mathf.PI / 2;
        }

        public Fighter NearestEnemy(Fighter f)
        {
            Fighter best = null; float bd = 1e9f;
            foreach (var e in fighters) { if (e.team == f.team || e.Down) continue; float d = Vector3.Distance(e.pos, f.pos); if (d < bd) { bd = d; best = e; } }
            return best;
        }

        public void AddProjectile(Projectile p) { projectiles.Add(p); }

        public static void Pop(Fighter f, string text, Color c) { pops.Add(new Pop { f = f, text = text, color = c, t = 1.1f }); if (pops.Count > 12) pops.RemoveAt(0); }

        public void Show(string m, string s, float time) { message = m; sub = s; msgT = time; }

        public void OnKO(Fighter f)
        {
            bool teamLeft = false;
            foreach (var x in fighters) if (x.team == f.team && !x.Down) teamLeft = true;
            if (teamLeft || phase != "fight") return;
            winnerTeam = 1 - f.team;
            End(winnerTeam == 0 ? "¡VICTORIA!" : "DERROTA");
        }

        void End(string m)
        {
            phase = "ko"; t = 0; timeScale = .3f; Show(m, "", 3);
            foreach (var f in fighters) if (f.team == winnerTeam && !f.Down) f.state = "victory";
            cineF = null; foreach (var f in fighters) if (f.team == winnerTeam) cineF = f; cineKind = "victory"; cineT = 3;
        }

        public void CineTransform(Fighter f) { cineF = f; cineKind = "transform"; cineT = 1.2f; }
        public void CineUlt(Fighter f) { cineF = f; cineKind = "ult"; cineT = 1.4f; }

        public void Update(float rdt)
        {
            float dt = Mathf.Min(rdt, .05f);
            if (hitstop > 0) { hitstop -= dt; dt *= .05f; }
            dt *= timeScale;
            t += dt; msgT -= rdt;
            for (int i = pops.Count - 1; i >= 0; i--) { pops[i].t -= rdt; if (pops[i].t <= 0) pops.RemoveAt(i); }
            if (phase == "intro") { introT += rdt; if (introT > 1.3f) phase = "fight"; }
            if (phase == "fight")
            {
                if (survive > 0) { survive -= dt; if (survive <= 0) { winnerTeam = 0; End("¡RESISTISTE!"); } }
                if (node == null && mode == "cpu") { timer -= dt; if (timer <= 0) { winnerTeam = TeamHp(0) >= TeamHp(1) ? 0 : 1; End("¡TIEMPO!"); } }
            }
            if (phase == "ko") { timeScale = Mathf.Lerp(timeScale, 1, rdt * .8f); if (t > 2.6f) { phase = "over"; if (onEnd != null) onEnd(winnerTeam == 0); } }
            foreach (var f in fighters)
            {
                if (f == player && phase == "fight") f.inp = Controls.Read(f, rig);
                else if (f.ai != null && phase == "fight") f.inp = f.ai.Think(dt);
                else f.inp = new FInput();
                f.Update(dt);
            }
            for (int i = projectiles.Count - 1; i >= 0; i--) { var p = projectiles[i]; p.Update(dt); if (p.dead) { p.Destroy(); projectiles.RemoveAt(i); } }
            for (int i = beams.Count - 1; i >= 0; i--) { var b = beams[i]; b.Update(dt); if (!b.alive) { b.Destroy(); beams.RemoveAt(i); } }
            Camera(rdt);
        }

        float TeamHp(int team) { float s = 0; foreach (var f in fighters) if (f.team == team) s += f.hp / f.maxHp; return s; }

        void Camera(float dt)
        {
            if (cineT > 0 && cineF != null)
            {
                cineT -= dt;
                float ang = cineF.face + (cineKind == "victory" ? .5f : .9f + (1.2f - cineT) * 1.2f), d = (cineKind == "ult" ? 4f : 3.6f) * cineF.giant;
                var pos = cineF.pos + new Vector3(Mathf.Sin(ang) * d, cineF.Height * .7f, Mathf.Cos(ang) * d);
                if (cineKind == "ult") pos = cineF.pos - cineF.Fwd * 3.2f + new Vector3(cineF.Fwd.z, 0, -cineF.Fwd.x) * -1.4f + Vector3.up * cineF.Height * .8f;
                var look = cineKind == "ult" && cineF.opp != null ? cineF.opp.Chest : cineF.Chest;
                rig.Shot(pos, look, dt, false);
                return;
            }
            if (player != null && !player.Down) rig.Follow(player, dt, Controls.lockOn);
            else
            {
                Fighter a = null; foreach (var f in fighters) if (!f.Down) { a = f; break; }
                if (a != null) rig.Follow(a, dt, true);
            }
        }

        public void Dispose()
        {
            foreach (var f in fighters) f.Destroy();
            foreach (var p in projectiles) p.Destroy();
            foreach (var b in beams) b.Destroy();
            fighters.Clear(); projectiles.Clear(); beams.Clear(); pops.Clear();
            if (world != null) world.Destroy();
            if (Cur == this) Cur = null;
        }
    }
}
