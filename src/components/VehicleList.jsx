import { Card, List, Badge, Button, Space, Popconfirm, Tag, Empty } from 'antd';
import {
  CarOutlined,
  DeleteOutlined,
  EyeOutlined,
  EnvironmentOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import useVehicleStore from '../store/vehicleStore';
import { VEHICLE_STATUS_COLORS, VEHICLE_STATUS_TEXT } from '../constants';
import { getVehicleStatus } from '../utils/vehicleUtils';
import { formatDistance, formatSpeed } from '../utils/mapUtils';

const VehicleList = () => {
  const { vehicles, selectedVehicleId, selectVehicle, removeVehicle } = useVehicleStore();

  const handleDelete = (vehicleId, e) => {
    e.stopPropagation();
    removeVehicle(vehicleId);
  };

  const handleSelect = (vehicleId) => {
    selectVehicle(vehicleId);
  };

  if (vehicles.length === 0) {
    return (
      <div style={{ padding: '16px' }}>
        <Empty description="暂无车辆，请先添加车辆" />
      </div>
    );
  }

  return (
    <div style={{ padding: '16px', height: '100%', overflowY: 'auto' }}>
      <List
        size="small"
        dataSource={vehicles}
        renderItem={(vehicle) => {
          const status = getVehicleStatus(vehicle);
          const isSelected = vehicle.id === selectedVehicleId;

          return (
            <Card
              key={vehicle.id}
              size="small"
              style={{
                marginBottom: 12,
                cursor: 'pointer',
                border: isSelected ? '2px solid #1890ff' : '1px solid #d9d9d9',
                backgroundColor: isSelected ? '#e6f7ff' : 'white',
              }}
              onClick={() => handleSelect(vehicle.id)}
              hoverable
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ marginBottom: 8 }}>
                    <Space>
                      <CarOutlined style={{ fontSize: 16, color: '#1890ff' }} />
                      <strong>{vehicle.vehicleNumber}</strong>
                      {vehicle.vehicleName && (
                        <span style={{ color: '#999', fontSize: 12 }}>
                          ({vehicle.vehicleName})
                        </span>
                      )}
                    </Space>
                  </div>

                  <div style={{ marginBottom: 8 }}>
                    <Badge
                      color={VEHICLE_STATUS_COLORS[status]}
                      text={VEHICLE_STATUS_TEXT[status]}
                    />
                  </div>

                  <Space size="small" style={{ fontSize: 12, color: '#666' }} wrap>
                    {vehicle.trackData && vehicle.trackData.length > 0 && (
                      <>
                        <Tag icon={<EnvironmentOutlined />} color="blue">
                          {formatDistance(vehicle.totalDistance)}
                        </Tag>
                        <Tag icon={<DashboardOutlined />} color="green">
                          {formatSpeed(vehicle.averageSpeed)}
                        </Tag>
                        <Tag color="default">
                          {vehicle.trackData.length} 点
                        </Tag>
                      </>
                    )}
                  </Space>

                  {vehicle.lastUpdateTime && (
                    <div style={{ marginTop: 4, fontSize: 11, color: '#999' }}>
                      更新: {new Date(vehicle.lastUpdateTime).toLocaleString()}
                    </div>
                  )}
                </div>

                <div onClick={(e) => e.stopPropagation()}>
                  <Space direction="vertical" size="small">
                    {isSelected && (
                      <Button
                        type="text"
                        size="small"
                        icon={<EyeOutlined />}
                        style={{ color: '#1890ff' }}
                      >
                        已选中
                      </Button>
                    )}
                    <Popconfirm
                      title="确定删除该车辆吗？"
                      description="删除后将无法恢复轨迹数据"
                      onConfirm={(e) => handleDelete(vehicle.id, e)}
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button
                        type="text"
                        danger
                        size="small"
                        icon={<DeleteOutlined />}
                      >
                        删除
                      </Button>
                    </Popconfirm>
                  </Space>
                </div>
              </div>
            </Card>
          );
        }}
      />
    </div>
  );
};

export default VehicleList;
