// Kaioken Clash (Unity) · Mundos con colores planos y contorno, como el manga de Toriyama:
// Namek turquesa con árboles de copa azul, el yermo de mesetas, la arena del Torneo del Poder, el planeta de Bills, Kame House,
// la montaña Paoz, el planeta de Kaiosama, la Antártida, la Habitación del Tiempo y la órbita de la Tierra.
using System.Collections.Generic;
using UnityEngine;

namespace Kaioken
{
    public class Obstacle { public float x, z, r, y0, top; public bool alive = true; public GameObject go; }

    public class World
    {
        public Transform root;
        public string name, music = "menu";
        public float bound = 150, maxY = 80, spawnY = 1;
        public bool noGround;
        public List<Obstacle> rocks = new List<Obstacle>();
        public System.Func<float, float, float> ground = (x, z) => 0;

        public float GroundY(float x, float z)
        {
            if (noGround) return float.NegativeInfinity;
            float g = ground(x, z);
            foreach (var r in rocks) if (r.alive && (x - r.x) * (x - r.x) + (z - r.z) * (z - r.z) < r.r * r.r) g = Mathf.Max(g, r.top);
            return g;
        }

        public void Destroy() { if (root != null) Object.Destroy(root.gameObject); }
    }

    public static class WorldBuilder
    {
        static World W;
        static float Noise(float x, float z) { return Mathf.PerlinNoise(x * .03f + 100, z * .03f + 100); }

        public static World Build(int index, int variant)
        {
            W = new World { root = new GameObject("Mundo").transform };
            W.name = index >= 0 && index < GameData.WorldNames.Count ? GameData.WorldNames[index] : "Mundo";
            RenderSettings.fog = true;
            RenderSettings.fogMode = FogMode.Linear;
            switch (index)
            {
                case 1: Namek(variant == 1); break;
                case 2: Arena(variant == 1); break;
                case 3: Kaiosama(); break;
                case 4: Broken(); break;
                case 5: Antarctic(); break;
                case 6: KameHouse(variant == 1); break;
                case 7: City(variant == 1); break;
                case 8: Paoz(variant == 1); break;
                case 9: Budokai(); break;
                case 10: Bills(variant == 1); break;
                case 11: Room(); break;
                case 12: Orbit(); break;
                default: Wasteland(variant == 1); break;
            }
            return W;
        }

        // ---------- piezas comunes ----------
        static void Sky(Color top, Color mid, Color bottom, Vector3 sun, Color sunCol, Color fog, float fogStart, float fogEnd)
        {
            var g = MeshGen.Part(MeshGen.Sphere, new Material(Pal.SkyShader), W.root, Vector3.zero, Vector3.one * 1800, false, "cielo");
            var m = g.GetComponent<MeshRenderer>().sharedMaterial;
            m.SetColor("_Top", top); m.SetColor("_Mid", mid); m.SetColor("_Bottom", bottom); m.SetVector("_SunDir", sun.normalized); m.SetColor("_SunCol", sunCol);
            g.GetComponent<MeshRenderer>().shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
            RenderSettings.fogColor = fog; RenderSettings.fogStartDistance = fogStart; RenderSettings.fogEndDistance = fogEnd;
            RenderSettings.ambientLight = Color.Lerp(mid, Color.white, .3f) * .55f;
            var lg = new GameObject("sol").AddComponent<Light>();
            lg.transform.SetParent(W.root, false);
            lg.type = LightType.Directional;
            lg.transform.rotation = Quaternion.LookRotation(-sun.normalized);
            lg.color = Color.Lerp(sunCol, Color.white, .5f);
            lg.intensity = 1.1f;
            lg.shadows = LightShadows.Hard;
        }

        static GameObject Ground(float size, int seg, System.Func<float, float, float> h, System.Func<float, float, float, Color> c)
        {
            var mesh = MeshGen.Terrain(size, seg, h, c);
            var g = MeshGen.Part(mesh, Pal.ToonVC, W.root, Vector3.zero, Vector3.one, false, "suelo");
            g.GetComponent<MeshRenderer>().receiveShadows = true;
            W.ground = h;
            return g;
        }

