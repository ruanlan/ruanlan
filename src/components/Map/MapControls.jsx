import { useState } from 'react'
import { useVehicleStore } from '../../store/vehicleStore'
import './MapControls.css'

function MapControls({ map }) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const selectedVehicleId = useVehicleStore(state => state.selectedVehicleId)
  const vehicles = useVehicleStore(state => state.vehicles)

  // 回到中心
  const handleRecenter = () => {
    if (!map) return
    
    if (selectedVehicleId) {
      const vehicle = vehicles.find(v => v.id === selectedVehicleId)
      if (vehicle && vehicle.currentPosition) {
        map.setCenter(vehicle.currentPosition)
        map.setZoom(15)
      }
    } else {
      map.setCenter([116.397428, 39.90923])
      map.setZoom(13)
    }
  }

  // 切换全屏
  const handleFullscreen = () => {
    const container = document.getElementById('map-container')
    if (!container) return

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  // 缩放控制
  const handleZoomIn = () => {
    if (map) map.zoomIn()
  }

  const handleZoomOut = () => {
    if (map) map.zoomOut()
  }

  // 切换视图模式
  const handleToggleView = () => {
    if (!map) return
    const currentPitch = map.getPitch()
    if (currentPitch === 0) {
      map.setPitch(40)
      map.setViewMode('3D')
    } else {
      map.setPitch(0)
      map.setViewMode('2D')
    }
  }

  // 适应所有车辆
  const handleFitView = () => {
    if (!map || vehicles.length === 0) return
    
    const points = vehicles
      .filter(v => v.currentPosition)
      .map(v => v.currentPosition)
    
    if (points.length === 0) return
    
    map.setFitView()
  }

  return (
    <div className="map-controls">
      <button 
        className="map-control-btn" 
        onClick={handleRecenter}
        title="回到中心"
      >
        📍
      </button>
      
      <button 
        className="map-control-btn" 
        onClick={handleZoomIn}
        title="放大"
      >
        ➕
      </button>
      
      <button 
        className="map-control-btn" 
        onClick={handleZoomOut}
        title="缩小"
      >
        ➖
      </button>
      
      <button 
        className="map-control-btn" 
        onClick={handleToggleView}
        title="切换2D/3D"
      >
        🌐
      </button>
      
      <button 
        className="map-control-btn" 
        onClick={handleFitView}
        title="适应视图"
      >
        🎯
      </button>
      
      <button 
        className="map-control-btn" 
        onClick={handleFullscreen}
        title="全屏"
      >
        {isFullscreen ? '✕' : '⛶'}
      </button>
    </div>
  )
}

export default MapControls
