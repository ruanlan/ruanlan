# React 版本配置指南

本指南将帮助你快速配置和启动高德地图车辆轨迹追踪系统的 React 版本。

## 📋 目录

1. [环境准备](#环境准备)
2. [获取高德地图 API Key](#获取高德地图-api-key)
3. [项目安装](#项目安装)
4. [配置说明](#配置说明)
5. [启动项目](#启动项目)
6. [常见问题](#常见问题)

## 环境准备

### 必需软件

1. **Node.js** (版本 >= 14.0.0)
   ```bash
   # 检查 Node.js 版本
   node --version
   ```

   如果未安装，请访问 [Node.js 官网](https://nodejs.org/) 下载安装。

2. **npm** (版本 >= 6.0.0) 或 **yarn** (版本 >= 1.22.0)
   ```bash
   # 检查 npm 版本
   npm --version
   
   # 或检查 yarn 版本
   yarn --version
   ```

3. **现代浏览器**
   - Chrome (推荐)
   - Firefox
   - Safari
   - Edge

## 获取高德地图 API Key

### 步骤 1: 注册账号

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 点击右上角"注册"按钮
3. 填写注册信息（手机号、邮箱等）
4. 完成手机验证

### 步骤 2: 创建应用

1. 登录后，进入 [控制台](https://console.amap.com/)
2. 点击"应用管理" -> "我的应用"
3. 点击"创建新应用"
4. 填写应用信息：
   - 应用名称：如"车辆追踪系统"
   - 应用类型：Web 端

### 步骤 3: 添加 Key

1. 在应用列表中找到刚创建的应用
2. 点击"添加 Key"
3. 填写 Key 信息：
   - Key 名称：如"Web 端 Key"
   - 服务平台：选择"Web 端（JS API）"
4. 点击"提交"

### 步骤 4: 获取密钥

1. 创建成功后，复制显示的 Key
2. （可选）开启"安全密钥"，复制 securityJsCode

### 示例

```
API Key: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
Security Code: 1a2b3c4d5e6f7g8h9i0j (如果启用)
```

## 项目安装

### 方法 1: 使用 npm

```bash
# 进入项目目录
cd amap-vehicle-tracking-react

# 安装依赖
npm install

# 等待安装完成...
```

### 方法 2: 使用 yarn

```bash
# 进入项目目录
cd amap-vehicle-tracking-react

# 安装依赖
yarn install

# 等待安装完成...
```

### 方法 3: 使用 pnpm (推荐)

```bash
# 进入项目目录
cd amap-vehicle-tracking-react

# 安装依赖
pnpm install

# 等待安装完成...
```

## 配置说明

### 1. 配置 API Key

编辑 `index-react.html` 文件：

```html
<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>高德地图车辆轨迹追踪系统 - React版</title>
    
    <!-- 配置安全密钥（如果启用） -->
    <script type="text/javascript">
      window._AMapSecurityConfig = {
        securityJsCode: '你的安全密钥',  // 替换这里
      };
    </script>
    
    <!-- 加载高德地图 API -->
    <script src="https://webapi.amap.com/maps?v=2.0&key=你的API_Key&plugin=AMap.Driving,AMap.Geocoder,AMap.Geolocation"></script>
    <!-- 替换上面的 key=你的API_Key -->
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### 2. 配置地图默认参数

编辑 `src/constants/index.js`：

```javascript
// 默认地图中心（默认为北京天安门）
export const DEFAULT_MAP_CENTER = [116.397428, 39.90923];

// 默认地图缩放级别
export const DEFAULT_MAP_ZOOM = 13;

// 追踪更新间隔（毫秒）
export const TRACKING_UPDATE_INTERVAL = 2000;

// 根据你的需求修改...
```

### 3. 配置开发服务器（可选）

编辑 `vite.config.js`：

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,        // 修改端口号
    open: true,        // 自动打开浏览器
    host: '0.0.0.0',  // 允许外部访问（可选）
  },
});
```

## 启动项目

### 开发模式

```bash
# 使用 npm
npm run dev

# 或使用 yarn
yarn dev

# 或使用 pnpm
pnpm dev
```

浏览器将自动打开 `http://localhost:3000`

### 生产构建

```bash
# 使用 npm
npm run build

# 或使用 yarn
yarn build

# 或使用 pnpm
pnpm build
```

构建完成后，文件将在 `dist` 目录中。

### 预览生产构建

```bash
# 使用 npm
npm run preview

# 或使用 yarn
yarn preview

# 或使用 pnpm
pnpm preview
```

## 验证安装

### 1. 检查控制台

打开浏览器开发者工具（F12），检查控制台：
- ✅ 应该看到 "高德地图API加载成功" 消息
- ❌ 如果有错误，检查 API Key 配置

### 2. 测试功能

1. **添加车辆**
   - 在左侧面板输入车牌号
   - 点击"添加车辆"
   - 应该看到成功提示

2. **开始追踪**
   - 选择车辆
   - 点击"开始追踪"
   - 地图上应该出现移动的车辆标记

3. **加载示例路线**
   - 点击"北京市区路线"
   - 地图上应该显示完整路线

## 常见问题

### Q1: 地图不显示

**可能原因：**
- API Key 未配置或配置错误
- 网络连接问题
- 浏览器阻止了地图 API 加载

**解决方法：**
```bash
# 1. 检查 API Key 是否正确
# 2. 打开浏览器控制台查看错误信息
# 3. 检查网络连接
# 4. 清除浏览器缓存后重试
```

### Q2: npm install 失败

**可能原因：**
- 网络问题
- npm 源速度慢
- 权限问题

**解决方法：**
```bash
# 切换到国内镜像源
npm config set registry https://registry.npmmirror.com

# 或使用淘宝镜像
npm config set registry https://registry.npm.taobao.org

# 清除缓存
npm cache clean --force

# 重新安装
npm install
```

### Q3: 端口被占用

**错误信息：**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**解决方法：**
```bash
# 方法1: 修改端口号
# 编辑 vite.config.js，修改 server.port

# 方法2: 关闭占用端口的进程
# Windows
netstat -ano | findstr :3000
taskkill /PID <进程ID> /F

# Mac/Linux
lsof -i :3000
kill -9 <进程ID>
```

### Q4: 定位功能不可用

**可能原因：**
- 浏览器未授予定位权限
- HTTPS 要求未满足

**解决方法：**
1. 在浏览器地址栏左侧点击锁形图标
2. 允许位置访问权限
3. 刷新页面

### Q5: 轨迹显示不完整

**可能原因：**
- 数据量过大
- 地图缩放级别不合适

**解决方法：**
1. 点击"清除轨迹"后重新开始
2. 使用"生成随机路线"测试
3. 检查浏览器控制台错误信息

## 配置检查清单

在正式使用前，请确认以下项目：

- [ ] Node.js 已安装（v14+）
- [ ] npm/yarn 可正常使用
- [ ] 项目依赖已安装
- [ ] 高德地图 API Key 已获取
- [ ] API Key 已正确配置到 index-react.html
- [ ] 开发服务器可以正常启动
- [ ] 浏览器控制台无错误信息
- [ ] 地图可以正常显示
- [ ] 基本功能可以正常使用

## 性能优化建议

### 1. 启用生产模式

```bash
npm run build
```

### 2. 启用 gzip 压缩

在生产服务器配置 gzip：

```nginx
# Nginx 配置示例
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### 3. 使用 CDN

将构建后的静态资源部署到 CDN：
- 修改 `vite.config.js` 中的 `base` 配置
- 上传 `dist` 目录到 CDN

### 4. 代码分割

Vite 已自动启用代码分割，确保：
- 路由懒加载
- 组件按需加载
- 第三方库单独打包

## 部署指南

### 部署到 Vercel

```bash
# 安装 Vercel CLI
npm install -g vercel

# 部署
vercel
```

### 部署到 Netlify

```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 构建
npm run build

# 部署
netlify deploy --prod --dir=dist
```

### 部署到服务器

```bash
# 构建
npm run build

# 上传 dist 目录到服务器
scp -r dist/* user@server:/var/www/html/
```

## 技术支持

如果遇到无法解决的问题：

1. 查看项目 README-REACT.md
2. 检查高德地图 [官方文档](https://lbs.amap.com/api/javascript-api/summary)
3. 在 GitHub 提交 Issue
4. 查看浏览器控制台的详细错误信息

## 下一步

配置完成后，建议：

1. 阅读 [README-REACT.md](./README-REACT.md) 了解详细功能
2. 查看源代码学习实现细节
3. 根据需求定制功能
4. 接入真实的车辆数据接口

---

**祝你使用愉快！** 🎉
