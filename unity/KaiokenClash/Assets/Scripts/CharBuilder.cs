// Kaioken Clash (Unity) · Luchadores con proporciones de figura: cuerpo musculoso, pectorales, abdominales y brazos marcados,
// gi holgado, pelo de puntas afiladas (los mismos peinados que la versión web) y articulaciones para animar.
using System.Collections.Generic;
using UnityEngine;

namespace Kaioken
{
    public class Body
    {
        public Transform root, model, hairAnchor, headT;
        public readonly Dictionary<string, Transform> J = new Dictionary<string, Transform>();
        public readonly Dictionary<string, Material> M = new Dictionary<string, Material>();
        public readonly List<GameObject> extras = new List<GameObject>(), hairParts = new List<GameObject>();
        public readonly List<GameObject> muscles = new List<GameObject>();
        public CharDef ch;
        public string hairStyle = "", extrasKey = "";
        public float height = 1.9f;
        public Aura aura;
        public PoseAnimator anim;

        public Material Mat(string k)
        {
            Material m;
            if (!M.TryGetValue(k, out m)) { m = Pal.ToonUnique(Color.white); M[k] = m; }
            return m;
        }
    }

    public static class CharBuilder
    {
        const float HK = .82f; // tamaño del pelo respecto a la cabeza (los mechones de la web se diseñaron para una cabeza de radio 0,17)

        static GameObject P(Mesh mesh, Material m, Transform parent, float x, float y, float z, float sx, float sy, float sz, bool ol = true)
        {
            return MeshGen.Part(mesh, m, parent, new Vector3(x, y, z), new Vector3(sx, sy, sz), ol);
        }

        static Transform Joint(Body b, string name, Transform parent, float x, float y, float z)
        {
            var t = new GameObject(name).transform;
            t.SetParent(parent, false);
            t.localPosition = new Vector3(x, y, z);
            b.J[name] = t;
            return t;
        }

