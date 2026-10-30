// Kaioken Clash (Unity) · Datos del juego, exportados desde la versión web (tools/unity-export/export.js).
using System.Collections.Generic;
using UnityEngine;

namespace Kaioken
{
    public class TechDef
    {
        public string name, type;
        public Color color;
        public float pow, w, size;
        public int n;
        public bool thin;

        public static TechDef From(object o)
        {
            if (o == null) return null;
            return new TechDef
            {
                name = J.Str(o, "name"), type = J.Str(o, "type", "beam"), color = Pal.Hex(J.I(o, "color", 0xffffff)),
                pow = J.F(o, "pow"), w = J.F(o, "w"), size = J.F(o, "size"), n = J.I(o, "n"), thin = J.I(o, "thin") == 1
            };
        }
    }

    public class FormDef
    {
        public string id, name, era, hair;
        public float mult, cost, drain, hpDrain, ui, giant;
        public int hairColor, eye, pupil;
        public Color aura;
        public bool auraOn, kk, bolt;
        public Vector3 scale = Vector3.one;
        public bool hasScale;
        public Dictionary<string, int> colors;
        public List<string> extras;

        public static FormDef From(object o)
        {
            var f = new FormDef
            {
                id = J.Str(o, "id"), name = J.Str(o, "name"), era = J.Str(o, "era", "Z"), hair = J.Str(o, "hair"),
                mult = J.F(o, "mult", 1), cost = J.F(o, "cost"), drain = J.F(o, "drain"), hpDrain = J.F(o, "hpDrain"), ui = J.F(o, "ui"), giant = J.F(o, "giant"),
                hairColor = J.I(o, "hairColor", -1), eye = J.I(o, "eye", -1), pupil = J.I(o, "pupil", -1),
                aura = Pal.Hex(J.I(o, "aura", 0xfff3c8)), auraOn = J.I(o, "auraOn") == 1, kk = J.I(o, "kk") == 1, bolt = J.I(o, "bolt") == 1
            };
            var sc = J.Floats(J.Get(o, "scale"));
            if (sc != null && sc.Length == 3) { f.scale = new Vector3(sc[0], sc[1], sc[2]); f.hasScale = true; }
            f.colors = GameData.ColorMap(J.Obj(o, "colors"));
            if (J.Get(o, "extras") != null) f.extras = J.Strings(J.Get(o, "extras"));
            return f;
        }
    }

    public class CharDef
    {
        public string id, name, era, hair, unlock, model;
        public double basePower;
        public bool saiyan, android, ears;
        public float h = 1, evade;
        public Vector3 scale = Vector3.one, head = Vector3.one;
        public int hairColor;
        public Dictionary<string, int> colors;
        public List<string> extras;
        public TechDef s1, s2, ult;
        public List<FormDef> forms = new List<FormDef>();
        public int[] order;

        public static CharDef From(object o)
        {
            var c = new CharDef
            {
                id = J.Str(o, "id"), name = J.Str(o, "name"), era = J.Str(o, "era", "Z"), hair = J.Str(o, "hair", "none"), unlock = J.Str(o, "unlock"), model = J.Str(o, "model"),
                basePower = J.Num(o, "base", 1000), saiyan = J.I(o, "saiyan") == 1, android = J.I(o, "android") == 1, ears = J.I(o, "ears", 1) == 1,
                h = J.F(o, "h", 1), evade = J.F(o, "evade"), hairColor = J.I(o, "hairColor")
            };
            var sc = J.Floats(J.Get(o, "scale")); if (sc != null && sc.Length == 3) c.scale = new Vector3(sc[0], sc[1], sc[2]);
            var hd = J.Floats(J.Get(o, "head")); if (hd != null && hd.Length == 3) c.head = new Vector3(hd[0], hd[1], hd[2]);
            c.colors = GameData.ColorMap(J.Obj(o, "colors")) ?? new Dictionary<string, int>();
            c.extras = J.Strings(J.Get(o, "extras"));
            c.s1 = TechDef.From(J.Get(o, "s1")); c.s2 = TechDef.From(J.Get(o, "s2")) ?? c.s1; c.ult = TechDef.From(J.Get(o, "ult"));
            var fl = J.Arr(o, "forms"); if (fl != null) foreach (var f in fl) c.forms.Add(FormDef.From(f));
            var ord = J.Floats(J.Get(o, "order")); if (ord != null) { c.order = new int[ord.Length]; for (int i = 0; i < ord.Length; i++) c.order[i] = (int)ord[i]; }
            return c;
        }

