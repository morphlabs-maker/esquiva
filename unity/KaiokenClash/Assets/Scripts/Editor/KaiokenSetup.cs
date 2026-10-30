// Kaioken Clash (Unity) · Configura el proyecto la primera vez que se abre: crea la escena principal, la añade a la compilación
// y deja el iPhone en horizontal. También está en el menú «Kaioken Clash → Configurar proyecto».
using UnityEditor;
using UnityEditor.SceneManagement;
using UnityEngine;

namespace Kaioken.EditorTools
{
    [InitializeOnLoad]
    public static class KaiokenSetup
    {
        const string ScenePath = "Assets/Scenes/Main.unity";

        static KaiokenSetup() { EditorApplication.delayCall += () => { if (!System.IO.File.Exists(ScenePath)) Setup(); }; }

        [MenuItem("Kaioken Clash/Configurar proyecto")]
        public static void Setup()
        {
            if (!AssetDatabase.IsValidFolder("Assets/Scenes")) AssetDatabase.CreateFolder("Assets", "Scenes");
            var scene = EditorSceneManager.NewScene(NewSceneSetup.EmptyScene, NewSceneMode.Single);
            EditorSceneManager.SaveScene(scene, ScenePath);
            EditorBuildSettings.scenes = new[] { new EditorBuildSettingsScene(ScenePath, true) };
            PlayerSettings.companyName = "Kaioken Clash";
            PlayerSettings.productName = "Kaioken Clash";
            PlayerSettings.SetApplicationIdentifier(BuildTargetGroup.iOS, "com.kaiokenclash.unity");
            PlayerSettings.defaultInterfaceOrientation = UIOrientation.AutoRotation;
            PlayerSettings.allowedAutorotateToPortrait = false;
            PlayerSettings.allowedAutorotateToPortraitUpsideDown = false;
            PlayerSettings.allowedAutorotateToLandscapeLeft = true;
            PlayerSettings.allowedAutorotateToLandscapeRight = true;
            AssetDatabase.SaveAssets();
            Debug.Log("Kaioken Clash: proyecto configurado. Pulsa Play para jugar.");
        }
    }
}
