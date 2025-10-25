const AMAP_SCRIPT_ID = 'amap-jsapi-script';
const AMAP_SDK_URL = 'https://webapi.amap.com/maps';

const cachedSdkByKey = new Map<string, Promise<any>>();

export function loadAmap(apiKey: string): Promise<any> {
  if (!apiKey) {
    return Promise.reject(new Error('缺少高德地图 Web JSAPI 的 key。'));
  }

  if (window.AMap) {
    return Promise.resolve(window.AMap);
  }

  if (cachedSdkByKey.has(apiKey)) {
    return cachedSdkByKey.get(apiKey)!;
  }

  const sdkPromise = new Promise<any>((resolve, reject) => {
    const existingScript = document.getElementById(AMAP_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = AMAP_SCRIPT_ID;
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    const query = new URLSearchParams({
      v: '2.0',
      key: apiKey,
      plugin: 'AMap.MoveAnimation,AMap.ToolBar,AMap.Scale,AMap.HawkEye',
    });
    script.src = `${AMAP_SDK_URL}?${query.toString()}`;

    script.onload = () => {
      if (window.AMap) {
        resolve(window.AMap);
      } else {
        reject(new Error('高德地图 SDK 加载后未在 window 上挂载 AMap 对象。'));
      }
    };

    script.onerror = () => {
      script.remove();
      reject(new Error('高德地图 SDK 加载失败，请检查网络和 key 是否正确。'));
    };

    document.head.appendChild(script);
  });

  cachedSdkByKey.set(apiKey, sdkPromise);

  return sdkPromise;
}
