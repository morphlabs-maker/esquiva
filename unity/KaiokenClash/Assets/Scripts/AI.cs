// Kaioken Clash (Unity) · CPU: se acerca, combina golpes, dispara ki desde lejos, rodea al rival, se cubre y se transforma.
using UnityEngine;

namespace Kaioken
{
    public class AI
    {
        readonly Fighter f;
        float t, tick, transCool, react;
        string plan = "approach";
        public float level = 1; // 0 fácil · 1 normal · 2 difícil · 3 legendario

        public AI(Fighter fighter, float lv) { f = fighter; level = lv; transCool = Random.Range(6f, 12f) / (1 + lv * .3f); }

        public FInput Think(float dt)
        {
            var o = new FInput();
            var op = f.opp;
            if (op == null || op.Down) return o;
            t -= dt; tick -= dt; transCool -= dt;
            var to = op.pos - f.pos; float d = to.magnitude; to.y = 0;
            var dir = to.sqrMagnitude > .01f ? to.normalized : f.Fwd;
            var side = new Vector3(dir.z, 0, -dir.x) * (Mathf.Sin(Time.time * .9f + f.idx * 2.3f) > 0 ? 1 : -1);
            bool threat = op.state == "attack" || op.state == "special";
            react = threat ? react + dt : 0;
            if (react > .35f - level * .07f && d < 5 && Random.value < .3f + level * .15f) { o.guard = true; return o; }
            if (t <= 0)
            {
                t = Random.Range(.45f, 1.1f) * (level < 1 ? 1.4f : 1);
                float r = Random.value;
                if (transCool <= 0 && r < .5f) { o.transUp = true; transCool = Random.Range(8f, 16f) / (1 + level * .3f); return o; }
                if (f.ki < 2.5f && d > 14 && r < .5f) plan = "charge";
                else if (d > 9) plan = f.ki >= 4 && r < .2f + level * .08f ? "ult" : f.ki >= 2 && r < .45f ? "special" : r < .75f ? "approach" : "blast";
                else plan = r < .12f ? "wait" : "melee";
            }
            float dy = op.pos.y - f.pos.y;
            if (Mathf.Abs(dy) > 1) { o.up = dy > 0; o.down = dy < 0; }
            switch (plan)
            {
                case "approach": o.move = dir; break;
                case "wait": o.move = side * .7f + (d < 4 ? -dir : Vector3.zero); break;
                case "charge": o.charge = true; if (f.ki >= 4.5f) plan = "approach"; break;
                case "blast": if (tick <= 0) { tick = .35f; o.ki = true; } o.move = side * .7f + (d < 12 ? -dir * .5f : Vector3.zero); break;
                case "special": if (Random.value < .5f) o.special2 = true; else o.special = true; plan = "approach"; break;
                case "ult": o.ult = true; plan = "approach"; break;
                case "melee":
                    if (tick <= 0) { tick = Random.Range(.18f, .4f) / (1 + level * .25f); if (Random.value < .15f) o.heavy = true; else o.light = true; }
                    if (d > 2.2f) o.move = dir;
                    break;
            }
            return o;
        }
    }
}
