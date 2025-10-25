# 🚗 高德地图车辆轨迹追踪系统

一个功能完整的车辆轨迹追踪和回放系统，基于高德地图 API 2.0开发。

**提供两个版本供选择：**
- 📦 **原生JavaScript版本** - 轻量级、零依赖
- ⭐ **React版本** - 现代化、功能完整（推荐）

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

---

## 🎯 项目特点

### 核心功能

✅ **车辆管理**
- 添加/删除车辆
- 批量操作
- 车辆信息编辑
- 多车辆同时管理

✅ **实时追踪**
- 实时位置更新
- 轨迹路径可视化
- 动态标记显示
- 支持多车辆同时追踪

✅ **轨迹回放**
- 历史轨迹回放
- 多级速度调节
- 播放控制
- 轨迹点详情

✅ **数据统计**
- 里程统计
- 速度分析
- 时长计算
- 排行榜展示

✅ **地图控制**
- 3D/2D视图切换
- 缩放控制
- 定位功能
- 全屏模式

✅ **数据管理**
- 轨迹导出
- 数据导入
- 本地存储

---

## 🚀 快速开始

### 选择适合你的版本

#### React版本（推荐） ⭐

**适合：** 生产环境、大型项目、团队协作

```bash
# 1. 安装依赖
npm install

# 2. 配置高德地图API Key（编辑 index.html）

# 3. 启动开发服务器
npm run dev

# 4. 访问 http://localhost:3000
```

**详细文档：** [README-REACT.md](./README-REACT.md)

**快速配置：** [SETUP-GUIDE-REACT.md](./SETUP-GUIDE-REACT.md)

---

#### 原生JavaScript版本

**适合：** 快速演示、学习、简单项目

```bash
# 1. 切换到原生版本
mv index.html index.html.react
mv index.html.original index.html

# 2. 配置高德地图API Key（编辑 index.html）

# 3. 启动HTTP服务器
python3 -m http.server 8000
# 或
npm run start

# 4. 访问 http://localhost:8000
```

**详细文档：** [README.md](./README.md)

---

## 📊 版本对比

| 特性 | 原生版本 | React版本 ⭐ |
|------|---------|------------|
| **技术栈** | HTML/CSS/JS | React + Vite + Zustand |
| **打包大小** | ~50KB | ~150KB (gzipped) |
| **启动时间** | 即时 | 快速 |
| **开发体验** | 简单 | 现代化 |
| **组件复用** | 较难 | 容易 |
| **状态管理** | 手动 | Zustand |
| **代码组织** | 单文件 | 模块化 |
| **热更新** | ❌ | ✅ |
| **类型检查** | ❌ | ✅ ESLint |
| **构建优化** | ❌ | ✅ Vite |
| **适用场景** | 演示/学习 | 生产环境 |

---

## 🎨 功能展示

### 实时追踪
- 🚗 多车辆同时追踪
- 📍 实时位置更新
- 🛣️ 轨迹路径可视化
- 📊 实时数据统计

### 轨迹回放
- ⏯️ 播放/暂停控制
- ⚡ 多级速度调节（0.5x - 10x）
- 📹 平滑动画效果
- 🔍 轨迹点详情查看

### 数据统计
- 📈 总里程统计
- 🚀 速度分析
- ⏱️ 时长计算
- 🏆 排行榜展示
- 📋 详细报表

### 地图操作
- 🌐 2D/3D视图切换
- 🔍 缩放控制
- 📍 车辆定位
- ⛶ 全屏模式
- 🎯 适应视图

---

## 📦 项目结构

```
amap-vehicle-tracking/
├── 📂 src/                    # React源代码（React版本）
│   ├── components/            # React组件
│   ├── hooks/                 # 自定义Hooks
│   ├── store/                 # 状态管理
│   ├── utils/                 # 工具函数
│   ├── styles/                # 样式文件
│   ├── constants/             # 配置常量
│   └── services/              # API服务
│
├── 📂 js/                     # JavaScript文件（原生版本）
│   ├── map.js
│   ├── vehicle.js
│   └── app.js
│
├── 📂 css/                    # 样式文件（原生版本）
│   └── style.css
│
├── 📄 index.html              # React版入口
├── 📄 index.html.original     # 原生版入口
│
├── 📄 package.json            # 依赖配置
├── 📄 vite.config.js          # Vite配置
│
├── 📖 README-REACT.md         # React版详细文档
├── 📖 SETUP-GUIDE-REACT.md    # React版快速配置
├── 📖 PROJECT_STRUCTURE.md    # 项目结构说明
└── 📖 README.md               # 原生版文档
```

