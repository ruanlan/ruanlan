import { create } from 'zustand'

// 车辆数据存储
export const useVehicleStore = create((set, get) => ({
  // 车辆列表
  vehicles: [],
  
  // 选中的车辆ID
  selectedVehicleId: null,
  
  // 地图实例
  mapInstance: null,
  
  // 添加车辆
  addVehicle: (vehicle) => set((state) => {
    const exists = state.vehicles.find(v => v.id === vehicle.id)
    if (exists) {
      return state
    }
    return {
      vehicles: [...state.vehicles, {
        id: vehicle.id,
        name: vehicle.name || `车辆${vehicle.id}`,
        status: 'offline', // online, offline, tracking
        isTracking: false,
        currentPosition: vehicle.position || null,
        trackPoints: [],
        totalDistance: 0,
        averageSpeed: 0,
        maxSpeed: 0,
        startTime: null,
        endTime: null,
        color: vehicle.color || getRandomColor(),
        marker: null,
        polyline: null,
        ...vehicle
      }]
    }
  }),
  
  // 删除车辆
  removeVehicle: (vehicleId) => set((state) => ({
    vehicles: state.vehicles.filter(v => v.id !== vehicleId),
    selectedVehicleId: state.selectedVehicleId === vehicleId ? null : state.selectedVehicleId
  })),
  
  // 更新车辆信息
  updateVehicle: (vehicleId, updates) => set((state) => ({
    vehicles: state.vehicles.map(v => 
      v.id === vehicleId ? { ...v, ...updates } : v
    )
  })),
  
  // 更新车辆位置
  updateVehiclePosition: (vehicleId, position, speed = 0) => set((state) => {
    const vehicle = state.vehicles.find(v => v.id === vehicleId)
    if (!vehicle) return state
    
    const trackPoint = {
      lng: position[0],
      lat: position[1],
      timestamp: Date.now(),
      speed: speed
    }
    
    const newTrackPoints = [...vehicle.trackPoints, trackPoint]
    
    // 计算总里程
    let totalDistance = vehicle.totalDistance || 0
    if (vehicle.trackPoints.length > 0) {
      const lastPoint = vehicle.trackPoints[vehicle.trackPoints.length - 1]
      totalDistance += calculateDistance(
        [lastPoint.lng, lastPoint.lat],
        position
      )
    }
    
    // 计算平均速度和最大速度
    const speeds = newTrackPoints.map(p => p.speed).filter(s => s > 0)
    const averageSpeed = speeds.length > 0 
      ? speeds.reduce((a, b) => a + b, 0) / speeds.length 
      : 0
    const maxSpeed = speeds.length > 0 ? Math.max(...speeds) : 0
    
    return {
      vehicles: state.vehicles.map(v => 
        v.id === vehicleId 
          ? {
              ...v,
              currentPosition: position,
              trackPoints: newTrackPoints,
              totalDistance,
              averageSpeed,
              maxSpeed,
              status: 'online'
            }
          : v
      )
    }
  }),
  
  // 开始追踪
  startTracking: (vehicleId) => set((state) => ({
    vehicles: state.vehicles.map(v => 
      v.id === vehicleId 
        ? { 
            ...v, 
            isTracking: true, 
            status: 'tracking',
            startTime: Date.now()
          } 
        : v
    )
  })),
  
  // 停止追踪
  stopTracking: (vehicleId) => set((state) => ({
    vehicles: state.vehicles.map(v => 
      v.id === vehicleId 
        ? { 
            ...v, 
            isTracking: false, 
            status: 'online',
            endTime: Date.now()
          } 
        : v
    )
  })),
  
  // 清除轨迹
  clearTrack: (vehicleId) => set((state) => ({
    vehicles: state.vehicles.map(v => 
      v.id === vehicleId 
        ? {
            ...v,
            trackPoints: [],
            totalDistance: 0,
            averageSpeed: 0,
            maxSpeed: 0,
            startTime: null,
            endTime: null
          }
        : v
    )
  })),
  
  // 选择车辆
  selectVehicle: (vehicleId) => set({ selectedVehicleId: vehicleId }),
  
  // 设置地图实例
  setMapInstance: (map) => set({ mapInstance: map }),
  
  // 获取选中的车辆
  getSelectedVehicle: () => {
    const state = get()
    return state.vehicles.find(v => v.id === state.selectedVehicleId)
  },
  
  // 获取所有追踪中的车辆
  getTrackingVehicles: () => {
    return get().vehicles.filter(v => v.isTracking)
  }
}))

// 计算两点之间的距离（米）
function calculateDistance(point1, point2) {
  const R = 6371e3 // 地球半径（米）
  const φ1 = point1[1] * Math.PI / 180
  const φ2 = point2[1] * Math.PI / 180
  const Δφ = (point2[1] - point1[1]) * Math.PI / 180
  const Δλ = (point2[0] - point1[0]) * Math.PI / 180

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

  return R * c
}

// 生成随机颜色
function getRandomColor() {
  const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33F5',
    '#33FFF5', '#F5FF33', '#FF8C33', '#8C33FF',
    '#33FF8C', '#FF3385'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}
