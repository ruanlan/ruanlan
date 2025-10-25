import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { VehicleTrack } from '../data/sampleTrack';
import { loadAmap } from '../utils/loadAmap';
import { calculateTrackMetrics, formatDistance, formatDuration, formatSpeed } from '../utils/trackMetrics';
import './VehicleTrackMap.css';

type AnimationPhase = 'idle' | 'loading' | 'running' | 'paused' | 'finished' | 'error';

interface VehicleTrackMapProps {
  track: VehicleTrack;
}

const MIN_PLAYBACK_SPEED_MS = 10; // 对应大约 36 km/h 的回放速度

const VehicleTrackMap = ({ track }: VehicleTrackMapProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const movingMarkerRef = useRef<any>(null);
  const pathRef = useRef<[number, number][]>([]);

  const [phase, setPhase] = useState<AnimationPhase>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const metrics = useMemo(() => calculateTrackMetrics(track.points), [track.points]);

  const playbackSpeed = useMemo(() => {
    if (metrics.averageSpeedKmh > 1) {
      return Math.max((metrics.averageSpeedKmh * 1000) / 3600, MIN_PLAYBACK_SPEED_MS);
    }
    return MIN_PLAYBACK_SPEED_MS;
  }, [metrics.averageSpeedKmh]);

  const startPlayback = useCallback(
    (resetPosition: boolean) => {
      const marker = movingMarkerRef.current;
      const path = pathRef.current;

      if (!marker || !path.length) {
        return;
      }

      if (resetPosition) {
        marker.stopMove?.();
        marker.setPosition?.(path[0]);
      }

      marker.moveAlong?.(path, playbackSpeed);
      setPhase('running');
    },
    [playbackSpeed]
  );

  useEffect(() => {
    let isUnmounted = false;

    async function initMap() {
      if (!containerRef.current) {
        return;
      }

      try {
        setPhase('loading');
        setErrorMessage('');

        if (!import.meta.env.VITE_AMAP_KEY) {
          throw new Error('未检测到 VITE_AMAP_KEY，请先在项目根目录创建 .env 并填写高德地图 Key。');
        }

        const AMap = await loadAmap(import.meta.env.VITE_AMAP_KEY);
        if (isUnmounted) {
          return;
        }

        const path = track.points.map((point) => [point.lng, point.lat] as [number, number]);
        if (path.length < 2) {
          throw new Error('轨迹点数量不足，至少需要两个坐标点。');
        }
        pathRef.current = path;

        mapInstanceRef.current = new AMap.Map(containerRef.current, {
          viewMode: '3D',
          zoom: 14,
          center: path[0],
          mapStyle: 'amap://styles/whitesmoke',
        });

        mapInstanceRef.current?.addControl?.(new AMap.ToolBar());
        mapInstanceRef.current?.addControl?.(new AMap.Scale());
        mapInstanceRef.current?.addControl?.(new AMap.HawkEye({ isOpen: false }));

        const polyline = new AMap.Polyline({
          path,
          strokeColor: '#1e88e5',
          strokeOpacity: 0.9,
          strokeWeight: 6,
          lineJoin: 'round',
          lineCap: 'round',
          showDir: true,
        });

        mapInstanceRef.current.add(polyline);
        mapInstanceRef.current.setFitView([polyline], true, [32, 32, 48, 320]);

        const createMarker = (imageUrl: string, position: [number, number], title: string) =>
          new AMap.Marker({
            position,
            title,
            anchor: 'bottom-center',
            icon: new AMap.Icon({
              image: imageUrl,
              size: new AMap.Size(32, 42),
              imageSize: new AMap.Size(32, 42),
            }),
          });

        const startMarker = createMarker(
          'https://a.amap.com/jsapi_demos/static/demo-center/icons/marker-start.png',
          path[0],
          '起点'
        );
        const endMarker = createMarker(
          'https://a.amap.com/jsapi_demos/static/demo-center/icons/marker-end.png',
          path[path.length - 1],
          '终点'
        );

        const movingMarker = new AMap.Marker({
          position: path[0],
          title: '车辆当前位置',
          offset: new AMap.Pixel(-20, -20),
          autoRotation: true,
          zIndex: 120,
          icon: new AMap.Icon({
            image: '/car.svg',
            size: new AMap.Size(40, 40),
            imageSize: new AMap.Size(40, 40),
          }),
        });

        mapInstanceRef.current.add([startMarker, endMarker, movingMarker]);

        await new Promise<void>((resolve) => {
          if (!(AMap as any).plugin) {
            resolve();
            return;
          }
          AMap.plugin('AMap.MoveAnimation', () => resolve());
        });

        movingMarker.on?.('moveend', () => {
          setPhase('finished');
        });

        movingMarkerRef.current = movingMarker;
        setPhase('paused');
        startPlayback(true);
      } catch (error) {
        if (isUnmounted) {
          return;
        }
        setPhase('error');
        setErrorMessage(error instanceof Error ? error.message : '高德地图加载失败，请稍后重试。');
      }
    }

    initMap();

    return () => {
      isUnmounted = true;
      movingMarkerRef.current?.stopMove?.();
      movingMarkerRef.current = null;
      mapInstanceRef.current?.destroy?.();
      mapInstanceRef.current = null;
      pathRef.current = [];
    };
  }, [startPlayback, track.points]);

  const handlePause = useCallback(() => {
    movingMarkerRef.current?.pauseMove?.();
    setPhase('paused');
  }, []);

  const handleResume = useCallback(() => {
    if (phase === 'finished') {
      startPlayback(true);
      return;
    }
    movingMarkerRef.current?.resumeMove?.();
    setPhase('running');
  }, [phase, startPlayback]);

  const handleRestart = useCallback(() => {
    startPlayback(true);
  }, [startPlayback]);

  return (
    <div className="vehicle-track-map">
      <div className="vehicle-track-map__map">
        <div ref={containerRef} className="vehicle-track-map__map__canvas" />
        {phase === 'loading' && (
          <div className="vehicle-track-map__overlay">正在加载高德地图…</div>
        )}
        {phase === 'error' && errorMessage && (
          <div className="vehicle-track-map__overlay">{errorMessage}</div>
        )}
      </div>
      <aside className="vehicle-track-map__panel">
        <div>
          <h2>{track.name}</h2>
          {track.description && <p className="vehicle-track-map__meta">{track.description}</p>}
          {track.vehicleType && (
            <p className="vehicle-track-map__meta">
              车辆类型：<strong>{track.vehicleType}</strong>
            </p>
          )}
          {metrics.startTime && metrics.endTime && (
            <p className="vehicle-track-map__meta">
              运行时间：
              <strong>
                {metrics.startTime.toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
                {' '}–{' '}
                {metrics.endTime.toLocaleTimeString('zh-CN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </strong>
            </p>
          )}
        </div>

        <div className="vehicle-track-map__info">
          <div className="vehicle-track-map__info-item">
            <span>总里程</span>
            <strong>{formatDistance(metrics.totalDistanceMeters)}</strong>
          </div>
          <div className="vehicle-track-map__info-item">
            <span>总耗时</span>
            <strong>{formatDuration(metrics.totalDurationSeconds)}</strong>
          </div>
          <div className="vehicle-track-map__info-item">
            <span>平均速度</span>
            <strong>{formatSpeed(metrics.averageSpeedKmh)}</strong>
          </div>
          <div className="vehicle-track-map__info-item">
            <span>最高速度</span>
            <strong>{formatSpeed(metrics.maxSpeedKmh)}</strong>
          </div>
        </div>

        <div className="vehicle-track-map__controls">
          <button
            type="button"
            className="secondary"
            onClick={handleRestart}
            disabled={phase === 'loading' || phase === 'idle' || phase === 'error'}
          >
            重新播放
          </button>
          {phase === 'running' ? (
            <button type="button" className="primary" onClick={handlePause}>
              暂停
            </button>
          ) : (
            <button
              type="button"
              className="primary"
              onClick={handleResume}
              disabled={phase === 'loading' || phase === 'error'}
            >
              {phase === 'finished' ? '重新开始' : '继续'}
            </button>
          )}
        </div>
      </aside>
    </div>
  );
};

export default VehicleTrackMap;
