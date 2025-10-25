@echo off
chcp 65001 >nul
echo ==========================================
echo   高德地图车辆轨迹追踪系统
echo ==========================================
echo.

REM 检查是否有 Python
where python >nul 2>nul
if %errorlevel% == 0 (
    echo ✓ 检测到 Python
    echo 启动 HTTP 服务器在端口 8000...
    echo.
    echo 访问地址: http://localhost:8000
    echo 按 Ctrl+C 停止服务器
    echo.
    python -m http.server 8000
    goto :end
)

REM 检查是否有 PHP
where php >nul 2>nul
if %errorlevel% == 0 (
    echo ✓ 检测到 PHP
    echo 启动 HTTP 服务器在端口 8000...
    echo.
    echo 访问地址: http://localhost:8000
    echo 按 Ctrl+C 停止服务器
    echo.
    php -S localhost:8000
    goto :end
)

REM 检查是否有 Node.js
where node >nul 2>nul
if %errorlevel% == 0 (
    echo ✓ 检测到 Node.js
    where npx >nul 2>nul
    if %errorlevel% == 0 (
        echo 启动 HTTP 服务器在端口 8000...
        echo.
        echo 访问地址: http://localhost:8000
        echo 按 Ctrl+C 停止服务器
        echo.
        npx http-server -p 8000
        goto :end
    ) else (
        echo 请安装 http-server: npm install -g http-server
        goto :error
    )
)

:error
echo ✗ 未检测到 Python、PHP 或 Node.js
echo 请安装其中一个来启动 HTTP 服务器
pause
exit /b 1

:end
pause
