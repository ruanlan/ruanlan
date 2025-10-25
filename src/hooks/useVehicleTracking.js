import { useEffect, useRef } from 'react'
import { useVehicleStore } from '../store/vehicleStore'
import { simulateVehicleMovement } from '../utils/simulator'

// 车辆追踪Hook
export const useVehicleTracking = (vehicleId) => {
  const intervalRef = useRef(null)
  const vehicle = useVehicleStore(state => 
    state.vehicles.find(v => v.id === vehicleId)
  )
  const updateVehiclePosition = useVehicleStore(state => state.updateVehiclePosition)
  const stopTracking = useVehicleStore(state => state.stopTracking)

  useEffect(() => {
    if (!vehicle || !vehicle.isTracking) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
      return
    }

    // 模拟车辆移动
    let currentIndex = vehicle.trackPoints.length
    
    intervalRef.current = setInterval(() => {
      const newPosition = simulateVehicleMovement(
        vehicle.currentPosition || [116.397428, 39.90923],
        currentIndex
      )
      
      const speed = 40 + Math.random() * 40 // 40-80 km/h
      
      updateVehiclePosition(vehicleId, newPosition, speed)
      currentIndex++
      
      // 模拟：追踪一定时间后自动停止
      if (currentIndex > 100) {
        stopTracking(vehicleId)
      }
    }, 2000) // 每2秒更新一次

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [vehicle?.isTracking, vehicleId])
}

// 轨迹回放Hook
export const useTrackPlayback = (vehicleId, trackPoints) => {
  const playbackRef = useRef(null)
  const indexRef = useRef(0)
  const mapInstance = useVehicleStore(state => state.mapInstance)

  const startPlayback = (speed = 500, onComplete) => {
    if (!trackPoints || trackPoints.length === 0) {
      console.warn('没有轨迹数据可回放')
      return
    }

    stopPlayback()
    indexRef.current = 0

    playbackRef.current = setInterval(() => {
      if (indexRef.current >= trackPoints.length) {
        stopPlayback()
        if (onComplete) onComplete()
        return
      }

      const point = trackPoints[indexRef.current]
      
      // 创建回放标记
      if (mapInstance && window.AMap) {
        const marker = new window.AMap.Marker({
          position: [point.lng, point.lat],
          content: `<div style="
            width: 12px;
            height: 12px;
            background: #FF5733;
            border: 2px solid white;
            border-radius: 50%;
            box-shadow: 0 0 6px rgba(255,87,51,0.6);
          "></div>`,
          offset: new window.AMap.Pixel(-6, -6)
        })
        marker.setMap(mapInstance)
        
        // 移动地图到当前点
        mapInstance.setCenter([point.lng, point.lat])
        
        // 延迟移除标记
        setTimeout(() => {
          marker.setMap(null)
        }, speed * 2)
      }

      indexRef.current++
    }, speed)
  }

  const stopPlayback = () => {
    if (playbackRef.current) {
      clearInterval(playbackRef.current)
      playbackRef.current = null
    }
  }

  const pausePlayback = () => {
    stopPlayback()
  }

  const resumePlayback = (speed = 500, onComplete) => {
    if (indexRef.current >= trackPoints.length) {
      indexRef.current = 0
    }
    startPlayback(speed, onComplete)
  }

  useEffect(() => {
    return () => {
      stopPlayback()
    }
  }, [])

  return {
    startPlayback,
    stopPlayback,
    pausePlayback,
    resumePlayback,
    currentIndex: indexRef.current
  }
}
