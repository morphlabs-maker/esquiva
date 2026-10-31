// Kaioken Clash (Unity) · Lector de JSON mínimo, sin dependencias.
// Devuelve Dictionary<string,object>, List<object>, double, string, bool o null.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;

namespace Kaioken
{
    public static class MiniJson
    {
        public static object Parse(string json)
        {
            if (json == null) return null;
            int i = 0;
            return ReadValue(json, ref i);
        }

        static void SkipWs(string s, ref int i)
        {
            while (i < s.Length && char.IsWhiteSpace(s[i])) i++;
        }

        static object ReadValue(string s, ref int i)
        {
            SkipWs(s, ref i);
            if (i >= s.Length) return null;
            char c = s[i];
            if (c == '{') return ReadObject(s, ref i);
            if (c == '[') return ReadArray(s, ref i);
            if (c == '"') return ReadString(s, ref i);
            if (c == 't' && string.CompareOrdinal(s, i, "true", 0, 4) == 0) { i += 4; return true; }
            if (c == 'f' && string.CompareOrdinal(s, i, "false", 0, 5) == 0) { i += 5; return false; }
            if (c == 'n' && string.CompareOrdinal(s, i, "null", 0, 4) == 0) { i += 4; return null; }
            return ReadNumber(s, ref i);
        }

        static Dictionary<string, object> ReadObject(string s, ref int i)
        {
            var d = new Dictionary<string, object>();
            i++;
            while (true)
            {
                SkipWs(s, ref i);
                if (i >= s.Length) break;
                if (s[i] == '}') { i++; break; }
                if (s[i] == ',') { i++; continue; }
                string key = ReadString(s, ref i);
                SkipWs(s, ref i);
                if (i < s.Length && s[i] == ':') i++;
                d[key] = ReadValue(s, ref i);
            }
            return d;
        }

        static List<object> ReadArray(string s, ref int i)
        {
            var l = new List<object>();
            i++;
            while (true)
            {
                SkipWs(s, ref i);
                if (i >= s.Length) break;
                if (s[i] == ']') { i++; break; }
                if (s[i] == ',') { i++; continue; }
                l.Add(ReadValue(s, ref i));
            }
            return l;
        }

        static string ReadString(string s, ref int i)
        {
            var sb = new StringBuilder();
            i++;
            while (i < s.Length)
            {
                char c = s[i++];
                if (c == '"') break;
                if (c == '\\' && i < s.Length)
                {
                    char e = s[i++];
                    switch (e)
                    {
                        case 'n': sb.Append('\n'); break;
                        case 't': sb.Append('\t'); break;
                        case 'r': sb.Append('\r'); break;
                        case 'b': sb.Append('\b'); break;
                        case 'f': sb.Append('\f'); break;
                        case 'u':
                            if (i + 4 <= s.Length)
                            {
                                sb.Append((char)Convert.ToInt32(s.Substring(i, 4), 16));
                                i += 4;
                            }
                            break;
                        default: sb.Append(e); break;
                    }
                }
                else sb.Append(c);
            }
            return sb.ToString();
        }

        static object ReadNumber(string s, ref int i)
        {
            int st = i;
            while (i < s.Length && "+-0123456789.eE".IndexOf(s[i]) >= 0) i++;
            double v;
            double.TryParse(s.Substring(st, i - st), NumberStyles.Float, CultureInfo.InvariantCulture, out v);
            return v;
        }
    }

    /// <summary>Accesos cómodos a los objetos que devuelve MiniJson.</summary>
    public static class J
    {
        public static Dictionary<string, object> Obj(object o, string k)
        {
            var d = o as Dictionary<string, object>;
            object v;
            if (d != null && d.TryGetValue(k, out v)) return v as Dictionary<string, object>;
            return null;
        }

        public static List<object> Arr(object o, string k)
        {
            var d = o as Dictionary<string, object>;
            object v;
            if (d != null && d.TryGetValue(k, out v)) return v as List<object>;
            return null;
        }

        public static object Get(object o, string k)
        {
            var d = o as Dictionary<string, object>;
            object v;
            if (d != null && d.TryGetValue(k, out v)) return v;
            return null;
        }

        public static double Num(object o, string k, double def = 0)
        {
            object v = Get(o, k);
            if (v is double) return (double)v;
            if (v is bool) return (bool)v ? 1 : 0;
            return def;
        }

        public static float F(object o, string k, float def = 0) { return (float)Num(o, k, def); }
        public static int I(object o, string k, int def = 0) { return (int)Num(o, k, def); }

        public static string Str(object o, string k, string def = "")
        {
            object v = Get(o, k);
            if (v is string) return (string)v;
            if (v is double) return ((double)v).ToString(CultureInfo.InvariantCulture);
            return def;
        }

        public static float[] Floats(object o)
        {
            var l = o as List<object>;
            if (l == null) return null;
            var r = new float[l.Count];
            for (int i = 0; i < l.Count; i++) r[i] = l[i] is double ? (float)(double)l[i] : 0f;
            return r;
        }

        public static List<string> Strings(object o)
        {
            var r = new List<string>();
            var l = o as List<object>;
            if (l != null) foreach (var x in l) if (x is string) r.Add((string)x);
            return r;
        }
    }
}
