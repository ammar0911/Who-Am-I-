import { WorkingBlockDoc } from '@/types';

const mapWorkingBlockDocToDto = (doc: WorkingBlockDoc) => {
  return {
    id: doc.id,
    durationMs: doc.duration_ms,
    source: doc.source,
    startMs: doc.start_ms,
    userId: doc.user_id.id,
    weekDay: doc.week_day,
  };
};

export default mapWorkingBlockDocToDto;