        /// <summary>Construye el cuerpo completo. El luchador mira hacia +Z, con los pies en y = 0.</summary>
        public static Body Build(CharDef ch, Transform parent)
        {
            var b = new Body { ch = ch };
            b.root = new GameObject("Luchador " + ch.name).transform;
            b.root.SetParent(parent, false);
            b.model = new GameObject("modelo").transform;
            b.model.SetParent(b.root, false);
            float H = ch.h;
            b.model.localScale = new Vector3(ch.scale.x * H, ch.scale.y * H, ch.scale.z * H);
            b.height = 1.95f * ch.scale.y * H;
            Mesh S = MeshGen.Sphere, C = MeshGen.Capsule, Cy = MeshGen.Cylinder, Bx = MeshGen.Cube;
            Material skin = b.Mat("skin"), top = b.Mat("top"), sleeve = b.Mat("sleeve"), pants = b.Mat("pants"), belt = b.Mat("belt"), boots = b.Mat("boots"),
                wrist = b.Mat("wrist"), glove = b.Mat("glove"), hair = b.Mat("hair"), eye = b.Mat("eye"), pupil = b.Mat("pupil"), mouth = b.Mat("mouth"), abs = b.Mat("abs");
            mouth.color = new Color(.25f, .08f, .08f);

            // cadera y piernas (pantalón holgado de gi)
            var hips = Joint(b, "hips", b.model, 0, 1.0f, 0);
            P(S, pants, hips, 0, 0, 0, .36f, .26f, .26f);
            P(Cy, belt, hips, 0, .08f, 0, .37f, .035f, .27f);
            var sash = P(Bx, belt, hips, .1f, -.06f, .13f, .07f, .2f, .02f); sash.transform.localRotation = Quaternion.Euler(0, 0, -8);
            b.muscles.Add(sash);
            foreach (var L in new[] { "L", "R" })
            {
                float s = L == "L" ? -1 : 1; // el lado izquierdo del luchador es -X
                var hip = Joint(b, "hip" + L, hips, s * .1f, -.05f, 0);
                P(C, pants, hip, 0, -.23f, 0, .23f, .25f, .23f);
                var kn = Joint(b, "kn" + L, hip, 0, -.46f, 0);
                P(C, pants, kn, 0, -.17f, .01f, .19f, .21f, .19f);
                var an = Joint(b, "an" + L, kn, 0, -.38f, 0);
                P(Cy, boots, an, 0, .06f, 0, .15f, .08f, .15f);
                P(S, boots, an, 0, -.04f, .06f, .14f, .1f, .27f);
                var lace = P(Bx, wrist, an, 0, .1f, .065f, .1f, .015f, .02f, false); lace.transform.localRotation = Quaternion.Euler(0, 0, 12);
            }

            // torso musculoso: abdomen, pecho ancho, pectorales, trapecios y dorsales
            var torso = Joint(b, "torso", hips, 0, .08f, 0);
            P(C, top, torso, 0, .14f, 0, .32f, .2f, .24f);
            P(S, top, torso, 0, .36f, -.01f, .5f, .32f, .32f);
            foreach (var s in new[] { -1f, 1f })
            {
                b.muscles.Add(P(S, top, torso, s * .095f, .37f, .1f, .2f, .17f, .13f));   // pectoral
                b.muscles.Add(P(S, top, torso, s * .17f, .28f, -.03f, .14f, .26f, .2f));  // dorsal
            }
            for (int r = 0; r < 3; r++) for (int s2 = -1; s2 <= 1; s2 += 2)
                    b.muscles.Add(P(S, abs, torso, s2 * .04f, .23f - r * .065f, .115f, .07f, .055f, .04f, false)); // abdominales (solo se ven sin camiseta)
            b.muscles.Add(P(S, top, torso, 0, .5f, -.04f, .36f, .14f, .2f)); // trapecios

            // cuello y cabeza
            var neck = Joint(b, "neck", torso, 0, .54f, 0);
            P(Cy, skin, neck, 0, .04f, 0, .13f, .07f, .13f);
            var head = Joint(b, "head", neck, 0, .1f, 0);
            b.headT = head;
            var hg = new GameObject("cabeza").transform; hg.SetParent(head, false); hg.localPosition = new Vector3(0, .1f, 0);
            hg.localScale = ch.head;
            P(S, skin, hg, 0, 0, 0, .23f, .26f, .24f);
            P(S, skin, hg, 0, -.07f, .03f, .17f, .12f, .17f); // mandíbula
            P(S, skin, hg, 0, -.01f, .118f, .03f, .04f, .04f, false); // nariz
            if (ch.ears) foreach (var s in new[] { -1f, 1f }) P(S, skin, hg, s * .115f, 0, 0, .03f, .06f, .05f);
            foreach (var s in new[] { -1f, 1f })
            {
                var w = P(S, eye, hg, s * .045f, .02f, .102f, .05f, .03f, .015f, false); w.transform.localRotation = Quaternion.Euler(0, 0, -s * 8);
                P(S, pupil, hg, s * .042f, .019f, .109f, .018f, .024f, .01f, false);
                var lid = P(Bx, mouth, hg, s * .045f, .038f, .108f, .055f, .007f, .006f, false); lid.transform.localRotation = Quaternion.Euler(0, 0, -s * 12);
                var br = P(Bx, hair, hg, s * .047f, .058f, .103f, .06f, .014f, .012f, false); br.transform.localRotation = Quaternion.Euler(0, 0, -s * 20);
            }
            P(Bx, mouth, hg, 0, -.055f, .11f, .035f, .005f, .005f, false);
            b.hairAnchor = new GameObject("pelo").transform; b.hairAnchor.SetParent(hg, false);

            // brazos: deltoides, bíceps, antebrazo, muñequera y puño
            foreach (var L in new[] { "L", "R" })
            {
                float s = L == "L" ? -1 : 1;
                var sh = Joint(b, "sh" + L, torso, s * .29f, .44f, 0);
                b.muscles.Add(P(S, sleeve, sh, s * .02f, -.01f, 0, .19f, .17f, .19f));
                P(C, sleeve, sh, 0, -.16f, 0, .15f, .17f, .15f);
                b.muscles.Add(P(S, sleeve, sh, 0, -.14f, .04f, .11f, .15f, .1f)); // bíceps
                var el = Joint(b, "el" + L, sh, 0, -.32f, 0);
                P(C, skin, el, 0, -.13f, 0, .13f, .15f, .13f);
                var wr = Joint(b, "wr" + L, el, 0, -.27f, 0);
                P(Cy, wrist, wr, 0, .03f, 0, .135f, .045f, .135f);
                P(S, glove, wr, 0, -.06f, .01f, .1f, .11f, .11f);
            }
            b.anim = new PoseAnimator(b);
            return b;
        }

