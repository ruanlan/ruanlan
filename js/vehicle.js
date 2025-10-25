class VehicleTracker {
    constructor(mapManager) {
        this.mapManager = mapManager;
        this.isTracking = false;
        this.trackingInterval = null;
        this.vehicleId = '';
        this.vehicleName = '';
        this.currentTrackData = [];
        this.playbackIndex = 0;
        this.playbackInterval = null;
        this.isPlayingBack = false;
    }

    startTracking(vehicleId, vehicleName) {
        if (this.isTracking) {
            console.log('已在追踪中');
            return;
        }

        this.vehicleId = vehicleId || 'VEHICLE_' + Date.now();
        this.vehicleName = vehicleName || '未命名车辆';
        this.isTracking = true;

        console.log(`开始追踪车辆: ${this.vehicleName} (${this.vehicleId})`);

        this.simulateTracking();
    }

    stopTracking() {
        if (!this.isTracking) {
            console.log('未在追踪');
            return;
        }

        this.isTracking = false;
        if (this.trackingInterval) {
            clearInterval(this.trackingInterval);
            this.trackingInterval = null;
        }

        console.log('停止追踪');
    }

    simulateTracking() {
        let currentPos = this.mapManager.defaultCenter.slice();
        const speed = 60;

        this.trackingInterval = setInterval(() => {
            if (!this.isTracking) return;

            const offset = 0.003;
            const randomLng = currentPos[0] + (Math.random() - 0.5) * offset;
            const randomLat = currentPos[1] + (Math.random() - 0.5) * offset;

            currentPos = [randomLng, randomLat];

            const timestamp = new Date();
            const trackPoint = {
                lng: randomLng,
                lat: randomLat,
                timestamp: timestamp,
                speed: speed + Math.random() * 20 - 10
            };

            this.currentTrackData.push(trackPoint);
            this.mapManager.addPathPoint(randomLng, randomLat, timestamp, trackPoint.speed);

        }, 2000);
    }

    loadSampleRoute() {
        this.mapManager.clearTrack();
        this.currentTrackData = [];

        const basePoint = [116.397428, 39.90923];
        const sampleRoute = [
            { lng: 116.397428, lat: 39.90923, speed: 40 },
            { lng: 116.401428, lat: 39.91123, speed: 45 },
            { lng: 116.405428, lat: 39.91323, speed: 50 },
            { lng: 116.409428, lat: 39.91523, speed: 55 },
            { lng: 116.413428, lat: 39.91723, speed: 60 },
            { lng: 116.417428, lat: 39.91923, speed: 50 },
            { lng: 116.421428, lat: 39.92123, speed: 45 },
            { lng: 116.425428, lat: 39.92323, speed: 40 },
            { lng: 116.429428, lat: 39.92523, speed: 35 },
            { lng: 116.433428, lat: 39.92723, speed: 30 }
        ];

        sampleRoute.forEach((point, index) => {
            const timestamp = new Date(Date.now() + index * 60000);
            const trackPoint = {
                lng: point.lng,
                lat: point.lat,
                timestamp: timestamp,
                speed: point.speed
            };
            
            this.currentTrackData.push(trackPoint);
            this.mapManager.addPathPoint(point.lng, point.lat, timestamp, point.speed);
        });

        console.log('已加载示例路线');
        this.mapManager.fitView();
    }

    generateRandomRoute() {
        this.mapManager.clearTrack();
        this.currentTrackData = [];

        const startPoint = [
            116.397428 + (Math.random() - 0.5) * 0.1,
            39.90923 + (Math.random() - 0.5) * 0.1
        ];

        const pointCount = 15 + Math.floor(Math.random() * 10);
        let currentPoint = startPoint;

        for (let i = 0; i < pointCount; i++) {
            const offset = 0.005;
            const newLng = currentPoint[0] + (Math.random() - 0.3) * offset;
            const newLat = currentPoint[1] + (Math.random() - 0.3) * offset;
            
            currentPoint = [newLng, newLat];

            const timestamp = new Date(Date.now() + i * 120000);
            const speed = 30 + Math.random() * 40;

            const trackPoint = {
                lng: newLng,
                lat: newLat,
                timestamp: timestamp,
                speed: speed
            };

            this.currentTrackData.push(trackPoint);
            this.mapManager.addPathPoint(newLng, newLat, timestamp, speed);
        }

        console.log('已生成随机路线');
        this.mapManager.fitView();
    }

    startPlayback() {
        if (this.currentTrackData.length === 0) {
            alert('没有轨迹数据可回放');
            return;
        }

        if (this.isPlayingBack) {
            console.log('正在回放中');
            return;
        }

        this.mapManager.clearTrack();
        this.playbackIndex = 0;
        this.isPlayingBack = true;

        console.log('开始轨迹回放');

        this.playbackInterval = setInterval(() => {
            if (this.playbackIndex >= this.currentTrackData.length) {
                this.stopPlayback();
                return;
            }

            const point = this.currentTrackData[this.playbackIndex];
            this.mapManager.addPathPoint(point.lng, point.lat, point.timestamp, point.speed);
            
            this.playbackIndex++;
        }, 500);
    }

    pausePlayback() {
        if (!this.isPlayingBack) return;

        if (this.playbackInterval) {
            clearInterval(this.playbackInterval);
            this.playbackInterval = null;
        }

        this.isPlayingBack = false;
        console.log('暂停回放');
    }

    stopPlayback() {
        this.pausePlayback();
        this.playbackIndex = 0;
        console.log('停止回放');
    }

    getCurrentTrackData() {
        return this.currentTrackData;
    }

    getAverageSpeed() {
        if (this.currentTrackData.length === 0) return 0;

        const totalSpeed = this.currentTrackData.reduce((sum, point) => sum + point.speed, 0);
        return (totalSpeed / this.currentTrackData.length).toFixed(2);
    }

    clearAllData() {
        this.stopTracking();
        this.stopPlayback();
        this.currentTrackData = [];
        this.mapManager.clearTrack();
    }
}
