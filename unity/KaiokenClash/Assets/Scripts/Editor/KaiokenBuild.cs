// Kaioken Clash (Unity) · Compilar para Windows, Android e iPhone con un clic (menú «Kaioken Clash») o sin abrir Unity
// (construir-windows.bat / construir-android.bat usan -executeMethod con estas funciones).
using System.IO;
using UnityEditor;
using UnityEngine;

namespace Kaioken.EditorTools
{
    public static class KaiokenBuild
    {
        static readonly string[] Scenes = { "Assets/Scenes/Main.unity" };

        static void Prepare()
        {
            if (!File.Exists(Scenes[0])) KaiokenSetup.Setup();
            PlayerSettings.companyName = "Kaioken Clash";
            PlayerSettings.productName = "Kaioken Clash";
            PlayerSettings.bundleVersion = "3.1";
            PlayerSettings.defaultInterfaceOrientation = UIOrientation.AutoRotation;
            PlayerSettings.allowedAutorotateToPortrait = false;
            PlayerSettings.allowedAutorotateToPortraitUpsideDown = false;
            PlayerSettings.allowedAutorotateToLandscapeLeft = true;
            PlayerSettings.allowedAutorotateToLandscapeRight = true;
        }

        static void Build(BuildTarget target, string path)
        {
            Prepare();
            Directory.CreateDirectory(Path.GetDirectoryName(path));
            var opt = new BuildPlayerOptions { scenes = Scenes, locationPathName = path, target = target, options = BuildOptions.None };
            var report = BuildPipeline.BuildPlayer(opt);
            Debug.Log("Kaioken Clash: compilación " + target + " → " + path + " · " + report.summary.result);
            if (Application.isBatchMode && report.summary.result != UnityEditor.Build.Reporting.BuildResult.Succeeded) EditorApplication.Exit(1);
        }

        [MenuItem("Kaioken Clash/Compilar para Windows")]
        public static void BuildWindows()
        {
            PlayerSettings.fullScreenMode = FullScreenMode.FullScreenWindow;
            Build(BuildTarget.StandaloneWindows64, "Builds/Windows/KaiokenClash.exe");
        }

        [MenuItem("Kaioken Clash/Compilar para Android (APK)")]
        public static void BuildAndroid()
        {
            PlayerSettings.SetApplicationIdentifier(BuildTargetGroup.Android, "com.kaiokenclash.unity");
            PlayerSettings.Android.minSdkVersion = AndroidSdkVersions.AndroidApiLevel24;
            PlayerSettings.SetScriptingBackend(BuildTargetGroup.Android, ScriptingImplementation.IL2CPP);
            PlayerSettings.Android.targetArchitectures = AndroidArchitecture.ARM64 | AndroidArchitecture.ARMv7;
            EditorUserBuildSettings.buildAppBundle = false;
            Build(BuildTarget.Android, "Builds/Android/KaiokenClash.apk");
        }

        [MenuItem("Kaioken Clash/Compilar para iPhone (proyecto de Xcode)")]
        public static void BuildIOS()
        {
            PlayerSettings.SetApplicationIdentifier(BuildTargetGroup.iOS, "com.kaiokenclash.unity");
            Build(BuildTarget.iOS, "Builds/iOS");
        }
    }
}
