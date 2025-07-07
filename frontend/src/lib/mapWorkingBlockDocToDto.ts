import { WorkingBlockDoc, WorkingBlockDTO } from '@/types';

const mapWorkingBlockDocToDto = (doc: WorkingBlockDoc): WorkingBlockDTO => {
  return {
    id: doc.id,
    startTime: doc.start_time.toISOString(),
    endTime: doc.end_time.toISOString(),
    source: doc.source,
    userId: doc.user_id.id,
  };
};

export default mapWorkingBlockDocToDto;
