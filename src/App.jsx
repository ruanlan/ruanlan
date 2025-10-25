import { useState } from 'react'
import MapContainer from './components/Map/MapContainer'
import ControlPanel from './components/ControlPanel/ControlPanel'
import VehicleList from './components/Vehicle/VehicleList'
import TrackHistory from './components/Track/TrackHistory'
import Statistics from './components/Statistics/Statistics'
import { useVehicleStore } from './store/vehicleStore'
import './styles/App.css'

function App() {
  const [activeTab, setActiveTab] = useState('tracking')
  const vehicles = useVehicleStore(state => state.vehicles)

  return (
    <div className="app">
      {/* 顶部导航栏 */}
      <header className="app-header">
        <div className="header-left">
          <h1 className="app-title">🚗 高德地图车辆轨迹追踪系统</h1>
          <span className="version">React v1.0.0</span>
        </div>
        <div className="header-right">
          <span className="vehicle-count">
            在线车辆: <strong>{vehicles.filter(v => v.isTracking).length}</strong> / {vehicles.length}
          </span>
        </div>
      </header>

      {/* 主体内容 */}
      <div className="app-body">
        {/* 左侧控制面板 */}
        <aside className="app-sidebar">
          {/* 标签切换 */}
          <div className="tab-nav">
            <button 
              className={`tab-btn ${activeTab === 'tracking' ? 'active' : ''}`}
              onClick={() => setActiveTab('tracking')}
            >
              🎯 实时追踪
            </button>
            <button 
              className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => setActiveTab('history')}
            >
              📜 历史轨迹
            </button>
            <button 
              className={`tab-btn ${activeTab === 'statistics' ? 'active' : ''}`}
              onClick={() => setActiveTab('statistics')}
            >
              📊 数据统计
            </button>
          </div>

          {/* 标签内容 */}
          <div className="tab-content">
            {activeTab === 'tracking' && (
              <div className="tab-panel">
                <ControlPanel />
                <VehicleList />
              </div>
            )}
            {activeTab === 'history' && (
              <div className="tab-panel">
                <TrackHistory />
              </div>
            )}
            {activeTab === 'statistics' && (
              <div className="tab-panel">
                <Statistics />
              </div>
            )}
          </div>
        </aside>

        {/* 右侧地图 */}
        <main className="app-main">
          <MapContainer />
        </main>
      </div>
    </div>
  )
}

export default App
