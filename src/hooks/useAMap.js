import { useEffect, useRef, useState } from 'react'
import { useVehicleStore } from '../store/vehicleStore'

// 高德地图Hook
export const useAMap = (containerId, options = {}) => {
  const mapRef = useRef(null)
  const [isMapReady, setIsMapReady] = useState(false)
  const setMapInstance = useVehicleStore(state => state.setMapInstance)
  
  const defaultOptions = {
    zoom: 13,
    center: [116.397428, 39.90923], // 北京
    viewMode: '3D',
    pitch: 40,
    rotation: 0,
    ...options
  }

  useEffect(() => {
    if (!window.AMap) {
      console.error('高德地图API未加载')
      return
    }

    // 初始化地图
    const map = new window.AMap.Map(containerId, defaultOptions)
    
    map.on('complete', () => {
      console.log('地图加载完成')
      mapRef.current = map
      setMapInstance(map)
      setIsMapReady(true)
    })

    // 清理
    return () => {
      if (mapRef.current) {
        mapRef.current.destroy()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [containerId])

  return { map: mapRef.current, isMapReady }
}

// 车辆标记Hook
export const useVehicleMarker = (map, vehicle) => {
  const markerRef = useRef(null)
  const { updateVehicle } = useVehicleStore()

  useEffect(() => {
    if (!map || !vehicle || !window.AMap) return

    // 创建车辆标记
    if (!markerRef.current) {
      const content = createVehicleMarkerContent(vehicle)
      
      const marker = new window.AMap.Marker({
        position: vehicle.currentPosition || [116.397428, 39.90923],
        content: content,
        offset: new window.AMap.Pixel(-15, -30),
        anchor: 'bottom-center'
      })

      marker.setMap(map)
      markerRef.current = marker
      
      // 保存到store
      updateVehicle(vehicle.id, { marker })
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null)
        markerRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, vehicle?.id])

  // 更新标记位置
  useEffect(() => {
    if (markerRef.current && vehicle?.currentPosition) {
      markerRef.current.setPosition(vehicle.currentPosition)
      
      // 更新标记内容
      const content = createVehicleMarkerContent(vehicle)
      markerRef.current.setContent(content)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle?.currentPosition, vehicle?.isTracking, vehicle?.status])

  return markerRef.current
}

// 轨迹线Hook
export const useTrackPolyline = (map, vehicle) => {
  const polylineRef = useRef(null)
  const { updateVehicle } = useVehicleStore()

  useEffect(() => {
    if (!map || !vehicle || !window.AMap) return

    // 创建轨迹线
    if (!polylineRef.current && vehicle.trackPoints.length > 0) {
      const path = vehicle.trackPoints.map(p => [p.lng, p.lat])
      
      const polyline = new window.AMap.Polyline({
        path: path,
        strokeColor: vehicle.color || '#3366FF',
        strokeWeight: 5,
        strokeOpacity: 0.8,
        showDir: true
      })

      polyline.setMap(map)
      polylineRef.current = polyline
      
      // 保存到store
      updateVehicle(vehicle.id, { polyline })
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null)
        polylineRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, vehicle?.id])

  // 更新轨迹线
  useEffect(() => {
    if (polylineRef.current && vehicle?.trackPoints) {
      const path = vehicle.trackPoints.map(p => [p.lng, p.lat])
      polylineRef.current.setPath(path)
    } else if (!polylineRef.current && map && vehicle && vehicle.trackPoints.length > 0) {
      const path = vehicle.trackPoints.map(p => [p.lng, p.lat])
      
      const polyline = new window.AMap.Polyline({
        path: path,
        strokeColor: vehicle.color || '#3366FF',
        strokeWeight: 5,
        strokeOpacity: 0.8,
        showDir: true
      })

      polyline.setMap(map)
      polylineRef.current = polyline
      updateVehicle(vehicle.id, { polyline })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicle?.trackPoints])

  return polylineRef.current
}

// 创建车辆标记内容
function createVehicleMarkerContent(vehicle) {
  const statusColor = vehicle.isTracking ? '#00ff00' : 
                     vehicle.status === 'online' ? '#ffaa00' : '#999999'
  
  return `
    <div style="position: relative;">
      <div style="
        background: ${vehicle.color || '#3366FF'};
        color: white;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
        white-space: nowrap;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      ">
        🚗 ${vehicle.name}
      </div>
      <div style="
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 6px solid transparent;
        border-right: 6px solid transparent;
        border-top: 6px solid ${vehicle.color || '#3366FF'};
      "></div>
      <div style="
        position: absolute;
        top: -4px;
        right: -4px;
        width: 8px;
        height: 8px;
        background: ${statusColor};
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(0,0,0,0.3);
      "></div>
    </div>
  `
}
