@echo off
rem Busca Unity 2022.3 instalado con Unity Hub.
set UNITY=
for /d %%D in ("C:\Program Files\Unity\Hub\Editor\2022.3.*") do if exist "%%D\Editor\Unity.exe" set "UNITY=%%D\Editor\Unity.exe"
if "%UNITY%"=="" (echo No encuentro Unity 2022.3. Instalalo desde Unity Hub ^(https://unity.com/download^) & pause & exit /b 1)
echo Usando %UNITY%
exit /b 0
