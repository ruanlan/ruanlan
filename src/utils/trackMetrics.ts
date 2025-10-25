import type { TrackPoint } from '../data/sampleTrack';

const EARTH_RADIUS_IN_METERS = 6371000;

export interface TrackMetrics {
  totalDistanceMeters: number;
  totalDurationSeconds: number;
  averageSpeedKmh: number;
  maxSpeedKmh: number;
  startTime?: Date;
  endTime?: Date;
}

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function haversineDistance(pointA: TrackPoint, pointB: TrackPoint): number {
  const lat1 = toRadians(pointA.lat);
  const lat2 = toRadians(pointB.lat);
  const deltaLat = lat2 - lat1;
  const deltaLng = toRadians(pointB.lng - pointA.lng);

  const a = Math.sin(deltaLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_IN_METERS * c;
}

export function calculateTrackMetrics(points: TrackPoint[]): TrackMetrics {
  if (points.length < 2) {
    const lastPoint = points[points.length - 1];
    return {
      totalDistanceMeters: 0,
      totalDurationSeconds: 0,
      averageSpeedKmh: 0,
      maxSpeedKmh: points[0]?.speed ?? 0,
      startTime: points[0]?.timestamp ? new Date(points[0].timestamp) : undefined,
      endTime: lastPoint?.timestamp ? new Date(lastPoint.timestamp) : undefined,
    };
  }

  let totalDistance = 0;
  let totalDurationSeconds = 0;
  let maxSpeed = typeof points[0]?.speed === 'number' ? (points[0]?.speed as number) : 0;

  for (let index = 1; index < points.length; index += 1) {
    const prev = points[index - 1];
    const current = points[index];
    totalDistance += haversineDistance(prev, current);

    if (prev.timestamp && current.timestamp) {
      const prevDate = new Date(prev.timestamp);
      const currentDate = new Date(current.timestamp);
      const deltaSeconds = Math.max(0, (currentDate.getTime() - prevDate.getTime()) / 1000);
      totalDurationSeconds += deltaSeconds;
    }

    if (typeof current.speed === 'number') {
      maxSpeed = Math.max(maxSpeed, current.speed);
    }
  }

  let averageSpeedKmh = 0;
  if (totalDistance > 0 && totalDurationSeconds > 0) {
    averageSpeedKmh = (totalDistance / 1000) / (totalDurationSeconds / 3600);
  }

  const lastPoint = points[points.length - 1];

  return {
    totalDistanceMeters: totalDistance,
    totalDurationSeconds,
    averageSpeedKmh,
    maxSpeedKmh: maxSpeed,
    startTime: points[0].timestamp ? new Date(points[0].timestamp) : undefined,
    endTime: lastPoint?.timestamp ? new Date(lastPoint.timestamp) : undefined,
  };
}

export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters.toFixed(0)} 米`;
  }
  return `${(meters / 1000).toFixed(2)} 公里`;
}

export function formatDuration(totalSeconds: number): string {
  if (!Number.isFinite(totalSeconds) || totalSeconds <= 0) {
    return '—';
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const parts: string[] = [];
  if (hours > 0) {
    parts.push(`${hours} 小时`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} 分`);
  }
  if (seconds > 0 && hours === 0) {
    parts.push(`${seconds} 秒`);
  }

  return parts.length > 0 ? parts.join(' ') : '小于 1 秒';
}

export function formatSpeed(kmh: number): string {
  if (!Number.isFinite(kmh) || kmh <= 0) {
    return '—';
  }

  return `${kmh.toFixed(1)} km/h`;
}
