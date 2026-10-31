// Kaioken Clash (Unity) · Colores y materiales (sombreado toon de anime con contorno, aditivo para auras y rayos).
using System.Collections.Generic;
using UnityEngine;

namespace Kaioken
{
    public static class Pal
    {
        static Shader toon, outline, add, sky;
        static readonly Dictionary<int, Material> cache = new Dictionary<int, Material>();
        static readonly Dictionary<int, Material> addCache = new Dictionary<int, Material>();
        static Material outlineMat;

        public static Color Hex(int h) { return new Color(((h >> 16) & 255) / 255f, ((h >> 8) & 255) / 255f, (h & 255) / 255f, 1f); }

        public static Color Css(string s)
        {
            Color c;
            if (!string.IsNullOrEmpty(s) && ColorUtility.TryParseHtmlString(s, out c)) return c;
            return Color.white;
        }

        static Shader Find(string n, string fallback)
        {
            var s = Shader.Find(n);
            if (s == null) s = Shader.Find(fallback);
            return s;
        }

        public static Shader ToonShader { get { if (toon == null) toon = Find("Kaioken/Toon", "Standard"); return toon; } }
        public static Shader SkyShader { get { if (sky == null) sky = Find("Kaioken/Sky", "Unlit/Color"); return sky; } }

        /// <summary>Material toon compartido por color (cuerpos, ropa, pelo, mundo).</summary>
        public static Material Toon(Color c, float rim = .35f)
        {
            int key = ((int)(c.r * 255) << 16) | ((int)(c.g * 255) << 8) | (int)(c.b * 255) | ((int)(rim * 10) << 24);
            Material m;
            if (cache.TryGetValue(key, out m) && m != null) return m;
            m = new Material(ToonShader);
            m.color = c;
            if (m.HasProperty("_Rim")) m.SetFloat("_Rim", rim);
            cache[key] = m;
            return m;
        }

        public static Material Toon(int hex) { return Toon(Hex(hex)); }

        static Material vcMat;
        /// <summary>Material toon que usa el color de cada vértice (terrenos y mundos).</summary>
        public static Material ToonVC
        {
            get
            {
                if (vcMat == null) { vcMat = new Material(ToonShader); vcMat.color = Color.white; if (vcMat.HasProperty("_VC")) vcMat.SetFloat("_VC", 1f); }
                return vcMat;
            }
        }

        /// <summary>Material nuevo (no compartido): para cosas que cambian de color en la pelea.</summary>
        public static Material ToonUnique(Color c)
        {
            var m = new Material(ToonShader);
            m.color = c;
            return m;
        }

        public static Material Outline
        {
            get
            {
                if (outlineMat == null)
                {
                    if (outline == null) outline = Find("Kaioken/Outline", "Unlit/Color");
                    outlineMat = new Material(outline);
                    outlineMat.color = new Color(.04f, .04f, .08f);
                }
                return outlineMat;
            }
        }

        /// <summary>Material aditivo y brillante: auras, ki, rayos, chispas.</summary>
        public static Material Additive(Color c)
        {
            int key = ((int)(c.r * 255) << 16) | ((int)(c.g * 255) << 8) | (int)(c.b * 255) | ((int)(c.a * 15) << 24);
            Material m;
            if (addCache.TryGetValue(key, out m) && m != null) return m;
            if (add == null) add = Find("Kaioken/Additive", "Sprites/Default");
            m = new Material(add);
            m.color = c;
            addCache[key] = m;
            return m;
        }

        public static Material AdditiveUnique(Color c)
        {
            if (add == null) add = Find("Kaioken/Additive", "Sprites/Default");
            var m = new Material(add);
            m.color = c;
            return m;
        }
    }
}
