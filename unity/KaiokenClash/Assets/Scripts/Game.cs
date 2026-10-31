// Kaioken Clash (Unity) · Juego: menús, selección de luchador con vista previa y versión por arco, modo historia, entrenamiento y HUD.
// La interfaz usa IMGUI (OnGUI) para que el proyecto funcione sin escenas ni prefabs: todo se crea al arrancar.
using System.Collections.Generic;
using UnityEngine;

namespace Kaioken
{
    public class Game : MonoBehaviour
    {
        public static Game I;
        string screen = "title";
        CameraRig rig;
        Match match;
        CinePlayer cine;
        System.Action afterCine;
        int sel0, sel1 = 1, world = 1, variant, diff = 1, arcSel, nodeSel = -1, mode;
        string mode2 = "cpu";
        World previewWorld; Body preview, preview2; int previewIdx = -1, previewIdx2 = -1; float previewT;
        GUIStyle big, mid, small, btn, box, title, hud;
        float u;
        bool paused;
        static readonly string[] diffNames = { "FÁCIL", "NORMAL", "DIFÍCIL", "LEGENDARIO" };

        public static void Boot()
        {
            if (I != null) return;
            GameData.Load();
            var g = new GameObject("Kaioken Clash");
            DontDestroyOnLoad(g);
            I = g.AddComponent<Game>();
        }

        void Start()
        {
            Application.targetFrameRate = 60;
            Screen.orientation = ScreenOrientation.LandscapeLeft;
            QualitySettings.shadowDistance = 60;
            rig = new CameraRig();
            rig.cam.gameObject.AddComponent<Synth>();
            Sound.Music("menu");
            ShowPreviewWorld();
        }

        void ShowPreviewWorld()
        {
            if (previewWorld == null) previewWorld = WorldBuilder.Build(world, 0);
        }

        void ClearPreview()
        {
            if (preview != null) { Destroy(preview.root.gameObject); preview = null; }
            if (preview2 != null) { Destroy(preview2.root.gameObject); preview2 = null; }
            previewIdx = previewIdx2 = -1;
        }

        void KillPreviewWorld() { ClearPreview(); if (previewWorld != null) { previewWorld.Destroy(); previewWorld = null; } }

        // ---------------- bucle ----------------
        void Update()
        {
            TouchPad.Update();
            float dt = Time.deltaTime;
            if (cine != null)
            {
                if (Input.GetKeyDown(KeyCode.Space) || Input.GetKeyDown(KeyCode.Return) || Input.GetMouseButtonDown(0) && !TouchPad.enabled) cine.Tap();
                if (Input.GetKeyDown(KeyCode.Escape)) { while (!cine.done) cine.Next(); }
                cine.Update(dt);
                if (cine.done) { cine.Dispose(); cine = null; var a = afterCine; afterCine = null; if (a != null) a(); }
                return;
            }
            if (match != null)
            {
                if (Input.GetKeyDown(KeyCode.Escape) || TouchPad.Down("pause")) paused = !paused;
                if (!paused) match.Update(dt);
                return;
            }
            // menús: vista previa del luchador con guardia de combate y gestos
            if (previewWorld == null) ShowPreviewWorld();
            previewT += dt;
            if (screen == "chars")
            {
                if (previewIdx != sel0) { if (preview != null) Destroy(preview.root.gameObject); preview = MakePreview(GameData.Chars[sel0]); previewIdx = sel0; }
                if (mode2 == "cpu" && previewIdx2 != sel1) { if (preview2 != null) Destroy(preview2.root.gameObject); preview2 = MakePreview(GameData.Chars[sel1]); previewIdx2 = sel1; }
                AnimatePreview(preview, new Vector3(-1.4f, 0, 0), .5f, 0, dt);
                AnimatePreview(preview2, new Vector3(1.2f, 0, -1.2f), -.5f, 1.9f, dt);
                rig.Shot(new Vector3(.6f, 1.6f, 5.6f), new Vector3(.3f, 1.25f, 0), dt, false);
            }
            else { ClearPreview(); float a = Time.time * .05f; rig.Shot(new Vector3(Mathf.Cos(a) * 40, 14, Mathf.Sin(a) * 40), new Vector3(0, 6, 0), dt, false); }
        }

        Body MakePreview(CharDef ch)
        {
            var b = CharBuilder.Build(ch, previewWorld.root);
            b.aura = new Aura(b.root, b.height);
            var f = ch.forms[0]; CharBuilder.ApplyForm(b, f); b.aura.SetColor(f.aura);
            return b;
        }

