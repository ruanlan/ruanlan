// 应用配置
export const APP_CONFIG = {
  // 应用信息
  APP_NAME: '高德地图车辆轨迹追踪系统',
  VERSION: '1.0.0',
  
  // 地图配置
  MAP: {
    DEFAULT_CENTER: [116.397428, 39.90923], // 北京
    DEFAULT_ZOOM: 13,
    VIEW_MODE: '3D',
    PITCH: 40,
    ROTATION: 0,
  },
  
  // 追踪配置
  TRACKING: {
    UPDATE_INTERVAL: 2000, // 更新间隔（毫秒）
    MAX_TRACK_POINTS: 1000, // 最大轨迹点数
    AUTO_STOP_POINTS: 100, // 自动停止点数
  },
  
  // 回放配置
  PLAYBACK: {
    DEFAULT_SPEED: 500, // 默认回放速度（毫秒）
    SPEEDS: [
      { label: '0.5x', value: 2000 },
      { label: '1x', value: 1000 },
      { label: '2x', value: 500 },
      { label: '4x', value: 250 },
      { label: '10x', value: 100 },
    ],
  },
  
  // 车辆配置
  VEHICLE: {
    COLORS: [
      '#FF5733', '#33FF57', '#3357FF', '#FF33F5',
      '#33FFF5', '#F5FF33', '#FF8C33', '#8C33FF',
      '#33FF8C', '#FF3385'
    ],
  },
  
  // 统计配置
  STATS: {
    TOP_VEHICLES_COUNT: 5, // 排行榜显示数量
  },
}

// 高德地图API配置（请在index.html中配置）
export const AMAP_CONFIG = {
  // key: 'YOUR_AMAP_KEY',
  // securityJsCode: 'YOUR_SECURITY_CODE',
  version: '2.0',
  plugins: ['AMap.Driving', 'AMap.Geolocation'],
}

// 本地存储键名
export const STORAGE_KEYS = {
  VEHICLES: 'amap_vehicles',
  SETTINGS: 'amap_settings',
  TRACK_HISTORY: 'amap_track_history',
}