        static GameObject Prop(Mesh m, Color c, Vector3 pos, Vector3 scale, float rotY = 0, bool outline = true)
        {
            var g = MeshGen.Part(m, Pal.Toon(c), W.root, pos, scale, outline, "decorado");
            g.transform.localRotation = Quaternion.Euler(0, rotY, 0);
            return g;
        }

        /// <summary>Roca o meseta de capas (estilo Toriyama): cilindros apilados con la cima de otro color. Cuenta como cobertura.</summary>
        static void Mesa(float x, float z, float r, float h, Color side, Color topC, Color band)
        {
            float g = W.ground(x, z);
            int layers = Mathf.Max(2, (int)(h / 3));
            for (int i = 0; i < layers; i++)
            {
                float k = 1 - i * .06f;
                Prop(MeshGen.Cylinder, i % 2 == 0 ? side : band, new Vector3(x, g + h * (i + .5f) / layers, z), new Vector3(r * 2 * k, h / layers * .5f, r * 2 * k), Random.Range(0, 360f));
            }
            Prop(MeshGen.Cylinder, topC, new Vector3(x, g + h + .15f, z), new Vector3(r * 1.9f * (1 - layers * .06f), .15f, r * 1.9f * (1 - layers * .06f)), 0);
            W.rocks.Add(new Obstacle { x = x, z = z, r = r, y0 = g, top = g + h + .3f });
        }

        /// <summary>Árbol de Namek (como en el manga): tronco alto y fino y copa redonda azul.</summary>
        static void BallTree(float x, float z, float hgt, Color trunk, Color crown, float crownR)
        {
            float g = W.ground(x, z);
            Prop(MeshGen.Cylinder, trunk, new Vector3(x, g + hgt * .5f, z), new Vector3(.35f, hgt * .5f, .35f));
            Prop(MeshGen.Sphere, crown, new Vector3(x, g + hgt + crownR * .6f, z), new Vector3(crownR * 2, crownR * 1.7f, crownR * 2));
            W.rocks.Add(new Obstacle { x = x, z = z, r = .45f, y0 = g, top = g + hgt });
        }

        static void PineTree(float x, float z, float s, Color trunk, Color leaf)
        {
            float g = W.ground(x, z);
            Prop(MeshGen.Cylinder, trunk, new Vector3(x, g + 1.5f * s, z), new Vector3(.5f * s, 1.5f * s, .5f * s));
            for (int i = 0; i < 3; i++) MeshGen.Part(MeshGen.Cone(2.2f * s * (1 - i * .22f), 3.2f * s), Pal.Toon(leaf), W.root, new Vector3(x, g + 2.4f * s + i * 1.6f * s, z), Vector3.one, true, "pino");
            W.rocks.Add(new Obstacle { x = x, z = z, r = .5f * s, y0 = g, top = g + 7 * s });
        }

        static void Dome(float x, float z, float r, Color c, Color win)
        {
            float g = W.ground(x, z);
            MeshGen.Part(MeshGen.Cap(r, .5f), Pal.Toon(c), W.root, new Vector3(x, g, z), Vector3.one, true, "casa");
            for (int i = 0; i < 3; i++)
            {
                float a = i * 2.1f;
                Prop(MeshGen.Sphere, win, new Vector3(x + Mathf.Cos(a) * r * .9f, g + r * .45f, z + Mathf.Sin(a) * r * .9f), Vector3.one * r * .3f, 0, false);
            }
            W.rocks.Add(new Obstacle { x = x, z = z, r = r, y0 = g, top = g + r });
        }

        static void Water(float y, float size, Color c)
        {
            var g = Prop(MeshGen.Cube, c, new Vector3(0, y - .5f, 0), new Vector3(size, 1, size), 0, false);
            g.GetComponent<MeshRenderer>().sharedMaterial = Pal.Toon(c, .8f);
        }

