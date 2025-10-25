export const DEFAULT_MAP_CENTER = [116.397428, 39.90923];

export const DEFAULT_MAP_ZOOM = 13;

export const TRACKING_UPDATE_INTERVAL = 2000;

export const PLAYBACK_SPEED_OPTIONS = [
  { label: '0.5x', value: 2000 },
  { label: '1x', value: 1000 },
  { label: '2x', value: 500 },
  { label: '4x', value: 250 },
  { label: '8x', value: 125 },
];

export const VEHICLE_STATUS = {
  IDLE: 'idle',
  TRACKING: 'tracking',
  STOPPED: 'stopped',
  OFFLINE: 'offline',
};

export const VEHICLE_STATUS_COLORS = {
  [VEHICLE_STATUS.IDLE]: '#d9d9d9',
  [VEHICLE_STATUS.TRACKING]: '#52c41a',
  [VEHICLE_STATUS.STOPPED]: '#faad14',
  [VEHICLE_STATUS.OFFLINE]: '#f5222d',
};

export const VEHICLE_STATUS_TEXT = {
  [VEHICLE_STATUS.IDLE]: '待命中',
  [VEHICLE_STATUS.TRACKING]: '追踪中',
  [VEHICLE_STATUS.STOPPED]: '已停止',
  [VEHICLE_STATUS.OFFLINE]: '离线',
};

export const SAMPLE_ROUTES = {
  beijing_downtown: {
    name: '北京市区路线',
    points: [
      { lng: 116.397428, lat: 39.90923, speed: 45 },
      { lng: 116.398428, lat: 39.91023, speed: 42 },
      { lng: 116.400428, lat: 39.91223, speed: 38 },
      { lng: 116.403428, lat: 39.91423, speed: 35 },
      { lng: 116.406428, lat: 39.91523, speed: 40 },
      { lng: 116.409428, lat: 39.91623, speed: 48 },
      { lng: 116.412428, lat: 39.91823, speed: 52 },
      { lng: 116.415428, lat: 39.92023, speed: 46 },
      { lng: 116.418428, lat: 39.92223, speed: 43 },
      { lng: 116.421428, lat: 39.92423, speed: 39 },
    ],
  },
  shanghai_bund: {
    name: '上海外滩路线',
    points: [
      { lng: 121.480237, lat: 31.236034, speed: 38 },
      { lng: 121.481237, lat: 31.237034, speed: 35 },
      { lng: 121.482537, lat: 31.238534, speed: 32 },
      { lng: 121.484237, lat: 31.240034, speed: 36 },
      { lng: 121.486237, lat: 31.241534, speed: 40 },
      { lng: 121.488237, lat: 31.243034, speed: 44 },
      { lng: 121.490237, lat: 31.244534, speed: 41 },
      { lng: 121.492237, lat: 31.246034, speed: 38 },
    ],
  },
  guangzhou_tower: {
    name: '广州塔周边路线',
    points: [
      { lng: 113.319095, lat: 23.108344, speed: 42 },
      { lng: 113.320095, lat: 23.109344, speed: 45 },
      { lng: 113.321595, lat: 23.110844, speed: 48 },
      { lng: 113.323095, lat: 23.112344, speed: 50 },
      { lng: 113.324595, lat: 23.113844, speed: 47 },
      { lng: 113.326095, lat: 23.115344, speed: 44 },
      { lng: 113.327595, lat: 23.116844, speed: 41 },
    ],
  },
};

export const MAP_STYLES = [
  { label: '标准', value: 'normal' },
  { label: '卫星', value: 'satellite' },
  { label: '暗色', value: 'dark' },
  { label: '亮色', value: 'light' },
];

export const ALERT_TYPES = {
  SPEED: 'speed',
  GEOFENCE: 'geofence',
  OFFLINE: 'offline',
  LOW_BATTERY: 'low_battery',
};

export const SPEED_LIMITS = {
  HIGHWAY: 120,
  URBAN: 60,
  SCHOOL_ZONE: 30,
};
