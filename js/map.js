class MapManager {
    constructor() {
        this.map = null;
        this.polyline = null;
        this.pathPoints = [];
        this.markers = [];
        this.vehicleMarker = null;
        this.defaultCenter = [116.397428, 39.90923];
        this.defaultZoom = 13;
    }

    initMap() {
        if (!AMap) {
            console.error('高德地图API未加载');
            alert('高德地图API未加载，请检查网络连接或API密钥');
            return;
        }

        this.map = new AMap.Map('map', {
            zoom: this.defaultZoom,
            center: this.defaultCenter,
            viewMode: '3D',
            pitch: 40,
            mapStyle: 'amap://styles/normal',
            showIndoorMap: false
        });

        this.map.on('complete', () => {
            console.log('地图加载完成');
        });

        return this.map;
    }

    addPathPoint(lng, lat, timestamp, speed) {
        const point = [lng, lat];
        this.pathPoints.push({
            position: point,
            timestamp: timestamp || new Date(),
            speed: speed || 0
        });

        this.updatePolyline();
        this.updateVehicleMarker(point);
        
        return this.pathPoints.length;
    }

    updatePolyline() {
        if (this.polyline) {
            this.map.remove(this.polyline);
        }

        if (this.pathPoints.length > 1) {
            const path = this.pathPoints.map(p => p.position);
            
            this.polyline = new AMap.Polyline({
                path: path,
                borderWeight: 2,
                strokeColor: '#667eea',
                strokeWeight: 6,
                strokeOpacity: 0.8,
                lineJoin: 'round',
                lineCap: 'round',
                showDir: true
            });

            this.map.add(this.polyline);
            this.map.setFitView([this.polyline]);
        }
    }

    updateVehicleMarker(position) {
        if (this.vehicleMarker) {
            this.vehicleMarker.setPosition(position);
        } else {
            const content = `
                <div style="
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: 3px solid white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 20px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                ">
                    🚗
                </div>
            `;

            this.vehicleMarker = new AMap.Marker({
                position: position,
                content: content,
                offset: new AMap.Pixel(-20, -20)
            });

            this.map.add(this.vehicleMarker);
        }

        this.map.setCenter(position);
    }

    addMarker(lng, lat, title, content) {
        const marker = new AMap.Marker({
            position: [lng, lat],
            title: title || ''
        });

        if (content) {
            const infoWindow = new AMap.InfoWindow({
                content: content
            });

            marker.on('click', () => {
                infoWindow.open(this.map, marker.getPosition());
            });
        }

        this.map.add(marker);
        this.markers.push(marker);

        return marker;
    }

    clearTrack() {
        if (this.polyline) {
            this.map.remove(this.polyline);
            this.polyline = null;
        }

        if (this.vehicleMarker) {
            this.map.remove(this.vehicleMarker);
            this.vehicleMarker = null;
        }

        this.markers.forEach(marker => {
            this.map.remove(marker);
        });
        this.markers = [];

        this.pathPoints = [];
    }

    getTotalDistance() {
        if (this.pathPoints.length < 2) return 0;

        let totalDistance = 0;
        for (let i = 1; i < this.pathPoints.length; i++) {
            const p1 = this.pathPoints[i - 1].position;
            const p2 = this.pathPoints[i].position;
            totalDistance += AMap.GeometryUtil.distance(p1, p2);
        }

        return (totalDistance / 1000).toFixed(2);
    }

    centerMap() {
        if (this.vehicleMarker) {
            this.map.setCenter(this.vehicleMarker.getPosition());
        } else {
            this.map.setCenter(this.defaultCenter);
        }
        this.map.setZoom(this.defaultZoom);
    }

    setMapCenter(lng, lat, zoom) {
        this.map.setCenter([lng, lat]);
        if (zoom) {
            this.map.setZoom(zoom);
        }
    }

    getPathPoints() {
        return this.pathPoints;
    }

    setPathPoints(points) {
        this.clearTrack();
        points.forEach(point => {
            this.addPathPoint(point.lng, point.lat, point.timestamp, point.speed);
        });
    }

    fitView() {
        if (this.polyline) {
            this.map.setFitView([this.polyline]);
        }
    }
}
