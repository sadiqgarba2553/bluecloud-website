@echo off
title Prism Studio — Build EXE
echo.
echo  ============================================
echo   Prism Studio — Windows EXE Builder
echo  ============================================
echo   Outputs:
echo     dist\Prism Studio Setup 1.0.0.exe   (Installer)
echo     dist\Prism Studio 1.0.0.exe         (Portable)
echo  ============================================
echo.

:: Check Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
  echo  [ERROR] Node.js is not installed.
  echo  Download it from: https://nodejs.org
  pause
  exit /b 1
)

echo  [1/3] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
  echo  [ERROR] npm install failed.
  pause
  exit /b 1
)

echo.
echo  [2/3] Building Windows EXE (Setup + Portable)...
call npm run build
if %errorlevel% neq 0 (
  echo  [ERROR] Build failed.
  pause
  exit /b 1
)

echo.
echo  [3/3] Done!
echo.
echo  =============================================
echo   Files are in the  dist\  folder:
echo.
echo   [INSTALLER]  Prism Studio Setup 1.0.0.exe
echo   [PORTABLE ]  Prism Studio 1.0.0.exe
echo  =============================================
echo.
pause
