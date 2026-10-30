// Kaioken Clash (Unity) · Mallas procedurales: torno (lathe), mechones de pelo, casquetes, toros, terreno y partes básicas.
using System.Collections.Generic;
using UnityEngine;

namespace Kaioken
{
    public static class MeshGen
    {
        static readonly Dictionary<string, Mesh> cache = new Dictionary<string, Mesh>();

        /// <summary>Gira un perfil (x = radio, y = altura) alrededor del eje Y.</summary>
        public static Mesh Lathe(List<Vector2> pts, int seg)
        {
            var m = new Mesh();
            var v = new List<Vector3>(); var t = new List<int>();
            int n = pts.Count;
            for (int s = 0; s <= seg; s++)
            {
                float a = s / (float)seg * Mathf.PI * 2f, ca = Mathf.Cos(a), sa = Mathf.Sin(a);
                for (int i = 0; i < n; i++) v.Add(new Vector3(pts[i].x * ca, pts[i].y, pts[i].x * sa));
            }
            for (int s = 0; s < seg; s++)
                for (int i = 0; i < n - 1; i++)
                {
                    int a = s * n + i, b = (s + 1) * n + i;
                    t.Add(a); t.Add(a + 1); t.Add(b);
                    t.Add(b); t.Add(a + 1); t.Add(b + 1);
                }
            m.SetVertices(v); m.SetTriangles(t, 0);
            m.RecalculateNormals(); m.RecalculateBounds();
            int mid = n / 2;
            FixWinding(m, v[mid], new Vector3(v[mid].x, 0, v[mid].z), mid);
            return m;
        }

        /// <summary>Si las caras quedaron hacia dentro, se invierte el orden de los triángulos.</summary>
        static void FixWinding(Mesh m, Vector3 p, Vector3 outward, int idx)
        {
            if (outward.sqrMagnitude < 1e-8f) return;
            var ns = m.normals;
            if (idx < ns.Length && Vector3.Dot(ns[idx], outward) < 0)
            {
                var tr = m.triangles;
                for (int i = 0; i < tr.Length; i += 3) { int k = tr[i + 1]; tr[i + 1] = tr[i + 2]; tr[i + 2] = k; }
                m.triangles = tr;
                m.RecalculateNormals();
            }
        }

        /// <summary>Mechón de pelo de Dragon Ball: base ancha y redonda, cuerpo con volumen y punta afilada (tk = radio de la punta).</summary>
        public static Mesh HairLock(float r, float len, float tk)
        {
            string key = "h" + r.ToString("F3") + "_" + len.ToString("F3") + "_" + tk.ToString("F2");
            Mesh m;
            if (cache.TryGetValue(key, out m) && m != null) return m;
            var p = new List<Vector2>();
            float rt = r * tk;
            for (int i = 0; i <= 5; i++) { float a = -Mathf.PI / 2 + i / 5f * Mathf.PI / 2; p.Add(new Vector2(Mathf.Max(1e-4f, Mathf.Cos(a) * r), Mathf.Sin(a) * r * .5f)); }
            for (int i = 1; i <= 8; i++) { float k = i / 8f; p.Add(new Vector2((r * (1 - k) + rt * k) * (1 + .18f * Mathf.Sin(k * Mathf.PI)), k * (len - rt))); }
            for (int i = 1; i <= 4; i++) { float a = i / 4f * Mathf.PI / 2; p.Add(new Vector2(Mathf.Max(1e-4f, Mathf.Cos(a) * rt), len - rt + Mathf.Sin(a) * rt)); }
            m = Lathe(p, 10);
            cache[key] = m;
            return m;
        }

        /// <summary>Casquete esférico (la parte de arriba de una esfera): pelo pegado a la cabeza.</summary>
        public static Mesh Cap(float r, float frac)
        {
            string key = "c" + r.ToString("F3") + frac.ToString("F2");
            Mesh m;
            if (cache.TryGetValue(key, out m) && m != null) return m;
            var p = new List<Vector2>();
            int n = 12;
            for (int i = 0; i <= n; i++) { float a = Mathf.PI / 2 - i / (float)n * Mathf.PI * frac; p.Add(new Vector2(Mathf.Max(1e-4f, Mathf.Cos(a) * r), Mathf.Sin(a) * r)); }
            p.Reverse();
            m = Lathe(p, 24);
            cache[key] = m;
            return m;
        }