        static readonly string[] gest = { "taunt", "knuckles", "crossArms", "tauntB", "powerup" };
        void AnimatePreview(Body b, Vector3 p, float rot, float ph, float dt)
        {
            if (b == null) return;
            float g = previewWorld.GroundY(p.x, p.z); p.y = float.IsNegativeInfinity(g) ? 0 : g;
            b.root.position = p; b.root.rotation = Quaternion.Euler(0, rot * Mathf.Rad2Deg + Mathf.Sin(Time.time * .6f) * 7, 0);
            float k = (previewT + ph) % 5.2f; int n = (int)((previewT + ph) / 5.2f);
            b.anim.target = k > 3.8f ? gest[n % gest.Length] : "stance";
            b.anim.Update(dt);
            b.aura.target = 0; b.aura.Update(dt);
        }

        // ---------------- empezar peleas ----------------
        void StartVersus()
        {
            KillPreviewWorld();
            match = new Match(world, variant, rig) { mode = mode2, diff = diff };
            var c0 = GameData.Chars[sel0]; var c1 = GameData.Chars[sel1];
            string ver = Save.Version(c0.id);
            var a = match.Add(c0, 0, false, null, ver);
            if (mode2 == "train")
            {
                var w = match.Add(GameData.Whis, 1, false);
                w.minHpFrac = .3f; w.basePower = a.basePower * 50; w.ch.evade = .6f;
            }
            else match.Add(c1, 1, true, null, ver ?? "tp");
            match.player = a;
            match.onEnd = win => { Save.Coins += win ? 50 : 10; EndMatch(); };
            match.Start();
            screen = "fight";
        }

        void StartNode(ArcDef arc, NodeDef n)
        {
            if (n.t == "cine" && n.cine != null) { PlayCine(n.cine, () => { Save.MarkDone(n.id); screen = "map"; }); return; }
            if (!n.IsFight) { Save.MarkDone(n.id); return; }
            System.Action go = () =>
            {
                KillPreviewWorld();
                match = new Match(n.world, n.v, rig) { mode = "story", diff = diff, node = n };
                var pc = GameData.Char(n.p.c);
                var a = match.Add(pc, 0, false, n.p);
                a.minHpFrac = 0;
                if (n.ally != null) { var al = GameData.Char(n.ally.c); if (al != null) match.Add(al, 0, true, n.ally); }
                if (n.e != null) { var ec = GameData.Char(n.e.c); if (ec != null) match.Add(ec, 1, true, n.e); }
                if (n.e2 != null) { var ec = GameData.Char(n.e2.c); if (ec != null) match.Add(ec, 1, true, n.e2); }
                if (n.e == null && !string.IsNullOrEmpty(n.boss)) { var bc = GameData.Char(n.boss); if (bc != null) { var b = match.Add(bc, 1, true); b.maxHp = b.hp = GameData.MaxHp * 2; b.giant = 1.6f; } }
                match.player = a;
                Sound.Music("arc_" + arc.id);
                match.onEnd = win =>
                {
                    if (win) { Save.MarkDone(n.id); Save.Coins += n.coins; }
                    var end = n.cine;
                    EndMatch();
                    if (win && end != null) PlayCine(end, () => screen = "map"); else screen = "map";
                };
                match.Start();
                screen = "fight";
            };
            if (n.intro != null) PlayCine(n.intro, go); else go();
        }

        void PlayCine(CineDef c, System.Action then)
        {
            KillPreviewWorld();
            cine = new CinePlayer(c, rig);
            afterCine = then;
            screen = "cine";
        }

        void EndMatch()
        {
            if (match != null) { match.Dispose(); match = null; }
            paused = false;
            screen = screen == "fight" ? (mode2 == "story" ? "map" : "chars") : screen;
            Sound.Music("menu");
        }

