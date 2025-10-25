# 快速参考手册

## 🚀 5分钟快速上手

### 1. 安装并启动

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 2. 配置 API Key

编辑 `index-react.html`，替换 `YOUR_AMAP_KEY`

### 3. 开始使用

1. 添加车辆 → 输入车牌号 → 点击"添加车辆"
2. 开始追踪 → 点击"开始追踪"按钮
3. 查看统计 → 切换到"统计信息"标签页

## 📝 常用命令

```bash
# 开发
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run preview      # 预览生产构建
npm run lint         # 代码检查

# 脚本
./start-react.sh     # Linux/Mac 启动脚本
start-react.bat      # Windows 启动脚本
```

## 🎯 快捷键

| 快捷键 | 功能 |
|--------|------|
| `Ctrl/Cmd + B` | 折叠/展开侧边栏 |
| `Ctrl/Cmd + 1` | 切换到控制面板 |
| `Ctrl/Cmd + 2` | 切换到统计信息 |
| `Ctrl/Cmd + 3` | 切换到车辆列表 |
| `Space` | 暂停/继续回放 |
| `Esc` | 关闭对话框 |

## 📂 项目结构速查

```
src/
├── components/      # React组件
├── hooks/          # 自定义Hooks
├── store/          # 状态管理
├── services/       # API服务
├── utils/          # 工具函数
└── constants/      # 常量配置
```

## 🔧 核心API

### VehicleStore

```javascript
import useVehicleStore from '@/store/vehicleStore';

const {
  vehicles,              // 车辆列表
  selectedVehicleId,     // 选中车辆ID
  addVehicle,            // 添加车辆
  selectVehicle,         // 选择车辆
  startTracking,         // 开始追踪
  stopTracking,          // 停止追踪
  addTrackPoint,         // 添加轨迹点
  clearTrack,            // 清除轨迹
} = useVehicleStore();
```

### MapUtils

```javascript
import { 
  calculateDistance,     // 计算距离
  formatDistance,        // 格式化距离
  calculateAverageSpeed, // 计算平均速度
  formatSpeed,           // 格式化速度
  generateRandomRoute,   // 生成随机路线
} from '@/utils/mapUtils';
```

### TrackingService

```javascript
import trackingService from '@/services/trackingService';

// 开始模拟追踪
trackingService.startSimulation(vehicleId, position, callback);

// 停止模拟
trackingService.stopSimulation(vehicleId);

// 获取当前位置
const position = await trackingService.getCurrentLocation();
```

## 🎨 样式变量

```javascript
// 主题色
colorPrimary: '#1890ff'

// 状态色
idle: '#d9d9d9'      // 待命
tracking: '#52c41a'  // 追踪中
stopped: '#faad14'   // 已停止
offline: '#f5222d'   // 离线
```

## 📊 数据格式

### 车辆对象

```javascript
{
  id: string,              // 车辆ID
  vehicleNumber: string,   // 车牌号
  vehicleName: string,     // 车辆名称
  trackData: Array,        // 轨迹数据
  currentPosition: Object, // 当前位置
  totalDistance: number,   // 总里程(km)
  averageSpeed: number,    // 平均速度(km/h)
  isTracking: boolean,     // 是否追踪中
  lastUpdateTime: number,  // 最后更新时间
}
```

### 轨迹点对象

```javascript
{
  lng: number,        // 经度
  lat: number,        // 纬度
  speed: number,      // 速度(km/h)
  timestamp: number,  // 时间戳(ms)
  altitude: number,   // 海拔(m)
}
```

## 🔍 常见问题速查

### Q: 地图不显示？
**A:** 检查 API Key 配置 → 查看控制台错误 → 确认网络连接

### Q: 追踪不工作？
**A:** 确保已添加车辆 → 检查车辆是否选中 → 查看控制台日志

### Q: 数据导出失败？
**A:** 确保有轨迹数据 → 检查浏览器下载设置 → 尝试其他格式