        // ---------- mundos ----------
        static void Wasteland(bool storm)
        {
            Sky(storm ? new Color(.45f, .35f, .3f) : new Color(.35f, .6f, .95f), storm ? new Color(.75f, .55f, .4f) : new Color(.95f, .85f, .7f), new Color(.8f, .6f, .4f), new Vector3(.4f, .5f, .3f), new Color(1, .9f, .7f), storm ? new Color(.7f, .5f, .35f) : new Color(.95f, .82f, .65f), 80, storm ? 260 : 520);
            Ground(420, 120, (x, z) => (Noise(x, z) - .5f) * 6, (x, z, y) => Color.Lerp(new Color(.85f, .62f, .38f), new Color(.72f, .5f, .3f), Noise(x * 3, z * 3)));
            Random.InitState(7);
            for (int i = 0; i < 26; i++)
            {
                float a = Random.Range(0, Mathf.PI * 2), d = Random.Range(25, 170);
                Mesa(Mathf.Cos(a) * d, Mathf.Sin(a) * d, Random.Range(5, 13), Random.Range(10, 36), new Color(.78f, .48f, .3f), new Color(.86f, .7f, .45f), new Color(.65f, .38f, .24f));
            }
            for (int i = 0; i < 30; i++) { float a = Random.Range(0, Mathf.PI * 2), d = Random.Range(12, 120); var p = new Vector3(Mathf.Cos(a) * d, 0, Mathf.Sin(a) * d); p.y = W.ground(p.x, p.z); Prop(MeshGen.Sphere, new Color(.6f, .45f, .32f), p, Vector3.one * Random.Range(1.2f, 3.5f)); }
            W.music = "earth";
        }

        static void Namek(bool burning)
        {
            Color skyTop = burning ? new Color(.55f, .2f, .15f) : new Color(.45f, .85f, .55f), skyMid = burning ? new Color(.9f, .45f, .25f) : new Color(.75f, .95f, .7f);
            Sky(skyTop, skyMid, new Color(.3f, .6f, .6f), new Vector3(.5f, .55f, .2f), new Color(1, 1, .85f), burning ? new Color(.8f, .4f, .25f) : new Color(.7f, .9f, .75f), 90, 560);
            Color grassA = new Color(.38f, .78f, .72f), grassB = new Color(.42f, .74f, .38f), water = burning ? new Color(.95f, .4f, .15f) : new Color(.35f, .75f, .8f);
            Ground(460, 130, (x, z) => { float n = Noise(x, z); return (n - .45f) * 12 + Mathf.Max(0, 8 - Mathf.Sqrt(x * x + z * z) * .05f); },
                (x, z, y) => y < -1.2f ? new Color(.55f, .42f, .3f) : (Mathf.PerlinNoise(x * .05f + 7, z * .05f) > .55f ? grassB : grassA));
            Water(-1.4f, 900, water);
            Random.InitState(3);
            Color crown = new Color(.2f, .35f, .85f), trunk = new Color(.82f, .38f, .2f);
            for (int i = 0; i < 60; i++)
            {
                float a = Random.Range(0, Mathf.PI * 2), d = Random.Range(16, 190), x = Mathf.Cos(a) * d, z = Mathf.Sin(a) * d;
                if (W.ground(x, z) < -.8f) continue;
                BallTree(x, z, Random.Range(6, 16), trunk, crown, Random.Range(1.4f, 2.6f));
            }
            for (int i = 0; i < 18; i++)
            {
                float a = Random.Range(0, Mathf.PI * 2), d = Random.Range(30, 170);
                Mesa(Mathf.Cos(a) * d, Mathf.Sin(a) * d, Random.Range(5, 11), Random.Range(6, 22), new Color(.62f, .42f, .26f), grassA, new Color(.5f, .32f, .2f));
            }
            for (int i = 0; i < 5; i++) Dome(-30 + i * 14, 40 + (i % 2) * 6, 4, new Color(.95f, .95f, .9f), new Color(.2f, .25f, .35f));
            for (int i = 0; i < 40; i++) { float a = Random.Range(0, Mathf.PI * 2), d = Random.Range(10, 80); var p = new Vector3(Mathf.Cos(a) * d, 0, Mathf.Sin(a) * d); p.y = W.ground(p.x, p.z); Prop(MeshGen.Sphere, new Color(.85f, .2f, .2f), p, new Vector3(.5f, .25f, .5f), 0, false); }
            W.music = "namek";
        }

