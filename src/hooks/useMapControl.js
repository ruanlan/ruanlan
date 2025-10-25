import { useRef, useCallback } from 'react';

export const useMapControl = () => {
  const mapRef = useRef(null);

  const setMap = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const recenterMap = useCallback((position, zoom = 15) => {
    if (mapRef.current && position) {
      mapRef.current.setZoomAndCenter(zoom, [position.lng, position.lat]);
    }
  }, []);

  const fitBounds = useCallback((points) => {
    if (mapRef.current && points && points.length > 0) {
      const bounds = new window.AMap.Bounds(
        [points[0].lng, points[0].lat],
        [points[0].lng, points[0].lat]
      );

      points.forEach((point) => {
        bounds.extend([point.lng, point.lat]);
      });

      mapRef.current.setBounds(bounds);
    }
  }, []);

  const addMarker = useCallback((position, options = {}) => {
    if (!mapRef.current) return null;

    const marker = new window.AMap.Marker({
      position: [position.lng, position.lat],
      ...options,
    });

    mapRef.current.add(marker);
    return marker;
  }, []);

  const addPolyline = useCallback((path, options = {}) => {
    if (!mapRef.current) return null;

    const polyline = new window.AMap.Polyline({
      path: path.map((p) => [p.lng, p.lat]),
      strokeColor: '#1890ff',
      strokeWeight: 4,
      strokeOpacity: 0.8,
      ...options,
    });

    mapRef.current.add(polyline);
    return polyline;
  }, []);

  const removeOverlay = useCallback((overlay) => {
    if (mapRef.current && overlay) {
      mapRef.current.remove(overlay);
    }
  }, []);

  const clearMap = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.clearMap();
    }
  }, []);

  const setMapStyle = useCallback((style) => {
    if (mapRef.current) {
      mapRef.current.setMapStyle(`amap://styles/${style}`);
    }
  }, []);

  return {
    setMap,
    recenterMap,
    fitBounds,
    addMarker,
    addPolyline,
    removeOverlay,
    clearMap,
    setMapStyle,
    getMap: () => mapRef.current,
  };
};
