@echo off
REM A lancer a la racine du projet (la ou se trouve package.json et le dossier android)
call npm i -D @capacitor/assets
call npx capacitor-assets generate --android
call npm run build
call npx cap sync android
echo.
echo Termine. Ouvre Android Studio : Build ^> Clean Project, puis Build APK(s).
pause