        static void Arena(bool ruins)
        {
            Sky(new Color(.25f, .1f, .45f), new Color(.55f, .35f, .75f), new Color(.1f, .05f, .2f), new Vector3(.2f, .9f, .2f), new Color(1, .9f, 1), new Color(.3f, .18f, .45f), 150, 900);
            const float R = 60;
            for (int i = -15; i < 15; i++)
                for (int j = -15; j < 15; j++)
                {
                    float cx = (i + .5f) * 4, cz = (j + .5f) * 4;
                    if (cx * cx + cz * cz > R * R) continue;
                    if (ruins && Random.value < .25f && cx * cx + cz * cz > 100) continue;
                    bool ring = Mathf.Abs(Mathf.Sqrt(cx * cx + cz * cz) - 18) < 2;
                    Prop(MeshGen.Cube, ring ? new Color(.62f, .58f, .75f) : ((i + j) % 2 == 0 ? new Color(.86f, .84f, .92f) : new Color(.8f, .78f, .88f)), new Vector3(cx, -.5f, cz), new Vector3(3.95f, 1, 3.95f), 0, false);
                }
            W.ground = (x, z) => x * x + z * z < R * R ? 0 : float.NegativeInfinity;
            for (int k = 0; k < 3; k++) { var t = Prop(MeshGen.Cylinder, new Color(.8f, .78f, .9f), new Vector3(0, .65f + k * 1.3f, 0), new Vector3(18 - k * 5.5f, .65f, 18 - k * 5.5f)); W.rocks.Add(new Obstacle { x = 0, z = 0, r = 9 - k * 2.75f, y0 = k * 1.3f, top = (k + 1) * 1.3f }); }
            Random.InitState(5);
            for (int i = 0; i < 14; i++)
            {
                float a = Random.Range(0, Mathf.PI * 2), d = Random.Range(22, 54), x = Mathf.Cos(a) * d, z = Mathf.Sin(a) * d, h = Random.Range(6, 22);
                Prop(MeshGen.Cube, new Color(.84f, .82f, .92f), new Vector3(x, h * .5f, z), new Vector3(3, h, 3), 45);
                W.rocks.Add(new Obstacle { x = x, z = z, r = 2.1f, y0 = 0, top = h });
            }
            for (int i = 0; i < 8; i++)
            {
                float a = i / 8f * Mathf.PI * 2;
                Prop(MeshGen.Cylinder, new Color(.35f, .3f, .55f), new Vector3(Mathf.Cos(a) * (R + 30), 12, Mathf.Sin(a) * (R + 30)), new Vector3(14, 1.6f, 14), 0);
            }
            W.bound = R - 2; W.music = "void";
        }

        static void Kaiosama()
        {
            Sky(new Color(.95f, .75f, .4f), new Color(1f, .9f, .6f), new Color(.8f, .6f, .3f), new Vector3(.3f, .6f, .4f), Color.white, new Color(1, .9f, .7f), 120, 700);
            const float R = 60;
            Ground(150, 80, (x, z) => { float r2 = x * x + z * z; return r2 < R * R ? Mathf.Sqrt(R * R - r2) - R : -40; }, (x, z, y) => Mathf.Abs(x) < 2.5f ? new Color(.85f, .78f, .6f) : new Color(.45f, .8f, .35f));
            Dome(0, 18, 4.5f, new Color(.95f, .95f, .95f), new Color(.85f, .2f, .2f));
            BallTree(-12, 10, 7, new Color(.6f, .4f, .2f), new Color(.3f, .7f, .3f), 3);
            W.bound = 55; W.music = "kaio";
        }

