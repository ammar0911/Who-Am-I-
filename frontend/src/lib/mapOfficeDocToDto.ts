import { OfficeDoc, OfficeDTO } from '@/types';

const mapOfficeDocToDTO = (doc: OfficeDoc): OfficeDTO => {
  return {
    id: doc.id,
    name: doc.name,
    sensorId: doc.sensor_id?.id,
  };
};

export default mapOfficeDocToDTO;
