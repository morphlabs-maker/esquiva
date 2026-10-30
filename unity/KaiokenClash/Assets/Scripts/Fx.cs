// Kaioken Clash (Unity) · Efectos: chispas, humo, destellos, explosiones, anillos de choque y auras con rayos.
using System.Collections.Generic;
using UnityEngine;

namespace Kaioken
{
    public class Fx : MonoBehaviour
    {
        class Particle { public Transform t; public MeshRenderer r; public Vector3 vel; public float life, max, size, grow, grav; public Color c; }
        static Fx inst;
        readonly List<Particle> live = new List<Particle>();
        readonly Stack<Particle> pool = new Stack<Particle>();
        MaterialPropertyBlock mpb;
        public static float Shake;

        public static Fx I
        {
            get
            {
                if (inst == null) { var g = new GameObject("Efectos"); inst = g.AddComponent<Fx>(); inst.mpb = new MaterialPropertyBlock(); }
                return inst;
            }
        }

        Particle Get()
        {
            Particle p;
            if (pool.Count > 0) { p = pool.Pop(); p.t.gameObject.SetActive(true); return p; }
            var g = new GameObject("chispa");
            g.transform.SetParent(transform, false);
            g.AddComponent<MeshFilter>().sharedMesh = MeshGen.Sphere;
            var r = g.AddComponent<MeshRenderer>();
            r.sharedMaterial = Pal.Additive(Color.white);
            r.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
            r.receiveShadows = false;
            return new Particle { t = g.transform, r = r };
        }

        public static void Spawn(Vector3 pos, Vector3 vel, Color c, float size, float life, float grow = 0, float grav = 0)
        {
            var f = I;
            if (f.live.Count > 700) return;
            var p = f.Get();
            p.t.position = pos; p.vel = vel; p.c = c; p.size = size; p.life = p.max = life; p.grow = grow; p.grav = grav;
            p.t.localScale = Vector3.one * size;
            f.live.Add(p);
        }

        public static void Sparks(Vector3 pos, Color c, int n = 10, float spd = 12, float size = .25f)
        {
            for (int i = 0; i < n; i++) Spawn(pos, Random.onUnitSphere * Random.Range(spd * .5f, spd), c, size, Random.Range(.15f, .35f));
            Spawn(pos, Vector3.zero, Color.white, size * 4, .12f);
        }

        public static void Explosion(Vector3 pos, float radius, Color c)
        {
            Spawn(pos, Vector3.zero, Color.white, radius * 2.6f, .22f);
            Spawn(pos, Vector3.zero, c, radius * 3.6f, .5f, radius * 3);
            for (int i = 0; i < 12; i++) Spawn(pos + Random.insideUnitSphere * radius * .5f, Random.onUnitSphere * radius * 2, new Color(.6f, .55f, .5f, .5f), radius * .9f, Random.Range(.6f, 1.2f), radius);
            Sparks(pos, c, 18, radius * 9, .35f);
            Shake = Mathf.Max(Shake, Mathf.Min(2f, radius * .4f));
        }

        void Update()
        {
            float dt = Time.deltaTime;
            for (int i = live.Count - 1; i >= 0; i--)
            {
                var p = live[i];
                p.life -= dt;
                if (p.life <= 0) { p.t.gameObject.SetActive(false); live.RemoveAt(i); pool.Push(p); continue; }
                p.vel.y -= p.grav * dt;
                p.vel *= Mathf.Max(0, 1 - 2.5f * dt);
                p.t.position += p.vel * dt;
                p.size += p.grow * dt;
                p.t.localScale = Vector3.one * Mathf.Max(.01f, p.size);
                var c = p.c; c.a = p.c.a * (p.life / p.max);
                mpb.SetColor("_Color", c);
                p.r.SetPropertyBlock(mpb);
            }
        }
    }

    /// <summary>Aura de ki: dos capas de llama que palpitan alrededor del cuerpo y rayos para las formas eléctricas (SSJ2, Legendario…).</summary>
    public class Aura
    {
        readonly Transform root;
        readonly MeshRenderer outer, inner;
        readonly List<MeshRenderer> bolts = new List<MeshRenderer>();
        readonly MaterialPropertyBlock mpb = new MaterialPropertyBlock();
        public float level, target;
        public bool bolt;
        Color col = Color.white;
        float t, boltT;
        readonly float h;

        public Aura(Transform parent, float height)
        {
            h = height;
            root = new GameObject("aura").transform;
            root.SetParent(parent, false);
            outer = Layer("aura exterior", 1f);
            inner = Layer("aura interior", .72f);
            for (int i = 0; i < 6; i++)
            {
                var g = new GameObject("rayo");
                g.transform.SetParent(root, false);
                g.AddComponent<MeshFilter>().sharedMesh = MeshGen.Cube;
                var r = g.AddComponent<MeshRenderer>();
                r.sharedMaterial = Pal.Additive(new Color(.7f, .9f, 1f, 1f));
                r.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
                bolts.Add(r);
            }
        }

        MeshRenderer Layer(string n, float k)
        {
            var g = new GameObject(n);
            g.transform.SetParent(root, false);
            g.transform.localPosition = new Vector3(0, h * .5f, 0);
            g.transform.localScale = new Vector3(h * .55f * k, h * .75f * k, h * .55f * k);
            g.AddComponent<MeshFilter>().sharedMesh = MeshGen.Sphere;
            var r = g.AddComponent<MeshRenderer>();
            r.sharedMaterial = Pal.Additive(Color.white);
            r.shadowCastingMode = UnityEngine.Rendering.ShadowCastingMode.Off;
            return r;
        }

        public void SetColor(Color c) { col = c; }

        public void Update(float dt)
        {
            t += dt;
            level = Mathf.Lerp(level, target, 1 - Mathf.Exp(-8 * dt));
            bool on = level > .03f;
            outer.gameObject.SetActive(on); inner.gameObject.SetActive(on);
            if (on)
            {
                float j = 1 + Mathf.Sin(t * 23) * .05f + Mathf.Sin(t * 9.7f) * .04f;
                outer.transform.localScale = new Vector3(h * .55f * j * (.8f + level * .4f), h * .78f * (.8f + level * .35f) * (2 - j), h * .55f * j * (.8f + level * .4f));
                var c = col; c.a = Mathf.Min(1, level) * .55f; mpb.SetColor("_Color", c); outer.SetPropertyBlock(mpb);
                var c2 = Color.Lerp(col, Color.white, .5f); c2.a = Mathf.Min(1, level) * .4f; mpb.SetColor("_Color", c2); inner.SetPropertyBlock(mpb);
                if (Random.value < dt * 30 * level)
                {
                    var p = root.position + new Vector3(Random.Range(-.4f, .4f), Random.Range(0, h * .9f), Random.Range(-.4f, .4f));
                    Fx.Spawn(p, new Vector3(0, Random.Range(3f, 7f), 0), col, Random.Range(.08f, .2f), .45f);
                }
            }
            boltT -= dt;
            bool showB = bolt && level > .2f;
            if (boltT <= 0)
            {
                boltT = .05f;
                foreach (var b in bolts)
                {
                    b.gameObject.SetActive(showB && Random.value < .6f);
                    if (!b.gameObject.activeSelf) continue;
                    b.transform.localPosition = new Vector3(Random.Range(-.5f, .5f), Random.Range(.2f, h), Random.Range(-.5f, .5f));
                    b.transform.localRotation = Random.rotation;
                    b.transform.localScale = new Vector3(.02f, Random.Range(.2f, .5f), .02f);
                }
            }
        }
    }
}
