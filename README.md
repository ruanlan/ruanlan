# 高德地图车辆轨迹演示项目

该项目基于 [Vite](https://vitejs.dev/) + [React](https://react.dev/) + TypeScript 构建，展示了如何在网页中集成高德地图 JavaScript API，实现车辆轨迹的绘制与回放。内置了示例轨迹数据，可直接运行查看效果，实际使用时只需替换为自己的实时数据即可。

## 功能特性

- 使用高德地图 Web JSAPI 2.0 绘制车辆行驶路线
- 自动加载轨迹起终点标记、路径方向箭头与车辆自定义图标
- 支持轨迹回放、暂停、继续、重新播放等操作
- 统计展示总里程、行驶时间、平均/最高速度等关键指标
- 响应式布局，桌面与移动端均可良好展示

## 快速开始

1. **安装依赖**

   ```bash
   npm install
   ```

2. **配置高德地图 Key**

   - 复制 `.env.example` 为 `.env`
   - 将 `YOUR_AMAP_WEB_KEY` 替换为你在高德开放平台申请的 Web JSAPI Key

   ```bash
   cp .env.example .env
   # 编辑 .env 并填写自己的 Key
   ```

3. **启动开发服务器**

   ```bash
   npm run dev
   ```

   打开终端输出的地址（默认 `http://127.0.0.1:5173/`）即可看到车辆轨迹演示效果。

## 项目结构

```
├── public/
│   └── car.svg             # 车辆移动标记图标
├── src/
│   ├── components/
│   │   └── VehicleTrackMap.tsx  # 地图组件，负责渲染及控制轨迹
│   ├── data/
│   │   └── sampleTrack.ts       # 示例轨迹数据
│   ├── utils/
│   │   ├── loadAmap.ts          # 高德地图 SDK 动态加载工具
│   │   └── trackMetrics.ts      # 轨迹统计指标计算方法
│   ├── App.tsx
│   ├── App.css
│   ├── main.tsx
│   └── index.css
├── .env.example
├── index.html
├── package.json
└── vite.config.ts
```

## 自定义轨迹数据

- 将 `src/data/sampleTrack.ts` 中的坐标替换为自己的轨迹数据即可。
- `lng` / `lat` 使用高德地图（GCJ-02）坐标。
- 可按需补充 `timestamp` 与 `speed` 字段，以便统计行驶时长、均速等指标。

## 常见问题

1. **页面提示未检测到 Key**
   - 请确认 `.env` 文件存在且填写了有效的 `VITE_AMAP_KEY`
   - 修改 `.env` 后需重新启动 `npm run dev`

2. **地图加载失败**
   - 检查网络是否能够访问 `https://webapi.amap.com`
   - 确认浏览器 Console 中无报错，必要时排查是否超出 Key 的使用配额

## 许可

此项目为示例工程，可自由修改并用于学习或集成参考。请遵守高德开放平台的使用条款和配额限制。
