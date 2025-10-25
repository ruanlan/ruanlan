import { useState, useCallback } from 'react';

export const useGeolocation = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const getCurrentPosition = useCallback(() => {
    if (!window.AMap) {
      setError(new Error('高德地图API未加载'));
      return Promise.reject(new Error('高德地图API未加载'));
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve, reject) => {
      window.AMap.plugin('AMap.Geolocation', () => {
        const geolocation = new window.AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
          convert: true,
          showButton: false,
          showMarker: false,
          showCircle: false,
        });

        geolocation.getCurrentPosition((status, result) => {
          setLoading(false);

          if (status === 'complete') {
            const pos = {
              lng: result.position.lng,
              lat: result.position.lat,
              accuracy: result.accuracy,
              address: result.formattedAddress,
            };
            setPosition(pos);
            resolve(pos);
          } else {
            const err = new Error(result.message || '定位失败');
            setError(err);
            reject(err);
          }
        });
      });
    });
  }, []);

  const watchPosition = useCallback((callback) => {
    if (!window.AMap) {
      setError(new Error('高德地图API未加载'));
      return null;
    }

    window.AMap.plugin('AMap.Geolocation', () => {
      const geolocation = new window.AMap.Geolocation({
        enableHighAccuracy: true,
        timeout: 10000,
        convert: true,
      });

      const watchId = setInterval(() => {
        geolocation.getCurrentPosition((status, result) => {
          if (status === 'complete') {
            const pos = {
              lng: result.position.lng,
              lat: result.position.lat,
              accuracy: result.accuracy,
            };
            setPosition(pos);
            if (callback) callback(pos);
          }
        });
      }, 5000);

      return () => clearInterval(watchId);
    });
  }, []);

  return {
    position,
    error,
    loading,
    getCurrentPosition,
    watchPosition,
  };
};
