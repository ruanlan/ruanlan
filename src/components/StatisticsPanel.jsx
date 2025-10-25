import { Card, Statistic, Row, Col, Descriptions, Empty, Badge, Timeline } from 'antd';
import {
  CarOutlined,
  DashboardOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  ArrowUpOutlined,
} from '@ant-design/icons';
import useVehicleStore from '../store/vehicleStore';
import { formatDistance, formatSpeed, formatDuration } from '../utils/mapUtils';
import { VEHICLE_STATUS_COLORS, VEHICLE_STATUS_TEXT } from '../constants';
import { detectStopPoints, detectSpeedingAlerts } from '../utils/vehicleUtils';

const StatisticsPanel = () => {
  const { selectedVehicleId, getSelectedVehicle } = useVehicleStore();
  const vehicle = getSelectedVehicle();

  if (!selectedVehicleId || !vehicle) {
    return (
      <div style={{ padding: '16px' }}>
        <Empty description="请选择车辆查看统计信息" />
      </div>
    );
  }

  const hasTrackData = vehicle.trackData && vehicle.trackData.length > 0;
  const startTime = hasTrackData ? vehicle.trackData[0].timestamp : null;
  const endTime = hasTrackData
    ? vehicle.trackData[vehicle.trackData.length - 1].timestamp
    : null;
  const duration = startTime && endTime ? (endTime - startTime) / 1000 : 0;

  const maxSpeed = hasTrackData
    ? Math.max(...vehicle.trackData.map((p) => p.speed || 0))
    : 0;

  const stopPoints = hasTrackData ? detectStopPoints(vehicle.trackData) : [];
  const speedingAlerts = hasTrackData ? detectSpeedingAlerts(vehicle.trackData, 80) : [];

  return (
    <div style={{ padding: '16px', height: '100%', overflowY: 'auto' }}>
      <Card title="车辆信息" size="small" style={{ marginBottom: 16 }}>
        <Descriptions column={1} size="small">
          <Descriptions.Item label="车牌号">
            <Badge
              status={vehicle.isTracking ? 'processing' : 'default'}
              text={vehicle.vehicleNumber}
            />
          </Descriptions.Item>
          {vehicle.vehicleName && (
            <Descriptions.Item label="车辆名称">{vehicle.vehicleName}</Descriptions.Item>
          )}
          <Descriptions.Item label="状态">
            <Badge
              color={VEHICLE_STATUS_COLORS[vehicle.isTracking ? 'tracking' : 'stopped']}
              text={VEHICLE_STATUS_TEXT[vehicle.isTracking ? 'tracking' : 'stopped']}
            />
          </Descriptions.Item>
          {vehicle.lastUpdateTime && (
            <Descriptions.Item label="最后更新">
              {new Date(vehicle.lastUpdateTime).toLocaleString()}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Card>

      <Card title="实时统计" size="small" style={{ marginBottom: 16 }}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <Statistic
              title="总里程"
              value={vehicle.totalDistance}
              precision={2}
              suffix="km"
              prefix={<EnvironmentOutlined />}
              valueStyle={{ fontSize: 20 }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="轨迹点数"
              value={vehicle.trackData?.length || 0}
              prefix={<CarOutlined />}
              valueStyle={{ fontSize: 20 }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="平均速度"
              value={vehicle.averageSpeed}
              precision={1}
              suffix="km/h"
              prefix={<DashboardOutlined />}
              valueStyle={{ fontSize: 20 }}
            />
          </Col>
          <Col span={12}>
            <Statistic
              title="最高速度"
              value={maxSpeed}
              precision={0}
              suffix="km/h"
              prefix={<ThunderboltOutlined />}
              valueStyle={{ fontSize: 20, color: maxSpeed > 80 ? '#f5222d' : undefined }}
            />
          </Col>
          <Col span={24}>
            <Statistic
              title="行驶时长"
              value={formatDuration(duration)}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ fontSize: 18 }}
            />
          </Col>
        </Row>
      </Card>

      {vehicle.currentPosition && (
        <Card title="当前位置" size="small" style={{ marginBottom: 16 }}>
          <Descriptions column={1} size="small">
            <Descriptions.Item label="经度">
              {vehicle.currentPosition.lng.toFixed(6)}
            </Descriptions.Item>
            <Descriptions.Item label="纬度">
              {vehicle.currentPosition.lat.toFixed(6)}
            </Descriptions.Item>
            {vehicle.currentPosition.speed !== undefined && (
              <Descriptions.Item label="当前速度">
                {formatSpeed(vehicle.currentPosition.speed)}
              </Descriptions.Item>
            )}
            {vehicle.currentPosition.altitude !== undefined && (
              <Descriptions.Item label="海拔">
                {vehicle.currentPosition.altitude}m
              </Descriptions.Item>
            )}
            <Descriptions.Item label="时间">
              {new Date(vehicle.currentPosition.timestamp).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {stopPoints.length > 0 && (
        <Card title={`停车点 (${stopPoints.length})`} size="small" style={{ marginBottom: 16 }}>
          <Timeline
            mode="left"
            items={stopPoints.slice(0, 5).map((stop, index) => ({
              label: new Date(stop.startTime).toLocaleTimeString(),
              children: (
                <div>
                  <div>停留时长: {formatDuration(stop.duration / 1000)}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>
                    {stop.position.lat.toFixed(4)}, {stop.position.lng.toFixed(4)}
                  </div>
                </div>
              ),
            }))}
          />
          {stopPoints.length > 5 && (
            <div style={{ textAlign: 'center', color: '#999', fontSize: 12 }}>
              ... 还有 {stopPoints.length - 5} 个停车点
            </div>
          )}
        </Card>
      )}

      {speedingAlerts.length > 0 && (
        <Card
          title={
            <span style={{ color: '#f5222d' }}>
              超速警告 ({speedingAlerts.length})
            </span>
          }
          size="small"
          style={{ marginBottom: 16 }}
        >
          <Timeline
            mode="left"
            items={speedingAlerts.slice(0, 5).map((alert, index) => ({
              label: new Date(alert.timestamp).toLocaleTimeString(),
              color: 'red',
              children: (
                <div>
                  <div>{alert.message}</div>
                  <div style={{ fontSize: 12, color: '#999' }}>
                    {alert.position.lat.toFixed(4)}, {alert.position.lng.toFixed(4)}
                  </div>
                </div>
              ),
            }))}
          />
          {speedingAlerts.length > 5 && (
            <div style={{ textAlign: 'center', color: '#f5222d', fontSize: 12 }}>
              ... 还有 {speedingAlerts.length - 5} 条超速记录
            </div>
          )}
        </Card>
      )}

      {hasTrackData && (
        <Card title="轨迹详情" size="small">
          <Descriptions column={1} size="small">
            <Descriptions.Item label="起始时间">
              {new Date(startTime).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="结束时间">
              {new Date(endTime).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="起点坐标">
              {vehicle.trackData[0].lat.toFixed(6)}, {vehicle.trackData[0].lng.toFixed(6)}
            </Descriptions.Item>
            <Descriptions.Item label="终点坐标">
              {vehicle.trackData[vehicle.trackData.length - 1].lat.toFixed(6)},{' '}
              {vehicle.trackData[vehicle.trackData.length - 1].lng.toFixed(6)}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      )}

      {!hasTrackData && (
        <Card size="small">
          <Empty description="暂无轨迹数据" />
        </Card>
      )}
    </div>
  );
};

export default StatisticsPanel;