**详细结构：** [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

---

## 🛠️ 技术栈

### React版本 ⭐

```
核心框架
├── React 18              # UI框架
├── Vite                  # 构建工具
└── Zustand              # 状态管理

开发工具
├── ESLint               # 代码检查
├── Dayjs                # 时间处理
└── CSS Modules          # 样式方案

地图服务
└── 高德地图 API 2.0     # 地图服务
```

### 原生版本

```
├── HTML5                # 结构
├── CSS3                 # 样式
├── JavaScript ES6+      # 逻辑
└── 高德地图 API 2.0     # 地图服务
```

---

## 🔧 配置说明

### 1. 获取高德地图API Key

1. 访问 [高德开放平台](https://lbs.amap.com/)
2. 注册并登录账号
3. 进入控制台 → 应用管理 → 我的应用
4. 创建新应用，添加Key
   - 选择 **Web端(JS API)**
5. 获取Key和安全密钥

### 2. 配置API Key

**React版本：** 编辑 `index.html`

```html
<script type="text/javascript">
  window._AMapSecurityConfig = {
    securityJsCode: 'YOUR_SECURITY_CODE'
  }
</script>
<script src="https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY"></script>
```

**原生版本：** 编辑 `index.html.original`（同上）

### 3. 环境变量（React版本）

复制 `.env.example` 为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 配置后端API地址等。

---

## 📖 文档索引

### React版本文档（推荐）

| 文档 | 描述 |
|------|------|
| [README-REACT.md](./README-REACT.md) | 完整的React版本使用文档 |
| [SETUP-GUIDE-REACT.md](./SETUP-GUIDE-REACT.md) | 3步快速配置指南 |

### 原生版本文档

| 文档 | 描述 |
|------|------|
| [README.md](./README.md) | 原生版本使用文档 |
| [QUICKSTART.md](./QUICKSTART.md) | 快速入门指南 |
| [API_SETUP_GUIDE.md](./API_SETUP_GUIDE.md) | API配置详细指南 |

### 通用文档

| 文档 | 描述 |
|------|------|
| [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) | 项目结构详解 |
| [CHANGELOG.md](./CHANGELOG.md) | 版本更新日志 |
| [LICENSE](./LICENSE) | MIT开源许可证 |

---

## 🎓 使用场景

### 1. 物流配送
- 配送车辆实时追踪
- 配送路线优化
- 配送时效统计

### 2. 出租车/网约车
- 车辆实时位置
- 行程轨迹记录
- 运营数据分析

### 3. 公交系统
- 公交车实时位置
- 到站时间预测
- 线路运营分析

### 4. 车队管理
- 企业车辆管理
- 行驶轨迹监控
- 油耗里程统计

### 5. 个人车辆
- 个人车辆追踪
- 行驶记录保存
- 里程统计分析

---

## 🔌 扩展功能

### 已实现功能

- ✅ 车辆管理
- ✅ 实时追踪
- ✅ 轨迹回放
- ✅ 数据统计
- ✅ 轨迹导出

### 可扩展功能

- 📱 移动端适配
- 🔔 实时告警
- 🚧 电子围栏
- 📊 数据报表
- 🗺️ 路径规划
- 🔥 轨迹热力图
- 📷 街景集成
- 🌡️ 环境数据
- 💾 数据库存储
- 👥 多用户系统

---

## 🤝 接入真实数据

### WebSocket实时数据

React版本提供WebSocket支持：

```javascript
import { createWebSocket } from './services/vehicleService'

const ws = createWebSocket(
  (data) => {
    // 处理实时数据
    updateVehiclePosition(data.vehicleId, [data.lng, data.lat], data.speed)
  },
  (error) => {
    console.error('WebSocket错误:', error)
  }
)
```

### REST API集成

```javascript
import { fetchVehicleLocation } from './services/vehicleService'

// 获取车辆位置
const location = await fetchVehicleLocation(vehicleId)
```

详见：`src/services/vehicleService.js`

---

## 💡 开发建议

### 选择React版本，如果你：

- ⭐ 开发生产项目
- ⭐ 需要复杂交互
- ⭐ 团队协作开发
- ⭐ 长期维护
- ⭐ 追求开发体验

### 选择原生版本，如果你：

- 📦 快速演示
- 📦 学习地图API
- 📦 不想安装依赖
- 📦 项目简单

---

## 🐛 常见问题

### Q: 地图不显示？

A: 
1. 检查API Key配置
2. 检查网络连接
3. 查看控制台错误
4. 确认API Key权限

### Q: 如何接入真实GPS数据？

A: 
- React版本：使用 `src/services/vehicleService.js`
- 原生版本：修改 `js/vehicle.js` 中的数据源

### Q: 支持多少车辆？

A: 
- 理论上无限制
- 建议同时追踪不超过20辆以保持性能
- 可通过分页优化

### Q: 可以商用吗？

A: 
- 本项目采用MIT协议，可自由使用
- 但需遵守高德地图的使用条款
- 商业使用需购买高德地图商业授权

---

## 📈 性能优化

### 轨迹点优化
- 轨迹点抽稀
- Douglas-Peucker算法

### 渲染优化
- 虚拟滚动
- 组件懒加载
- 防抖节流

### 数据优化
- 数据分页
- 增量更新
- 缓存策略

---

## 🌟 Star History

如果这个项目对你有帮助，欢迎给个Star！⭐

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 许可证

[MIT License](./LICENSE)

---

## 🔗 相关链接

- [高德开放平台](https://lbs.amap.com/)
- [高德地图JS API](https://lbs.amap.com/api/javascript-api/summary)
- [React文档](https://react.dev/)
- [Vite文档](https://vitejs.dev/)
- [Zustand文档](https://docs.pmnd.rs/zustand/)

---

## 👨‍💻 作者

Created with ❤️ for vehicle tracking enthusiasts

---

## 📮 反馈

有任何问题或建议，欢迎提Issue或联系我们！

---

**选择你的版本，开始车辆追踪之旅！** 🚗💨

**推荐使用 React 版本以获得最佳开发体验！** ⭐