        static void Broken()
        {
            Sky(new Color(.05f, .02f, .12f), new Color(.35f, .1f, .5f), new Color(.02f, .02f, .06f), new Vector3(.1f, .2f, .9f), new Color(.6f, .8f, 1f), new Color(.1f, .05f, .2f), 200, 1200);
            W.noGround = true;
            Random.InitState(9);
            for (int i = 0; i < 40; i++)
            {
                var p = Random.insideUnitSphere * 160; p.y = Mathf.Abs(p.y) * .4f - 10;
                var g = Prop(MeshGen.Cube, Color.HSVToRGB(Random.value, .5f, .8f), p, Vector3.one * Random.Range(2f, 9f), Random.Range(0, 360f));
                g.transform.rotation = Random.rotation;
                W.rocks.Add(new Obstacle { x = p.x, z = p.z, r = 3, y0 = p.y - 3, top = p.y + 3 });
            }
            W.bound = 170; W.spawnY = 6; W.music = "broken";
        }

        static void Antarctic()
        {
            Sky(new Color(.45f, .65f, .95f), new Color(.85f, .92f, 1f), new Color(.9f, .95f, 1f), new Vector3(.3f, .25f, .6f), new Color(1, .95f, .9f), new Color(.88f, .92f, 1f), 70, 420);
            Ground(420, 110, (x, z) => (Noise(x, z) - .5f) * 8, (x, z, y) => y > 1 ? Color.white : new Color(.82f, .9f, 1f));
            Random.InitState(11);
            for (int i = 0; i < 22; i++) { float a = Random.Range(0, Mathf.PI * 2), d = Random.Range(25, 170); MeshGen.Part(MeshGen.Cone(Random.Range(4, 9), Random.Range(10, 30), 6), Pal.Toon(new Color(.7f, .85f, 1f)), W.root, new Vector3(Mathf.Cos(a) * d, W.ground(Mathf.Cos(a) * d, Mathf.Sin(a) * d) - 1, Mathf.Sin(a) * d), Vector3.one, true, "glaciar"); W.rocks.Add(new Obstacle { x = Mathf.Cos(a) * d, z = Mathf.Sin(a) * d, r = 4, top = 12 }); }
            W.music = "ice";
        }

        static void KameHouse(bool sunset)
        {
            Sky(sunset ? new Color(.95f, .5f, .4f) : new Color(.3f, .6f, 1f), sunset ? new Color(1f, .75f, .5f) : new Color(.8f, .92f, 1f), new Color(.3f, .6f, .8f), new Vector3(.4f, sunset ? .15f : .6f, .4f), new Color(1, .9f, .7f), sunset ? new Color(1, .75f, .6f) : new Color(.8f, .9f, 1f), 120, 800);
            Ground(400, 100, (x, z) => { float r = Mathf.Sqrt(x * x + z * z); return r < 22 ? 1.2f - r * r * .0015f : -2 - r * .01f; }, (x, z, y) => y > .2f ? new Color(.98f, .9f, .62f) : new Color(.9f, .82f, .55f));
            Water(0, 900, new Color(.2f, .55f, .9f));
            var house = Prop(MeshGen.Cube, new Color(.98f, .7f, .78f), new Vector3(6, 3.2f, -4), new Vector3(7, 4, 6));
            Prop(MeshGen.Cube, new Color(.85f, .25f, .25f), new Vector3(6, 5.6f, -4), new Vector3(8, .8f, 7));
            W.rocks.Add(new Obstacle { x = 6, z = -4, r = 4, top = 6 });
            for (int i = 0; i < 3; i++) { float x = -10 + i * 4, z = 8 - i * 2; float g = W.ground(x, z); Prop(MeshGen.Cylinder, new Color(.75f, .55f, .3f), new Vector3(x, g + 3, z), new Vector3(.4f, 3, .4f)); for (int k = 0; k < 5; k++) { var l = Prop(MeshGen.Cube, new Color(.25f, .7f, .3f), new Vector3(x, g + 6, z), new Vector3(.4f, .1f, 3), k * 72); l.transform.localRotation = Quaternion.Euler(20, k * 72, 0); } }
            W.music = "kame";
        }

