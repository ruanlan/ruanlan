export const calculateDistance = (point1, point2) => {
  if (!point1 || !point2) return 0;
  
  const R = 6371;
  const dLat = toRad(point2.lat - point1.lat);
  const dLon = toRad(point2.lng - point1.lng);
  const lat1 = toRad(point1.lat);
  const lat2 = toRad(point2.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;

  return d;
};

const toRad = (value) => {
  return (value * Math.PI) / 180;
};

export const calculateTotalDistance = (points) => {
  if (!points || points.length < 2) return 0;

  let total = 0;
  for (let i = 0; i < points.length - 1; i++) {
    total += calculateDistance(points[i], points[i + 1]);
  }

  return total;
};

export const formatDistance = (km) => {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(2)}km`;
};

export const calculateAverageSpeed = (points) => {
  if (!points || points.length === 0) return 0;

  const totalSpeed = points.reduce((sum, point) => sum + (point.speed || 0), 0);
  return totalSpeed / points.length;
};

export const formatSpeed = (speed) => {
  return `${Math.round(speed)}km/h`;
};

export const calculateDuration = (startTime, endTime) => {
  if (!startTime || !endTime) return 0;
  return (endTime - startTime) / 1000;
};

export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}小时${minutes}分钟`;
  }
  if (minutes > 0) {
    return `${minutes}分钟${secs}秒`;
  }
  return `${secs}秒`;
};

export const isPointInCircle = (point, center, radius) => {
  const distance = calculateDistance(point, center);
  return distance <= radius;
};

export const isPointInPolygon = (point, polygon) => {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    const intersect =
      yi > point.lat !== yj > point.lat &&
      point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

export const generateRandomPoint = (center, radiusInKm) => {
  const radiusInDeg = radiusInKm / 111;
  const w = radiusInDeg * Math.sqrt(Math.random());
  const t = 2 * Math.PI * Math.random();
  const x = w * Math.cos(t);
  const y = w * Math.sin(t);
  const newLng = center.lng + x;
  const newLat = center.lat + y;

  return {
    lng: newLng,
    lat: newLat,
  };
};

export const generateRandomRoute = (center, numPoints = 10, radiusInKm = 5) => {
  const points = [];
  let currentPoint = { ...center };

  for (let i = 0; i < numPoints; i++) {
    const randomPoint = generateRandomPoint(currentPoint, radiusInKm / numPoints);
    const speed = 30 + Math.random() * 40;
    
    points.push({
      lng: randomPoint.lng,
      lat: randomPoint.lat,
      speed: Math.round(speed),
      timestamp: Date.now() + i * 60000,
    });

    currentPoint = randomPoint;
  }

  return points;
};

export const smoothPath = (points, tolerance = 0.00001) => {
  if (!points || points.length <= 2) return points;

  const simplified = [points[0]];
  let prevPoint = points[0];

  for (let i = 1; i < points.length - 1; i++) {
    const distance = calculateDistance(prevPoint, points[i]);
    if (distance > tolerance) {
      simplified.push(points[i]);
      prevPoint = points[i];
    }
  }

  simplified.push(points[points.length - 1]);
  return simplified;
};

export const interpolatePoints = (point1, point2, steps = 10) => {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const ratio = i / steps;
    points.push({
      lng: point1.lng + (point2.lng - point1.lng) * ratio,
      lat: point1.lat + (point2.lat - point1.lat) * ratio,
      speed: point1.speed + ((point2.speed || 0) - (point1.speed || 0)) * ratio,
    });
  }
  return points;
};

export const getBoundsFromPoints = (points) => {
  if (!points || points.length === 0) return null;

  let minLng = points[0].lng;
  let maxLng = points[0].lng;
  let minLat = points[0].lat;
  let maxLat = points[0].lat;

  points.forEach((point) => {
    minLng = Math.min(minLng, point.lng);
    maxLng = Math.max(maxLng, point.lng);
    minLat = Math.min(minLat, point.lat);
    maxLat = Math.max(maxLat, point.lat);
  });

  return {
    southwest: { lng: minLng, lat: minLat },
    northeast: { lng: maxLng, lat: maxLat },
  };
};

export const createVehicleIcon = (color = '#1890ff', rotation = 0) => {
  return new window.AMap.Icon({
    size: new window.AMap.Size(32, 32),
    image: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <g transform="rotate(${rotation} 16 16)">
          <path d="M16 2 L24 10 L22 10 L22 20 L10 20 L10 10 L8 10 Z" fill="${color}" stroke="white" stroke-width="1.5"/>
          <circle cx="12" cy="22" r="2" fill="#333"/>
          <circle cx="20" cy="22" r="2" fill="#333"/>
          <rect x="11" y="5" width="10" height="4" fill="white" opacity="0.7" rx="1"/>
        </g>
      </svg>
    `)}`,
    imageSize: new window.AMap.Size(32, 32),
  });
};

export const createMarkerIcon = (color = '#1890ff', label = '') => {
  return new window.AMap.Icon({
    size: new window.AMap.Size(24, 24),
    image: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
        <text x="12" y="16" text-anchor="middle" fill="white" font-size="12" font-weight="bold">${label}</text>
      </svg>
    `)}`,
    imageSize: new window.AMap.Size(24, 24),
  });
};
