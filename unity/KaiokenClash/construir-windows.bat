@echo off
rem Kaioken Clash: compila la version de Windows sin abrir Unity. Resultado: Builds\Windows\KaiokenClash.exe
call "%~dp0buscar-unity.bat" || exit /b 1
"%UNITY%" -batchmode -quit -projectPath "%~dp0." -executeMethod Kaioken.EditorTools.KaiokenBuild.BuildWindows -logFile "%~dp0build-windows.log"
if errorlevel 1 (echo Fallo la compilacion. Mira build-windows.log & pause & exit /b 1)
echo Listo: %~dp0Builds\Windows\KaiokenClash.exe
start "" "%~dp0Builds\Windows"
pause
