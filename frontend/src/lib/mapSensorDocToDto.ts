import { SensorDoc, SensorDTO } from '@/types';

const mapSensorDocToDTO = (doc: SensorDoc): SensorDTO => {
  return {
    id: doc.id,
    batteryStatus: doc.battery_status,
    inputTime: doc.input_time,
    isOpen: doc.is_open,
  };
};

export default mapSensorDocToDTO;