        // ---------------- interfaz ----------------
        void Styles()
        {
            u = Mathf.Min(Screen.width, Screen.height) / 20f;
            if (big != null && Mathf.Abs(big.fontSize - (int)(u * 2.2f)) < 1) return;
            big = new GUIStyle(GUI.skin.label) { fontSize = (int)(u * 2.2f), fontStyle = FontStyle.Bold, alignment = TextAnchor.MiddleCenter };
            big.normal.textColor = new Color(1, .82f, .2f);
            title = new GUIStyle(big) { fontSize = (int)(u * 3.2f) };
            mid = new GUIStyle(GUI.skin.label) { fontSize = (int)(u * .95f), alignment = TextAnchor.MiddleCenter, wordWrap = true };
            mid.normal.textColor = Color.white;
            small = new GUIStyle(mid) { fontSize = (int)(u * .7f), alignment = TextAnchor.UpperLeft };
            btn = new GUIStyle(GUI.skin.button) { fontSize = (int)(u * .85f), fontStyle = FontStyle.Bold, wordWrap = true };
            box = new GUIStyle(GUI.skin.box) { fontSize = (int)(u * .75f), alignment = TextAnchor.UpperLeft, wordWrap = true };
            box.normal.textColor = Color.white;
            hud = new GUIStyle(GUI.skin.label) { fontSize = (int)(u * .75f), fontStyle = FontStyle.Bold };
            hud.normal.textColor = Color.white;
        }

        bool B(Rect r, string t) { return GUI.Button(r, t, btn); }

        void OnGUI()
        {
            Styles();
            float W = Screen.width, H = Screen.height;
            if (cine != null) { CineGUI(W, H); return; }
            if (match != null) { HudGUI(W, H); return; }
            switch (screen)
            {
                case "title":
                    GUI.Label(new Rect(0, H * .1f, W, u * 4), "KAIOKEN CLASH", title);
                    GUI.Label(new Rect(0, H * .1f + u * 3.6f, W, u * 1.4f), "Edición Unity - 3D libre - " + GameData.Chars.Count + " luchadores", mid);
                    float bw = u * 9, x = W / 2 - bw / 2, y = H * .45f;
                    if (B(new Rect(x, y, bw, u * 2), "JUGAR CONTRA LA CPU")) { mode2 = "cpu"; screen = "chars"; }
                    if (B(new Rect(x, y + u * 2.3f, bw, u * 2), "MODO HISTORIA")) { mode2 = "story"; screen = "story"; }
                    if (B(new Rect(x, y + u * 4.6f, bw, u * 2), "ENTRENAMIENTO CON WHIS")) { mode2 = "train"; screen = "chars"; }
                    GUI.Label(new Rect(u, H - u * 1.6f, W, u), "Monedas: " + Save.Coins, small);
                    break;
                case "chars": CharsGUI(W, H); break;
                case "worlds": WorldsGUI(W, H); break;
                case "story": StoryGUI(W, H); break;
                case "map": MapGUI(W, H); break;
            }
        }

        Vector2 scroll;
        void CharsGUI(float W, float H)
        {
            if (B(new Rect(u * .5f, u * .5f, u * 5, u * 1.5f), "← MENÚ")) { screen = "title"; return; }
            GUI.Label(new Rect(0, u * .4f, W, u * 1.8f), mode2 == "train" ? "ELIGE A TU LUCHADOR - ENTRENAMIENTO" : "ELIGE A TU LUCHADOR", big);
            // cuadrícula a la derecha, vista previa a la izquierda
            float gx = W * .48f, gw = W * .5f, cell = u * 3.4f; int cols = Mathf.Max(3, (int)(gw / cell));
            var view = new Rect(gx, u * 2.6f, gw, H - u * 3.2f);
            int rows = (GameData.Chars.Count + cols - 1) / cols;
            scroll = GUI.BeginScrollView(view, scroll, new Rect(0, 0, gw - u, rows * cell * .62f + u));
            for (int i = 0; i < GameData.Chars.Count; i++)
            {
                var c = GameData.Chars[i];
                var r = new Rect((i % cols) * cell, (i / cols) * cell * .62f, cell - u * .2f, cell * .58f);
                bool on = i == sel0 || (mode2 == "cpu" && i == sel1);
                if (GUI.Button(r, (i == sel0 ? "1P - " : mode2 == "cpu" && i == sel1 ? "CPU - " : "") + c.name, btn))
                {
                    if (Event.current.button == 1 || (mode2 == "cpu" && pickCpu)) sel1 = i; else sel0 = i;
                }
                if (on) GUI.Box(new Rect(r.x, r.y, r.width, u * .25f), "");
            }
            GUI.EndScrollView();
            // información y versión por arco
            var ch = GameData.Chars[sel0];
            var vers = Save.OpenVersions(ch.id); string v = Save.Version(ch.id);
            var vd = v != null ? GameData.Version(ch.id, v) : null;
            string info = ch.name + "\n" + ch.forms.Count + " formas - poder base " + Fmt(vd != null ? vd.basePower : ch.basePower) + "\nEspecial: " + (ch.s1 != null ? ch.s1.name : "—") + " - Definitivo: " + (ch.ult != null ? ch.ult.name : "—");
            if (vd != null) info += "\nVersión: " + GameData.ArcName(v) + " (" + vd.forms.Count + " formas)";
            GUI.Box(new Rect(u * .5f, H - u * 6.2f, W * .45f, u * 3.6f), info, box);
            if (vers.Count > 1)
            {
                if (B(new Rect(u * .5f, H - u * 2.4f, u * 4.2f, u * 1.6f), "< VERSIÓN")) { int k = vers.IndexOf(v); Save.SetVersion(ch.id, vers[(k - 1 + vers.Count) % vers.Count]); }
                if (B(new Rect(u * 4.9f, H - u * 2.4f, u * 4.2f, u * 1.6f), "VERSIÓN >")) { int k = vers.IndexOf(v); Save.SetVersion(ch.id, vers[(k + 1) % vers.Count]); }
            }
            if (mode2 == "cpu" && B(new Rect(u * 9.4f, H - u * 2.4f, u * 4.4f, u * 1.6f), pickCpu ? "ELIGIENDO CPU" : "ELEGIR CPU")) pickCpu = !pickCpu;
            if (B(new Rect(W * .48f - u * 6f, H - u * 2.4f, u * 5.4f, u * 1.6f), "¡LISTO! >")) { if (mode2 == "train") { world = 10; StartVersus(); } else screen = "worlds"; }
        }
        bool pickCpu;