        static void City(bool ruins)
        {
            Sky(ruins ? new Color(.4f, .4f, .45f) : new Color(.35f, .6f, .95f), ruins ? new Color(.65f, .6f, .55f) : new Color(.85f, .92f, 1f), new Color(.6f, .6f, .6f), new Vector3(.4f, .5f, .3f), Color.white, ruins ? new Color(.55f, .52f, .5f) : new Color(.8f, .88f, .95f), 90, 600);
            Ground(400, 40, (x, z) => 0, (x, z, y) => (Mathf.Abs(x % 30) < 4 || Mathf.Abs(z % 30) < 4) ? new Color(.35f, .35f, .4f) : new Color(.55f, .75f, .45f));
            Random.InitState(13);
            for (int i = -4; i <= 4; i++)
                for (int j = -4; j <= 4; j++)
                {
                    if (Mathf.Abs(i) <= 1 && Mathf.Abs(j) <= 1) continue;
                    float x = i * 30 + 15, z = j * 30 + 15, h = ruins ? Random.Range(4, 16) : Random.Range(10, 45);
                    bool dome = Random.value < .35f;
                    if (dome) Dome(x, z, 7, new Color(.95f, .95f, .92f), new Color(.2f, .3f, .5f));
                    else { Prop(MeshGen.Cube, Color.HSVToRGB(Random.value, .2f, .9f), new Vector3(x, h * .5f, z), new Vector3(12, h, 12)); W.rocks.Add(new Obstacle { x = x, z = z, r = 7, top = h }); }
                }
            W.music = "city";
        }

        static void Paoz(bool sunset)
        {
            Sky(sunset ? new Color(.9f, .45f, .35f) : new Color(.35f, .62f, .95f), sunset ? new Color(1, .7f, .5f) : new Color(.85f, .95f, 1f), new Color(.5f, .6f, .5f), new Vector3(.4f, sunset ? .2f : .6f, .3f), new Color(1, .92f, .75f), sunset ? new Color(.95f, .7f, .55f) : new Color(.8f, .92f, .9f), 80, 480);
            Ground(420, 120, (x, z) => (Noise(x, z) - .5f) * 10 + Mathf.Max(0, Mathf.Sqrt(x * x + z * z) - 120) * .5f, (x, z, y) => y > 9 ? new Color(.55f, .5f, .45f) : new Color(.38f, .7f, .32f));
            Random.InitState(17);
            for (int i = 0; i < 80; i++) { float a = Random.Range(0, Mathf.PI * 2), d = Random.Range(18, 170); PineTree(Mathf.Cos(a) * d, Mathf.Sin(a) * d, Random.Range(.8f, 1.6f), new Color(.5f, .32f, .2f), new Color(.15f, .5f, .25f)); }
            for (int i = 0; i < 10; i++) { float a = Random.Range(0, Mathf.PI * 2), d = Random.Range(40, 150); Mesa(Mathf.Cos(a) * d, Mathf.Sin(a) * d, Random.Range(4, 8), Random.Range(18, 40), new Color(.6f, .55f, .5f), new Color(.38f, .65f, .32f), new Color(.5f, .45f, .42f)); }
            Dome(-8, 16, 4, new Color(.95f, .92f, .85f), new Color(.3f, .3f, .4f));
            W.music = "paoz";
        }

        static void Budokai()
        {
            Sky(new Color(.35f, .6f, .95f), new Color(.85f, .92f, 1f), new Color(.6f, .6f, .6f), new Vector3(.4f, .55f, .3f), Color.white, new Color(.85f, .9f, .95f), 120, 700);
            Ground(400, 40, (x, z) => Mathf.Abs(x) < 18 && Mathf.Abs(z) < 18 ? 1.6f : 0, (x, z, y) => y > 1 ? new Color(.85f, .82f, .75f) : new Color(.45f, .72f, .4f));
            Prop(MeshGen.Cube, new Color(.82f, .8f, .74f), new Vector3(0, .8f, 0), new Vector3(36, 1.6f, 36));
            Prop(MeshGen.Cube, new Color(.95f, .45f, .25f), new Vector3(0, 9, -45), new Vector3(30, 18, 10));
            W.music = "budokai";
        }

