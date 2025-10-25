import { useVehicleStore } from '../../store/vehicleStore'
import VehicleItem from './VehicleItem'
import './VehicleList.css'

function VehicleList() {
  const vehicles = useVehicleStore(state => state.vehicles)
  const selectedVehicleId = useVehicleStore(state => state.selectedVehicleId)

  if (vehicles.length === 0) {
    return (
      <div className="vehicle-list-empty">
        <div className="empty-icon">🚗</div>
        <p>暂无车辆</p>
        <p className="empty-hint">请先添加车辆</p>
      </div>
    )
  }

  return (
    <div className="vehicle-list">
      <div className="vehicle-list-header">
        <h3>车辆列表 ({vehicles.length})</h3>
        <div className="list-stats">
          <span className="stat-item">
            在线: <strong>{vehicles.filter(v => v.status === 'online' || v.status === 'tracking').length}</strong>
          </span>
          <span className="stat-item">
            追踪中: <strong>{vehicles.filter(v => v.isTracking).length}</strong>
          </span>
        </div>
      </div>

      <div className="vehicle-list-body">
        {vehicles.map(vehicle => (
          <VehicleItem
            key={vehicle.id}
            vehicle={vehicle}
            isSelected={vehicle.id === selectedVehicleId}
          />
        ))}
      </div>
    </div>
  )
}

export default VehicleList
