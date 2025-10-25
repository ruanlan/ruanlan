import { VEHICLE_STATUS } from '../constants';

export const generateVehicleId = () => {
  return `VEH-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const generateVehicleNumber = () => {
  const provinces = ['京', '沪', '粤', '浙', '苏', '鲁', '川', '湘'];
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '0123456789';
  
  const province = provinces[Math.floor(Math.random() * provinces.length)];
  const letter = letters[Math.floor(Math.random() * letters.length)];
  
  let plateNumber = province + letter;
  for (let i = 0; i < 5; i++) {
    plateNumber += numbers[Math.floor(Math.random() * numbers.length)];
  }
  
  return plateNumber;
};

export const getVehicleStatus = (vehicle) => {
  if (!vehicle) return VEHICLE_STATUS.IDLE;
  
  if (vehicle.isTracking) {
    return VEHICLE_STATUS.TRACKING;
  }
  
  if (vehicle.lastUpdateTime) {
    const timeSinceUpdate = Date.now() - vehicle.lastUpdateTime;
    if (timeSinceUpdate > 5 * 60 * 1000) {
      return VEHICLE_STATUS.OFFLINE;
    }
  }
  
  if (vehicle.trackData && vehicle.trackData.length > 0) {
    return VEHICLE_STATUS.STOPPED;
  }
  
  return VEHICLE_STATUS.IDLE;
};

export const validateVehicleNumber = (plateNumber) => {
  const pattern = /^[京沪粤浙苏鲁川湘][A-Z][0-9]{5}$/;
  return pattern.test(plateNumber);
};

export const formatVehicleData = (vehicle) => {
  return {
    id: vehicle.id,
    vehicleNumber: vehicle.vehicleNumber,
    vehicleName: vehicle.vehicleName || '',
    status: getVehicleStatus(vehicle),
    currentPosition: vehicle.currentPosition,
    trackData: vehicle.trackData || [],
    totalDistance: vehicle.totalDistance || 0,
    averageSpeed: vehicle.averageSpeed || 0,
    lastUpdateTime: vehicle.lastUpdateTime,
    isTracking: vehicle.isTracking || false,
  };
};

export const exportTrackData = (vehicle, format = 'json') => {
  const data = formatVehicleData(vehicle);
  
  if (format === 'json') {
    return JSON.stringify(data, null, 2);
  }
  
  if (format === 'csv') {
    let csv = '时间,经度,纬度,速度,海拔\n';
    data.trackData.forEach((point) => {
      csv += `${new Date(point.timestamp).toLocaleString()},${point.lng},${point.lat},${point.speed || 0},${point.altitude || 0}\n`;
    });
    return csv;
  }
  
  if (format === 'gpx') {
    let gpx = '<?xml version="1.0" encoding="UTF-8"?>\n';
    gpx += '<gpx version="1.1" creator="AMap Vehicle Tracking">\n';
    gpx += '  <trk>\n';
    gpx += `    <name>${data.vehicleNumber}</name>\n`;
    gpx += '    <trkseg>\n';
    data.trackData.forEach((point) => {
      gpx += `      <trkpt lat="${point.lat}" lon="${point.lng}">\n`;
      if (point.altitude) gpx += `        <ele>${point.altitude}</ele>\n`;
      gpx += `        <time>${new Date(point.timestamp).toISOString()}</time>\n`;
      gpx += '      </trkpt>\n';
    });
    gpx += '    </trkseg>\n';
    gpx += '  </trk>\n';
    gpx += '</gpx>';
    return gpx;
  }
  
  return '';
};

export const downloadFile = (content, filename, mimeType) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importTrackData = (fileContent, format = 'json') => {
  try {
    if (format === 'json') {
      return JSON.parse(fileContent);
    }
    
    if (format === 'csv') {
      const lines = fileContent.split('\n');
      const trackData = [];
      
      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (line) {
          const [timestamp, lng, lat, speed, altitude] = line.split(',');
          trackData.push({
            timestamp: new Date(timestamp).getTime(),
            lng: parseFloat(lng),
            lat: parseFloat(lat),
            speed: parseFloat(speed),
            altitude: parseFloat(altitude),
          });
        }
      }
      
      return { trackData };
    }
    
    return null;
  } catch (error) {
    console.error('导入数据失败:', error);
    return null;
  }
};

export const calculateVehicleStatistics = (trackData) => {
  if (!trackData || trackData.length === 0) {
    return {
      totalDistance: 0,
      averageSpeed: 0,
      maxSpeed: 0,
      duration: 0,
      pointCount: 0,
    };
  }
  
  let totalDistance = 0;
  let totalSpeed = 0;
  let maxSpeed = 0;
  
  for (let i = 0; i < trackData.length - 1; i++) {
    const point1 = trackData[i];
    const point2 = trackData[i + 1];
    
    const distance = Math.sqrt(
      Math.pow(point2.lng - point1.lng, 2) + Math.pow(point2.lat - point1.lat, 2)
    ) * 111;
    
    totalDistance += distance;
    
    if (point1.speed) {
      totalSpeed += point1.speed;
      maxSpeed = Math.max(maxSpeed, point1.speed);
    }
  }
  
  const duration = trackData.length > 1
    ? (trackData[trackData.length - 1].timestamp - trackData[0].timestamp) / 1000
    : 0;
  
  return {
    totalDistance,
    averageSpeed: totalSpeed / trackData.length,
    maxSpeed,
    duration,
    pointCount: trackData.length,
  };
};

export const detectSpeedingAlerts = (trackData, speedLimit = 120) => {
  if (!trackData || trackData.length === 0) return [];
  
  const alerts = [];
  trackData.forEach((point, index) => {
    if (point.speed && point.speed > speedLimit) {
      alerts.push({
        type: 'speeding',
        timestamp: point.timestamp,
        position: { lng: point.lng, lat: point.lat },
        speed: point.speed,
        speedLimit,
        message: `超速行驶: ${Math.round(point.speed)}km/h (限速${speedLimit}km/h)`,
      });
    }
  });
  
  return alerts;
};

export const detectStopPoints = (trackData, minStopDuration = 60000) => {
  if (!trackData || trackData.length < 2) return [];
  
  const stopPoints = [];
  let stopStart = null;
  
  for (let i = 0; i < trackData.length; i++) {
    const point = trackData[i];
    
    if (!point.speed || point.speed < 5) {
      if (!stopStart) {
        stopStart = point;
      }
    } else {
      if (stopStart) {
        const duration = point.timestamp - stopStart.timestamp;
        if (duration >= minStopDuration) {
          stopPoints.push({
            position: { lng: stopStart.lng, lat: stopStart.lat },
            startTime: stopStart.timestamp,
            endTime: point.timestamp,
            duration,
          });
        }
        stopStart = null;
      }
    }
  }
  
  return stopPoints;
};
