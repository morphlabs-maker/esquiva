// Kaioken Clash (Unity) · Controles: teclado (WASD, Espacio/C, F G H R T E X Q Y K L) y pantalla táctil (joystick + botones) para iPhone.
using System.Collections.Generic;
using UnityEngine;

namespace Kaioken
{
    public static class TouchPad
    {
        public class Btn { public string id, label; public Rect r; public bool held, down; public Color col; }
        public static readonly List<Btn> buttons = new List<Btn>();
        public static Vector2 joy, joyCenter, drag;
        public static bool joyOn, enabled;
        static int joyId = -1, dragId = -1;
        static Vector2 dragLast;
        static readonly Dictionary<int, Btn> held = new Dictionary<int, Btn>();

        public static void Layout()
        {
            buttons.Clear();
            float u = Mathf.Min(Screen.width, Screen.height) / 7.5f, W = Screen.width, H = Screen.height;
            System.Action<string, string, float, float, float, Color> add = (id, l, x, y, s, c) => buttons.Add(new Btn { id = id, label = l, r = new Rect(x, y, u * s, u * s), col = c });
            add("light", "👊", W - u * 1.3f, H - u * 1.3f, 1.15f, new Color(1, .82f, .2f));
            add("heavy", "💥", W - u * 2.5f, H - u * 1.1f, .95f, new Color(1, .5f, .2f));
            add("ki", "✨", W - u * 1.25f, H - u * 2.5f, .95f, new Color(.4f, .8f, 1f));
            add("special", "🌀", W - u * 2.4f, H - u * 2.3f, .9f, new Color(.7f, .4f, 1f));
            add("ult", "☄", W - u * 3.5f, H - u * 2.3f, .85f, new Color(1, .3f, .3f));
            add("special2", "🌟", W - u * 3.6f, H - u * 1.15f, .85f, new Color(.75f, .5f, 1f));
            add("guard", "🛡", W - u * 4.6f, H - u * 1.1f, .85f, new Color(.5f, .8f, 1f));
            add("charge", "🔋", W - u * 4.7f, H - u * 2.2f, .85f, new Color(.4f, 1f, .5f));
            add("transUp", "⚡+", W - u * 1.3f, H - u * 3.65f, .85f, new Color(1, .9f, .3f));
            add("transDown", "⚡-", W - u * 2.35f, H - u * 3.6f, .8f, new Color(.7f, .7f, .7f));
            add("kaioken", "KK", W - u * 3.4f, H - u * 3.5f, .8f, new Color(1, .25f, .25f));
            add("vanish", "💨", W - u * 4.5f, H - u * 3.4f, .8f, Color.white);
            add("up", "+", u * .25f, H * .32f, .8f, new Color(.6f, .9f, 1f));
            add("down", "-", u * .25f, H * .32f + u * .95f, .8f, new Color(.6f, .9f, 1f));
            add("lock", "🎯", u * .25f, H * .32f + u * 1.9f, .8f, new Color(1, .4f, .4f));
            add("pause", "II", W * .5f - u * .35f, u * .15f, .7f, Color.white);
        }

        public static Btn Get(string id) { foreach (var b in buttons) if (b.id == id) return b; return null; }

        public static void Update()
        {
            if (buttons.Count == 0) Layout();
            foreach (var b in buttons) b.down = false;
            if (Input.touchCount > 0) enabled = true;
            if (!enabled) return;
            var seen = new HashSet<int>();
            for (int i = 0; i < Input.touchCount; i++)
            {
                var t = Input.GetTouch(i);
                var p = new Vector2(t.position.x, Screen.height - t.position.y); // coordenadas de la interfaz (arriba = 0)
                seen.Add(t.fingerId);
                if (t.phase == TouchPhase.Began)
                {
                    Btn hit = null;
                    foreach (var b in buttons) if (b.r.Contains(p)) hit = b;
                    if (hit != null) { hit.down = true; held[t.fingerId] = hit; }
                    else if (p.x < Screen.width * .4f && p.y > Screen.height * .35f && joyId < 0) { joyId = t.fingerId; joyCenter = p; joyOn = true; }
                    else if (dragId < 0) { dragId = t.fingerId; dragLast = p; }
                }
                if (t.fingerId == joyId)
                {
                    var d = (p - joyCenter) / (Screen.height * .12f);
                    if (d.magnitude > 1) d.Normalize();
                    joy = new Vector2(d.x, -d.y);
                }
                if (t.fingerId == dragId) { drag += p - dragLast; dragLast = p; }
                if (t.phase == TouchPhase.Ended || t.phase == TouchPhase.Canceled)
                {
                    if (t.fingerId == joyId) { joyId = -1; joy = Vector2.zero; joyOn = false; }
                    if (t.fingerId == dragId) dragId = -1;
                    held.Remove(t.fingerId);
                }
            }
            foreach (var k in new List<int>(held.Keys)) if (!seen.Contains(k)) held.Remove(k);
            foreach (var b in buttons) b.held = held.ContainsValue(b);
        }