        /// <summary>Aplica una forma: colores, pelo, extras, escala.</summary>
        public static void ApplyForm(Body b, FormDef f, Dictionary<string, int> outfit = null)
        {
            var ch = b.ch;
            System.Func<string, int, int> col = (k, def) =>
            {
                int v;
                if (f != null && f.colors != null && f.colors.TryGetValue(k, out v)) return v;
                if (outfit != null && outfit.TryGetValue(k, out v)) return v;
                return ch.Col(k, def);
            };
            int skin = col("skin", 0xf2c79a);
            int top = col("top", skin);
            b.Mat("skin").color = Pal.Hex(skin);
            b.Mat("abs").color = Pal.Hex(skin) * .92f;
            b.Mat("top").color = Pal.Hex(top);
            b.Mat("sleeve").color = Pal.Hex(col("sleeve", skin));
            b.Mat("pants").color = Pal.Hex(col("pants", top));
            b.Mat("belt").color = Pal.Hex(col("belt", col("pants", top)));
            b.Mat("boots").color = Pal.Hex(col("boots", col("pants", top)));
            b.Mat("wrist").color = Pal.Hex(col("wrist", col("glove", skin)));
            b.Mat("glove").color = Pal.Hex(col("glove", skin));
            b.Mat("ex1").color = Pal.Hex(col("ex1", 0xffffff));
            b.Mat("ex2").color = Pal.Hex(col("ex2", 0x222222));
            b.Mat("eye").color = Pal.Hex(f != null && f.eye >= 0 ? f.eye : col("eye", 0xffffff));
            b.Mat("pupil").color = Pal.Hex(f != null && f.pupil >= 0 ? f.pupil : col("pupil", 0x151515));
            b.Mat("hair").color = Pal.Hex(f != null && f.hairColor >= 0 ? f.hairColor : ch.hairColor);
            SetHair(b, f != null && !string.IsNullOrEmpty(f.hair) ? f.hair : ch.hair);
            SetExtras(b, f != null && f.extras != null ? f.extras : ch.extras);
            Vector3 sc = f != null && f.hasScale ? f.scale : ch.scale;
            b.model.localScale = sc * ch.h;
            // sin camiseta (pelaje del SSJ4, gi roto): se notan los abdominales
            bool shirtless = top == skin;
            foreach (var m in b.muscles) if (m.name == "pieza" && m.GetComponent<MeshRenderer>().sharedMaterial == b.Mat("abs")) m.SetActive(shirtless);
        }

        /// <summary>Peinado: los mismos mechones que la versión web (posición, giro, largo y grosor), con puntas afiladas.</summary>
        public static void SetHair(Body b, string style)
        {
            if (b.hairStyle == style) return;
            b.hairStyle = style;
            foreach (var g in b.hairParts) Object.Destroy(g);
            b.hairParts.Clear();
            HairDef h;
            if (!GameData.Hair.TryGetValue(style ?? "none", out h)) return;
            var mat = b.Mat("hair");
            if (h.cap > 0)
            {
                float r = (h.cap == 2 ? .212f : .19f) * .68f;
                var cap = MeshGen.Part(MeshGen.Cap(r, h.cap == 2 ? .6f : .52f), mat, b.hairAnchor, new Vector3(0, .008f, -.012f), Vector3.one * 1.04f, true, "casquete");
                cap.transform.localRotation = Quaternion.Euler(h.cap == 2 ? -9 : -18, 0, 0);
                b.hairParts.Add(cap);
            }
            foreach (var s in h.sp)
            {
                float k = HK;
                var m = MeshGen.HairLock(s[6] * 1.35f * k, s[5] * k, h.tip);
                var g = MeshGen.Part(m, mat, b.hairAnchor, new Vector3(-s[0] * k, s[1] * k, s[2] * k), new Vector3(1, 1, .72f), true, "mechón");
                g.transform.localRotation = Quaternion.AngleAxis(s[3] * Mathf.Rad2Deg, Vector3.right) * Quaternion.AngleAxis(-s[4] * Mathf.Rad2Deg, Vector3.forward);
                b.hairParts.Add(g);
            }
        }