        void WorldsGUI(float W, float H)
        {
            if (B(new Rect(u * .5f, u * .5f, u * 5, u * 1.5f), "← ATRÁS")) { screen = "chars"; return; }
            GUI.Label(new Rect(0, u * .4f, W, u * 1.8f), "ELIGE EL MUNDO", big);
            int cols = 4; float bw = (W - u * 2) / cols;
            for (int i = 0; i < GameData.WorldNames.Count; i++)
                if (GUI.Toggle(new Rect(u + (i % cols) * bw, u * 2.8f + (i / cols) * u * 2.1f, bw - u * .3f, u * 1.8f), world == i, GameData.WorldNames[i], btn)) { if (world != i) { world = i; if (previewWorld != null) { previewWorld.Destroy(); previewWorld = null; } } }
            if (B(new Rect(u, H - u * 2.4f, u * 7, u * 1.6f), "DIFICULTAD: " + diffNames[diff])) diff = (diff + 1) % 4;
            if (B(new Rect(u * 8.4f, H - u * 2.4f, u * 5, u * 1.6f), variant == 0 ? "VARIANTE 1" : "VARIANTE 2")) variant = 1 - variant;
            if (B(new Rect(W - u * 8, H - u * 2.4f, u * 7, u * 1.6f), "¡A PELEAR! >")) StartVersus();
        }

        void StoryGUI(float W, float H)
        {
            if (B(new Rect(u * .5f, u * .5f, u * 5, u * 1.5f), "← MENÚ")) { screen = "title"; return; }
            GUI.Label(new Rect(0, u * .4f, W, u * 1.8f), "MODO HISTORIA - JUNTO A GOKU", big);
            int cols = 3; float bw = (W - u * 2) / cols;
            for (int i = 0; i < GameData.Arcs.Count; i++)
            {
                var a = GameData.Arcs[i]; bool open = Save.ArcOpen(i), dn = Save.ArcDone(a);
                var r = new Rect(u + (i % cols) * bw, u * 2.8f + (i / cols) * u * 2.2f, bw - u * .3f, u * 1.9f);
                GUI.color = open ? Color.Lerp(a.color, Color.white, .5f) : Color.gray;
                if (GUI.Button(r, (dn ? "[OK] " : open ? "" : "[X] ") + a.name, btn) && open) { arcSel = i; nodeSel = -1; screen = "map"; Sound.Music("arc_" + a.id); }
                GUI.color = Color.white;
            }
        }

