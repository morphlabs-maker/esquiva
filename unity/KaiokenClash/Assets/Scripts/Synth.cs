// Kaioken Clash (Unity) · Sonido sintetizado (como el chiptune de la web): música por arco y efectos, sin archivos de audio.
using System.Collections.Generic;
using UnityEngine;

namespace Kaioken
{
    public static class Sound
    {
        public static Synth synth;
        public static void Play(string n) { if (synth != null) synth.Sfx(n); }
        public static void Music(string key) { if (synth != null) synth.SetSong(key); }
    }

    public class Synth : MonoBehaviour
    {
        class Voice { public float f0, f1, t, dur, vol; public int wave; }
        readonly List<Voice> voices = new List<Voice>();
        readonly object lk = new object();
        SongDef song; int step; double next, now; float sr = 48000; float phB, phL; int bassN, leadN; float bassT, leadT;
        System.Random rnd = new System.Random(1);
        public float musicVol = .22f, sfxVol = .5f;

        void Awake() { sr = AudioSettings.outputSampleRate; Sound.synth = this; }

        public void SetSong(string key)
        {
            SongDef s;
            if (!GameData.Songs.TryGetValue(key ?? "menu", out s)) GameData.Songs.TryGetValue("menu", out s);
            lock (lk) { if (song == s) return; song = s; step = 0; next = now; }
        }

        public void Sfx(string n)
        {
            var v = new Voice();
            switch (n)
            {
                case "hitL": v.f0 = 420; v.f1 = 120; v.dur = .08f; v.vol = .5f; v.wave = 2; break;
                case "hitH": v.f0 = 260; v.f1 = 50; v.dur = .18f; v.vol = .8f; v.wave = 2; break;
                case "blast": v.f0 = 900; v.f1 = 300; v.dur = .12f; v.vol = .3f; v.wave = 1; break;
                case "beam": v.f0 = 180; v.f1 = 900; v.dur = .6f; v.vol = .45f; v.wave = 1; break;
                case "transform": v.f0 = 120; v.f1 = 600; v.dur = 1f; v.vol = .5f; v.wave = 1; break;
                case "charge": v.f0 = 90; v.f1 = 260; v.dur = .8f; v.vol = .35f; v.wave = 0; break;
                case "tele": v.f0 = 1400; v.f1 = 300; v.dur = .12f; v.vol = .3f; v.wave = 0; break;
                case "swing": v.f0 = 700; v.f1 = 200; v.dur = .06f; v.vol = .18f; v.wave = 2; break;
                case "boom": v.f0 = 120; v.f1 = 30; v.dur = .6f; v.vol = .9f; v.wave = 2; break;
                default: v.f0 = 660; v.f1 = 880; v.dur = .08f; v.vol = .3f; v.wave = 1; break;
            }
            lock (lk) { if (voices.Count < 24) voices.Add(v); }
        }

        static float Mf(int n) { return 440f * Mathf.Pow(2, (n - 69) / 12f); }

        void OnAudioFilterRead(float[] data, int ch)
        {
            lock (lk)
            {
                double dt = 1.0 / sr;
                for (int i = 0; i < data.Length; i += ch)
                {
                    now += dt;
                    float s = 0;
                    if (song != null && song.lead.Length > 0)
                    {
                        double sp = 60.0 / song.bpm / 2;
                        if (now >= next) { int k = step % song.lead.Length; bassN = song.bass[k % song.bass.Length]; leadN = song.lead[k]; bassT = leadT = 0; step++; next = now + sp; }
                        bassT += (float)dt; leadT += (float)dt;
                        if (bassN > 0) { phB += Mf(bassN) / sr; s += (Mathf.Abs((phB % 1) * 4 - 2) - 1) * .5f * Mathf.Max(0, 1 - bassT / (float)(sp * .95f)); }
                        if (leadN > 0) { phL += Mf(leadN) / sr; s += ((phL % 1) < .5f ? .2f : -.2f) * Mathf.Max(0, 1 - leadT / (float)(sp * 1.6f)); }
                        s *= musicVol;
                    }
                    for (int v = voices.Count - 1; v >= 0; v--)
                    {
                        var x = voices[v]; x.t += (float)dt;
                        if (x.t >= x.dur) { voices.RemoveAt(v); continue; }
                        float k = x.t / x.dur, f = Mathf.Lerp(x.f0, x.f1, k), env = (1 - k) * x.vol * sfxVol;
                        float ph = x.t * f;
                        s += env * (x.wave == 2 ? (float)(rnd.NextDouble() * 2 - 1) : x.wave == 1 ? ((ph % 1) < .5f ? .5f : -.5f) : Mathf.Sin(ph * 6.2832f) * .6f);
                    }
                    for (int c = 0; c < ch; c++) data[i + c] += Mathf.Clamp(s, -1, 1);
                }
            }
        }
    }
}
