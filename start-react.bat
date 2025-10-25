@echo off
chcp 65001 >nul
cls

echo =========================================
echo   高德地图车辆轨迹追踪系统 - React版
echo =========================================
echo.

:: 检查 Node.js 是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到 Node.js
    echo 请先安装 Node.js: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✅ Node.js 版本: %NODE_VERSION%

:: 检查 npm 是否安装
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: 未检测到 npm
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
echo ✅ npm 版本: %NPM_VERSION%
echo.

:: 检查是否已安装依赖
if not exist "node_modules" (
    echo 📦 首次运行，正在安装依赖...
    echo.
    
    echo 请选择包管理器:
    echo 1^) npm
    echo 2^) yarn
    echo 3^) pnpm
    set /p pm_choice="请输入选项 (1-3，默认1): "
    
    if "%pm_choice%"=="" set pm_choice=1
    
    if "%pm_choice%"=="2" (
        where yarn >nul 2>&1
        if %errorlevel% equ 0 (
            call yarn install
        ) else (
            echo ❌ 未检测到 yarn，使用 npm 安装
            call npm install
        )
    ) else if "%pm_choice%"=="3" (
        where pnpm >nul 2>&1
        if %errorlevel% equ 0 (
            call pnpm install
        ) else (
            echo ❌ 未检测到 pnpm，使用 npm 安装
            call npm install
        )
    ) else (
        call npm install
    )
    
    if %errorlevel% neq 0 (
        echo.
        echo ❌ 依赖安装失败！
        echo.
        echo 请尝试以下解决方案:
        echo 1. 检查网络连接
        echo 2. 使用国内镜像: npm config set registry https://registry.npmmirror.com
        echo 3. 清除缓存: npm cache clean --force
        pause
        exit /b 1
    )
    
    echo.
    echo ✅ 依赖安装成功！
) else (
    echo ✅ 依赖已安装
)

echo.
echo =========================================
echo   启动开发服务器...
echo =========================================
echo.

:: 检查 API Key 配置
findstr /C:"YOUR_AMAP_KEY" index-react.html >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  警告: 检测到未配置的 API Key
    echo.
    echo 请按以下步骤配置:
    echo 1. 访问 https://lbs.amap.com/ 注册并获取 API Key
    echo 2. 编辑 index-react.html 文件
    echo 3. 将 YOUR_AMAP_KEY 替换为你的 API Key
    echo.
    set /p continue_choice="是否继续启动？(y/n，默认y): "
    
    if /i "%continue_choice%"=="n" (
        echo 已取消启动
        pause
        exit /b 0
    )
)

:: 启动开发服务器
call npm run dev

:: 如果启动失败
if %errorlevel% neq 0 (
    echo.
    echo ❌ 启动失败！
    echo.
    echo 常见问题解决:
    echo 1. 端口被占用: 修改 vite.config.js 中的 port 配置
    echo 2. 权限问题: 以管理员身份运行
    echo 3. 查看详细错误信息并根据提示解决
    pause
    exit /b 1
)
