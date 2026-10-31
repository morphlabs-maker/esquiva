// Simulación sin pantalla de Kaioken Clash (Unity) sobre la API simulada: peleas CPU contra CPU, todas las peleas de la historia y todas las cinemáticas.
using System;
using Kaioken;
using UnityEngine;

class Sim
{
    static int errors;
    static void Run(string what, Action a) { try { a(); } catch (Exception e) { errors++; Console.WriteLine("ERROR " + what + ": " + e.GetType().Name + " " + e.Message + "\n" + e.StackTrace.Split('\n')[0]); } }

    static string Fight(Match m, float seconds)
    {
        m.Start(); int steps = (int)(seconds * 30);
        for (int i = 0; i < steps && m.phase != "over"; i++) m.Update(1 / 30f);
        string r = m.phase + " gana=" + m.winnerTeam;
        foreach (var f in m.fighters) r += " | " + f.ch.id + "[" + f.Form.id + (f.kkL > 0 ? "+kk" + f.kkL : "") + "] " + (int)f.hp + "/" + (int)f.maxHp + " ki" + f.ki.ToString("0.0");
        m.Dispose();
        return r;
    }

    static void Main(string[] args)
    {
        Resources.Root = args[0];
        GameData.Load();
        Console.WriteLine("luchadores " + GameData.Chars.Count + " arcos " + GameData.Arcs.Count + " peinados " + GameData.Hair.Count + " poses " + GameData.Poses.Count + " canciones " + GameData.Songs.Count);
        var rig = new CameraRig();
        var v = GameData.Version("goku", "sai"); Console.WriteLine("Goku Saga Saiyajin: poder " + v.basePower + " formas " + string.Join(",", v.forms.ToArray()));
        v = GameData.Version("goku", "tp"); Console.WriteLine("Goku Torneo: poder " + v.basePower + " formas " + v.forms.Count);
        // versus CPU contra CPU en todos los mundos
        for (int w = 0; w < GameData.WorldNames.Count; w++)
        {
            int ww = w;
            Run("mundo " + w, () =>
            {
                var m = new Match(ww, ww % 2, rig) { mode = "cpu", diff = 2 };
                var a = GameData.Chars[(ww * 3) % GameData.Chars.Count]; var b = GameData.Chars[(ww * 5 + 1) % GameData.Chars.Count];
                m.Add(a, 0, true, null, "tp"); m.Add(b, 1, true, null, "tp");
                Console.WriteLine("mundo " + ww + " " + GameData.WorldNames[ww] + ": " + Fight(m, 40));
            });
        }
        // todas las peleas y cinemáticas del modo historia
        int fights = 0, cines = 0;
        foreach (var arc in GameData.Arcs)
            foreach (var n in arc.nodes)
            {
                if (n.IsFight)
                    Run("pelea " + n.id, () =>
                    {
                        var m = new Match(n.world, n.v, rig) { mode = "story", diff = 1, node = n };
                        m.Add(GameData.Char(n.p.c), 0, true, n.p);
                        if (n.ally != null && GameData.Char(n.ally.c) != null) m.Add(GameData.Char(n.ally.c), 0, true, n.ally);
                        if (n.e != null && GameData.Char(n.e.c) != null) m.Add(GameData.Char(n.e.c), 1, true, n.e);
                        if (n.e2 != null && GameData.Char(n.e2.c) != null) m.Add(GameData.Char(n.e2.c), 1, true, n.e2);
                        if (n.e == null && GameData.Char(n.boss) != null) m.Add(GameData.Char(n.boss), 1, true);
                        if (m.fighters.Count < 2) { Console.WriteLine("  sin rival en " + n.id); return; }
                        string r = Fight(m, 25); fights++;
                        if (fights % 12 == 1) Console.WriteLine("historia " + n.id + ": " + r);
                    });
                foreach (var c in new[] { n.intro, n.cine })
                {
                    if (c == null) continue;
                    var cc = c;
                    Run("cinemática " + c.id, () =>
                    {
                        var p = new CinePlayer(cc, rig); int k = 0;
                        while (!p.done && k++ < 4000) { p.Update(1 / 15f); if (k % 20 == 0) p.Tap(); }
                        p.Dispose(); cines++;
                    });
                }
            }
        Console.WriteLine("peleas de historia " + fights + " · cinemáticas " + cines + " · objetos creados " + GameObject.Count + " · errores " + errors);
    }
}
