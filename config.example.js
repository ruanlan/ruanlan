// 配置示例文件
// 复制此文件为 config.js 并填入你的配置

const config = {
    // 高德地图 API Key
    amapKey: 'YOUR_AMAP_KEY',
    
    // 默认地图中心点 [经度, 纬度]
    defaultCenter: [116.397428, 39.90923],
    
    // 默认缩放级别
    defaultZoom: 13,
    
    // 追踪更新间隔（毫秒）
    trackingInterval: 2000,
    
    // 回放速度（毫秒）
    playbackInterval: 500,
    
    // 默认车辆速度（km/h）
    defaultSpeed: 60,
    
    // 地图样式
    mapStyle: 'amap://styles/normal', // normal, dark, light, whitesmoke, fresh, grey, graffiti, macaron, blue, darkblue, wine
    
    // 轨迹线颜色
    pathColor: '#667eea',
    
    // 轨迹线宽度
    pathWidth: 6
};

// 如果在 Node.js 环境
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
}
