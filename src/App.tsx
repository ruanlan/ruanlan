import VehicleTrackMap from './components/VehicleTrackMap';
import sampleTrack from './data/sampleTrack';
import './App.css';

function App() {
  return (
    <div className="app">
      <header className="app__header">
        <div>
          <h1>高德地图车辆轨迹演示</h1>
          <p>
            该示例展示了如何使用高德地图 JavaScript API 绘制车辆行驶轨迹，并通过动画模拟车辆行驶过程。
            在真正的业务场景中，您只需要替换实时轨迹数据即可。
          </p>
        </div>
      </header>
      <main className="app__main">
        <VehicleTrackMap track={sampleTrack} />
      </main>
    </div>
  );
}

export default App;
