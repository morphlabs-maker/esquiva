// Kaioken Clash (Unity) · Animación por poses: las mismas poses de la versión web (articulaciones y ángulos),
// pasadas al sistema de Unity (X espejado) y seguidas con un muelle amortiguado para que tengan rebote.
using System.Collections.Generic;
using UnityEngine;

namespace Kaioken
{
    public class PoseAnimator
    {
        readonly Body b;
        readonly Dictionary<string, Quaternion> cur = new Dictionary<string, Quaternion>();
        public string target = "idle";
        public float speed = 14f, t;
        static readonly HashSet<string> snappy = new HashSet<string> { "punchR", "punchL", "kick", "kickHigh", "uppercut", "blastR", "blastL", "beamFire", "throw", "hit", "knock", "windup", "dodgeL", "dodgeR", "sway", "duck" };
        static readonly string[] joints = { "torso", "head", "shL", "elL", "shR", "elR", "hipL", "knL", "hipR", "knR", "hips", "wrL", "wrR", "anL", "anR" };

        public PoseAnimator(Body body) { b = body; foreach (var j in joints) cur[j] = Quaternion.identity; }

        /// <summary>Ángulos de la web (x, y, z en radianes, orden XYZ) → rotación de Unity con el eje X espejado.</summary>
        public static Quaternion FromWeb(Vector3 r)
        {
            return Quaternion.AngleAxis(r.x * Mathf.Rad2Deg, Vector3.right) * Quaternion.AngleAxis(-r.y * Mathf.Rad2Deg, Vector3.up) * Quaternion.AngleAxis(-r.z * Mathf.Rad2Deg, Vector3.forward);
        }

        public void Update(float dt, bool snap = false)
        {
            t += dt;
            Dictionary<string, Vector3> P;
            if (!GameData.Poses.TryGetValue(target ?? "idle", out P)) GameData.Poses.TryGetValue("idle", out P);
            float k = snap ? 1f : 1f - Mathf.Exp(-(snappy.Contains(target) ? 30f : speed) * dt);
            float br = Mathf.Sin(t * 2.2f) * .03f;
            foreach (var j in joints)
            {
                Transform tr;
                if (!b.J.TryGetValue(j, out tr)) continue;
                Vector3 r = Vector3.zero;
                if (P != null) P.TryGetValue(j, out r);
                if (j == "torso") r.x += br; else if (j == "head") r.x -= br * .6f; else if (j == "shL" || j == "shR") r.x += br * .8f;
                var want = FromWeb(r);
                cur[j] = Quaternion.Slerp(cur[j], want, k);
                tr.localRotation = cur[j];
            }
        }
    }
}
