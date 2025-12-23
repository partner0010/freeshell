@echo off
chcp 65001 >nul
cls
echo ========================================
echo Freeshell Preview Server
echo ========================================
echo.

REM Change to project root if in .github folder
if exist "..\package.json" (
    cd ..
    echo Changed to project root: %CD%
    echo.
) else if exist "..\..\package.json" (
    cd ..\..
    echo Changed to project root: %CD%
    echo.
)

REM Check if in project root
if not exist "package.json" (
    echo [ERROR] package.json not found.
    echo Current location: %CD%
    echo Please run from project root folder.
    echo.
    pause
    exit /b 1
)

echo [1/6] Check dependencies...
if not exist "node_modules" (
    echo node_modules folder not found. Installing packages...
    call npm install
    if errorlevel 1 (
        echo [ERROR] Package installation failed
        pause
        exit /b 1
    )
    echo Package installation completed!
) else (
    echo Packages already installed.
)
echo.

echo [2/6] Check environment variables...
if not exist ".env.local" (
    echo [WARNING] .env.local file not found.
    echo Will run with default environment variables.
    echo.
) else (
    echo .env.local file found.
)
echo.

echo [3/6] Check port...
netstat -ano | findstr :3000 >nul 2>&1
if errorlevel 1 (
    echo Port 3000 is available.
) else (
    echo [WARNING] Port 3000 is already in use.
    echo Close existing server? (Y/N)
    set /p kill_process=
    if /i "!kill_process!"=="Y" (
        echo Closing processes using port 3000...
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
            taskkill /F /PID %%a >nul 2>&1
        )
        timeout /t 2 /nobreak >nul
        echo Process closed.
    )
)
echo.

echo [4/6] Generate Prisma client...
if exist "prisma\schema.prisma" (
    echo Generating Prisma client...
    call npx prisma generate >nul 2>&1
    if errorlevel 1 (
        echo [WARNING] Prisma generation error, continuing...
    ) else (
        echo Prisma client generated!
    )
) else (
    echo Prisma schema file not found. Skipping.
)
echo.

echo [5/6] Start development server...
echo.
echo ========================================
echo Starting server...
echo.
echo Note: Server startup may take 10-30 seconds.
echo       First run may take longer.
echo ========================================
echo.

REM Start dev server in separate window
start "Freeshell Dev Server" cmd /k "npm run dev"

REM Wait for server to start (max 60 seconds)
echo Waiting for server to start...
set /a wait_count=0
set /a max_wait=60

:wait_loop
timeout /t 2 /nobreak >nul
netstat -ano | findstr :3000 >nul 2>&1
if errorlevel 1 (
    set /a wait_count+=2
    if %wait_count% geq %max_wait% (
        echo.
        echo [WARNING] Server startup delayed.
        echo Check server window or manually access http://localhost:3000
        echo.
        goto open_browser
    )
    echo Waiting for server to start... (%wait_count% seconds elapsed)
    goto wait_loop
)

echo.
echo ========================================
echo [SUCCESS] Server started successfully!
echo.
echo Access in browser:
echo   http://localhost:3000
echo.
echo Main Pages:
echo   - Main: http://localhost:3000
echo   - Editor: http://localhost:3000/editor
echo   - AI Search: http://localhost:3000/genspark
echo   - Content Creator: http://localhost:3000/creator
echo   - AI Agents: http://localhost:3000/agents
echo   - Trends: http://localhost:3000/trends
echo   - Debug: http://localhost:3000/debug
echo   - Validate: http://localhost:3000/validate
echo   - Remote: http://localhost:3000/remote
echo   - Community: http://localhost:3000/community
echo   - Templates: http://localhost:3000/templates
echo   - Analytics: http://localhost:3000/analytics
echo   - Help: http://localhost:3000/help
echo   - Admin: http://localhost:3000/admin
echo   - My Page: http://localhost:3000/mypage
echo   - Benefits: http://localhost:3000/mypage/benefits
echo   - Security: http://localhost:3000/mypage/security
echo.
echo To stop server, close server window or press Ctrl+C
echo ========================================
echo.

:open_browser
REM Auto open browser
timeout /t 2 /nobreak >nul
start http://localhost:3000

echo.
echo [6/6] Browser opened!
echo.
echo Check logs in server window.
echo This window can be closed, server will continue running.
echo.
pause