### Q: 回放速度太快/太慢？
**A:** 使用速度选择器调整 → 支持0.5x到8x速度

### Q: 如何接入真实数据？
**A:** 修改 `trackingService.js` → 替换模拟函数为真实API

## 🌐 浏览器兼容性

| 浏览器 | 版本要求 | 支持情况 |
|--------|---------|---------|
| Chrome | ≥ 90 | ✅ 完全支持 |
| Firefox | ≥ 88 | ✅ 完全支持 |
| Safari | ≥ 14 | ✅ 完全支持 |
| Edge | ≥ 90 | ✅ 完全支持 |

## 📱 响应式断点

```javascript
// 移动端
mobile: < 768px

// 平板
tablet: 768px - 1024px

// 桌面
desktop: > 1024px
```

## 🔗 有用的链接

- [高德地图开放平台](https://lbs.amap.com/)
- [高德地图API文档](https://lbs.amap.com/api/javascript-api/summary)
- [React 官方文档](https://react.dev/)
- [Ant Design 官网](https://ant.design/)
- [Vite 官方文档](https://vitejs.dev/)
- [Zustand 文档](https://github.com/pmndrs/zustand)

## 💻 环境变量

```bash
# .env.local
VITE_AMAP_KEY=your_key_here
VITE_AMAP_SECURITY_CODE=your_code_here
VITE_PORT=3000
VITE_API_BASE_URL=http://localhost:8080
```

## 🎯 性能优化提示

1. **大量轨迹点**
   ```javascript
   // 使用轨迹点抽稀
   const simplified = smoothPath(points, 0.0001);
   ```

2. **地图性能**
   ```javascript
   // 减少标记数量
   // 使用聚合标记
   // 按需加载数据
   ```

3. **状态更新**
   ```javascript
   // 避免不必要的重渲染
   // 使用 React.memo
   // 优化依赖数组
   ```

## 🛠️ 调试技巧

### 启用调试模式

```javascript
// src/constants/index.js
export const DEBUG_MODE = true;
```

### 查看状态

```javascript
// 在浏览器控制台
window.vehicleStore = useVehicleStore.getState();
console.log(window.vehicleStore);
```

### 清除本地存储

```javascript
// 在浏览器控制台
localStorage.clear();
location.reload();
```

## 📦 依赖版本

```json
{
  "react": "^18.2.0",
  "antd": "^5.11.0",
  "zustand": "^4.4.6",
  "vite": "^5.0.0"
}
```

## 🎨 自定义主题

```javascript
// src/App.jsx
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#1890ff',  // 主色
      borderRadius: 4,          // 圆角
      fontSize: 14,             // 字体大小
    },
  }}
>
```

## 📋 代码片段

### 添加自定义路线

```javascript
// src/constants/index.js
export const SAMPLE_ROUTES = {
  my_route: {
    name: '我的路线',
    points: [
      { lng: 116.397428, lat: 39.90923, speed: 45 },
      // 更多点...
    ],
  },
};
```

### 自定义追踪间隔

```javascript
// src/constants/index.js
export const TRACKING_UPDATE_INTERVAL = 3000; // 3秒
```

### 自定义地图样式

```javascript
// src/components/MapView.jsx
mapStyle: 'amap://styles/your-style-id'
```

## 🚨 错误代码

| 代码 | 说明 | 解决方案 |
|------|------|---------|
| 10000 | Key不正确 | 检查API Key配置 |
| 10001 | Key不存在 | 重新申请Key |
| 10002 | Key过期 | 续费或申请新Key |
| 10003 | Key无权限 | 检查服务权限设置 |

## 📞 获取帮助

1. 查看项目文档
2. 搜索已有Issue
3. 提交新Issue
4. 联系维护者

---

**快速参考手册结束** 📖

**需要更多帮助？查看完整文档: README-REACT.md**
