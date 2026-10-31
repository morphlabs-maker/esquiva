// Kaioken Clash (Unity) · Cámara en tercera persona detrás del luchador (como en un juego de acción):
// con el objetivo fijado mira al rival; sin objetivo la giras tú arrastrando el dedo o el ratón.
using UnityEngine;

namespace Kaioken
{
    public class CameraRig
    {
        public Camera cam;
        public float yaw, pitch = .12f;
        public float dragT;
        Vector3 look;
        public bool cine;

        public CameraRig()
        {
            var g = new GameObject("Cámara");
            cam = g.AddComponent<Camera>();
            cam.fieldOfView = 58; cam.nearClipPlane = .1f; cam.farClipPlane = 6000;
            cam.clearFlags = CameraClearFlags.SolidColor; cam.backgroundColor = Color.black;
            g.AddComponent<AudioListener>();
        }

        public void Follow(Fighter p, float dt, bool lockOn)
        {
            if (p == null) return;
            var t = lockOn && p.opp != null && !p.opp.Down ? p.opp : null;
            if (t != null) { var to = t.pos - p.pos; to.y = 0; if (to.sqrMagnitude > .3f) yaw = Mathf.LerpAngle(yaw * Mathf.Rad2Deg, Mathf.Atan2(to.x, to.z) * Mathf.Rad2Deg, 1 - Mathf.Exp(-4.5f * dt)) * Mathf.Deg2Rad; }
            else if (dragT <= 0 && p.vel.sqrMagnitude > 9) yaw = Mathf.LerpAngle(yaw * Mathf.Rad2Deg, p.face * Mathf.Rad2Deg, 1 - Mathf.Exp(-1.2f * dt)) * Mathf.Deg2Rad;
            dragT -= dt;
            float g = Mathf.Max(1, p.giant), dist = 5.2f * g * (t != null && t.giant > 1.5f ? 1.3f : 1);
            var F = new Vector3(Mathf.Sin(yaw), 0, Mathf.Cos(yaw)); var R = new Vector3(F.z, 0, -F.x);
            var chest = p.pos + Vector3.up * p.Height * .62f;
            var tp = chest - F * dist * Mathf.Cos(pitch) + R * .45f * g + Vector3.up * (.75f * g + dist * Mathf.Sin(pitch));
            float gy = Match.Cur.world.GroundY(tp.x, tp.z);
            if (!float.IsNegativeInfinity(gy) && tp.y < gy + .6f) tp.y = gy + .6f;
            var lk = chest + F * 8 + Vector3.up * (.4f * g - Mathf.Sin(pitch) * 3);
            if (t != null) lk = Vector3.Lerp(lk, t.Chest, Mathf.Clamp(8f / Mathf.Max(6, Vector3.Distance(t.pos, p.pos)), .25f, .6f));
            float k = 1 - Mathf.Exp(-9 * dt);
            cam.transform.position = Vector3.Lerp(cam.transform.position, tp, k);
            look = Vector3.Lerp(look, lk, k);
            cam.transform.LookAt(look);
            if (Fx.Shake > .01f) { cam.transform.position += Random.insideUnitSphere * Fx.Shake * .25f; Fx.Shake *= Mathf.Exp(-6 * dt); }
        }

        public void Drag(Vector2 d, bool lockOn)
        {
            if (!lockOn) { yaw += d.x * .006f; dragT = 1.5f; }
            pitch = Mathf.Clamp(pitch - d.y * .004f, -.35f, .75f);
        }

        /// <summary>Plano de cinemática: posición y punto de mira directos (con acercamiento suave).</summary>
        public void Shot(Vector3 pos, Vector3 target, float dt, bool cut)
        {
            float k = cut ? 1 : 1 - Mathf.Exp(-4 * dt);
            cam.transform.position = Vector3.Lerp(cam.transform.position, pos, k);
            look = Vector3.Lerp(look, target, k);
            cam.transform.LookAt(look);
            if (Fx.Shake > .01f) { cam.transform.position += Random.insideUnitSphere * Fx.Shake * .2f; Fx.Shake *= Mathf.Exp(-6 * dt); }
        }
    }
}