        public int FormIndex(string fid) { for (int i = 0; i < forms.Count; i++) if (forms[i].id == fid) return i; return 0; }
        public int Col(string k, int def) { int v; return colors.TryGetValue(k, out v) ? v : def; }
    }

    public class HairDef
    {
        public int cap;
        public float tip = .32f;
        public List<float[]> sp = new List<float[]>();
    }

    public class Spec
    {
        public string c, f;
        public double basePower;
        public float hp = 1;
        public List<string> forms;

        public static Spec From(object o)
        {
            if (o == null) return null;
            var s = new Spec { c = J.Str(o, "c"), f = J.Str(o, "f"), basePower = J.Num(o, "base"), hp = J.F(o, "hp", 1) };
            if (J.Get(o, "forms") != null) s.forms = J.Strings(J.Get(o, "forms"));
            return s;
        }
    }

    public class CastDef { public string c, f; public float x, z, s = 1; public bool under, hidden; }

    public class Shot
    {
        public string who, say, cam, pose, form, fx, card, fw, lift, explode, uiwake, hide, show, balls;
        public List<string> rise, dance;
        public string mergeInto, mergeForm; public List<string> mergeFrom;
        public Dictionary<string, object> poses, aura;
    }

    public class CineDef
    {
        public string id, title; public int world; public int v;
        public List<CastDef> cast = new List<CastDef>();
        public List<Shot> shots = new List<Shot>();

        public static CineDef From(object o)
        {
            if (o == null) return null;
            var c = new CineDef { id = J.Str(o, "id"), title = J.Str(o, "title"), v = J.I(o, "v") };
            object w = J.Get(o, "world"); c.world = w is double ? (int)(double)w : (w is string && (string)w == "bills" ? 10 : 2);
            var cl = J.Arr(o, "cast");
            if (cl != null) foreach (var x in cl) c.cast.Add(new CastDef { c = J.Str(x, "c"), f = J.Str(x, "f", "base"), x = J.F(x, "x"), z = J.F(x, "z"), s = J.F(x, "s", 1), under = J.I(x, "under") == 1, hidden = J.I(x, "hidden") == 1 });
            var sl = J.Arr(o, "shots");
            if (sl != null) foreach (var s in sl)
                {
                    var sh = new Shot
                    {
                        who = J.Str(s, "who", "nar"), say = J.Str(s, "say"), cam = J.Str(s, "cam", "two"), pose = J.Str(s, "pose"), form = J.Str(s, "form"), fx = J.Str(s, "fx"), card = J.Str(s, "card"), fw = J.Str(s, "fw"),
                        lift = J.Str(s, "lift"), explode = J.Str(s, "explode"), uiwake = J.Str(s, "uiwake"), hide = J.Str(s, "hide"), show = J.Str(s, "show"), balls = J.Str(s, "balls"),
                        poses = J.Obj(s, "poses"), aura = J.Obj(s, "aura")
                    };
                    if (J.Get(s, "rise") != null) sh.rise = J.Strings(J.Get(s, "rise"));
                    if (J.Get(s, "dance") != null) sh.dance = J.Strings(J.Get(s, "dance"));
                    var m = J.Obj(s, "merge");
                    if (m != null) { sh.mergeInto = J.Str(m, "into"); sh.mergeForm = J.Str(m, "f", "base"); sh.mergeFrom = J.Strings(J.Get(m, "from")); }
                    c.shots.Add(sh);
                }
            return c;
        }
    }

    public class NodeDef
    {
        public string id, t, name, place, boss, unlock, goalType;
        public int world, v, coins, dbN;
        public float goalT;
        public Spec p, e, e2, ally;
        public CineDef cine, intro;
        public List<string[]> pre = new List<string[]>();