        public static Mesh Cone(float r, float h, int seg = 10)
        {
            string key = "k" + r.ToString("F3") + h.ToString("F3") + seg;
            Mesh m;
            if (cache.TryGetValue(key, out m) && m != null) return m;
            m = Lathe(new List<Vector2> { new Vector2(1e-4f, 0), new Vector2(r, 0), new Vector2(1e-4f, h) }, seg);
            cache[key] = m;
            return m;
        }

        public static Mesh Torus(float R, float r, int seg = 28, int side = 8)
        {
            string key = "t" + R.ToString("F3") + r.ToString("F3");
            Mesh m;
            if (cache.TryGetValue(key, out m) && m != null) return m;
            m = new Mesh();
            var v = new List<Vector3>(); var t = new List<int>();
            for (int i = 0; i <= seg; i++)
            {
                float a = i / (float)seg * Mathf.PI * 2;
                for (int j = 0; j <= side; j++)
                {
                    float b = j / (float)side * Mathf.PI * 2;
                    v.Add(new Vector3((R + r * Mathf.Cos(b)) * Mathf.Cos(a), r * Mathf.Sin(b), (R + r * Mathf.Cos(b)) * Mathf.Sin(a)));
                }
            }
            for (int i = 0; i < seg; i++)
                for (int j = 0; j < side; j++)
                {
                    int a = i * (side + 1) + j, b = (i + 1) * (side + 1) + j;
                    t.Add(a); t.Add(b); t.Add(a + 1); t.Add(b); t.Add(b + 1); t.Add(a + 1);
                }
            m.SetVertices(v); m.SetTriangles(t, 0); m.RecalculateNormals(); m.RecalculateBounds();
            FixWinding(m, v[0], new Vector3(v[0].x - R, v[0].y, v[0].z), 0);
            cache[key] = m;
            return m;
        }

        /// <summary>Terreno en rejilla con alturas y colores por vértice (estilo de color plano del manga).</summary>
        public static Mesh Terrain(float size, int seg, System.Func<float, float, float> height, System.Func<float, float, float, Color> color)
        {
            var m = new Mesh();
            m.indexFormat = UnityEngine.Rendering.IndexFormat.UInt32;
            var v = new List<Vector3>(); var c = new List<Color>(); var t = new List<int>();
            for (int z = 0; z <= seg; z++)
                for (int x = 0; x <= seg; x++)
                {
                    float px = (x / (float)seg - .5f) * size, pz = (z / (float)seg - .5f) * size, y = height(px, pz);
                    v.Add(new Vector3(px, y, pz)); c.Add(color(px, pz, y));
                }
            for (int z = 0; z < seg; z++)
                for (int x = 0; x < seg; x++)
                {
                    int a = z * (seg + 1) + x, b = a + seg + 1;
                    t.Add(a); t.Add(b); t.Add(a + 1); t.Add(a + 1); t.Add(b); t.Add(b + 1);
                }
            m.SetVertices(v); m.SetColors(c); m.SetTriangles(t, 0); m.RecalculateNormals(); m.RecalculateBounds();
            return m;
        }

        /// <summary>Crea una pieza con malla propia, material y (opcional) contorno.</summary>
        public static GameObject Part(Mesh mesh, Material mat, Transform parent, Vector3 pos, Vector3 scale, bool outline = true, string name = "pieza")
        {
            var g = new GameObject(name);
            g.transform.SetParent(parent, false);
            g.transform.localPosition = pos;
            g.transform.localScale = scale;
            g.AddComponent<MeshFilter>().sharedMesh = mesh;
            var r = g.AddComponent<MeshRenderer>();
            r.sharedMaterial = mat;
            if (outline)
            {
                var o = new GameObject("contorno");
                o.transform.SetParent(g.transform, false);
                o.AddComponent<MeshFilter>().sharedMesh = mesh;
                var orr = o.AddComponent<MeshRenderer>();
                orr.sharedMaterial = Pal.Outline;
                orr.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
            }
            return g;
        }

        static Mesh prim(PrimitiveType t)
        {
            string key = "p" + t;
            Mesh m;
            if (cache.TryGetValue(key, out m) && m != null) return m;
            var g = GameObject.CreatePrimitive(t);
            m = g.GetComponent<MeshFilter>().sharedMesh;
            Object.Destroy(g);
            cache[key] = m;
            return m;
        }

        public static Mesh Sphere { get { return prim(PrimitiveType.Sphere); } }
        public static Mesh Capsule { get { return prim(PrimitiveType.Capsule); } }
        public static Mesh Cylinder { get { return prim(PrimitiveType.Cylinder); } }
        public static Mesh Cube { get { return prim(PrimitiveType.Cube); } }
    }
}
