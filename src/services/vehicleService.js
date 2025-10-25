// 车辆数据服务
// 用于与后端API交互

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'

/**
 * 获取所有车辆
 */
export async function fetchVehicles() {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles`)
    if (!response.ok) throw new Error('获取车辆列表失败')
    return await response.json()
  } catch (error) {
    console.error('获取车辆列表失败:', error)
    return []
  }
}

/**
 * 获取单个车辆信息
 */
export async function fetchVehicle(vehicleId) {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`)
    if (!response.ok) throw new Error('获取车辆信息失败')
    return await response.json()
  } catch (error) {
    console.error('获取车辆信息失败:', error)
    return null
  }
}

/**
 * 获取车辆实时位置
 */
export async function fetchVehicleLocation(vehicleId) {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/location`)
    if (!response.ok) throw new Error('获取位置失败')
    return await response.json()
  } catch (error) {
    console.error('获取位置失败:', error)
    return null
  }
}

/**
 * 获取车辆历史轨迹
 */
export async function fetchVehicleTrack(vehicleId, startTime, endTime) {
  try {
    const params = new URLSearchParams({
      startTime: startTime || '',
      endTime: endTime || ''
    })
    const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/track?${params}`)
    if (!response.ok) throw new Error('获取轨迹失败')
    return await response.json()
  } catch (error) {
    console.error('获取轨迹失败:', error)
    return []
  }
}

/**
 * 添加车辆
 */
export async function addVehicle(vehicleData) {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicleData)
    })
    if (!response.ok) throw new Error('添加车辆失败')
    return await response.json()
  } catch (error) {
    console.error('添加车辆失败:', error)
    return null
  }
}

/**
 * 更新车辆信息
 */
export async function updateVehicle(vehicleId, vehicleData) {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(vehicleData)
    })
    if (!response.ok) throw new Error('更新车辆失败')
    return await response.json()
  } catch (error) {
    console.error('更新车辆失败:', error)
    return null
  }
}

/**
 * 删除车辆
 */
export async function deleteVehicle(vehicleId) {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error('删除车辆失败')
    return true
  } catch (error) {
    console.error('删除车辆失败:', error)
    return false
  }
}

/**
 * 开始追踪车辆
 */
export async function startTracking(vehicleId) {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/tracking/start`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('开始追踪失败')
    return await response.json()
  } catch (error) {
    console.error('开始追踪失败:', error)
    return null
  }
}

/**
 * 停止追踪车辆
 */
export async function stopTracking(vehicleId) {
  try {
    const response = await fetch(`${API_BASE_URL}/vehicles/${vehicleId}/tracking/stop`, {
      method: 'POST'
    })
    if (!response.ok) throw new Error('停止追踪失败')
    return await response.json()
  } catch (error) {
    console.error('停止追踪失败:', error)
    return null
  }
}

/**
 * 获取统计数据
 */
export async function fetchStatistics() {
  try {
    const response = await fetch(`${API_BASE_URL}/statistics`)
    if (!response.ok) throw new Error('获取统计数据失败')
    return await response.json()
  } catch (error) {
    console.error('获取统计数据失败:', error)
    return null
  }
}

// WebSocket连接
export function createWebSocket(onMessage, onError) {
  const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws'
  
  try {
    const ws = new WebSocket(WS_URL)
    
    ws.onopen = () => {
      console.log('WebSocket连接已建立')
    }
    
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        onMessage(data)
      } catch (error) {
        console.error('WebSocket消息解析失败:', error)
      }
    }
    
    ws.onerror = (error) => {
      console.error('WebSocket错误:', error)
      if (onError) onError(error)
    }
    
    ws.onclose = () => {
      console.log('WebSocket连接已关闭')
    }
    
    return ws
  } catch (error) {
    console.error('WebSocket连接失败:', error)
    if (onError) onError(error)
    return null
  }
}
