import { useState } from 'react'
import { useVehicleStore } from '../../store/vehicleStore'
// import { generateSampleRoute, generateRandomRoute } from '../../utils/simulator'
import './ControlPanel.css'

function ControlPanel() {
  const [vehicleId, setVehicleId] = useState('')
  const [vehicleName, setVehicleName] = useState('')
  const addVehicle = useVehicleStore(state => state.addVehicle)
  // const mapInstance = useVehicleStore(state => state.mapInstance)

  // 添加新车辆
  const handleAddVehicle = () => {
    if (!vehicleId.trim()) {
      alert('请输入车辆编号')
      return
    }

    const newVehicle = {
      id: vehicleId.trim(),
      name: vehicleName.trim() || `车辆${vehicleId}`,
      position: [116.397428 + (Math.random() - 0.5) * 0.02, 
                 39.90923 + (Math.random() - 0.5) * 0.02]
    }

    addVehicle(newVehicle)
    
    // 清空输入
    setVehicleId('')
    setVehicleName('')
  }

  // 批量添加车辆
  const handleBatchAdd = () => {
    const count = prompt('请输入要添加的车辆数量：', '5')
    if (!count || isNaN(count)) return

    const num = parseInt(count)
    for (let i = 1; i <= num; i++) {
      const id = `V${Date.now()}_${i}`
      addVehicle({
        id,
        name: `车辆${i}`,
        position: [116.397428 + (Math.random() - 0.5) * 0.05, 
                   39.90923 + (Math.random() - 0.5) * 0.05]
      })
    }
  }

  // 导入车辆数据
  const handleImportData = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result)
          if (Array.isArray(data)) {
            data.forEach(vehicle => addVehicle(vehicle))
            alert(`成功导入 ${data.length} 辆车辆`)
          } else {
            alert('数据格式错误')
          }
        } catch (error) {
          alert('文件解析失败：' + error.message)
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  // 加载示例数据
  const handleLoadSample = () => {
    const sampleVehicles = [
      { id: 'BJ001', name: '京A12345', position: [116.397428, 39.90923] },
      { id: 'BJ002', name: '京B67890', position: [116.407428, 39.91923] },
      { id: 'BJ003', name: '京C13579', position: [116.387428, 39.89923] }
    ]

    sampleVehicles.forEach(v => addVehicle(v))
    alert('示例车辆已加载')
  }

  return (
    <div className="control-panel">
      <div className="panel-section">
        <h3 className="section-title">🚗 添加车辆</h3>
        
        <div className="form-group">
          <label>车辆编号 *</label>
          <input
            type="text"
            value={vehicleId}
            onChange={(e) => setVehicleId(e.target.value)}
            placeholder="例如: BJ001"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>车辆名称</label>
          <input
            type="text"
            value={vehicleName}
            onChange={(e) => setVehicleName(e.target.value)}
            placeholder="例如: 京A12345"
            className="form-input"
          />
        </div>

        <button 
          className="btn btn-primary btn-block"
          onClick={handleAddVehicle}
        >
          ➕ 添加车辆
        </button>
      </div>

      <div className="panel-section">
        <h3 className="section-title">⚡ 快速操作</h3>
        
        <button 
          className="btn btn-secondary btn-block"
          onClick={handleBatchAdd}
        >
          📦 批量添加
        </button>

        <button 
          className="btn btn-secondary btn-block"
          onClick={handleLoadSample}
        >
          📋 加载示例
        </button>

        <button 
          className="btn btn-secondary btn-block"
          onClick={handleImportData}
        >
          📂 导入数据
        </button>
      </div>

      <div className="panel-section">
        <h3 className="section-title">💡 使用提示</h3>
        <ul className="tips-list">
          <li>添加车辆后可在列表中管理</li>
          <li>点击车辆可查看详情</li>
          <li>开始追踪后会模拟实时移动</li>
          <li>支持同时追踪多辆车辆</li>
        </ul>
      </div>
    </div>
  )
}

export default ControlPanel
