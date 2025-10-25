// 车辆移动模拟工具

// 模拟车辆移动
export function simulateVehicleMovement(currentPosition) {
  const [lng, lat] = currentPosition
  
  // 生成随机偏移（模拟真实移动）
  const offsetLng = (Math.random() - 0.5) * 0.002
  const offsetLat = (Math.random() - 0.5) * 0.002
  
  return [lng + offsetLng, lat + offsetLat]
}

// 生成示例路线
export function generateSampleRoute(startPosition, pointCount = 50) {
  const route = []
  let [lng, lat] = startPosition
  
  for (let i = 0; i < pointCount; i++) {
    route.push({
      lng,
      lat,
      timestamp: Date.now() + i * 2000,
      speed: 40 + Math.random() * 40
    })
    
    // 模拟沿着某个方向移动
    const angle = (i / pointCount) * Math.PI * 2
    lng += Math.cos(angle) * 0.001 + (Math.random() - 0.5) * 0.0005
    lat += Math.sin(angle) * 0.001 + (Math.random() - 0.5) * 0.0005
  }
  
  return route
}

// 生成随机路线
export function generateRandomRoute(center, radius = 0.05, pointCount = 30) {
  const route = []
  const [centerLng, centerLat] = center
  
  for (let i = 0; i < pointCount; i++) {
    const angle = Math.random() * Math.PI * 2
    const distance = Math.random() * radius
    
    const lng = centerLng + distance * Math.cos(angle)
    const lat = centerLat + distance * Math.sin(angle)
    
    route.push({
      lng,
      lat,
      timestamp: Date.now() + i * 3000,
      speed: 30 + Math.random() * 50
    })
  }
  
  return route
}

// 沿道路生成路线（需要高德API）
export async function generateRouteAlongRoad(map, startPoint, endPoint) {
  if (!window.AMap || !map) {
    console.error('高德地图API未加载')
    return []
  }
  
  return new Promise((resolve, reject) => {
    const driving = new window.AMap.Driving({
      map: map,
      panel: null
    })
    
    driving.search(startPoint, endPoint, (status, result) => {
      if (status === 'complete') {
        const route = result.routes[0]
        const steps = route.steps
        const trackPoints = []
        
        steps.forEach((step) => {
          const path = step.path
          path.forEach((point) => {
            trackPoints.push({
              lng: point.lng,
              lat: point.lat,
              timestamp: Date.now() + trackPoints.length * 1000,
              speed: 40 + Math.random() * 20
            })
          })
        })
        
        resolve(trackPoints)
      } else {
        reject(new Error('路线规划失败'))
      }
    })
  })
}

// 平滑轨迹点
export function smoothTrackPoints(points, windowSize = 3) {
  if (points.length < windowSize) return points
  
  const smoothed = []
  const halfWindow = Math.floor(windowSize / 2)
  
  for (let i = 0; i < points.length; i++) {
    const start = Math.max(0, i - halfWindow)
    const end = Math.min(points.length, i + halfWindow + 1)
    const window = points.slice(start, end)
    
    const avgLng = window.reduce((sum, p) => sum + p.lng, 0) / window.length
    const avgLat = window.reduce((sum, p) => sum + p.lat, 0) / window.length
    
    smoothed.push({
      ...points[i],
      lng: avgLng,
      lat: avgLat
    })
  }
  
  return smoothed
}

// 计算距离（米）
export function calculateDistance(point1, point2) {
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

// 计算总里程
export function calculateTotalDistance(trackPoints) {
  let total = 0
  for (let i = 1; i < trackPoints.length; i++) {
    const p1 = [trackPoints[i-1].lng, trackPoints[i-1].lat]
    const p2 = [trackPoints[i].lng, trackPoints[i].lat]
    total += calculateDistance(p1, p2)
  }
  return total
}

// 计算平均速度
export function calculateAverageSpeed(trackPoints) {
  if (trackPoints.length === 0) return 0
  const speeds = trackPoints.map(p => p.speed).filter(s => s > 0)
  if (speeds.length === 0) return 0
  return speeds.reduce((a, b) => a + b, 0) / speeds.length
}

// 格式化距离
export function formatDistance(meters) {
  if (meters < 1000) {
    return `${meters.toFixed(0)} 米`
  }
  return `${(meters / 1000).toFixed(2)} 公里`
}

// 格式化速度
export function formatSpeed(kmh) {
  return `${kmh.toFixed(1)} km/h`
}

// 格式化时长
export function formatDuration(milliseconds) {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  
  if (hours > 0) {
    return `${hours}小时${minutes % 60}分钟`
  } else if (minutes > 0) {
    return `${minutes}分钟${seconds % 60}秒`
  } else {
    return `${seconds}秒`
  }
}
