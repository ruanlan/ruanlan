import { generateRandomPoint } from '../utils/mapUtils';

class TrackingService {
  constructor() {
    this.intervals = new Map();
  }

  startSimulation(vehicleId, currentPosition, callback, interval = 2000) {
    if (this.intervals.has(vehicleId)) {
      this.stopSimulation(vehicleId);
    }

    let position = currentPosition || { lng: 116.397428, lat: 39.90923 };
    
    const intervalId = setInterval(() => {
      const newPosition = generateRandomPoint(position, 0.5);
      const speed = 30 + Math.random() * 40;
      
      const trackPoint = {
        lng: newPosition.lng,
        lat: newPosition.lat,
        speed: Math.round(speed),
        timestamp: Date.now(),
        altitude: Math.round(50 + Math.random() * 100),
      };

      callback(trackPoint);
      position = newPosition;
    }, interval);

    this.intervals.set(vehicleId, intervalId);
  }

  stopSimulation(vehicleId) {
    if (this.intervals.has(vehicleId)) {
      clearInterval(this.intervals.get(vehicleId));
      this.intervals.delete(vehicleId);
    }
  }

  stopAllSimulations() {
    this.intervals.forEach((intervalId) => clearInterval(intervalId));
    this.intervals.clear();
  }

  async getRealTimePosition(vehicleId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          lng: 116.397428 + (Math.random() - 0.5) * 0.1,
          lat: 39.90923 + (Math.random() - 0.5) * 0.1,
          speed: Math.round(30 + Math.random() * 40),
          timestamp: Date.now(),
        });
      }, 500);
    });
  }

  async getHistoricalTrack(vehicleId, startTime, endTime) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const trackData = [];
        const duration = endTime - startTime;
        const numPoints = Math.floor(duration / 60000);

        let currentLng = 116.397428;
        let currentLat = 39.90923;

        for (let i = 0; i < numPoints; i++) {
          currentLng += (Math.random() - 0.5) * 0.01;
          currentLat += (Math.random() - 0.5) * 0.01;

          trackData.push({
            lng: currentLng,
            lat: currentLat,
            speed: Math.round(30 + Math.random() * 40),
            timestamp: startTime + i * 60000,
          });
        }

        resolve(trackData);
      }, 1000);
    });
  }

  async getNearbyVehicles(position, radius = 5) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const vehicles = [];
        const numVehicles = Math.floor(Math.random() * 5) + 1;

        for (let i = 0; i < numVehicles; i++) {
          const randomPos = generateRandomPoint(position, radius);
          vehicles.push({
            id: `nearby-${i}`,
            vehicleNumber: `粤B${Math.floor(Math.random() * 100000)
              .toString()
              .padStart(5, '0')}`,
            position: randomPos,
            speed: Math.round(30 + Math.random() * 40),
          });
        }

        resolve(vehicles);
      }, 500);
    });
  }

  async geocodeAddress(address) {
    return new Promise((resolve, reject) => {
      if (!window.AMap) {
        reject(new Error('高德地图API未加载'));
        return;
      }

      window.AMap.plugin('AMap.Geocoder', () => {
        const geocoder = new window.AMap.Geocoder({
          city: '全国',
        });

        geocoder.getLocation(address, (status, result) => {
          if (status === 'complete' && result.geocodes.length) {
            const location = result.geocodes[0].location;
            resolve({
              lng: location.lng,
              lat: location.lat,
              address: result.geocodes[0].formattedAddress,
            });
          } else {
            reject(new Error('地址解析失败'));
          }
        });
      });
    });
  }

  async reverseGeocode(lng, lat) {
    return new Promise((resolve, reject) => {
      if (!window.AMap) {
        reject(new Error('高德地图API未加载'));
        return;
      }

      window.AMap.plugin('AMap.Geocoder', () => {
        const geocoder = new window.AMap.Geocoder({
          radius: 1000,
        });

        geocoder.getAddress([lng, lat], (status, result) => {
          if (status === 'complete' && result.regeocode) {
            resolve({
              address: result.regeocode.formattedAddress,
              province: result.regeocode.addressComponent.province,
              city: result.regeocode.addressComponent.city,
              district: result.regeocode.addressComponent.district,
            });
          } else {
            reject(new Error('逆地理编码失败'));
          }
        });
      });
    });
  }

  async getCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!window.AMap) {
        reject(new Error('高德地图API未加载'));
        return;
      }

      window.AMap.plugin('AMap.Geolocation', () => {
        const geolocation = new window.AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
        });

        geolocation.getCurrentPosition((status, result) => {
          if (status === 'complete') {
            resolve({
              lng: result.position.lng,
              lat: result.position.lat,
              accuracy: result.accuracy,
            });
          } else {
            reject(new Error('定位失败'));
          }
        });
      });
    });
  }
}

export default new TrackingService();
