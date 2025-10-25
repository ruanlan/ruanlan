#!/bin/bash

# 高德地图车辆轨迹追踪系统 - React版 启动脚本

echo "========================================="
echo "  高德地图车辆轨迹追踪系统 - React版"
echo "========================================="
echo ""

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未检测到 Node.js"
    echo "请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未检测到 npm"
    exit 1
fi

echo "✅ npm 版本: $(npm --version)"
echo ""

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 首次运行，正在安装依赖..."
    echo ""
    
    # 询问使用哪个包管理器
    echo "请选择包管理器:"
    echo "1) npm"
    echo "2) yarn"
    echo "3) pnpm"
    read -p "请输入选项 (1-3，默认1): " pm_choice
    
    case $pm_choice in
        2)
            if command -v yarn &> /dev/null; then
                yarn install
            else
                echo "❌ 未检测到 yarn，使用 npm 安装"
                npm install
            fi
            ;;
        3)
            if command -v pnpm &> /dev/null; then
                pnpm install
            else
                echo "❌ 未检测到 pnpm，使用 npm 安装"
                npm install
            fi
            ;;
        *)
            npm install
            ;;
    esac
    
    if [ $? -ne 0 ]; then
        echo ""
        echo "❌ 依赖安装失败！"
        echo ""
        echo "请尝试以下解决方案:"
        echo "1. 检查网络连接"
        echo "2. 使用国内镜像: npm config set registry https://registry.npmmirror.com"
        echo "3. 清除缓存: npm cache clean --force"
        exit 1
    fi
    
    echo ""
    echo "✅ 依赖安装成功！"
else
    echo "✅ 依赖已安装"
fi

echo ""
echo "========================================="
echo "  启动开发服务器..."
echo "========================================="
echo ""

# 检查 API Key 配置
if grep -q "YOUR_AMAP_KEY" index-react.html; then
    echo "⚠️  警告: 检测到未配置的 API Key"
    echo ""
    echo "请按以下步骤配置:"
    echo "1. 访问 https://lbs.amap.com/ 注册并获取 API Key"
    echo "2. 编辑 index-react.html 文件"
    echo "3. 将 YOUR_AMAP_KEY 替换为你的 API Key"
    echo ""
    read -p "是否继续启动？(y/n，默认y): " continue_choice
    
    if [ "$continue_choice" = "n" ] || [ "$continue_choice" = "N" ]; then
        echo "已取消启动"
        exit 0
    fi
fi

# 启动开发服务器
npm run dev

# 如果启动失败
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ 启动失败！"
    echo ""
    echo "常见问题解决:"
    echo "1. 端口被占用: 修改 vite.config.js 中的 port 配置"
    echo "2. 权限问题: 尝试使用 sudo 运行"
    echo "3. 查看详细错误信息并根据提示解决"
    exit 1
fi
