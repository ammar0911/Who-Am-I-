import { OfficeDoc, OfficeDTO, SensorDTO } from '@/types';

type OfficeDocWithSensor = OfficeDoc & {
  sensor?: SensorDTO | null;
};

const mapOfficeDocToDTO = (doc: OfficeDocWithSensor): OfficeDTO => {
  return {
    id: doc.id,
    name: doc.name,
    sensorId: doc.sensor_id?.id,
    sensor: doc.sensor,
  };
};

export default mapOfficeDocToDTO;
