import { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../constants';
import { createVehicleIcon, createMarkerIcon } from '../utils/mapUtils';

const MapView = ({ 
  trackData = [], 
  currentPosition = null, 
  onMapReady,
  showStartEndMarkers = true,
  centerOnCurrent = false,
  mapStyle = 'normal'
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const polylineRef = useRef(null);
  const vehicleMarkerRef = useRef(null);
  const startMarkerRef = useRef(null);
  const endMarkerRef = useRef(null);
  const trackPointMarkersRef = useRef([]);
  const [isMapReady, setIsMapReady] = useState(false);

  useEffect(() => {
    if (!window.AMap) {
      message.error('高德地图API未加载，请检查配置');
      return;
    }

    const map = new window.AMap.Map(mapRef.current, {
      zoom: DEFAULT_MAP_ZOOM,
      center: DEFAULT_MAP_CENTER,
      viewMode: '3D',
      pitch: 50,
      mapStyle: getMapStyle(mapStyle),
      features: ['bg', 'road', 'building'],
    });

    mapInstanceRef.current = map;

    map.on('complete', () => {
      setIsMapReady(true);
      if (onMapReady) {
        onMapReady(map);
      }
    });

    return () => {
      clearMapOverlays();
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (isMapReady && mapInstanceRef.current) {
      mapInstanceRef.current.setMapStyle(getMapStyle(mapStyle));
    }
  }, [mapStyle, isMapReady]);

  useEffect(() => {
    if (!isMapReady) return;

    updateTrackLine();
    updateMarkers();
  }, [trackData, isMapReady]);

  useEffect(() => {
    if (!isMapReady) return;

    updateVehicleMarker();
    
    if (centerOnCurrent && currentPosition) {
      mapInstanceRef.current.setCenter([currentPosition.lng, currentPosition.lat]);
    }
  }, [currentPosition, isMapReady, centerOnCurrent]);

  const getMapStyle = (style) => {
    const styles = {
      normal: 'amap://styles/normal',
      dark: 'amap://styles/dark',
      light: 'amap://styles/light',
      satellite: 'amap://styles/satellite',
    };
    return styles[style] || styles.normal;
  };

  const clearMapOverlays = () => {
    if (polylineRef.current) {
      mapInstanceRef.current?.remove(polylineRef.current);
      polylineRef.current = null;
    }

    if (vehicleMarkerRef.current) {
      mapInstanceRef.current?.remove(vehicleMarkerRef.current);
      vehicleMarkerRef.current = null;
    }

    if (startMarkerRef.current) {
      mapInstanceRef.current?.remove(startMarkerRef.current);
      startMarkerRef.current = null;
    }

    if (endMarkerRef.current) {
      mapInstanceRef.current?.remove(endMarkerRef.current);
      endMarkerRef.current = null;
    }

    if (trackPointMarkersRef.current.length > 0) {
      mapInstanceRef.current?.remove(trackPointMarkersRef.current);
      trackPointMarkersRef.current = [];
    }
  };

  const updateTrackLine = () => {
    if (polylineRef.current) {
      mapInstanceRef.current.remove(polylineRef.current);
    }

    if (trackData.length > 1) {
      const path = trackData.map(point => [point.lng, point.lat]);
      
      polylineRef.current = new window.AMap.Polyline({
        path: path,
        strokeColor: '#1890ff',
        strokeWeight: 4,
        strokeOpacity: 0.8,
        lineJoin: 'round',
        lineCap: 'round',
      });

      mapInstanceRef.current.add(polylineRef.current);
      mapInstanceRef.current.setFitView([polylineRef.current]);
    }
  };

  const updateMarkers = () => {
    if (startMarkerRef.current) {
      mapInstanceRef.current.remove(startMarkerRef.current);
      startMarkerRef.current = null;
    }

    if (endMarkerRef.current) {
      mapInstanceRef.current.remove(endMarkerRef.current);
      endMarkerRef.current = null;
    }

    if (showStartEndMarkers && trackData.length > 0) {
      const startPoint = trackData[0];
      startMarkerRef.current = new window.AMap.Marker({
        position: [startPoint.lng, startPoint.lat],
        icon: createMarkerIcon('#52c41a', 'S'),
        title: '起点',
        offset: new window.AMap.Pixel(-12, -12),
      });

      mapInstanceRef.current.add(startMarkerRef.current);

      if (trackData.length > 1) {
        const endPoint = trackData[trackData.length - 1];
        endMarkerRef.current = new window.AMap.Marker({
          position: [endPoint.lng, endPoint.lat],
          icon: createMarkerIcon('#f5222d', 'E'),
          title: '终点',
          offset: new window.AMap.Pixel(-12, -12),
        });

        mapInstanceRef.current.add(endMarkerRef.current);
      }
    }
  };

  const updateVehicleMarker = () => {
    if (vehicleMarkerRef.current) {
      mapInstanceRef.current.remove(vehicleMarkerRef.current);
    }

    if (currentPosition) {
      const rotation = currentPosition.direction || 0;
      
      vehicleMarkerRef.current = new window.AMap.Marker({
        position: [currentPosition.lng, currentPosition.lat],
        icon: createVehicleIcon('#1890ff', rotation),
        offset: new window.AMap.Pixel(-16, -16),
        title: '当前位置',
      });

      const content = `
        <div class="custom-info-window">
          <h4>车辆信息</h4>
          ${currentPosition.speed ? `<p>速度: ${currentPosition.speed}km/h</p>` : ''}
          ${currentPosition.altitude ? `<p>海拔: ${currentPosition.altitude}m</p>` : ''}
          <p>时间: ${new Date(currentPosition.timestamp).toLocaleString()}</p>
        </div>
      `;

      const infoWindow = new window.AMap.InfoWindow({
        content: content,
        offset: new window.AMap.Pixel(0, -35),
      });

      vehicleMarkerRef.current.on('click', () => {
        infoWindow.open(mapInstanceRef.current, [currentPosition.lng, currentPosition.lat]);
      });

      mapInstanceRef.current.add(vehicleMarkerRef.current);
    }
  };

  const recenterMap = () => {
    if (currentPosition) {
      mapInstanceRef.current.setZoomAndCenter(DEFAULT_MAP_ZOOM, [
        currentPosition.lng,
        currentPosition.lat,
      ]);
    } else if (trackData.length > 0) {
      if (polylineRef.current) {
        mapInstanceRef.current.setFitView([polylineRef.current]);
      }
    }
  };

  return (
    <div className="map-container">
      <div ref={mapRef} id="map-container" />
    </div>
  );
};

export default MapView;
