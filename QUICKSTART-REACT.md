# ⚡ React版本快速入门

只需3步，立即开始使用！

---

## 第一步：安装

```bash
npm install
```

等待依赖安装完成...

---

## 第二步：配置API Key

编辑 `index.html` 文件，找到以下代码：

```html
<script type="text/javascript">
  window._AMapSecurityConfig = {
    securityJsCode: 'YOUR_SECURITY_CODE', // ⬅️ 替换这里
  }
</script>
<script type="text/javascript" src="https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY&plugin=AMap.Driving,AMap.Geolocation"></script>
<!-- 将YOUR_AMAP_KEY替换为你的Key ⬆️ -->
```

### 如何获取API Key？

1. 访问 https://lbs.amap.com/
2. 注册/登录
3. 进入"控制台" → "应用管理" → "我的应用"
4. 创建应用，添加Key（选择"Web端 JS API"）
5. 复制Key和安全密钥

---

## 第三步：启动

```bash
npm run dev
```

浏览器自动打开 http://localhost:3000

---

## 🎉 开始使用

### 1. 添加车辆

点击左侧的"添加车辆"：
- 输入车辆编号（如：BJ001）
- 输入车辆名称（如：京A12345）
- 点击"添加车辆"

或者点击"加载示例"快速添加示例车辆。

### 2. 开始追踪

在车辆列表中，点击"开始追踪"按钮：
- 车辆开始在地图上移动
- 自动绘制轨迹线
- 实时更新统计数据

### 3. 查看统计

切换到"数据统计"标签：
- 查看总体数据
- 查看里程排行榜
- 查看详细信息

### 4. 轨迹回放

切换到"历史轨迹"标签：
- 选择要回放的车辆
- 选择回放速度
- 点击"播放"

---

## 🎯 常用功能

### 地图控制

右侧控制按钮：
- 📍 回到中心
- ➕ 放大
- ➖ 缩小
- 🌐 2D/3D切换
- 🎯 适应视图
- ⛶ 全屏

### 批量操作

控制面板：
- 📦 批量添加 - 一次添加多辆车
- 📋 加载示例 - 快速加载示例数据
- 📂 导入数据 - 从文件导入车辆

### 数据管理

历史轨迹：
- 💾 导出轨迹 - 导出为JSON文件

---

## 🛠️ 其他命令

```bash
# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint
```

---

## ❓ 遇到问题？

### 地图不显示？
1. 检查API Key是否正确配置
2. 检查网络连接
3. 打开浏览器控制台查看错误

### 端口被占用？
修改 `vite.config.js` 中的端口：
```javascript
export default defineConfig({
  server: {
    port: 3001  // 改为其他端口
  }
})
```

### 安装失败？
```bash
# 清理缓存重试
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 更多文档

- 完整功能文档：[README-REACT.md](./README-REACT.md)
- 详细配置指南：[SETUP-GUIDE-REACT.md](./SETUP-GUIDE-REACT.md)
- 部署指南：[DEPLOYMENT.md](./DEPLOYMENT.md)
- 功能清单：[FEATURES.md](./FEATURES.md)

---

## 💡 提示

- 第一次使用？试试"加载示例"按钮
- 想要更多车辆？使用"批量添加"功能
- 需要保存数据？使用"导出轨迹"功能
- 想查看详细统计？切换到"数据统计"标签

---

**开始你的车辆追踪之旅！** 🚗💨

有问题？查看完整文档或提Issue！
