# 高德地图车辆轨迹追踪系统 - React版本

一个功能完整、交互友好的React车辆轨迹追踪系统，基于高德地图API 2.0开发。

## ✨ 功能特性

### 🚗 车辆管理
- ✅ 添加/删除车辆
- ✅ 批量添加车辆
- ✅ 车辆信息编辑
- ✅ 车辆状态实时显示
- ✅ 多车辆同时管理
- ✅ 车辆列表筛选

### 📍 实时追踪
- ✅ 实时位置更新
- ✅ 轨迹路径可视化
- ✅ 动态标记显示
- ✅ 自动跟随视角
- ✅ 轨迹平滑渲染
- ✅ 支持多车辆同时追踪

### 🎬 轨迹回放
- ✅ 历史轨迹回放
- ✅ 播放/暂停控制
- ✅ 多级速度调节（0.5x - 10x）
- ✅ 回放进度显示
- ✅ 轨迹点详情查看
- ✅ 轨迹数据导出

### 📊 数据统计
- ✅ 总里程统计
- ✅ 平均速度计算
- ✅ 最高速度记录
- ✅ 行驶时长统计
- ✅ 车辆在线状态
- ✅ 里程排行榜
- ✅ 速度排行榜
- ✅ 实时数据更新

### 🗺️ 地图控制
- ✅ 3D/2D视图切换
- ✅ 地图缩放控制
- ✅ 定位到车辆
- ✅ 全屏显示
- ✅ 适应所有车辆视图
- ✅ 地图样式自定义

### 💾 数据管理
- ✅ 轨迹数据导出（JSON）
- ✅ 车辆数据导入
- ✅ 历史记录查询
- ✅ 数据持久化存储

## 🚀 快速开始

### 环境要求

- Node.js 16+ 
- npm 或 yarn
- 现代浏览器（Chrome、Firefox、Safari、Edge）
- 高德地图API Key

### 安装步骤

#### 1. 安装依赖

```bash
npm install
```

或使用yarn：

```bash
yarn install
```

#### 2. 配置高德地图API Key

编辑 `index-react.html` 文件，替换高德地图API Key：

```html
<script type="text/javascript">
  window._AMapSecurityConfig = {
    securityJsCode: 'YOUR_SECURITY_CODE', // 安全密钥
  }
</script>
<script type="text/javascript" src="https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY&plugin=AMap.Driving,AMap.Geolocation"></script>
```

**获取API Key步骤：**

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册并登录账号
3. 进入控制台 -> 应用管理 -> 我的应用
4. 创建新应用，添加Key
   - 选择 **Web端(JS API)**
   - 服务平台选择 **Web端(JS API)**
5. 复制Key和安全密钥，替换到配置中

#### 3. 启动开发服务器

```bash
npm run dev
```

或使用yarn：

```bash
yarn dev
```

应用将在 `http://localhost:3000` 启动，浏览器会自动打开。

#### 4. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

#### 5. 预览生产版本

```bash
npm run preview
```

## 📖 使用指南

### 1. 添加车辆

**单个添加：**
1. 在"实时追踪"标签下的控制面板
2. 输入车辆编号（必填）和车辆名称（可选）
3. 点击"添加车辆"按钮

**批量添加：**
1. 点击"批量添加"按钮
2. 输入要添加的车辆数量
3. 系统自动生成多辆车辆

**加载示例：**
- 点击"加载示例"按钮快速添加示例车辆

**导入数据：**
1. 点击"导入数据"按钮
2. 选择JSON格式的车辆数据文件
3. 系统自动导入所有车辆

### 2. 开始追踪

1. 在车辆列表中找到要追踪的车辆
2. 点击"开始追踪"按钮
3. 车辆会开始模拟移动，实时更新位置
4. 地图上会显示轨迹线
5. 可以同时追踪多辆车辆

### 3. 停止追踪

1. 在追踪中的车辆卡片上
2. 点击"停止追踪"按钮
3. 车辆停止移动，轨迹数据保留

### 4. 查看车辆详情

1. 点击车辆卡片选中车辆
2. 地图自动定位到该车辆
3. 卡片显示详细统计信息：
   - 总里程
   - 轨迹点数
   - 平均速度
   - 最高速度
   - 行驶时长

### 5. 轨迹回放

1. 切换到"历史轨迹"标签
2. 选择要回放的车辆
3. 选择回放速度（0.5x - 10x）
4. 点击"播放"按钮开始回放
5. 可以随时暂停或停止

### 6. 查看统计数据