        void MapGUI(float W, float H)
        {
            var arc = GameData.Arcs[arcSel];
            if (B(new Rect(u * .5f, u * .5f, u * 5, u * 1.5f), "← ARCOS")) { screen = "story"; Sound.Music("menu"); return; }
            GUI.Label(new Rect(0, u * .4f, W, u * 1.8f), arc.name.ToUpper(), big);
            float y = u * 2.8f;
            scroll = GUI.BeginScrollView(new Rect(u, y, W * .5f, H - y - u), scroll, new Rect(0, 0, W * .5f - u * 1.5f, arc.nodes.Count * u * 1.9f));
            bool prevDone = true;
            for (int i = 0; i < arc.nodes.Count; i++)
            {
                var n = arc.nodes[i]; bool dn = Save.IsDone(n.id), open = prevDone || dn;
                string ico = n.t == "cine" ? "[ESCENA] " : n.t == "db" ? "[ESFERA] " : "";
                if (GUI.Toggle(new Rect(0, i * u * 1.9f, W * .5f - u * 2, u * 1.7f), nodeSel == i, (dn ? "[OK] " : open ? "" : "[X] ") + ico + n.name, btn) && open) nodeSel = i;
                if (n.t != "db") prevDone = dn;
            }
            GUI.EndScrollView();
            if (nodeSel >= 0 && nodeSel < arc.nodes.Count)
            {
                var n = arc.nodes[nodeSel];
                string info = n.name + "\n" + (n.place ?? "") + (n.IsFight ? "\nTú: " + (GameData.Char(n.p.c) != null ? GameData.Char(n.p.c).name : n.p.c) + (n.e != null ? " - Rival: " + (GameData.Char(n.e.c) != null ? GameData.Char(n.e.c).name : n.e.c) : "") + "\nObjetivo: " + (n.goalType == "survive" ? "resiste " + n.goalT + " s" : "gana") : "");
                foreach (var p in n.pre) info += "\n" + (GameData.Char(p[0]) != null ? GameData.Char(p[0]).name : p[0]) + ": \"" + p[1] + "\"";
                GUI.Box(new Rect(W * .55f, y, W * .42f, H * .55f), info, box);
                if (B(new Rect(W * .55f, H - u * 2.6f, u * 8, u * 1.8f), n.t == "cine" ? "> VER ESCENA" : "¡A PELEAR!")) StartNode(arc, n);
                if (B(new Rect(W * .55f + u * 8.4f, H - u * 2.6f, u * 7, u * 1.8f), "DIFICULTAD: " + diffNames[diff])) diff = (diff + 1) % 4;
            }
        }

        void CineGUI(float W, float H)
        {
            var s = cine.Cur; if (s == null) return;
            float bar = H * .11f;
            GUI.color = Color.black; GUI.DrawTexture(new Rect(0, 0, W, bar), Texture2D.whiteTexture); GUI.DrawTexture(new Rect(0, H - bar, W, bar), Texture2D.whiteTexture);
            if (cine.fade != 0) { GUI.color = cine.fade > 0 ? new Color(0, 0, 0, cine.fade * 2.5f) : new Color(1, 1, 1, -cine.fade); GUI.DrawTexture(new Rect(0, 0, W, H), Texture2D.whiteTexture); }
            GUI.color = Color.white;
            if (!string.IsNullOrEmpty(s.card)) GUI.Label(new Rect(0, H * .3f, W, u * 4), s.card, title);
            if (!string.IsNullOrEmpty(s.say))
            {
                var ch = s.who == "nar" ? null : GameData.Char(s.who);
                string who = s.who == "nar" ? "" : s.who == "shenlong" ? "SHENLONG" : s.who == "sshenlong" ? "SÚPER SHENLONG" : ch != null ? ch.name.ToUpper() : s.who;
                GUI.Box(new Rect(W * .15f, H - bar - u * 4.4f, W * .7f, u * 4), (who.Length > 0 ? who + "\n" : "") + s.say.Substring(0, Mathf.Min(s.say.Length, (int)cine.typed)), box);
            }
            if (B(new Rect(W - u * 6, u * .3f, u * 5.5f, u * 1.4f), "SALTAR >>")) { while (!cine.done) cine.Next(); }
            if (TouchPad.enabled && Event.current.type == EventType.MouseDown && Event.current.mousePosition.y > H * .2f) cine.Tap();
        }

