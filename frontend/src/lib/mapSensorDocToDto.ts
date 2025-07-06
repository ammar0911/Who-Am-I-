import { SensorDoc, SensorDTO, SensorInputDoc } from '@/types';

const mapSensorDocToDTO = (
  doc: SensorDoc,
  status: SensorInputDoc | null = null,
): SensorDTO => {
  return {
    id: doc.id,
    status: status
      ? {
          id: status.id,
          isOpen: status.is_open,
          batteryStatus: status.battery_status,
          inputTime: status.input_time?.toUTCString(),
          sensorId: status.sensor_id?.id,
        }
      : null,
    name: doc.name,
  };
};

export default mapSensorDocToDTO;
