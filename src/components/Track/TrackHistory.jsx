import { useState } from 'react'
import { useVehicleStore } from '../../store/vehicleStore'
import { useTrackPlayback } from '../../hooks/useVehicleTracking'
import dayjs from 'dayjs'
import { formatDistance, formatSpeed, formatDuration } from '../../utils/simulator'
import './TrackHistory.css'

function TrackHistory() {
  const vehicles = useVehicleStore(state => state.vehicles)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [playbackSpeed, setPlaybackSpeed] = useState(500)
  const [isPlaying, setIsPlaying] = useState(false)

  const vehicle = selectedVehicle 
    ? vehicles.find(v => v.id === selectedVehicle) 
    : null

  const { startPlayback, stopPlayback, pausePlayback } = 
    useTrackPlayback(vehicle?.id, vehicle?.trackPoints)

  const handlePlay = () => {
    if (isPlaying) {
      pausePlayback()
      setIsPlaying(false)
    } else {
      if (vehicle && vehicle.trackPoints.length > 0) {
        startPlayback(playbackSpeed, () => {
          setIsPlaying(false)
        })
        setIsPlaying(true)
      }
    }
  }

  const handleStop = () => {
    stopPlayback()
    setIsPlaying(false)
  }

  const handleExport = () => {
    if (!vehicle || vehicle.trackPoints.length === 0) {
      alert('没有可导出的数据')
      return
    }

    const data = {
      vehicleId: vehicle.id,
      vehicleName: vehicle.name,
      trackPoints: vehicle.trackPoints,
      totalDistance: vehicle.totalDistance,
      averageSpeed: vehicle.averageSpeed,
      maxSpeed: vehicle.maxSpeed,
      startTime: vehicle.startTime,
      endTime: vehicle.endTime,
      exportTime: Date.now()
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `track_${vehicle.id}_${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const vehiclesWithTracks = vehicles.filter(v => v.trackPoints.length > 0)

  return (
    <div className="track-history">
      <div className="history-header">
        <h3>📜 历史轨迹</h3>
        <p className="history-subtitle">
          共 {vehiclesWithTracks.length} 辆车有轨迹记录
        </p>
      </div>

      {vehiclesWithTracks.length === 0 ? (
        <div className="history-empty">
          <div className="empty-icon">📭</div>
          <p>暂无轨迹记录</p>
          <p className="empty-hint">开始追踪车辆后会产生轨迹数据</p>
        </div>
      ) : (
        <>
          <div className="vehicle-selector">
            <label>选择车辆：</label>
            <select 
              value={selectedVehicle || ''} 
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="vehicle-select"
            >
              <option value="">-- 请选择 --</option>
              {vehiclesWithTracks.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.trackPoints.length} 个点)
                </option>
              ))}
            </select>
          </div>

          {vehicle && (
            <div className="track-detail">
              <div className="detail-header">
                <h4>{vehicle.name}</h4>
                <span className="vehicle-badge" style={{ backgroundColor: vehicle.color }}>
                  {vehicle.id}
                </span>
              </div>

              <div className="detail-stats">
                <div className="stat-card">
                  <div className="stat-icon">📏</div>
                  <div className="stat-content">
                    <div className="stat-label">总里程</div>
                    <div className="stat-value">{formatDistance(vehicle.totalDistance)}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">📍</div>
                  <div className="stat-content">
                    <div className="stat-label">轨迹点数</div>
                    <div className="stat-value">{vehicle.trackPoints.length}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">⚡</div>
                  <div className="stat-content">
                    <div className="stat-label">平均速度</div>
                    <div className="stat-value">{formatSpeed(vehicle.averageSpeed)}</div>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon">🚀</div>
                  <div className="stat-content">
                    <div className="stat-label">最高速度</div>
                    <div className="stat-value">{formatSpeed(vehicle.maxSpeed)}</div>
                  </div>
                </div>

                {vehicle.startTime && (
                  <div className="stat-card">
                    <div className="stat-icon">⏱️</div>
                    <div className="stat-content">
                      <div className="stat-label">行驶时长</div>
                      <div className="stat-value">
                        {formatDuration(
                          (vehicle.endTime || Date.now()) - vehicle.startTime
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="playback-controls">
                <h4>轨迹回放</h4>
                
                <div className="speed-control">
                  <label>回放速度：</label>
                  <select 
                    value={playbackSpeed} 
                    onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                    className="speed-select"
                  >
                    <option value="2000">0.5x</option>
                    <option value="1000">1x</option>
                    <option value="500">2x</option>
                    <option value="250">4x</option>
                    <option value="100">10x</option>
                  </select>
                </div>

                <div className="playback-buttons">
                  <button 
                    className={`playback-btn ${isPlaying ? 'playing' : ''}`}
                    onClick={handlePlay}
                  >
                    {isPlaying ? '⏸️ 暂停' : '▶️ 播放'}
                  </button>

                  <button 
                    className="playback-btn"
                    onClick={handleStop}
                    disabled={!isPlaying}
                  >
                    ⏹️ 停止
                  </button>
                </div>
              </div>

              <div className="track-actions">
                <button 
                  className="action-btn action-btn-export"
                  onClick={handleExport}
                >
                  💾 导出轨迹
                </button>
              </div>

              <div className="track-points-list">
                <h4>轨迹点列表</h4>
                <div className="points-container">
                  {vehicle.trackPoints.map((point, index) => (
                    <div key={index} className="point-item">
                      <div className="point-index">{index + 1}</div>
                      <div className="point-info">
                        <div className="point-coord">
                          {point.lng.toFixed(6)}, {point.lat.toFixed(6)}
                        </div>
                        <div className="point-meta">
                          {dayjs(point.timestamp).format('HH:mm:ss')} | 
                          {formatSpeed(point.speed)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default TrackHistory