        public static NodeDef From(object o)
        {
            var n = new NodeDef { id = J.Str(o, "id"), t = J.Str(o, "t"), name = J.Str(o, "name"), place = J.Str(o, "place"), boss = J.Str(o, "boss"), unlock = J.Str(o, "unlock"), v = J.I(o, "v"), coins = J.I(o, "coins", 100), dbN = J.I(o, "n") };
            object w = J.Get(o, "world"); n.world = w is double ? (int)(double)w : (w is string ? 10 : 0);
            object src = J.Get(o, "fight") ?? o;
            n.p = Spec.From(J.Get(src, "p")); n.e = Spec.From(J.Get(src, "e")); n.e2 = Spec.From(J.Get(src, "e2")); n.ally = Spec.From(J.Get(src, "ally"));
            var g = J.Obj(src, "goal"); n.goalType = g != null ? J.Str(g, "type", "win") : "win"; n.goalT = g != null ? J.F(g, "t") : 0;
            n.cine = CineDef.From(J.Get(o, "cine")); n.intro = CineDef.From(J.Get(o, "intro"));
            var pre = J.Arr(src, "pre");
            if (pre != null) foreach (var x in pre) { var l = J.Strings(x); if (l.Count >= 2) n.pre.Add(new[] { l[0], l[1] }); }
            return n;
        }
        public bool IsFight { get { return (t == "fight" || (t == "db" && p != null)) && p != null; } }
    }

    public class ArcDef { public string id, name; public Color color; public List<NodeDef> nodes = new List<NodeDef>(); }

    public class VerDef { public string arc; public double basePower; public List<string> forms; }

    public class SongDef { public float bpm; public int[] bass, lead; }

    public static class GameData
    {
        public static List<CharDef> Chars = new List<CharDef>();
        public static CharDef Whis;
        public static Dictionary<string, HairDef> Hair = new Dictionary<string, HairDef>();
        public static Dictionary<string, Dictionary<string, Vector3>> Poses = new Dictionary<string, Dictionary<string, Vector3>>();
        public static List<ArcDef> Arcs = new List<ArcDef>();
        public static Dictionary<string, List<VerDef>> Versions = new Dictionary<string, List<VerDef>>();
        public static Dictionary<string, float> VerK = new Dictionary<string, float>(), VerM = new Dictionary<string, float>();
        public static Dictionary<string, SongDef> Songs = new Dictionary<string, SongDef>();
        public static List<string> WorldNames = new List<string>();
        public static List<string[]> Fusions = new List<string[]>();
        public static float MaxHp = 10000, KiMax = 7;
        public static bool Loaded;

        public static Dictionary<string, int> ColorMap(Dictionary<string, object> o)
        {
            if (o == null) return null;
            var d = new Dictionary<string, int>();
            foreach (var kv in o) if (kv.Value is double) d[kv.Key] = (int)(double)kv.Value;
            return d;
        }

