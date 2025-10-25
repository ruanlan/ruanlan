import { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Input,
  Space,
  Form,
  Select,
  Divider,
  Tooltip,
  message,
  Modal,
  DatePicker,
  Slider,
} from 'antd';
import {
  PlayCircleOutlined,
  PauseOutlined,
  StopOutlined,
  ClearOutlined,
  CarOutlined,
  EnvironmentOutlined,
  ThunderboltOutlined,
  DownloadOutlined,
  UploadOutlined,
  HistoryOutlined,
  AimOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import useVehicleStore from '../store/vehicleStore';
import trackingService from '../services/trackingService';
import { SAMPLE_ROUTES, PLAYBACK_SPEED_OPTIONS } from '../constants';
import { generateRandomRoute } from '../utils/mapUtils';
import { exportTrackData, downloadFile, generateVehicleNumber } from '../utils/vehicleUtils';
import dayjs from 'dayjs';

const { Option } = Select;
const { RangePicker } = DatePicker;

const ControlPanel = () => {
  const [form] = Form.useForm();
  const [historicalForm] = Form.useForm();
  const [isHistoricalModalOpen, setIsHistoricalModalOpen] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const {
    vehicles,
    selectedVehicleId,
    trackingVehicleId,
    playbackVehicleId,
    isPlaybackActive,
    playbackSpeed,
    playbackIndex,
    addVehicle,
    selectVehicle,
    startTracking,
    stopTracking,
    addTrackPoint,
    clearTrack,
    setTrackData,
    startPlayback,
    pausePlayback,
    resumePlayback,
    stopPlayback,
    setPlaybackSpeed,
    setPlaybackIndex,
    getSelectedVehicle,
    getTrackingVehicle,
    getPlaybackVehicle,
  } = useVehicleStore();

  const selectedVehicle = getSelectedVehicle();
  const trackingVehicle = getTrackingVehicle();
  const playbackVehicle = getPlaybackVehicle();

  useEffect(() => {
    return () => {
      trackingService.stopAllSimulations();
    };
  }, []);

  useEffect(() => {
    let playbackInterval;

    if (isPlaybackActive && playbackVehicle && playbackVehicle.trackData.length > 0) {
      playbackInterval = setInterval(() => {
        const nextIndex = playbackIndex + 1;
        if (nextIndex < playbackVehicle.trackData.length) {
          setPlaybackIndex(nextIndex);
        } else {
          handleStopPlayback();
          message.success('轨迹回放完成');
        }
      }, playbackSpeed);
    }

    return () => {
      if (playbackInterval) {
        clearInterval(playbackInterval);
      }
    };
  }, [isPlaybackActive, playbackIndex, playbackSpeed, playbackVehicle]);

  const handleAddVehicle = (values) => {
    const vehicleId = addVehicle({
      vehicleNumber: values.vehicleNumber,
      vehicleName: values.vehicleName || '',
    });

    selectVehicle(vehicleId);
    message.success('车辆添加成功');
    form.resetFields();
  };

  const handleStartTracking = () => {
    if (!selectedVehicleId) {
      message.warning('请先添加车辆');
      return;
    }

    if (trackingVehicleId) {
      message.warning('已有车辆在追踪中');
      return;
    }

    startTracking(selectedVehicleId);

    const currentPosition = selectedVehicle?.currentPosition || {
      lng: 116.397428,
      lat: 39.90923,
    };

    trackingService.startSimulation(
      selectedVehicleId,
      currentPosition,
      (trackPoint) => {
        addTrackPoint(selectedVehicleId, trackPoint);
      }
    );

    message.success('开始追踪');
  };

  const handleStopTracking = () => {
    if (!trackingVehicleId) return;

    trackingService.stopSimulation(trackingVehicleId);
    stopTracking(trackingVehicleId);
    message.info('追踪已停止');
  };

  const handleClearTrack = () => {
    if (!selectedVehicleId) {
      message.warning('请先选择车辆');
      return;
    }

    Modal.confirm({
      title: '确认清除',
      content: '确定要清除该车辆的所有轨迹数据吗？',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        clearTrack(selectedVehicleId);
        message.success('轨迹已清除');
      },
    });
  };

  const handleLoadSampleRoute = (routeKey) => {
    if (!selectedVehicleId) {
      message.warning('请先添加车辆');
      return;
    }

    const route = SAMPLE_ROUTES[routeKey];
    const trackData = route.points.map((point, index) => ({
      ...point,
      timestamp: Date.now() + index * 60000,
    }));

    setTrackData(selectedVehicleId, trackData);
    message.success(`已加载示例路线: ${route.name}`);
  };

  const handleGenerateRandomRoute = () => {
    if (!selectedVehicleId) {
      message.warning('请先添加车辆');
      return;
    }

    const center = selectedVehicle?.currentPosition || {
      lng: 116.397428,
      lat: 39.90923,
    };

    const trackData = generateRandomRoute(center, 15, 3);
    setTrackData(selectedVehicleId, trackData);
    message.success('随机路线生成成功');
  };

  const handleStartPlayback = () => {
    if (!selectedVehicleId) {
      message.warning('请先选择车辆');
      return;
    }

    if (!selectedVehicle || selectedVehicle.trackData.length === 0) {
      message.warning('该车辆暂无轨迹数据');
      return;
    }

    startPlayback(selectedVehicleId, playbackSpeed);
    message.success('开始轨迹回放');
  };

  const handlePausePlayback = () => {
    if (isPlaybackActive) {
      pausePlayback();
      message.info('回放已暂停');
    } else {
      resumePlayback();
      message.info('继续回放');
    }
  };

  const handleStopPlayback = () => {
    stopPlayback();
  };

  const handleExportTrack = (format) => {
    if (!selectedVehicle || selectedVehicle.trackData.length === 0) {
      message.warning('暂无轨迹数据可导出');
      return;
    }

    const content = exportTrackData(selectedVehicle, format);
    const filename = `${selectedVehicle.vehicleNumber}_track_${Date.now()}.${format}`;
    
    const mimeTypes = {
      json: 'application/json',
      csv: 'text/csv',
      gpx: 'application/gpx+xml',
    };

    downloadFile(content, filename, mimeTypes[format]);
    message.success('轨迹数据导出成功');
  };

  const handleGetCurrentLocation = async () => {
    try {
      message.loading({ content: '正在获取当前位置...', key: 'location' });
      const location = await trackingService.getCurrentLocation();
      
      if (selectedVehicleId) {
        addTrackPoint(selectedVehicleId, {
          ...location,
          timestamp: Date.now(),
          speed: 0,
        });
      }
      
      message.success({ content: '定位成功', key: 'location' });
    } catch (error) {
      message.error({ content: '定位失败: ' + error.message, key: 'location' });
    }
  };

  const handleLoadHistoricalTrack = async (values) => {
    if (!selectedVehicleId) {
      message.warning('请先选择车辆');
      return;
    }

    setIsLoadingHistory(true);

    try {
      const [startTime, endTime] = values.dateRange;
      const trackData = await trackingService.getHistoricalTrack(
        selectedVehicleId,
        startTime.valueOf(),
        endTime.valueOf()
      );

      setTrackData(selectedVehicleId, trackData);
      message.success('历史轨迹加载成功');
      setIsHistoricalModalOpen(false);
      historicalForm.resetFields();
    } catch (error) {
      message.error('加载历史轨迹失败');
    } finally {
      setIsLoadingHistory(false);
    }
  };

  const handleGenerateVehicleNumber = () => {
    form.setFieldsValue({
      vehicleNumber: generateVehicleNumber(),
    });
  };

  return (
    <div style={{ padding: '16px', height: '100%', overflowY: 'auto' }}>
      <Card title="车辆管理" size="small" style={{ marginBottom: 16 }}>
        <Form form={form} onFinish={handleAddVehicle} layout="vertical">
          <Form.Item
            label="车牌号"
            name="vehicleNumber"
            rules={[{ required: true, message: '请输入车牌号' }]}
          >
            <Input
              prefix={<CarOutlined />}
              placeholder="例如: 京A12345"
              addonAfter={
                <ThunderboltOutlined
                  onClick={handleGenerateVehicleNumber}
                  style={{ cursor: 'pointer' }}
                />
              }
            />
          </Form.Item>

          <Form.Item label="车辆名称" name="vehicleName">
            <Input placeholder="可选" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block icon={<CarOutlined />}>
              添加车辆
            </Button>
          </Form.Item>
        </Form>

        <Divider />

        <Form.Item label="选择车辆">
          <Select
            value={selectedVehicleId}
            onChange={selectVehicle}
            placeholder="请选择车辆"
          >
            {vehicles.map((vehicle) => (
              <Option key={vehicle.id} value={vehicle.id}>
                {vehicle.vehicleNumber} {vehicle.vehicleName && `(${vehicle.vehicleName})`}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Card>

      <Card title="追踪控制" size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            onClick={handleStartTracking}
            disabled={!selectedVehicleId || !!trackingVehicleId}
            block
          >
            开始追踪
          </Button>

          <Button
            danger
            icon={<StopOutlined />}
            onClick={handleStopTracking}
            disabled={!trackingVehicleId}
            block
          >
            停止追踪
          </Button>

          <Button
            icon={<ClearOutlined />}
            onClick={handleClearTrack}
            disabled={!selectedVehicleId}
            block
          >
            清除轨迹
          </Button>

          <Tooltip title="获取当前位置">
            <Button
              icon={<AimOutlined />}
              onClick={handleGetCurrentLocation}
              block
            >
              获取位置
            </Button>
          </Tooltip>
        </Space>
      </Card>

      <Card title="示例路线" size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          {Object.entries(SAMPLE_ROUTES).map(([key, route]) => (
            <Button
              key={key}
              icon={<EnvironmentOutlined />}
              onClick={() => handleLoadSampleRoute(key)}
              disabled={!selectedVehicleId}
              block
              size="small"
            >
              {route.name}
            </Button>
          ))}

          <Button
            icon={<ThunderboltOutlined />}
            onClick={handleGenerateRandomRoute}
            disabled={!selectedVehicleId}
            block
            type="dashed"
          >
            生成随机路线
          </Button>
        </Space>
      </Card>

      <Card title="轨迹回放" size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          {playbackVehicleId ? (
            <>
              <Button
                icon={isPlaybackActive ? <PauseOutlined /> : <PlayCircleOutlined />}
                onClick={handlePausePlayback}
                block
              >
                {isPlaybackActive ? '暂停回放' : '继续回放'}
              </Button>

              <Button icon={<StopOutlined />} onClick={handleStopPlayback} block danger>
                停止回放
              </Button>

              <div>
                <div style={{ marginBottom: 8 }}>回放速度</div>
                <Select
                  value={playbackSpeed}
                  onChange={setPlaybackSpeed}
                  style={{ width: '100%' }}
                >
                  {PLAYBACK_SPEED_OPTIONS.map((option) => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </div>

              {playbackVehicle && (
                <div>
                  <div style={{ marginBottom: 8 }}>
                    进度: {playbackIndex + 1} / {playbackVehicle.trackData.length}
                  </div>
                  <Slider
                    value={playbackIndex}
                    max={playbackVehicle.trackData.length - 1}
                    onChange={setPlaybackIndex}
                  />
                </div>
              )}
            </>
          ) : (
            <Button
              type="primary"
              icon={<PlayCircleOutlined />}
              onClick={handleStartPlayback}
              disabled={!selectedVehicle || selectedVehicle.trackData.length === 0}
              block
            >
              开始回放
            </Button>
          )}
        </Space>
      </Card>

      <Card title="数据管理" size="small" style={{ marginBottom: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }} size="small">
          <Button
            icon={<HistoryOutlined />}
            onClick={() => setIsHistoricalModalOpen(true)}
            disabled={!selectedVehicleId}
            block
          >
            加载历史轨迹
          </Button>

          <Divider style={{ margin: '8px 0' }}>导出轨迹</Divider>

          <Space.Compact style={{ width: '100%' }}>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleExportTrack('json')}
              disabled={!selectedVehicle || selectedVehicle.trackData.length === 0}
            >
              JSON
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleExportTrack('csv')}
              disabled={!selectedVehicle || selectedVehicle.trackData.length === 0}
            >
              CSV
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => handleExportTrack('gpx')}
              disabled={!selectedVehicle || selectedVehicle.trackData.length === 0}
            >
              GPX
            </Button>
          </Space.Compact>
        </Space>
      </Card>

      <Modal
        title="加载历史轨迹"
        open={isHistoricalModalOpen}
        onCancel={() => setIsHistoricalModalOpen(false)}
        footer={null}
      >
        <Form
          form={historicalForm}
          onFinish={handleLoadHistoricalTrack}
          layout="vertical"
        >
          <Form.Item
            label="时间范围"
            name="dateRange"
            rules={[{ required: true, message: '请选择时间范围' }]}
          >
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm:ss"
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.Item>
            <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
              <Button onClick={() => setIsHistoricalModalOpen(false)}>取消</Button>
              <Button type="primary" htmlType="submit" loading={isLoadingHistory}>
                加载
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ControlPanel;
