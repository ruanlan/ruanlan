# 高德地图车辆轨迹追踪系统

一个基于高德地图 API 的车辆轨迹追踪和回放系统，支持实时追踪、轨迹回放、路线模拟等功能。

## 功能特性

### 🚗 车辆追踪
- 实时车辆位置追踪
- 轨迹路径可视化
- 车辆标记动态更新

### 📊 数据统计
- 总里程计算
- 轨迹点数统计
- 平均速度计算
- 实时状态显示

### 🎬 轨迹回放
- 支持历史轨迹回放
- 可暂停/继续回放
- 回放速度可调

### 🗺️ 地图功能
- 高德地图 3D 视图
- 地图中心定位
- 全屏模式
- 自适应视图

### 📍 路线模拟
- 加载示例路线
- 生成随机路线
- 模拟实时追踪

## 快速开始

### 前置要求
- 现代浏览器（Chrome、Firefox、Safari、Edge）
- 高德地图 API Key

### 安装步骤

1. **克隆项目**
   ```bash
   git clone <repository-url>
   cd amap-vehicle-tracking
   ```

2. **配置 API Key**
   
   编辑 `index.html` 文件，替换高德地图 API Key：
   ```html
   <script type="text/javascript" src="https://webapi.amap.com/maps?v=2.0&key=YOUR_AMAP_KEY"></script>
   ```
   
   将 `YOUR_AMAP_KEY` 替换为你的高德地图 API Key。
   
   **如何获取 API Key：**
   - 访问 [高德开放平台](https://lbs.amap.com/)
   - 注册并登录账号
   - 进入控制台 -> 应用管理 -> 我的应用
   - 创建新应用，添加 Key（选择 Web 端 JS API）
   - 复制 Key 并替换到项目中

3. **启动项目**
   
   使用任意 HTTP 服务器启动项目，例如：
   
   **使用 Python:**
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   **使用 Node.js (http-server):**
   ```bash
   npm install -g http-server
   http-server -p 8000
   ```
   
   **使用 PHP:**
   ```bash
   php -S localhost:8000
   ```

4. **访问应用**
   
   打开浏览器访问: `http://localhost:8000`

## 使用说明

### 基本操作

1. **开始追踪**
   - 输入车辆编号和名称（可选）
   - 点击"开始追踪"按钮
   - 系统将模拟车辆移动并显示轨迹

2. **停止追踪**
   - 点击"停止追踪"按钮停止实时追踪
   - 已记录的轨迹数据将保留

3. **清除轨迹**
   - 点击"清除轨迹"按钮
   - 确认后将清除所有轨迹数据和地图标记

4. **轨迹回放**
   - 确保已有轨迹数据
   - 点击"轨迹回放"开始播放
   - 点击"暂停回放"可暂停播放

5. **加载示例路线**
   - 点击"加载示例路线"加载预设路线
   - 系统将显示完整的示例轨迹

6. **生成随机路线**
   - 点击"生成随机路线"创建随机轨迹
   - 用于测试和演示

### 地图控制

- **回到中心** (📍): 将地图视图移动到当前车辆位置
- **全屏** (⛶): 切换地图全屏模式

## 项目结构

```
amap-vehicle-tracking/
├── index.html          # 主页面
├── css/
│   └── style.css       # 样式文件
├── js/
│   ├── map.js          # 地图管理类
│   ├── vehicle.js      # 车辆追踪类
│   └── app.js          # 应用主逻辑
└── README.md           # 项目文档
```

## 技术栈

- **前端框架**: 原生 JavaScript (ES6+)
- **地图服务**: 高德地图 JavaScript API 2.0
- **样式**: CSS3 + Flexbox
- **架构**: 面向对象编程 (OOP)

## 核心类说明

### MapManager
地图管理类，负责地图初始化、轨迹绘制、标记管理等。

主要方法：
- `initMap()`: 初始化地图
- `addPathPoint(lng, lat, timestamp, speed)`: 添加轨迹点
- `updatePolyline()`: 更新轨迹线
- `clearTrack()`: 清除轨迹
- `getTotalDistance()`: 计算总里程

### VehicleTracker
车辆追踪类，负责车辆追踪、数据记录、轨迹回放等。

主要方法：
- `startTracking(vehicleId, vehicleName)`: 开始追踪
- `stopTracking()`: 停止追踪
- `startPlayback()`: 开始回放
- `loadSampleRoute()`: 加载示例路线
- `generateRandomRoute()`: 生成随机路线

## 自定义配置

### 修改默认地图中心
编辑 `js/map.js`：
```javascript
this.defaultCenter = [116.397428, 39.90923]; // [经度, 纬度]
```

### 修改追踪更新频率
编辑 `js/vehicle.js`：
```javascript
this.trackingInterval = setInterval(() => {
    // ...
}, 2000); // 毫秒，2000 = 2秒
```

### 修改回放速度
编辑 `js/vehicle.js`：
```javascript
this.playbackInterval = setInterval(() => {
    // ...
}, 500); // 毫秒，500 = 0.5秒
```

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 注意事项

1. **API Key 配置**：必须配置有效的高德地图 API Key 才能正常使用
2. **HTTPS 要求**：某些浏览器可能要求在 HTTPS 环境下使用地图服务
3. **跨域问题**：建议使用 HTTP 服务器运行，不要直接打开 HTML 文件
4. **浏览器控制台**：建议打开浏览器开发者工具查看详细日志

## 常见问题

### Q: 地图不显示怎么办？
A: 
1. 检查是否正确配置了 API Key
2. 检查网络连接是否正常
3. 打开浏览器控制台查看错误信息
4. 确认 API Key 是否有访问权限

### Q: 如何接入真实的车辆数据？
A: 修改 `js/vehicle.js` 中的 `simulateTracking` 方法，替换为实际的数据接口调用。

### Q: 如何保存轨迹数据？
A: 可以将 `vehicleTracker.getCurrentTrackData()` 的数据保存到本地存储或后端服务器。

## 扩展功能建议

- [ ] 支持多车辆同时追踪
- [ ] 轨迹数据导入导出
- [ ] 历史轨迹查询
- [ ] 电子围栏告警
- [ ] 实时速度监控
- [ ] 轨迹热力图
- [ ] 路径规划
- [ ] 数据持久化存储

## 许可证

MIT License

## 联系方式

如有问题或建议，欢迎提交 Issue 或 Pull Request。

---

**享受车辆追踪的乐趣！** 🚗💨
