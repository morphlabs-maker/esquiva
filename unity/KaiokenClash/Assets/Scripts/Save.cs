// Kaioken Clash (Unity) · Progreso guardado en el dispositivo: peleas superadas, monedas y versión elegida de cada luchador.
using System.Collections.Generic;
using UnityEngine;

namespace Kaioken
{
    public static class Save
    {
        static HashSet<string> done;

        static HashSet<string> Done
        {
            get
            {
                if (done == null) { done = new HashSet<string>(); foreach (var s in PlayerPrefs.GetString("kc_done", "").Split(',')) if (s.Length > 0) done.Add(s); }
                return done;
            }
        }

        public static bool IsDone(string id) { return Done.Contains(id); }
        public static void MarkDone(string id) { if (Done.Add(id)) { PlayerPrefs.SetString("kc_done", string.Join(",", new List<string>(Done).ToArray())); PlayerPrefs.Save(); } }
        public static int Coins { get { return PlayerPrefs.GetInt("kc_coins", 0); } set { PlayerPrefs.SetInt("kc_coins", value); PlayerPrefs.Save(); } }

        public static bool ArcDone(ArcDef a) { foreach (var n in a.nodes) if (!IsDone(n.id)) return false; return a.nodes.Count > 0; }
        public static bool ArcOpen(int i) { return i == 0 || i >= 10 || ArcDone(GameData.Arcs[i - 1]); }

        /// <summary>Versiones abiertas de un luchador (se abren con los arcos de la historia).</summary>
        public static List<string> OpenVersions(string chId)
        {
            var r = new List<string>();
            foreach (var a in GameData.VersionArcs(chId)) { int i = GameData.ArcOrder(a); if (i == 0 || (i < GameData.Arcs.Count && ArcOpen(i))) r.Add(a); }
            return r;
        }

        public static string Version(string chId)
        {
            var l = OpenVersions(chId);
            if (l.Count == 0) return null;
            string v = PlayerPrefs.GetString("kc_ver_" + chId, "");
            return l.Contains(v) ? v : l[l.Count - 1];
        }

        public static void SetVersion(string chId, string arc) { PlayerPrefs.SetString("kc_ver_" + chId, arc); PlayerPrefs.Save(); }
    }
}
