let mapManager;
let vehicleTracker;

document.addEventListener('DOMContentLoaded', () => {
    mapManager = new MapManager();
    mapManager.initMap();
    
    vehicleTracker = new VehicleTracker(mapManager);

    initEventListeners();
    startStatsUpdate();
});

function initEventListeners() {
    document.getElementById('startTracking').addEventListener('click', () => {
        const vehicleId = document.getElementById('vehicleId').value;
        const vehicleName = document.getElementById('vehicleName').value;
        
        vehicleTracker.startTracking(vehicleId, vehicleName);
        updateStatus('追踪中');
        updateTrackList();
    });

    document.getElementById('stopTracking').addEventListener('click', () => {
        vehicleTracker.stopTracking();
        updateStatus('已停止');
    });

    document.getElementById('clearTrack').addEventListener('click', () => {
        if (confirm('确定要清除所有轨迹数据吗？')) {
            vehicleTracker.clearAllData();
            updateStatus('已清除');
            updateStats();
            clearTrackList();
        }
    });

    document.getElementById('playback').addEventListener('click', () => {
        vehicleTracker.startPlayback();
        updateStatus('回放中');
    });

    document.getElementById('pausePlayback').addEventListener('click', () => {
        vehicleTracker.pausePlayback();
        updateStatus('回放暂停');
    });

    document.getElementById('loadSampleRoute').addEventListener('click', () => {
        vehicleTracker.loadSampleRoute();
        updateStatus('示例路线已加载');
        updateStats();
        updateTrackList();
    });

    document.getElementById('generateRandomRoute').addEventListener('click', () => {
        vehicleTracker.generateRandomRoute();
        updateStatus('随机路线已生成');
        updateStats();
        updateTrackList();
    });

    document.getElementById('centerMap').addEventListener('click', () => {
        mapManager.centerMap();
    });

    document.getElementById('fullscreen').addEventListener('click', () => {
        const mapContainer = document.getElementById('map');
        if (mapContainer.requestFullscreen) {
            mapContainer.requestFullscreen();
        } else if (mapContainer.webkitRequestFullscreen) {
            mapContainer.webkitRequestFullscreen();
        } else if (mapContainer.msRequestFullscreen) {
            mapContainer.msRequestFullscreen();
        }
    });
}

function startStatsUpdate() {
    setInterval(() => {
        updateStats();
    }, 1000);
}

function updateStats() {
    const totalDistance = mapManager.getTotalDistance();
    const pointCount = mapManager.getPathPoints().length;
    const avgSpeed = vehicleTracker.getAverageSpeed();

    document.getElementById('totalDistance').textContent = `${totalDistance} km`;
    document.getElementById('pointCount').textContent = pointCount;
    document.getElementById('avgSpeed').textContent = `${avgSpeed} km/h`;
}

function updateStatus(status) {
    document.getElementById('trackingStatus').textContent = status;
}

function updateTrackList() {
    const trackList = document.getElementById('trackList');
    const trackData = vehicleTracker.getCurrentTrackData();

    if (trackData.length === 0) {
        trackList.innerHTML = '<p class="empty-message">暂无轨迹数据</p>';
        return;
    }

    const recentPoints = trackData.slice(-10).reverse();
    
    trackList.innerHTML = recentPoints.map((point, index) => {
        const time = point.timestamp.toLocaleTimeString('zh-CN');
        const lng = point.lng.toFixed(6);
        const lat = point.lat.toFixed(6);
        const speed = point.speed.toFixed(1);
        
        return `
            <div class="track-item">
                <div><strong>${time}</strong></div>
                <div>坐标: ${lng}, ${lat}</div>
                <div>速度: ${speed} km/h</div>
            </div>
        `;
    }).join('');
}

function clearTrackList() {
    const trackList = document.getElementById('trackList');
    trackList.innerHTML = '<p class="empty-message">暂无轨迹数据</p>';
}

window.onerror = function(message, source, lineno, colno, error) {
    console.error('全局错误:', message, 'at', source, lineno, colno);
    return true;
};