        /// <summary>Piezas extra de cada personaje (armadura, cola, capa, antenas, cuernos…).</summary>
        public static void SetExtras(Body b, List<string> list)
        {
            string key = list == null ? "" : string.Join(",", list.ToArray());
            if (b.extrasKey == key) return;
            b.extrasKey = key;
            foreach (var g in b.extras) Object.Destroy(g);
            b.extras.Clear();
            if (list == null) return;
            Mesh S = MeshGen.Sphere, Cy = MeshGen.Cylinder, Bx = MeshGen.Cube;
            Material ex1 = b.Mat("ex1"), ex2 = b.Mat("ex2"), skin = b.Mat("skin"), top = b.Mat("top"), hair = b.Mat("hair");
            Transform torso = b.J["torso"], hips = b.J["hips"], hg = b.hairAnchor.parent;
            foreach (var e in list)
            {
                switch (e)
                {
                    case "armor":
                        b.extras.Add(P(S, ex1, torso, 0, .36f, -.01f, .54f, .36f, .36f));
                        foreach (var L in new[] { "L", "R" }) b.extras.Add(P(S, ex2, b.J["sh" + L], 0, .05f, 0, .24f, .1f, .26f));
                        break;
                    case "tail":
                    case "furTail":
                    case "catTail":
                        {
                            Transform par = hips; float r = e == "catTail" ? .035f : .06f;
                            for (int i = 0; i < 6; i++)
                            {
                                var seg = new GameObject("cola").transform; seg.SetParent(par, false);
                                seg.localPosition = i == 0 ? new Vector3(0, -.02f, -.14f) : new Vector3(0, .17f, 0);
                                seg.localRotation = Quaternion.Euler(i == 0 ? -120 : -18, 0, 0);
                                var piece = P(Cy, e == "catTail" ? skin : top, seg, 0, .085f, 0, r * 2 - i * .006f, .09f, r * 2 - i * .006f);
                                b.extras.Add(seg.gameObject); par = seg;
                            }
                            break;
                        }
                    case "cape":
                        b.extras.Add(P(Bx, ex2, torso, 0, .15f, -.2f, .56f, .85f, .02f));
                        break;
                    case "antennae":
                        foreach (var s in new[] { -1f, 1f }) { var a = P(Cy, skin, hg, s * .04f, .14f, .06f, .012f, .07f, .012f); a.transform.localRotation = Quaternion.Euler(30, 0, s * 15); b.extras.Add(a); }
                        break;
                    case "ears":
                    case "pointyEars":
                        foreach (var s in new[] { -1f, 1f }) { var a = MeshGen.Part(MeshGen.Cone(.025f, .09f), skin, hg, new Vector3(s * .12f, .01f, 0), Vector3.one, true); a.transform.localRotation = Quaternion.Euler(0, 0, s * 80); b.extras.Add(a); }
                        break;
                    case "horns":
                    case "hitHorns":
                    case "hornsBig":
                        foreach (var s in new[] { -1f, 1f }) { var a = MeshGen.Part(MeshGen.Cone(.025f, e == "hornsBig" ? .16f : .1f), ex2, hg, new Vector3(s * .09f, .08f, -.01f), Vector3.one, true); a.transform.localRotation = Quaternion.Euler(-20, 0, s * 35); b.extras.Add(a); }
                        break;
                    case "earrings":
                    case "earringL":
                        foreach (var s in e == "earrings" ? new[] { -1f, 1f } : new[] { -1f }) b.extras.Add(P(S, ex1, hg, s * .118f, -.04f, 0, .022f, .022f, .022f, false));
                        break;
                    case "halo":
                        {
                            var a = MeshGen.Part(MeshGen.Torus(.12f, .012f), ex2, hg, new Vector3(0, .2f, -.05f), Vector3.one, false); b.extras.Add(a);
                            break;
                        }
                    case "mustache":
                    case "toppoStache":
                        foreach (var s in new[] { -1f, 1f }) { var a = P(Bx, ex1.color == Color.white ? hair : ex1, hg, s * .03f, -.035f, .112f, .05f, .012f, .012f, false); a.transform.localRotation = Quaternion.Euler(0, 0, s * 20); b.extras.Add(a); }
                        break;
                    case "collar":
                        b.extras.Add(P(Cy, ex1, torso, 0, .55f, 0, .3f, .02f, .26f));
                        break;
                    case "giCollar":
                        foreach (var s in new[] { -1f, 1f }) { var a = P(Bx, b.Mat("belt"), torso, s * .05f, .44f, .155f, .03f, .2f, .02f, false); a.transform.localRotation = Quaternion.Euler(0, 0, s * 25); b.extras.Add(a); }
                        break;
                    case "pads":
                        foreach (var L in new[] { "L", "R" }) b.extras.Add(P(S, ex1, b.J["sh" + L], 0, .06f, 0, .25f, .12f, .25f));
                        break;
                    case "furChest":
                        b.extras.Add(P(S, skin, torso, 0, .34f, .05f, .38f, .26f, .26f, false));
                        break;
                    case "redRims":
                        foreach (var s in new[] { -1f, 1f }) { var a = P(Bx, b.Mat("mouth"), hg, s * .045f, .036f, .109f, .055f, .01f, .006f, false); a.GetComponent<MeshRenderer>().sharedMaterial = Pal.Toon(0xd01a2a); b.extras.Add(a); }
                        break;
                    case "robe":
                    case "gammaCoat":
                    case "longCoat":
                        b.extras.Add(P(Cy, ex2, hips, 0, -.25f, 0, .5f, .3f, .4f));
                        break;
                }
            }
        }
    }
}
