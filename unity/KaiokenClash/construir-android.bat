@echo off
rem Kaioken Clash: compila el APK de Android sin abrir Unity (necesita el modulo Android Build Support). Resultado: Builds\Android\KaiokenClash.apk
call "%~dp0buscar-unity.bat" || exit /b 1
"%UNITY%" -batchmode -quit -projectPath "%~dp0." -buildTarget Android -executeMethod Kaioken.EditorTools.KaiokenBuild.BuildAndroid -logFile "%~dp0build-android.log"
if errorlevel 1 (echo Fallo la compilacion. Mira build-android.log & pause & exit /b 1)
echo Listo: %~dp0Builds\Android\KaiokenClash.apk  (copialo al celular y abrelo para instalarlo)
start "" "%~dp0Builds\Android"
pause