        void HudGUI(float W, float H)
        {
            var m = match;
            int k = 0;
            foreach (var f in m.fighters)
            {
                bool left = f.team == 0; float x = left ? u * .5f : W - u * .5f - W * .34f, y = u * .4f + (left ? k : 0) * u * 2.6f;
                if (left) k++;
                Bar(new Rect(x, y + u, W * .34f, u * .55f), f.hp / f.maxHp, f.hp / f.maxHp < .25f ? new Color(1, .3f, .2f) : new Color(.3f, 1, .4f));
                Bar(new Rect(x, y + u * 1.65f, W * .34f, u * .35f), f.ki / GameData.KiMax, new Color(.3f, .8f, 1f));
                GUI.Label(new Rect(x, y, W * .34f, u), f.ch.name.ToUpper() + (f.cpu ? " (CPU)" : " (TÚ)") + " - " + f.Form.name + (f.kkL > 0 ? " + KAIOKEN x" + f.kkL : "") + " - " + Fmt(f.Power), hud);
            }
            if (m.node != null && m.survive > 0) GUI.Label(new Rect(0, u * .3f, W, u * 1.6f), Mathf.CeilToInt(m.survive) + "", big);
            else if (m.node == null && m.mode == "cpu") GUI.Label(new Rect(0, u * .3f, W, u * 1.6f), Mathf.CeilToInt(m.timer) + "", big);
            if (m.msgT > 0) { GUI.Label(new Rect(0, H * .3f, W, u * 3), m.message, title); GUI.Label(new Rect(0, H * .3f + u * 3, W, u * 1.4f), m.sub, mid); }
            foreach (var p in Match.pops)
            {
                if (p.f == null) continue;
                var sp = rig.cam.WorldToScreenPoint(p.f.Chest + Vector3.up * (1.3f + (1.1f - p.t)));
                if (sp.z <= 0) continue;
                var st = new GUIStyle(hud) { alignment = TextAnchor.MiddleCenter }; st.normal.textColor = p.color;
                GUI.Label(new Rect(sp.x - u * 6, H - sp.y - u * .6f, u * 12, u * 1.2f), p.text, st);
            }
            if (TouchPad.enabled)
            {
                foreach (var b in TouchPad.buttons)
                {
                    GUI.color = new Color(b.col.r, b.col.g, b.col.b, b.held ? .9f : .55f);
                    GUI.Box(b.r, Label(b.id), btn);
                }
                GUI.color = Color.white;
                if (TouchPad.joyOn) { GUI.Box(new Rect(TouchPad.joyCenter.x - u * 2, TouchPad.joyCenter.y - u * 2, u * 4, u * 4), ""); }
            }
            else GUI.Label(new Rect(u * .5f, H - u * 1.4f, W, u), "WASD moverse - Espacio/C subir/bajar - F golpe - G fuerte - H ki - E especial - X especial 2 - H+E definitivo - R guardia - T cargar - Q+W/S transformarse - K Kaioken - Y teletransporte - L objetivo - clic derecho cámara", small);
            if (paused)
            {
                GUI.Box(new Rect(W * .3f, H * .25f, W * .4f, H * .5f), "PAUSA", box);
                if (B(new Rect(W * .35f, H * .35f, W * .3f, u * 1.8f), "CONTINUAR")) paused = false;
                if (B(new Rect(W * .35f, H * .35f + u * 2.2f, W * .3f, u * 1.8f), "SALIR")) { EndMatch(); screen = mode2 == "story" ? "map" : "title"; }
            }
        }

        static string Label(string id)
        {
            switch (id)
            {
                case "light": return "GOLPE"; case "heavy": return "FUERTE"; case "ki": return "KI"; case "special": return "ESP"; case "special2": return "ESP 2";
                case "ult": return "DEF"; case "guard": return "GUARDIA"; case "charge": return "CARGAR"; case "transUp": return "FORMA +"; case "transDown": return "FORMA -";
                case "kaioken": return "KK"; case "vanish": return "TELE"; case "up": return "+"; case "down": return "-"; case "lock": return "FIJAR"; case "pause": return "II";
            }
            return id;
        }

        void Bar(Rect r, float v, Color c)
        {
            GUI.color = new Color(0, 0, 0, .6f); GUI.DrawTexture(r, Texture2D.whiteTexture);
            GUI.color = c; GUI.DrawTexture(new Rect(r.x + 2, r.y + 2, (r.width - 4) * Mathf.Clamp01(v), r.height - 4), Texture2D.whiteTexture);
            GUI.color = Color.white;
        }

        public static string Fmt(double p)
        {
            if (p >= 1e12) return (p / 1e12).ToString("0.0") + " B";
            if (p >= 1e9) return (p / 1e9).ToString("0.0") + " MM";
            if (p >= 1e6) return (p / 1e6).ToString("0.0") + " M";
            if (p >= 1e3) return (p / 1e3).ToString("0.0") + " k";
            return p.ToString("0");
        }
    }

    public static class Bootstrap
    {
        [RuntimeInitializeOnLoadMethod(RuntimeInitializeLoadType.AfterSceneLoad)]
        static void Init() { Game.Boot(); }
    }
}
