import { useMemo } from 'react'
import { useVehicleStore } from '../../store/vehicleStore'
import { formatDistance, formatSpeed, formatDuration } from '../../utils/simulator'
import './Statistics.css'

function Statistics() {
  const vehicles = useVehicleStore(state => state.vehicles)

  const stats = useMemo(() => {
    const totalVehicles = vehicles.length
    const onlineVehicles = vehicles.filter(v => v.status === 'online' || v.status === 'tracking').length
    const trackingVehicles = vehicles.filter(v => v.isTracking).length
    const totalDistance = vehicles.reduce((sum, v) => sum + (v.totalDistance || 0), 0)
    const totalTrackPoints = vehicles.reduce((sum, v) => sum + v.trackPoints.length, 0)
    
    const vehiclesWithSpeed = vehicles.filter(v => v.averageSpeed > 0)
    const avgSpeed = vehiclesWithSpeed.length > 0
      ? vehiclesWithSpeed.reduce((sum, v) => sum + v.averageSpeed, 0) / vehiclesWithSpeed.length
      : 0

    const maxSpeed = vehicles.reduce((max, v) => Math.max(max, v.maxSpeed || 0), 0)

    const vehiclesWithTime = vehicles.filter(v => v.startTime)
    const totalDuration = vehiclesWithTime.reduce((sum, v) => {
      const duration = (v.endTime || Date.now()) - v.startTime
      return sum + duration
    }, 0)

    return {
      totalVehicles,
      onlineVehicles,
      trackingVehicles,
      offlineVehicles: totalVehicles - onlineVehicles,
      totalDistance,
      totalTrackPoints,
      avgSpeed,
      maxSpeed,
      totalDuration
    }
  }, [vehicles])

  const topVehicles = useMemo(() => {
    return [...vehicles]
      .filter(v => v.totalDistance > 0)
      .sort((a, b) => b.totalDistance - a.totalDistance)
      .slice(0, 5)
  }, [vehicles])

  const fastestVehicles = useMemo(() => {
    return [...vehicles]
      .filter(v => v.maxSpeed > 0)
      .sort((a, b) => b.maxSpeed - a.maxSpeed)
      .slice(0, 5)
  }, [vehicles])

  return (
    <div className="statistics">
      <div className="stats-header">
        <h3>📊 数据统计</h3>
        <p className="stats-subtitle">实时数据分析与统计</p>
      </div>

      {/* 总体统计 */}
      <div className="stats-section">
        <h4 className="section-title">总体数据</h4>
        <div className="stats-grid">
          <div className="stat-box">
            <div className="stat-icon">🚗</div>
            <div className="stat-content">
              <div className="stat-label">总车辆数</div>
              <div className="stat-value">{stats.totalVehicles}</div>
            </div>
          </div>

          <div className="stat-box stat-box-success">
            <div className="stat-icon">🟢</div>
            <div className="stat-content">
              <div className="stat-label">在线车辆</div>
              <div className="stat-value">{stats.onlineVehicles}</div>
            </div>
          </div>

          <div className="stat-box stat-box-warning">
            <div className="stat-icon">🔴</div>
            <div className="stat-content">
              <div className="stat-label">离线车辆</div>
              <div className="stat-value">{stats.offlineVehicles}</div>
            </div>
          </div>

          <div className="stat-box stat-box-info">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <div className="stat-label">追踪中</div>
              <div className="stat-value">{stats.trackingVehicles}</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon">📏</div>
            <div className="stat-content">
              <div className="stat-label">总里程</div>
              <div className="stat-value">{formatDistance(stats.totalDistance)}</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon">📍</div>
            <div className="stat-content">
              <div className="stat-label">总轨迹点</div>
              <div className="stat-value">{stats.totalTrackPoints.toLocaleString()}</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon">⚡</div>
            <div className="stat-content">
              <div className="stat-label">平均速度</div>
              <div className="stat-value">{formatSpeed(stats.avgSpeed)}</div>
            </div>
          </div>

          <div className="stat-box">
            <div className="stat-icon">🚀</div>
            <div className="stat-content">
              <div className="stat-label">最高速度</div>
              <div className="stat-value">{formatSpeed(stats.maxSpeed)}</div>
            </div>
          </div>

          {stats.totalDuration > 0 && (
            <div className="stat-box">
              <div className="stat-icon">⏱️</div>
              <div className="stat-content">
                <div className="stat-label">总时长</div>
                <div className="stat-value">{formatDuration(stats.totalDuration)}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 里程排行 */}
      {topVehicles.length > 0 && (
        <div className="stats-section">
          <h4 className="section-title">🏆 里程排行榜</h4>
          <div className="ranking-list">
            {topVehicles.map((vehicle, index) => (
              <div key={vehicle.id} className="ranking-item">
                <div className="rank-badge">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                </div>
                <div className="rank-info">
                  <div className="rank-name">{vehicle.name}</div>
                  <div className="rank-id">{vehicle.id}</div>
                </div>
                <div className="rank-value">
                  {formatDistance(vehicle.totalDistance)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 速度排行 */}
      {fastestVehicles.length > 0 && (
        <div className="stats-section">
          <h4 className="section-title">🚀 速度排行榜</h4>
          <div className="ranking-list">
            {fastestVehicles.map((vehicle, index) => (
              <div key={vehicle.id} className="ranking-item">
                <div className="rank-badge">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}`}
                </div>
                <div className="rank-info">
                  <div className="rank-name">{vehicle.name}</div>
                  <div className="rank-id">{vehicle.id}</div>
                </div>
                <div className="rank-value">
                  {formatSpeed(vehicle.maxSpeed)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 车辆详细列表 */}
      {vehicles.length > 0 && (
        <div className="stats-section">
          <h4 className="section-title">📋 车辆详细信息</h4>
          <div className="vehicle-table">
            <table>
              <thead>
                <tr>
                  <th>车辆</th>
                  <th>状态</th>
                  <th>里程</th>
                  <th>轨迹点</th>
                  <th>平均速度</th>
                  <th>最高速度</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map(vehicle => (
                  <tr key={vehicle.id}>
                    <td>
                      <div className="table-vehicle-info">
                        <span style={{ color: vehicle.color }}>●</span>
                        <span>{vehicle.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${vehicle.status}`}>
                        {vehicle.isTracking ? '追踪中' : vehicle.status === 'online' ? '在线' : '离线'}
                      </span>
                    </td>
                    <td>{formatDistance(vehicle.totalDistance)}</td>
                    <td>{vehicle.trackPoints.length}</td>
                    <td>{formatSpeed(vehicle.averageSpeed)}</td>
                    <td>{formatSpeed(vehicle.maxSpeed)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default Statistics
