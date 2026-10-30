// Firmas mínimas de la API de Unity para comprobar que los scripts compilan sin tener Unity instalado (mcs). No es código del juego.
using System;
using System.Collections.Generic;
namespace UnityEngine.SceneManagement { public struct Scene { } }
namespace UnityEngine.Rendering { public enum ShadowCastingMode { Off, On } public enum IndexFormat { UInt16, UInt32 } }
namespace UnityEngine
{
    public class Object { public string name; public static void Destroy(Object o) { } public static void Destroy(Object o, float t) { } public static void DontDestroyOnLoad(Object o) { } public static implicit operator bool(Object o) { return o != null; } }
    public class Component : Object { public Transform transform; public GameObject gameObject; public T GetComponent<T>() { return default(T); } }
    public class Behaviour : Component { public bool enabled; }
    public class MonoBehaviour : Behaviour { }
    public class GameObject : Object { public Transform transform; public bool activeSelf; public GameObject() { } public GameObject(string n) { } public T AddComponent<T>() where T : Component { return default(T); } public T GetComponent<T>() { return default(T); } public void SetActive(bool v) { } public static GameObject CreatePrimitive(PrimitiveType t) { return null; } }
    public enum PrimitiveType { Sphere, Capsule, Cylinder, Cube, Plane, Quad }
    public class Transform : Component { public Vector3 position, localPosition, localScale; public Quaternion rotation, localRotation; public Transform parent; public void SetParent(Transform p, bool w) { } public void Rotate(float x, float y, float z) { } public void LookAt(Vector3 v) { } }
    public struct Vector2 { public float x, y; public Vector2(float a, float b) { x = a; y = b; } public static Vector2 zero; public float magnitude { get { return 0; } } public float sqrMagnitude { get { return 0; } } public void Normalize() { }
        public static Vector2 operator +(Vector2 a, Vector2 b) { return a; } public static Vector2 operator -(Vector2 a, Vector2 b) { return a; } public static Vector2 operator *(Vector2 a, float b) { return a; } public static Vector2 operator /(Vector2 a, float b) { return a; } }
    public struct Vector3 { public float x, y, z; public Vector3(float a, float b, float c) { x = a; y = b; z = c; } public static Vector3 zero, one, up, down, left, right, forward;
        public float magnitude { get { return 0; } } public float sqrMagnitude { get { return 0; } } public Vector3 normalized { get { return this; } } public void Normalize() { }
        public static float Dot(Vector3 a, Vector3 b) { return 0; } public static float Distance(Vector3 a, Vector3 b) { return 0; } public static Vector3 Lerp(Vector3 a, Vector3 b, float t) { return a; } public static Vector3 ClampMagnitude(Vector3 a, float m) { return a; }
        public static Vector3 operator +(Vector3 a, Vector3 b) { return a; } public static Vector3 operator -(Vector3 a, Vector3 b) { return a; } public static Vector3 operator -(Vector3 a) { return a; } public static Vector3 operator *(Vector3 a, float b) { return a; } public static Vector3 operator *(float b, Vector3 a) { return a; } public static Vector3 operator /(Vector3 a, float b) { return a; }
        public static implicit operator Vector4(Vector3 v) { return new Vector4(); } }
    public struct Vector4 { public float x, y, z, w; }
    public struct Quaternion { public static Quaternion identity; public static Quaternion Euler(float x, float y, float z) { return identity; } public static Quaternion AngleAxis(float a, Vector3 ax) { return identity; } public static Quaternion Slerp(Quaternion a, Quaternion b, float t) { return a; }
        public static Quaternion LookRotation(Vector3 f) { return identity; } public static Quaternion FromToRotation(Vector3 a, Vector3 b) { return identity; } public static Quaternion operator *(Quaternion a, Quaternion b) { return a; } public static Vector3 operator *(Quaternion a, Vector3 b) { return b; } }
    public struct Color { public float r, g, b, a; public Color(float r, float g, float b) { this.r = r; this.g = g; this.b = b; a = 1; } public Color(float r, float g, float b, float a) { this.r = r; this.g = g; this.b = b; this.a = a; }
        public static Color white, black, gray; public static Color Lerp(Color a, Color b, float t) { return a; } public static Color HSVToRGB(float h, float s, float v) { return white; } public static Color operator *(Color a, float b) { return a; } public static bool operator ==(Color a, Color b) { return true; } public static bool operator !=(Color a, Color b) { return false; } public override bool Equals(object o) { return false; } public override int GetHashCode() { return 0; } }
    public static class ColorUtility { public static bool TryParseHtmlString(string s, out Color c) { c = Color.white; return true; } }
    public static class Mathf { public const float PI = 3.14159f, Rad2Deg = 57.3f, Deg2Rad = .01745f; public static float Sin(float a) { return 0; } public static float Cos(float a) { return 0; } public static float Abs(float a) { return 0; } public static float Min(float a, float b) { return a; } public static int Min(int a, int b) { return a; } public static float Max(float a, float b) { return a; } public static int Max(int a, int b) { return a; }
        public static float Clamp(float v, float a, float b) { return v; } public static int Clamp(int v, int a, int b) { return v; } public static float Clamp01(float v) { return v; } public static float Lerp(float a, float b, float t) { return a; } public static float LerpAngle(float a, float b, float t) { return a; } public static float Pow(float a, float b) { return a; } public static float Sqrt(float a) { return a; }
        public static float Atan2(float y, float x) { return 0; } public static float Exp(float a) { return a; } public static float Log10(float a) { return a; } public static int CeilToInt(float a) { return 0; } public static float PerlinNoise(float x, float y) { return 0; } }
    public static class Random { public static float value; public static Vector3 insideUnitSphere, onUnitSphere; public static Quaternion rotation; public static float Range(float a, float b) { return a; } public static int Range(int a, int b) { return a; } public static void InitState(int s) { } }
    public static class Time { public static float deltaTime, time; }
    public static class Debug { public static void Log(object o) { } public static void LogError(object o) { } }
    public static class Application { public static int targetFrameRate; public static bool isBatchMode; }
    public enum FullScreenMode { ExclusiveFullScreen, FullScreenWindow, MaximizedWindow, Windowed }
    public enum ScreenOrientation { Portrait, LandscapeLeft, LandscapeRight, AutoRotation }
    public static class Screen { public static int width, height; public static ScreenOrientation orientation; }
    public static class QualitySettings { public static float shadowDistance; }
    public static class Resources { public static T Load<T>(string p) where T : Object { return null; } }
    public class TextAsset : Object { public string text; }
    public class Shader : Object { public static Shader Find(string n) { return null; } }
    public class Material : Object { public Color color; public Material(Shader s) { } public void SetFloat(string n, float v) { } public void SetColor(string n, Color c) { } public void SetVector(string n, Vector4 v) { } public bool HasProperty(string n) { return true; } }
    public class MaterialPropertyBlock { public void SetColor(string n, Color c) { } }
    public class Mesh : Object { public Rendering.IndexFormat indexFormat; public Vector3[] normals; public int[] triangles; public void SetVertices(List<Vector3> v) { } public void SetTriangles(List<int> t, int s) { } public void SetColors(List<Color> c) { } public void RecalculateNormals() { } public void RecalculateBounds() { } }
    public class MeshFilter : Component { public Mesh sharedMesh; }
    public class Renderer : Component { public Material sharedMaterial; public Rendering.ShadowCastingMode shadowCastingMode; public bool receiveShadows; public void SetPropertyBlock(MaterialPropertyBlock b) { } }
    public class MeshRenderer : Renderer { }
    public enum CameraClearFlags { Skybox, SolidColor, Depth, Nothing }
    public class Camera : Behaviour { public float fieldOfView, nearClipPlane, farClipPlane; public CameraClearFlags clearFlags; public Color backgroundColor; public Vector3 WorldToScreenPoint(Vector3 p) { return p; } }
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
    public static class EditorApplication { public delegate void CallbackFunction(); public static CallbackFunction delayCall; public static void Exit(int c) { } }
    public static class AssetDatabase { public static bool IsValidFolder(string p) { return false; } public static string CreateFolder(string a, string b) { return ""; } public static void SaveAssets() { } }
    public class EditorBuildSettingsScene { public EditorBuildSettingsScene(string p, bool e) { } }
    public static class EditorBuildSettings { public static EditorBuildSettingsScene[] scenes; }
    public enum BuildTargetGroup { Standalone, iOS, Android }
    public enum BuildTarget { StandaloneWindows64, Android, iOS }
    [Flags] public enum BuildOptions { None = 0 }
    public enum ScriptingImplementation { Mono2x, IL2CPP }
    public enum AndroidSdkVersions { AndroidApiLevel24 = 24 }
    [Flags] public enum AndroidArchitecture { None = 0, ARMv7 = 1, ARM64 = 2 }
    public struct BuildPlayerOptions { public string[] scenes; public string locationPathName; public BuildTarget target; public BuildOptions options; }
    public static class BuildPipeline { public static Build.Reporting.BuildReport BuildPlayer(BuildPlayerOptions o) { return null; } }
    public static class EditorUserBuildSettings { public static bool buildAppBundle; }
    public enum UIOrientation { Portrait, PortraitUpsideDown, LandscapeRight, LandscapeLeft, AutoRotation }
    public static class PlayerSettings { public static string companyName, productName, bundleVersion; public static UnityEngine.FullScreenMode fullScreenMode; public static void SetScriptingBackend(BuildTargetGroup g, ScriptingImplementation s) { } public static class Android { public static AndroidSdkVersions minSdkVersion; public static AndroidArchitecture targetArchitectures; } public static UIOrientation defaultInterfaceOrientation; public static bool allowedAutorotateToPortrait, allowedAutorotateToPortraitUpsideDown, allowedAutorotateToLandscapeLeft, allowedAutorotateToLandscapeRight; public static void SetApplicationIdentifier(BuildTargetGroup g, string id) { } }
}
namespace UnityEditor.Build.Reporting
{
    public enum BuildResult { Unknown, Succeeded, Failed, Cancelled }
    public class BuildSummary { public BuildResult result; }
    public class BuildReport { public BuildSummary summary; }
}
namespace UnityEditor.SceneManagement
{
    public enum NewSceneSetup { EmptyScene, DefaultGameObjects }
    public enum NewSceneMode { Single, Additive }
    public static class EditorSceneManager { public static UnityEngine.SceneManagement.Scene NewScene(NewSceneSetup s, NewSceneMode m) { return new UnityEngine.SceneManagement.Scene(); } public static bool SaveScene(UnityEngine.SceneManagement.Scene s, string p) { return true; } }
}
