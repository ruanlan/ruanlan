# React版本快速配置指南

## 三步快速启动

### 第一步：安装依赖

```bash
npm install
```

### 第二步：配置高德地图API Key

#### 获取API Key

1. 访问 https://lbs.amap.com/
2. 注册/登录账号
3. 进入控制台 → 应用管理 → 我的应用
4. 创建新应用，添加Key（选择 Web端 JS API）
5. 获取Key和安全密钥

#### 配置Key

编辑 `index.html` 文件，找到以下部分：

```html
<script type="text/javascript">
  window._AMapSecurityConfig = {
    securityJsCode: 'YOUR_SECURITY_CODE', // 替换为你的安全密钥
  }
</script>
<script type="text/javascript" src="https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY&plugin=AMap.Driving,AMap.Geolocation"></script>
```

将 `YOUR_AMAP_KEY` 和 `YOUR_SECURITY_CODE` 替换为你的实际值。

### 第三步：启动应用

```bash
npm run dev
```

访问 http://localhost:3000 即可！

## 🎯 快速体验

### 1. 添加车辆

方式一：手动添加
- 输入车辆编号和名称
- 点击"添加车辆"

方式二：加载示例
- 点击"加载示例"一键添加示例车辆

方式三：批量添加
- 点击"批量添加"
- 输入数量快速生成

### 2. 开始追踪

- 在车辆列表中点击"开始追踪"
- 观察车辆在地图上移动
- 查看实时轨迹和数据

### 3. 查看统计

- 切换到"数据统计"标签
- 查看总体数据和排行榜

### 4. 轨迹回放

- 切换到"历史轨迹"标签
- 选择车辆和回放速度
- 点击"播放"观看回放

## 📦 项目文件说明

### 核心文件

- `index.html` - HTML入口（配置API Key）
- `package.json` - 依赖配置
- `vite.config.js` - Vite配置
- `src/main.jsx` - React入口
- `src/App.jsx` - 根组件

### 组件目录

- `src/components/Map/` - 地图组件
- `src/components/Vehicle/` - 车辆组件
- `src/components/Track/` - 轨迹组件
- `src/components/Statistics/` - 统计组件
- `src/components/ControlPanel/` - 控制面板

### 核心逻辑

- `src/store/vehicleStore.js` - 状态管理
- `src/hooks/useAMap.js` - 地图Hook
- `src/hooks/useVehicleTracking.js` - 追踪Hook
- `src/utils/simulator.js` - 工具函数

## 🔧 常用命令

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview

# 代码检查
npm run lint
```

## ⚙️ 自定义配置

### 修改地图中心

编辑 `src/constants/config.js`：

```javascript
MAP: {
  DEFAULT_CENTER: [116.397428, 39.90923], // 改为你的城市坐标
  DEFAULT_ZOOM: 13,
}
```

### 修改追踪频率

```javascript
TRACKING: {
  UPDATE_INTERVAL: 2000, // 改为你想要的毫秒数
}
```

### 修改车辆颜色

```javascript
VEHICLE: {
  COLORS: [
    '#FF5733', // 添加你喜欢的颜色
    // ...
  ],
}
```

## 🐛 问题排查

### 地图不显示

1. ✅ 检查API Key是否正确
2. ✅ 检查网络连接
3. ✅ 打开浏览器控制台查看错误
4. ✅ 确认API Key有权限

### 车辆不移动

1. ✅ 确保点击了"开始追踪"
2. ✅ 检查控制台是否有错误
3. ✅ 刷新页面重试

### 构建失败

1. ✅ 删除 node_modules 和 package-lock.json
2. ✅ 重新运行 npm install
3. ✅ 确保Node.js版本 >= 16

## 📚 更多信息

- 完整文档：README-REACT.md
- 高德地图API：https://lbs.amap.com/api/javascript-api/summary
- React文档：https://react.dev/
- Vite文档：https://vitejs.dev/

---

**开始你的车辆追踪之旅！** 🚗💨