        public static void Load()
        {
            if (Loaded) return;
            var ta = Resources.Load<TextAsset>("Data/kaioken");
            if (ta == null) { Debug.LogError("Falta Resources/Data/kaioken.json"); return; }
            var root = MiniJson.Parse(ta.text);
            foreach (var c in J.Arr(root, "chars")) Chars.Add(CharDef.From(c));
            Whis = CharDef.From(J.Get(root, "whis"));
            foreach (var kv in J.Obj(root, "hair"))
            {
                var h = new HairDef { cap = J.I(kv.Value, "cap"), tip = J.F(kv.Value, "tip", .32f) };
                var sp = J.Arr(kv.Value, "sp");
                if (sp != null) foreach (var s in sp) { var f = J.Floats(s); if (f != null && f.Length >= 7) h.sp.Add(f); }
                Hair[kv.Key] = h;
            }
            foreach (var kv in J.Obj(root, "poses"))
            {
                var p = new Dictionary<string, Vector3>();
                var d = kv.Value as Dictionary<string, object>;
                if (d == null) continue;
                foreach (var j in d) { var f = J.Floats(j.Value); if (f != null && f.Length == 3) p[j.Key] = new Vector3(f[0], f[1], f[2]); }
                Poses[kv.Key] = p;
            }
            var story = J.Obj(root, "story");
            foreach (var a in J.Arr(root, "arcs"))
            {
                var arc = new ArcDef { id = J.Str(a, "id"), name = J.Str(a, "name"), color = Pal.Css(J.Str(a, "color", "#ff8a1e")) };
                var sd = J.Get(story, arc.id);
                var nl = J.Arr(sd, "nodes");
                if (nl != null) foreach (var n in nl) arc.nodes.Add(NodeDef.From(n));
                Arcs.Add(arc);
            }
            var wi = J.Get(story, "whatif");
            var stl = J.Arr(wi, "stories");
            if (stl != null) foreach (var s in stl)
                {
                    var arc = new ArcDef { id = J.Str(s, "id"), name = "¿Qué pasaría si…? " + J.Str(s, "name"), color = Pal.Css(J.Str(s, "color", "#c06aff")) };
                    foreach (var n in J.Arr(s, "nodes")) arc.nodes.Add(NodeDef.From(n));
                    Arcs.Add(arc);
                }
            foreach (var kv in J.Obj(root, "verData"))
            {
                var l = new List<VerDef>();
                foreach (var v in (List<object>)kv.Value) l.Add(new VerDef { arc = J.Str(v, "arc"), basePower = J.Num(v, "base"), forms = J.Strings(J.Get(v, "forms")) });
                Versions[kv.Key] = l;
            }
            foreach (var kv in J.Obj(root, "verK")) VerK[kv.Key] = (float)(double)kv.Value;
            foreach (var kv in J.Obj(root, "verM")) VerM[kv.Key] = (float)(double)kv.Value;
            foreach (var kv in J.Obj(root, "songs"))
            {
                var b = J.Floats(J.Get(kv.Value, "bass")); var l = J.Floats(J.Get(kv.Value, "lead"));
                if (b == null || l == null) continue;
                var s = new SongDef { bpm = J.F(kv.Value, "bpm", 120), bass = new int[b.Length], lead = new int[l.Length] };
                for (int i = 0; i < b.Length; i++) s.bass[i] = (int)b[i];
                for (int i = 0; i < l.Length; i++) s.lead[i] = (int)l[i];
                Songs[kv.Key] = s;
            }
            foreach (var w in J.Arr(root, "worlds")) WorldNames.Add(J.Str(w, "name"));
            foreach (var f in J.Arr(root, "fusions")) Fusions.Add(new[] { J.Str(f, "a"), J.Str(f, "b"), J.Str(f, "r"), J.Str(f, "how") });
            MaxHp = J.F(root, "maxHp", 10000); KiMax = J.F(root, "kiMax", 7);
            Loaded = true;
        }

        public static CharDef Char(string id)
        {
            if (id == "whis") return Whis;
            foreach (var c in Chars) if (c.id == id) return c;
            return null;
        }

        public static int CharIndex(string id) { for (int i = 0; i < Chars.Count; i++) if (Chars[i].id == id) return i; return -1; }

        /// <summary>Versión del luchador en un arco: poder base (crece con el arco) y formas de entonces.</summary>
        public static VerDef Version(string chId, string arc)
        {
            List<VerDef> l;
            if (!Versions.TryGetValue(chId, out l) || l.Count == 0) return null;
            VerDef best = null;
            foreach (var v in l) { if (best == null) best = v; if (ArcOrder(v.arc) <= ArcOrder(arc)) best = v; }
            if (best == null) return null;
            VerDef first = best;
            foreach (var v in l) if (v.basePower == best.basePower) { first = v; break; }
            float k1, k0;
            VerK.TryGetValue(best.arc, out k1); VerK.TryGetValue(first.arc, out k0);
            return new VerDef { arc = best.arc, basePower = best.basePower * (k1 > 0 ? k1 : 1) / (k0 > 0 ? k0 : 1), forms = best.forms };
        }

        public static int ArcOrder(string id) { for (int i = 0; i < Arcs.Count; i++) if (Arcs[i].id == id) return i; return 99; }
        public static List<string> VersionArcs(string chId) { var r = new List<string>(); List<VerDef> l; if (Versions.TryGetValue(chId, out l)) foreach (var v in l) r.Add(v.arc); return r; }
        public static string ArcName(string id) { foreach (var a in Arcs) if (a.id == id) return a.name; return id; }
    }
}