1. 切换到"数据统计"标签
2. 查看总体统计数据
3. 查看里程排行榜
4. 查看速度排行榜
5. 查看车辆详细信息表

### 7. 地图控制

**定位车辆：**
- 点击地图右侧的 📍 按钮回到中心

**缩放地图：**
- 点击 ➕ 放大
- 点击 ➖ 缩小

**切换视图：**
- 点击 🌐 按钮在2D/3D视图间切换

**适应视图：**
- 点击 🎯 按钮让地图适应所有车辆

**全屏显示：**
- 点击 ⛶ 按钮进入全屏模式

### 8. 导出轨迹数据

1. 在"历史轨迹"标签中选择车辆
2. 点击"导出轨迹"按钮
3. 自动下载JSON格式的轨迹数据文件

数据格式示例：
```json
{
  "vehicleId": "BJ001",
  "vehicleName": "京A12345",
  "trackPoints": [
    {
      "lng": 116.397428,
      "lat": 39.90923,
      "timestamp": 1699000000000,
      "speed": 45.5
    }
  ],
  "totalDistance": 15230.5,
  "averageSpeed": 42.3,
  "maxSpeed": 78.9,
  "startTime": 1699000000000,
  "endTime": 1699010000000
}
```

## 🏗️ 项目结构

```
/
├── src/
│   ├── components/          # React组件
│   │   ├── Map/            # 地图相关组件
│   │   │   ├── MapContainer.jsx
│   │   │   ├── MapControls.jsx
│   │   │   └── *.css
│   │   ├── ControlPanel/   # 控制面板组件
│   │   │   ├── ControlPanel.jsx
│   │   │   └── *.css
│   │   ├── Vehicle/        # 车辆相关组件
│   │   │   ├── VehicleList.jsx
│   │   │   ├── VehicleItem.jsx
│   │   │   └── *.css
│   │   ├── Track/          # 轨迹相关组件
│   │   │   ├── TrackHistory.jsx
│   │   │   └── *.css
│   │   └── Statistics/     # 统计相关组件
│   │       ├── Statistics.jsx
│   │       └── *.css
│   ├── hooks/              # 自定义Hooks
│   │   ├── useAMap.js     # 地图Hook
│   │   └── useVehicleTracking.js  # 追踪Hook
│   ├── store/              # 状态管理
│   │   └── vehicleStore.js # 车辆状态Store
│   ├── utils/              # 工具函数
│   │   └── simulator.js   # 模拟工具
│   ├── styles/             # 全局样式
│   │   ├── index.css
│   │   └── App.css
│   ├── App.jsx             # 根组件
│   └── main.jsx            # 入口文件
├── index-react.html        # HTML模板
├── vite.config.js          # Vite配置
├── package-react.json      # 依赖配置
└── README-REACT.md         # 项目文档
```

## 🛠️ 技术栈

### 核心技术
- **React 18** - UI框架
- **Vite** - 构建工具
- **Zustand** - 状态管理
- **高德地图API 2.0** - 地图服务

### 开发工具
- **ESLint** - 代码检查
- **Dayjs** - 时间处理

### 样式方案
- **CSS Modules** - 组件样式隔离
- **原生CSS** - 灵活的样式控制

## 🎨 自定义配置

### 修改默认地图中心

编辑 `src/hooks/useAMap.js`：

```javascript
const defaultOptions = {
  zoom: 13,
  center: [116.397428, 39.90923], // [经度, 纬度]
  viewMode: '3D',
  pitch: 40
}
```

### 修改追踪更新频率

编辑 `src/hooks/useVehicleTracking.js`：

```javascript
intervalRef.current = setInterval(() => {
  // 更新逻辑
}, 2000) // 毫秒，2000 = 2秒
```

### 修改车辆颜色

编辑 `src/store/vehicleStore.js` 中的 `getRandomColor` 函数：

```javascript
function getRandomColor() {
  const colors = [
    '#FF5733', '#33FF57', '#3357FF', // 添加更多颜色
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
```

## 📦 核心功能实现

### 状态管理 (Zustand)

项目使用Zustand进行状态管理，主要状态包括：

- 车辆列表 (vehicles)
- 选中车辆 (selectedVehicleId)
- 地图实例 (mapInstance)

### 自定义Hooks

**useAMap** - 地图初始化和管理
```javascript
const { map, isMapReady } = useAMap('map-container', options)
```

**useVehicleMarker** - 车辆标记管理
```javascript
const marker = useVehicleMarker(map, vehicle)
```

