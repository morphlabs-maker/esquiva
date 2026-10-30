// Firmas mínimas de la API de Unity para comprobar que los scripts compilan sin tener Unity instalado (mcs). No es código del juego.
using System;
using System.Collections.Generic;
namespace UnityEngine.SceneManagement { public struct Scene { } }
namespace UnityEngine.Rendering { public enum ShadowCastingMode { Off, On } public enum IndexFormat { UInt16, UInt32 } }
namespace UnityEngine
{
    public class Object { public string name; public bool destroyed; public static void Destroy(Object o) { if (o != null) o.destroyed = true; } public static void Destroy(Object o, float t) { Destroy(o); } public static void DontDestroyOnLoad(Object o) { } public static implicit operator bool(Object o) { return o != null && !o.destroyed; } }
    public class Component : Object { public Transform transform; public GameObject gameObject; public T GetComponent<T>() where T : Component { return gameObject.GetComponent<T>(); } }
    public class Behaviour : Component { public bool enabled; }
    public class MonoBehaviour : Behaviour { }
    public class GameObject : Object { public static int Count; public Transform transform; public bool activeSelf = true; readonly List<Component> comps = new List<Component>();
        public GameObject() : this("GameObject") { } public GameObject(string n) { name = n; Count++; transform = new Transform(); transform.gameObject = this; transform.transform = transform; comps.Add(transform); }
        public T AddComponent<T>() where T : Component { var c = (T)Activator.CreateInstance(typeof(T)); c.gameObject = this; c.transform = transform; comps.Add(c); return c; }
        public T GetComponent<T>() where T : Component { foreach (var c in comps) if (c is T) return (T)c; return null; }
        public void SetActive(bool v) { activeSelf = v; }
        public static GameObject CreatePrimitive(PrimitiveType t) { var g = new GameObject(t.ToString()); g.AddComponent<MeshFilter>().sharedMesh = new Mesh(); g.AddComponent<MeshRenderer>(); return g; } }
    public enum PrimitiveType { Sphere, Capsule, Cylinder, Cube, Plane, Quad }
    public class Transform : Component { public Vector3 position, localPosition, localScale = Vector3.one; public Quaternion rotation = Quaternion.identity, localRotation = Quaternion.identity; public Transform parent; public void SetParent(Transform p, bool w) { parent = p; } public void Rotate(float x, float y, float z) { } public void LookAt(Vector3 v) { } }
    public struct Vector2 { public float x, y; public Vector2(float a, float b) { x = a; y = b; } public static Vector2 zero; public float magnitude { get { return (float)Math.Sqrt(x * x + y * y); } } public float sqrMagnitude { get { return x * x + y * y; } } public void Normalize() { float m = magnitude; if (m > 1e-6f) { x /= m; y /= m; } }
        public static Vector2 operator +(Vector2 a, Vector2 b) { return new Vector2(a.x + b.x, a.y + b.y); } public static Vector2 operator -(Vector2 a, Vector2 b) { return new Vector2(a.x - b.x, a.y - b.y); } public static Vector2 operator *(Vector2 a, float b) { return new Vector2(a.x * b, a.y * b); } public static Vector2 operator /(Vector2 a, float b) { return new Vector2(a.x / b, a.y / b); } }
    public struct Vector3 { public float x, y, z; public Vector3(float a, float b, float c) { x = a; y = b; z = c; } public static Vector3 zero = new Vector3(0, 0, 0), one = new Vector3(1, 1, 1), up = new Vector3(0, 1, 0), down = new Vector3(0, -1, 0), left = new Vector3(-1, 0, 0), right = new Vector3(1, 0, 0), forward = new Vector3(0, 0, 1);
        public float magnitude { get { return (float)Math.Sqrt(x * x + y * y + z * z); } } public float sqrMagnitude { get { return x * x + y * y + z * z; } } public Vector3 normalized { get { float m = magnitude; return m > 1e-6f ? this / m : zero; } } public void Normalize() { this = normalized; }
        public static float Dot(Vector3 a, Vector3 b) { return a.x * b.x + a.y * b.y + a.z * b.z; } public static float Distance(Vector3 a, Vector3 b) { return (a - b).magnitude; } public static Vector3 Lerp(Vector3 a, Vector3 b, float t) { t = Mathf.Clamp01(t); return a + (b - a) * t; } public static Vector3 ClampMagnitude(Vector3 a, float m) { return a.magnitude > m ? a.normalized * m : a; }
        public static Vector3 operator +(Vector3 a, Vector3 b) { return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z); } public static Vector3 operator -(Vector3 a, Vector3 b) { return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z); } public static Vector3 operator -(Vector3 a) { return new Vector3(-a.x, -a.y, -a.z); } public static Vector3 operator *(Vector3 a, float b) { return new Vector3(a.x * b, a.y * b, a.z * b); } public static Vector3 operator *(float b, Vector3 a) { return a * b; } public static Vector3 operator /(Vector3 a, float b) { return new Vector3(a.x / b, a.y / b, a.z / b); }
        public static implicit operator Vector4(Vector3 v) { return new Vector4(); } }
    public struct Vector4 { public float x, y, z, w; }
    public struct Quaternion { public static Quaternion identity; public static Quaternion Euler(float x, float y, float z) { return identity; } public static Quaternion AngleAxis(float a, Vector3 ax) { return identity; } public static Quaternion Slerp(Quaternion a, Quaternion b, float t) { return a; }
        public static Quaternion LookRotation(Vector3 f) { return identity; } public static Quaternion FromToRotation(Vector3 a, Vector3 b) { return identity; } public static Quaternion operator *(Quaternion a, Quaternion b) { return a; } public static Vector3 operator *(Quaternion a, Vector3 b) { return b; } }
    public struct Color { public float r, g, b, a; public Color(float r, float g, float b) { this.r = r; this.g = g; this.b = b; a = 1; } public Color(float r, float g, float b, float a) { this.r = r; this.g = g; this.b = b; this.a = a; }
        public static Color white, black, gray; public static Color Lerp(Color a, Color b, float t) { return a; } public static Color HSVToRGB(float h, float s, float v) { return white; } public static Color operator *(Color a, float b) { return a; } public static bool operator ==(Color a, Color b) { return true; } public static bool operator !=(Color a, Color b) { return false; } public override bool Equals(object o) { return false; } public override int GetHashCode() { return 0; } }
    public static class ColorUtility { public static bool TryParseHtmlString(string s, out Color c) { c = Color.white; return true; } }
    public static class Mathf { public const float PI = 3.14159265f, Rad2Deg = 57.29578f, Deg2Rad = .01745329f; public static float Sin(float a) { return (float)Math.Sin(a); } public static float Cos(float a) { return (float)Math.Cos(a); } public static float Abs(float a) { return Math.Abs(a); } public static float Min(float a, float b) { return Math.Min(a, b); } public static int Min(int a, int b) { return Math.Min(a, b); } public static float Max(float a, float b) { return Math.Max(a, b); } public static int Max(int a, int b) { return Math.Max(a, b); }
        public static float Clamp(float v, float a, float b) { return v < a ? a : v > b ? b : v; } public static int Clamp(int v, int a, int b) { return v < a ? a : v > b ? b : v; } public static float Clamp01(float v) { return Clamp(v, 0, 1); } public static float Lerp(float a, float b, float t) { return a + (b - a) * Clamp01(t); } public static float LerpAngle(float a, float b, float t) { float d = ((b - a) % 360 + 540) % 360 - 180; return a + d * Clamp01(t); } public static float Pow(float a, float b) { return (float)Math.Pow(a, b); } public static float Sqrt(float a) { return (float)Math.Sqrt(a); }
        public static float Atan2(float y, float x) { return (float)Math.Atan2(y, x); } public static float Exp(float a) { return (float)Math.Exp(a); } public static float Log10(float a) { return (float)Math.Log10(a); } public static int CeilToInt(float a) { return (int)Math.Ceiling(a); } public static float PerlinNoise(float x, float y) { return (float)(.5 + .5 * Math.Sin(x * 1.7 + Math.Cos(y * 1.3))); } }
    public static class Random { static System.Random r = new System.Random(5); public static float value { get { return (float)r.NextDouble(); } } public static Vector3 insideUnitSphere { get { return new Vector3(value - .5f, value - .5f, value - .5f); } } public static Vector3 onUnitSphere { get { return new Vector3(value - .5f, value - .5f, value - .5f).normalized; } } public static Quaternion rotation; public static float Range(float a, float b) { return a + (b - a) * value; } public static int Range(int a, int b) { return a + r.Next(Math.Max(1, b - a)); } public static void InitState(int s) { r = new System.Random(s); } }
    public static class Time { public static float deltaTime, time; }
    public static class Debug { public static void Log(object o) { } public static void LogError(object o) { } }
    public static class Application { public static int targetFrameRate; }
    public enum ScreenOrientation { Portrait, LandscapeLeft, LandscapeRight, AutoRotation }
    public static class Screen { public static int width, height; public static ScreenOrientation orientation; }
    public static class QualitySettings { public static float shadowDistance; }
    public static class Resources { public static string Root; public static T Load<T>(string p) where T : Object { var t = new TextAsset(); t.text = System.IO.File.ReadAllText(Root + p + ".json"); return t as T; } }
    public class TextAsset : Object { public string text; }
    public class Shader : Object { public static Shader Find(string n) { return null; } }
    public class Material : Object { public Color color; public Material(Shader s) { } public void SetFloat(string n, float v) { } public void SetColor(string n, Color c) { } public void SetVector(string n, Vector4 v) { } public bool HasProperty(string n) { return true; } }
    public class MaterialPropertyBlock { public void SetColor(string n, Color c) { } }
    public class Mesh : Object { public Rendering.IndexFormat indexFormat; public Vector3[] normals = new Vector3[0]; public int[] triangles = new int[0]; public void SetVertices(List<Vector3> v) { } public void SetTriangles(List<int> t, int s) { } public void SetColors(List<Color> c) { } public void RecalculateNormals() { } public void RecalculateBounds() { } }
    public class MeshFilter : Component { public Mesh sharedMesh; }
    public class Renderer : Component { public Material sharedMaterial; public Rendering.ShadowCastingMode shadowCastingMode; public bool receiveShadows; public void SetPropertyBlock(MaterialPropertyBlock b) { } }
    public class MeshRenderer : Renderer { }
    public enum CameraClearFlags { Skybox, SolidColor, Depth, Nothing }
    public class Camera : Behaviour { public float fieldOfView, nearClipPlane, farClipPlane; public CameraClearFlags clearFlags; public Color backgroundColor; public Vector3 WorldToScreenPoint(Vector3 p) { return p; } public Camera() { } }
    public class AudioListener : Behaviour { }
    public enum LightType { Spot, Directional, Point }
    public enum LightShadows { None, Hard, Soft }
    public class Light : Behaviour { public LightType type; public Color color; public float intensity; public LightShadows shadows; }
    public enum FogMode { Linear = 1, Exponential, ExponentialSquared }
    public static class RenderSettings { public static bool fog; public static FogMode fogMode; public static Color fogColor, ambientLight; public static float fogStartDistance, fogEndDistance; }
    public enum KeyCode { A, B, C, D, E, F, G, H, I, J, K, L, M, N, O, P, Q, R, S, T, U, V, W, X, Y, Z, Space, Return, Escape, LeftShift, RightArrow, LeftArrow, UpArrow, DownArrow }
    public enum TouchPhase { Began, Moved, Stationary, Ended, Canceled }
    public struct Touch { public Vector2 position; public int fingerId; public TouchPhase phase; }
    public static class Input { public static int touchCount; public static bool GetKey(KeyCode k) { return false; } public static bool GetKeyDown(KeyCode k) { return false; } public static bool GetMouseButton(int b) { return false; } public static bool GetMouseButtonDown(int b) { return false; } public static float GetAxis(string a) { return 0; } public static Touch GetTouch(int i) { return new Touch(); } }
    public enum FontStyle { Normal, Bold }
    public enum TextAnchor { UpperLeft, MiddleCenter }
    public struct Rect { public float x, y, width, height; public Rect(float a, float b, float c, float d) { x = a; y = b; width = c; height = d; } public bool Contains(Vector2 p) { return false; } }
    public class GUIStyleState { public Color textColor; }
    public class GUIStyle { public int fontSize; public FontStyle fontStyle; public TextAnchor alignment; public bool wordWrap; public GUIStyleState normal = new GUIStyleState(); public GUIStyle() { } public GUIStyle(GUIStyle o) { } }
    public class GUISkin { public GUIStyle label, button, box; }
    public class Texture : Object { } public class Texture2D : Texture { public static Texture2D whiteTexture; }
    public enum EventType { MouseDown, MouseUp, Repaint, Layout }
    public class Event { public static Event current; public EventType type; public int button; public Vector2 mousePosition; }
    public static class GUI { public static Color color; public static GUISkin skin; public static void Label(Rect r, string t, GUIStyle s) { } public static bool Button(Rect r, string t, GUIStyle s) { return false; } public static void Box(Rect r, string t) { } public static void Box(Rect r, string t, GUIStyle s) { } public static bool Toggle(Rect r, bool v, string t, GUIStyle s) { return v; }
        public static Vector2 BeginScrollView(Rect p, Vector2 s, Rect v) { return s; } public static void EndScrollView() { } public static void DrawTexture(Rect r, Texture t) { } }
    public static class PlayerPrefs { public static string GetString(string k, string d) { return d; } public static void SetString(string k, string v) { } public static int GetInt(string k, int d) { return d; } public static void SetInt(string k, int v) { } public static void Save() { } }
    public static class AudioSettings { public static int outputSampleRate; }
    public enum RuntimeInitializeLoadType { AfterSceneLoad, BeforeSceneLoad }
    [AttributeUsage(AttributeTargets.Method)] public class RuntimeInitializeOnLoadMethodAttribute : Attribute { public RuntimeInitializeOnLoadMethodAttribute(RuntimeInitializeLoadType t) { } }
}
namespace UnityEditor
{
    [AttributeUsage(AttributeTargets.Class)] public class InitializeOnLoadAttribute : Attribute { }
    [AttributeUsage(AttributeTargets.Method)] public class MenuItem : Attribute { public MenuItem(string p) { } }
    public static class EditorApplication { public delegate void CallbackFunction(); public static CallbackFunction delayCall; }
    public static class AssetDatabase { public static bool IsValidFolder(string p) { return false; } public static string CreateFolder(string a, string b) { return ""; } public static void SaveAssets() { } }
    public class EditorBuildSettingsScene { public EditorBuildSettingsScene(string p, bool e) { } }
    public static class EditorBuildSettings { public static EditorBuildSettingsScene[] scenes; }
    public enum BuildTargetGroup { Standalone, iOS, Android }
    public enum UIOrientation { Portrait, PortraitUpsideDown, LandscapeRight, LandscapeLeft, AutoRotation }
    public static class PlayerSettings { public static string companyName, productName; public static UIOrientation defaultInterfaceOrientation; public static bool allowedAutorotateToPortrait, allowedAutorotateToPortraitUpsideDown, allowedAutorotateToLandscapeLeft, allowedAutorotateToLandscapeRight; public static void SetApplicationIdentifier(BuildTargetGroup g, string id) { } }
}
namespace UnityEditor.SceneManagement
{
    public enum NewSceneSetup { EmptyScene, DefaultGameObjects }
    public enum NewSceneMode { Single, Additive }
    public static class EditorSceneManager { public static UnityEngine.SceneManagement.Scene NewScene(NewSceneSetup s, NewSceneMode m) { return new UnityEngine.SceneManagement.Scene(); } public static bool SaveScene(UnityEngine.SceneManagement.Scene s, string p) { return true; } }
}
