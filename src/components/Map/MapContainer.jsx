// import { useEffect } from 'react'
import { useAMap, useVehicleMarker, useTrackPolyline } from '../../hooks/useAMap'
import { useVehicleStore } from '../../store/vehicleStore'
import MapControls from './MapControls'
import './MapContainer.css'

function MapContainer() {
  const { map, isMapReady } = useAMap('map-container', {
    zoom: 13,
    center: [116.397428, 39.90923],
    viewMode: '3D',
    pitch: 40
  })
  
  const vehicles = useVehicleStore(state => state.vehicles)

  return (
    <div className="map-container-wrapper">
      <div id="map-container" className="map-container"></div>
      
      {isMapReady && <MapControls map={map} />}
      
      {/* 渲染所有车辆 */}
      {isMapReady && vehicles.map(vehicle => (
        <VehicleOnMap key={vehicle.id} map={map} vehicle={vehicle} />
      ))}
      
      {!isMapReady && (
        <div className="map-loading">
          <div className="spinner"></div>
          <p>地图加载中...</p>
        </div>
      )}
    </div>
  )
}

// 单个车辆在地图上的渲染
function VehicleOnMap({ map, vehicle }) {
  useVehicleMarker(map, vehicle)
  useTrackPolyline(map, vehicle)
  return null
}

export default MapContainer
