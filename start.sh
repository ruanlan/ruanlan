#!/bin/bash

echo "=========================================="
echo "  高德地图车辆轨迹追踪系统"
echo "=========================================="
echo ""

# 检查是否有 Python
if command -v python3 &> /dev/null; then
    echo "✓ 检测到 Python3"
    echo "启动 HTTP 服务器在端口 8000..."
    echo ""
    echo "访问地址: http://localhost:8000"
    echo "按 Ctrl+C 停止服务器"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✓ 检测到 Python"
    echo "启动 HTTP 服务器在端口 8000..."
    echo ""
    echo "访问地址: http://localhost:8000"
    echo "按 Ctrl+C 停止服务器"
    echo ""
    python -m SimpleHTTPServer 8000
elif command -v php &> /dev/null; then
    echo "✓ 检测到 PHP"
    echo "启动 HTTP 服务器在端口 8000..."
    echo ""
    echo "访问地址: http://localhost:8000"
    echo "按 Ctrl+C 停止服务器"
    echo ""
    php -S localhost:8000
elif command -v node &> /dev/null; then
    echo "✓ 检测到 Node.js"
    if command -v npx &> /dev/null; then
        echo "启动 HTTP 服务器在端口 8000..."
        echo ""
        echo "访问地址: http://localhost:8000"
        echo "按 Ctrl+C 停止服务器"
        echo ""
        npx http-server -p 8000
    else
        echo "请安装 http-server: npm install -g http-server"
        exit 1
    fi
else
    echo "✗ 未检测到 Python、PHP 或 Node.js"
    echo "请安装其中一个来启动 HTTP 服务器"
    exit 1
fi