**useTrackPolyline** - 轨迹线管理
```javascript
const polyline = useTrackPolyline(map, vehicle)
```

**useVehicleTracking** - 车辆追踪
```javascript
useVehicleTracking(vehicleId)
```

**useTrackPlayback** - 轨迹回放
```javascript
const { startPlayback, stopPlayback } = useTrackPlayback(vehicleId, trackPoints)
```

### 工具函数

所有工具函数位于 `src/utils/simulator.js`：

- `simulateVehicleMovement()` - 模拟车辆移动
- `generateSampleRoute()` - 生成示例路线
- `generateRandomRoute()` - 生成随机路线
- `calculateDistance()` - 计算距离
- `formatDistance()` - 格式化距离
- `formatSpeed()` - 格式化速度
- `formatDuration()` - 格式化时长

## 🔧 开发指南

### 添加新功能

1. **添加新组件**
   ```bash
   mkdir src/components/NewFeature
   touch src/components/NewFeature/NewFeature.jsx
   touch src/components/NewFeature/NewFeature.css
   ```

2. **添加新的状态**
   编辑 `src/store/vehicleStore.js`

3. **添加新的Hook**
   在 `src/hooks/` 目录创建新文件

4. **添加工具函数**
   在 `src/utils/` 目录添加

### 接入真实数据

编辑 `src/hooks/useVehicleTracking.js`，替换模拟数据为真实API：

```javascript
// 替换模拟逻辑
intervalRef.current = setInterval(async () => {
  // 调用真实API获取位置
  const response = await fetch(`/api/vehicles/${vehicleId}/location`)
  const data = await response.json()
  
  updateVehiclePosition(vehicleId, [data.lng, data.lat], data.speed)
}, 2000)
```

### WebSocket实时更新

在 `src/hooks/` 创建 `useWebSocket.js`：

```javascript
import { useEffect } from 'react'
import { useVehicleStore } from '../store/vehicleStore'

export const useWebSocket = (url) => {
  const updateVehiclePosition = useVehicleStore(state => state.updateVehiclePosition)
  
  useEffect(() => {
    const ws = new WebSocket(url)
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      updateVehiclePosition(data.vehicleId, [data.lng, data.lat], data.speed)
    }
    
    return () => ws.close()
  }, [url])
}
```

## 🐛 常见问题

### Q: 地图不显示？

A: 
1. 检查是否正确配置了API Key
2. 检查网络连接
3. 打开浏览器控制台查看错误信息
4. 确认API Key有访问权限

### Q: 车辆追踪不工作？

A:
1. 确保已添加车辆
2. 检查是否点击了"开始追踪"
3. 查看控制台是否有错误

### Q: 如何修改追踪速度？

A:
编辑 `src/hooks/useVehicleTracking.js` 中的 `setInterval` 时间参数

### Q: 如何支持更多车辆？

A:
项目支持任意数量车辆，但建议同时追踪不超过20辆以保持性能

### Q: 如何自定义地图样式？

A:
在高德地图控制台创建自定义地图样式，然后在 `useAMap` Hook中配置：

```javascript
const map = new window.AMap.Map(containerId, {
  ...defaultOptions,
  mapStyle: 'amap://styles/your-style-id'
})
```

## 🚀 性能优化

### 1. 轨迹点优化

当轨迹点过多时，可以进行抽稀：

```javascript
function simplifyTrack(points, tolerance = 0.0001) {
  // 实现Douglas-Peucker算法
  // 或使用第三方库如 simplify-js
}
```

### 2. 虚拟滚动

车辆列表过长时使用虚拟滚动：

```bash
npm install react-window
```

### 3. 懒加载

按需加载组件：

```javascript
import { lazy, Suspense } from 'react'

const Statistics = lazy(() => import('./components/Statistics/Statistics'))
```

## 📝 更新日志

### v1.0.0 (2024-10-25)
- ✅ 初始版本发布
- ✅ 完整的车辆管理功能
- ✅ 实时追踪和轨迹显示
- ✅ 轨迹回放功能
- ✅ 数据统计和分析
- ✅ 响应式设计

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

## 📄 许可证

MIT License

## 🔗 相关链接

- [高德开放平台](https://lbs.amap.com/)
- [高德地图JS API文档](https://lbs.amap.com/api/javascript-api/summary)
- [React官方文档](https://react.dev/)
- [Vite官方文档](https://vitejs.dev/)
- [Zustand文档](https://docs.pmnd.rs/zustand/)

---

**享受车辆追踪的乐趣！** 🚗💨