        public static bool Down(string id) { var b = Get(id); return b != null && b.down; }
        public static bool Held(string id) { var b = Get(id); return b != null && b.held; }
        public static Vector2 TakeDrag() { var d = drag; drag = Vector2.zero; return d; }
    }

    public static class Controls
    {
        public static bool lockOn = true;

        public static FInput Read(Fighter f, CameraRig rig)
        {
            var o = new FInput();
            float ax = (Input.GetKey(KeyCode.D) ? 1 : 0) - (Input.GetKey(KeyCode.A) ? 1 : 0) + TouchPad.joy.x;
            float az = (Input.GetKey(KeyCode.W) ? 1 : 0) - (Input.GetKey(KeyCode.S) ? 1 : 0) + TouchPad.joy.y;
            bool trans = Input.GetKey(KeyCode.Q);
            var F = new Vector3(Mathf.Sin(rig.yaw), 0, Mathf.Cos(rig.yaw)); var R = new Vector3(F.z, 0, -F.x);
            if (!trans) o.move = Vector3.ClampMagnitude(F * az + R * ax, 1);
            o.up = Input.GetKey(KeyCode.Space) || TouchPad.Held("up");
            o.down = Input.GetKey(KeyCode.C) || Input.GetKey(KeyCode.LeftShift) || TouchPad.Held("down");
            o.light = Input.GetKeyDown(KeyCode.F) || TouchPad.Down("light");
            o.heavy = Input.GetKeyDown(KeyCode.G) || TouchPad.Down("heavy");
            o.ki = Input.GetKeyDown(KeyCode.H) || TouchPad.Down("ki");
            o.guard = Input.GetKey(KeyCode.R) || TouchPad.Held("guard");
            o.charge = Input.GetKey(KeyCode.T) || TouchPad.Held("charge");
            o.special = (Input.GetKeyDown(KeyCode.E) && !Input.GetKey(KeyCode.H)) || TouchPad.Down("special");
            o.ult = (Input.GetKeyDown(KeyCode.E) && Input.GetKey(KeyCode.H)) || TouchPad.Down("ult");
            o.special2 = Input.GetKeyDown(KeyCode.X) || TouchPad.Down("special2");
            o.transUp = (trans && Input.GetKeyDown(KeyCode.W)) || TouchPad.Down("transUp");
            o.transDown = (trans && Input.GetKeyDown(KeyCode.S)) || TouchPad.Down("transDown");
            o.vanish = Input.GetKeyDown(KeyCode.Y) || TouchPad.Down("vanish");
            o.kaioken = Input.GetKeyDown(KeyCode.K) || TouchPad.Down("kaioken");
            if (Input.GetKeyDown(KeyCode.L) || TouchPad.Down("lock")) { lockOn = !lockOn; Match.Pop(f, lockOn ? "OBJETIVO FIJADO" : "OBJETIVO LIBRE", new Color(.6f, .9f, 1f)); }
            float rot = (Input.GetKey(KeyCode.RightArrow) ? 1 : 0) - (Input.GetKey(KeyCode.LeftArrow) ? 1 : 0);
            if (rot != 0 && !lockOn) { rig.yaw += rot * 2.4f * Time.deltaTime; rig.dragT = .6f; }
            var drag = TouchPad.TakeDrag();
            if (Input.GetMouseButton(1)) drag += new Vector2(Input.GetAxis("Mouse X"), -Input.GetAxis("Mouse Y")) * 12;
            if (drag.sqrMagnitude > 0) rig.Drag(drag, lockOn);
            f.lockOn = lockOn;
            return o;
        }
    }
}
