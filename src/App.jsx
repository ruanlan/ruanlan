import { useState, useEffect } from 'react';
import { Layout, Tabs, Button, message, ConfigProvider, theme } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ControlOutlined,
  BarChartOutlined,
  UnorderedListOutlined,
  BulbOutlined,
} from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import MapView from './components/MapView';
import ControlPanel from './components/ControlPanel';
import StatisticsPanel from './components/StatisticsPanel';
import VehicleList from './components/VehicleList';
import useVehicleStore from './store/vehicleStore';

const { Header, Sider, Content } = Layout;

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('control');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);

  const {
    selectedVehicleId,
    playbackVehicleId,
    playbackIndex,
    getSelectedVehicle,
    getPlaybackVehicle,
  } = useVehicleStore();

  const selectedVehicle = getSelectedVehicle();
  const playbackVehicle = getPlaybackVehicle();

  useEffect(() => {
    if (!window.AMap) {
      message.error('高德地图API未加载，请检查网络连接和API Key配置', 5);
    } else {
      message.success('高德地图API加载成功', 2);
    }
  }, []);

  const getCurrentPosition = () => {
    if (playbackVehicle && playbackVehicle.trackData.length > 0) {
      return playbackVehicle.trackData[playbackIndex];
    }

    if (selectedVehicle && selectedVehicle.currentPosition) {
      return selectedVehicle.currentPosition;
    }

    return null;
  };

  const getTrackData = () => {
    if (playbackVehicle) {
      return playbackVehicle.trackData.slice(0, playbackIndex + 1);
    }

    if (selectedVehicle) {
      return selectedVehicle.trackData || [];
    }

    return [];
  };

  const tabItems = [
    {
      key: 'control',
      label: (
        <span>
          <ControlOutlined />
          控制面板
        </span>
      ),
      children: <ControlPanel />,
    },
    {
      key: 'statistics',
      label: (
        <span>
          <BarChartOutlined />
          统计信息
        </span>
      ),
      children: <StatisticsPanel />,
    },
    {
      key: 'vehicles',
      label: (
        <span>
          <UnorderedListOutlined />
          车辆列表
        </span>
      ),
      children: <VehicleList />,
    },
  ];

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    message.info(isDarkMode ? '切换到亮色主题' : '切换到暗色主题');
  };

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: isDarkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1890ff',
        },
      }}
    >
      <Layout style={{ height: '100vh' }}>
        <Header
          style={{
            padding: '0 20px',
            background: isDarkMode ? '#001529' : '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            <h2
              style={{
                margin: 0,
                marginLeft: 16,
                color: isDarkMode ? '#fff' : '#000',
                fontSize: 18,
              }}
            >
              🚗 高德地图车辆轨迹追踪系统
            </h2>
          </div>

          <div>
            <Button
              type="text"
              icon={<BulbOutlined />}
              onClick={toggleTheme}
              style={{ marginRight: 8 }}
            >
              {isDarkMode ? '亮色' : '暗色'}
            </Button>
            {selectedVehicle && (
              <span style={{ marginLeft: 16, color: isDarkMode ? '#fff' : '#000' }}>
                当前车辆: <strong>{selectedVehicle.vehicleNumber}</strong>
              </span>
            )}
          </div>
        </Header>

        <Layout>
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={setCollapsed}
            width={350}
            collapsedWidth={0}
            style={{
              background: isDarkMode ? '#001529' : '#fff',
              boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
              zIndex: 100,
            }}
            trigger={null}
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              style={{ height: '100%' }}
              tabBarStyle={{ padding: '0 16px' }}
            />
          </Sider>

          <Content
            style={{
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <MapView
              trackData={getTrackData()}
              currentPosition={getCurrentPosition()}
              onMapReady={setMapInstance}
              showStartEndMarkers={!playbackVehicleId}
              centerOnCurrent={!!playbackVehicleId}
              mapStyle={isDarkMode ? 'dark' : 'normal'}
            />

            {!window.AMap && (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(255, 255, 255, 0.95)',
                  padding: '40px',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  textAlign: 'center',
                  zIndex: 1000,
                }}
              >
                <h3 style={{ color: '#f5222d', marginBottom: 16 }}>⚠️ 地图加载失败</h3>
                <p style={{ marginBottom: 8 }}>请检查以下配置：</p>
                <ul style={{ textAlign: 'left', color: '#666' }}>
                  <li>确保已正确配置高德地图 API Key</li>
                  <li>检查网络连接是否正常</li>
                  <li>确认 API Key 有效且有访问权限</li>
                </ul>
                <p style={{ marginTop: 16, fontSize: 12, color: '#999' }}>
                  配置文件: index-react.html
                </p>
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default App;
