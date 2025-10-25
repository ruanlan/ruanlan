import { useVehicleStore } from '../../store/vehicleStore'
import { useVehicleTracking } from '../../hooks/useVehicleTracking'
import { formatDistance, formatSpeed, formatDuration } from '../../utils/simulator'
import './VehicleItem.css'

function VehicleItem({ vehicle, isSelected }) {
  const { 
    selectVehicle, 
    removeVehicle, 
    startTracking, 
    stopTracking, 
    clearTrack,
    mapInstance 
  } = useVehicleStore()

  // 启用追踪Hook
  useVehicleTracking(vehicle.id)

  const handleSelect = () => {
    selectVehicle(vehicle.id)
    
    // 移动地图到车辆位置
    if (mapInstance && vehicle.currentPosition) {
      mapInstance.setCenter(vehicle.currentPosition)
      mapInstance.setZoom(15)
    }
  }

  const handleStartTracking = (e) => {
    e.stopPropagation()
    startTracking(vehicle.id)
  }

  const handleStopTracking = (e) => {
    e.stopPropagation()
    stopTracking(vehicle.id)
  }

  const handleClearTrack = (e) => {
    e.stopPropagation()
    if (confirm(`确定要清除车辆 ${vehicle.name} 的轨迹吗？`)) {
      clearTrack(vehicle.id)
    }
  }

  const handleRemove = (e) => {
    e.stopPropagation()
    if (confirm(`确定要删除车辆 ${vehicle.name} 吗？`)) {
      removeVehicle(vehicle.id)
    }
  }

  const getStatusColor = () => {
    if (vehicle.isTracking) return '#00ff00'
    if (vehicle.status === 'online') return '#ffaa00'
    return '#999999'
  }

  const getStatusText = () => {
    if (vehicle.isTracking) return '追踪中'
    if (vehicle.status === 'online') return '在线'
    return '离线'
  }

  const duration = vehicle.startTime && vehicle.endTime 
    ? vehicle.endTime - vehicle.startTime 
    : vehicle.startTime 
    ? Date.now() - vehicle.startTime 
    : 0

  return (
    <div 
      className={`vehicle-item ${isSelected ? 'selected' : ''}`}
      onClick={handleSelect}
      style={{ borderLeftColor: vehicle.color }}
    >
      <div className="vehicle-header">
        <div className="vehicle-info">
          <div className="vehicle-name-row">
            <span className="vehicle-icon">🚗</span>
            <span className="vehicle-name">{vehicle.name}</span>
            <span 
              className="vehicle-status"
              style={{ backgroundColor: getStatusColor() }}
            >
              {getStatusText()}
            </span>
          </div>
          <div className="vehicle-id">编号: {vehicle.id}</div>
        </div>
      </div>

      {vehicle.trackPoints.length > 0 && (
        <div className="vehicle-stats">
          <div className="stat-row">
            <span className="stat-label">里程:</span>
            <span className="stat-value">{formatDistance(vehicle.totalDistance)}</span>
          </div>
          <div className="stat-row">
            <span className="stat-label">轨迹点:</span>
            <span className="stat-value">{vehicle.trackPoints.length} 个</span>
          </div>
          {vehicle.averageSpeed > 0 && (
            <>
              <div className="stat-row">
                <span className="stat-label">平均速度:</span>
                <span className="stat-value">{formatSpeed(vehicle.averageSpeed)}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">最高速度:</span>
                <span className="stat-value">{formatSpeed(vehicle.maxSpeed)}</span>
              </div>
            </>
          )}
          {duration > 0 && (
            <div className="stat-row">
              <span className="stat-label">时长:</span>
              <span className="stat-value">{formatDuration(duration)}</span>
            </div>
          )}
        </div>
      )}

      <div className="vehicle-actions">
        {!vehicle.isTracking ? (
          <button 
            className="action-btn action-btn-start"
            onClick={handleStartTracking}
          >
            ▶️ 开始追踪
          </button>
        ) : (
          <button 
            className="action-btn action-btn-stop"
            onClick={handleStopTracking}
          >
            ⏸️ 停止追踪
          </button>
        )}

        {vehicle.trackPoints.length > 0 && (
          <button 
            className="action-btn action-btn-clear"
            onClick={handleClearTrack}
          >
            🗑️ 清除轨迹
          </button>
        )}

        <button 
          className="action-btn action-btn-remove"
          onClick={handleRemove}
        >
          ❌ 删除
        </button>
      </div>
    </div>
  )
}

export default VehicleItem
