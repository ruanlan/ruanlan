export interface TrackPoint {
  lng: number;
  lat: number;
  timestamp?: string;
  speed?: number; // km/h
}

export interface VehicleTrack {
  id: string;
  name: string;
  vehicleType?: string;
  description?: string;
  points: TrackPoint[];
}

const sampleTrack: VehicleTrack = {
  id: 'vehicle-001',
  name: '沪A12345 早间配送任务',
  vehicleType: '新能源厢式货车',
  description:
    '样例数据模拟了车辆在上海陆家嘴附近的配送轨迹，数据包含了时间、速度等信息，方便快速体验地图轨迹播放功能。',
  points: [
    { lng: 121.4805, lat: 31.2359, timestamp: '2024-10-01T08:30:00+08:00', speed: 0 },
    { lng: 121.4841, lat: 31.2316, timestamp: '2024-10-01T08:32:00+08:00', speed: 28 },
    { lng: 121.4897, lat: 31.229, timestamp: '2024-10-01T08:34:00+08:00', speed: 35 },
    { lng: 121.4952, lat: 31.2265, timestamp: '2024-10-01T08:36:00+08:00', speed: 32 },
    { lng: 121.5008, lat: 31.225, timestamp: '2024-10-01T08:38:00+08:00', speed: 40 },
    { lng: 121.5063, lat: 31.2241, timestamp: '2024-10-01T08:40:00+08:00', speed: 36 },
    { lng: 121.512, lat: 31.2238, timestamp: '2024-10-01T08:42:00+08:00', speed: 38 },
    { lng: 121.5176, lat: 31.2247, timestamp: '2024-10-01T08:44:00+08:00', speed: 34 },
    { lng: 121.5221, lat: 31.2265, timestamp: '2024-10-01T08:46:00+08:00', speed: 30 },
    { lng: 121.5265, lat: 31.2287, timestamp: '2024-10-01T08:48:00+08:00', speed: 24 },
    { lng: 121.5309, lat: 31.2312, timestamp: '2024-10-01T08:50:00+08:00', speed: 20 },
    { lng: 121.5342, lat: 31.2339, timestamp: '2024-10-01T08:52:00+08:00', speed: 18 },
    { lng: 121.5368, lat: 31.2365, timestamp: '2024-10-01T08:54:00+08:00', speed: 12 },
    { lng: 121.538, lat: 31.2392, timestamp: '2024-10-01T08:56:00+08:00', speed: 8 },
    { lng: 121.5385, lat: 31.2415, timestamp: '2024-10-01T08:58:00+08:00', speed: 0 },
  ],
};

export default sampleTrack;
