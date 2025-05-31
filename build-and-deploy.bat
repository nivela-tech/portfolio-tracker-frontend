@echo off
setlocal enabledelayedexpansion

:: Build and Deploy Script for Portfolio Tracker
:: This script builds the React frontend for production and copies it to the Spring Boot backend

echo.
echo ========================================
echo Portfolio Tracker Build and Deploy
echo ========================================
echo.

:: Define paths
set WORKSPACE_ROOT=c:\Users\Ami\ws
set FRONTEND_PATH=%WORKSPACE_ROOT%\portfolio-tracker-frontend
set BACKEND_PATH=%WORKSPACE_ROOT%\portfolio-tracker-backend
set FRONTEND_BUILD_PATH=%FRONTEND_PATH%\build
set BACKEND_STATIC_PATH=%BACKEND_PATH%\src\main\resources\static

:: Check if directories exist
if not exist "%FRONTEND_PATH%" (
    echo ERROR: Frontend directory not found: %FRONTEND_PATH%
    exit /b 1
)

if not exist "%BACKEND_PATH%" (
    echo ERROR: Backend directory not found: %BACKEND_PATH%
    exit /b 1
)

:: Step 1: Install dependencies
echo [1/4] Installing frontend dependencies...
cd /d "%FRONTEND_PATH%"
call npm install
if !errorlevel! neq 0 (
    echo ERROR: Failed to install dependencies
    exit /b 1
)
echo ✓ Dependencies installed successfully
echo.

:: Step 2: Build frontend for production
echo [2/4] Building frontend for production...
set NODE_ENV=production
call npm run build
if !errorlevel! neq 0 (
    echo ERROR: Frontend build failed
    exit /b 1
)
echo ✓ Frontend build completed successfully
echo.

:: Step 3: Create backend static directory if it doesn't exist
echo [3/4] Preparing backend static directory...
if not exist "%BACKEND_STATIC_PATH%" (
    mkdir "%BACKEND_STATIC_PATH%"
    echo ✓ Created backend static directory
) else (
    echo ✓ Backend static directory exists
)
echo.

:: Step 4: Copy build files to backend
echo [4/4] Copying build files to backend...
if not exist "%FRONTEND_BUILD_PATH%" (
    echo ERROR: Frontend build directory not found: %FRONTEND_BUILD_PATH%
    echo Make sure the build step completed successfully
    exit /b 1
)

:: Remove existing files in backend static (optional - comment out if you want to keep them)
if exist "%BACKEND_STATIC_PATH%\*" (
    del /q "%BACKEND_STATIC_PATH%\*.*" 2>nul
    for /d %%x in ("%BACKEND_STATIC_PATH%\*") do rd /s /q "%%x" 2>nul
)

:: Copy all files from build to backend static
xcopy "%FRONTEND_BUILD_PATH%\*.*" "%BACKEND_STATIC_PATH%\" /s /e /y /q
if !errorlevel! neq 0 (
    echo ERROR: Failed to copy build files
    exit /b 1
)
echo ✓ Successfully copied build files to backend
echo.

:: Success message
echo ========================================
echo BUILD AND DEPLOY COMPLETED SUCCESSFULLY!
echo ========================================
echo.
echo Frontend built in: %FRONTEND_BUILD_PATH%
echo Files copied to: %BACKEND_STATIC_PATH%
echo.
echo Next steps:
echo 1. Test locally: cd %BACKEND_PATH% ^&^& gradlew bootRun
echo 2. Deploy to production using your deployment script
echo 3. Verify frontend is served at your backend URL
echo.

pause