        static void Bills(bool night)
        {
            Sky(night ? new Color(.08f, .05f, .2f) : new Color(.55f, .45f, .9f), night ? new Color(.4f, .2f, .5f) : new Color(.98f, .75f, .9f), new Color(.3f, .2f, .4f), new Vector3(.6f, .5f, -.6f), new Color(1, .95f, .85f), night ? new Color(.2f, .12f, .3f) : new Color(.92f, .78f, .92f), 120, 900);
            const float R = 340;
            Ground(420, 120, (x, z) => { float r2 = x * x + z * z; return r2 < R * R ? Mathf.Sqrt(R * R - r2) - R : -80; }, (x, z, y) => Mathf.Sqrt(x * x + z * z) < 17 ? new Color(.85f, .8f, .72f) : (Mathf.PerlinNoise(x * .05f, z * .05f) > .6f ? new Color(.7f, .45f, .85f) : new Color(.42f, .72f, .3f)));
            Random.InitState(19);
            Color[] bulbs = { new Color(1, .62f, .25f), new Color(.82f, .42f, 1f), new Color(.42f, .82f, .62f), new Color(1, .42f, .6f) };
            for (int i = 0; i < 46; i++) { float a = Random.Range(0, Mathf.PI * 2), d = Random.Range(24, 150); BallTree(Mathf.Cos(a) * d, Mathf.Sin(a) * d, Random.Range(6, 10), new Color(.55f, .35f, .22f), bulbs[i % 4], Random.Range(2.5f, 4)); }
            for (int k = 0; k < 7; k++) Prop(MeshGen.Cube, k % 2 == 0 ? new Color(.35f, .35f, .55f) : new Color(.3f, .3f, .48f), new Vector3(-120, W.ground(-120, -150) + 3.5f + 7 * k, -150), new Vector3(70 - 9 * k, 7, 70 - 9 * k));
            Prop(MeshGen.Sphere, new Color(.6f, .35f, .85f), new Vector3(-120, W.ground(-120, -150) + 60, -150), new Vector3(20, 25, 20));
            W.music = "bills";
        }

        static void Room()
        {
            Sky(Color.white, new Color(.97f, .97f, 1f), Color.white, new Vector3(.2f, .9f, .1f), Color.white, new Color(.97f, .97f, 1f), 40, 300);
            Ground(600, 10, (x, z) => 0, (x, z, y) => new Color(.95f, .95f, .97f));
            Prop(MeshGen.Cube, new Color(.92f, .92f, .95f), new Vector3(0, 6, -30), new Vector3(30, 12, 10));
            W.music = "room";
        }

        static void Orbit()
        {
            Sky(new Color(0, 0, .02f), new Color(.02f, .03f, .08f), new Color(.2f, .45f, .9f), new Vector3(.7f, .35f, -.45f), new Color(1, .95f, .85f), new Color(0, 0, .02f), 600, 4000);
            W.noGround = true;
            var earth = Prop(MeshGen.Sphere, new Color(.25f, .5f, .9f), new Vector3(0, -2700, 0), Vector3.one * 5200, 0, false);
            var atm = MeshGen.Part(MeshGen.Sphere, Pal.Additive(new Color(.4f, .7f, 1f, .25f)), W.root, new Vector3(0, -2700, 0), Vector3.one * 5320, false, "atmósfera");
            Random.InitState(23);
            for (int i = 0; i < 22; i++) { var p = new Vector3(Random.Range(-150, 150), Random.Range(-5, 30), Random.Range(-150, 150)); var g = Prop(MeshGen.Sphere, new Color(.45f, .42f, .48f), p, Vector3.one * Random.Range(3, 10)); W.rocks.Add(new Obstacle { x = p.x, z = p.z, r = 3, y0 = p.y - 4, top = p.y + 4 }); }
            W.bound = 180; W.spawnY = 8; W.music = "void";
        }
    }
}
