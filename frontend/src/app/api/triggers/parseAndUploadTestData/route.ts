import { workingBlockApi } from '@/lib/firestoreApi';
import { WorkingBlockDTO } from '@/types';
import csv from 'csv-parser';
import fs from 'fs';

const fileToRead = 'data/weekInput.csv';
const userId = '';

export type CsvRow = {
  dayOfWeek: string;
  timeBlock: string;
  oneWeekAgo: string;
  twoWeeksAgo: string;
  threeWeeksAgo: string;
};
export type CsvData = CsvRow[];

const readFileAndParseCsv = async (): Promise<CsvData> => {
  const results: CsvData = [];
  console.log('Current Path:', process.cwd());

  return new Promise((resolve, reject) => {
    try {
      fs.createReadStream(fileToRead)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
          resolve(results);
        })
        .on('error', (error) => {
          console.error('Error parsing CSV:', error);
          reject(error);
        });
    } catch (error) {
      console.error('Error reading file:', error);
      reject(error);
    }
  });
};

const createWorkingBlockDTOFromDate = ({
  date,
  available,
}: {
  date: Date;
  available: boolean;
}): Omit<WorkingBlockDTO, 'id'> => {
  return {
    endTime: new Date(date.getTime() + 60 * 60 * 1000).toISOString(),
    startTime: date.toISOString(),
    source: 'Sensor',
    userId,
    availability: available ? 'Available' : 'NotAvailable',
  };
};

const mapCsvRowToWorkingBlockDTO = (
  row: CsvRow,
): Omit<WorkingBlockDTO, 'id'>[] => {
  const currentDate = new Date();
  currentDate.setUTCHours(Number(row.timeBlock) + 6);
  const dateForWorkingBlock = new Date(currentDate);
  dateForWorkingBlock.setDate(
    currentDate.getDate() + (Number(row.dayOfWeek) - currentDate.getDay()),
  );
  const oneWeekPrior = new Date(dateForWorkingBlock);
  oneWeekPrior.setDate(dateForWorkingBlock.getDate() - 6);
  const twoWeeksPrior = new Date(dateForWorkingBlock);
  twoWeeksPrior.setDate(dateForWorkingBlock.getDate() - 13);
  const threeWeeksPrior = new Date(dateForWorkingBlock);
  threeWeeksPrior.setDate(dateForWorkingBlock.getDate() - 20);

  return [
    createWorkingBlockDTOFromDate({
      date: oneWeekPrior,
      available: row.oneWeekAgo === '1',
    }),
    createWorkingBlockDTOFromDate({
      date: twoWeeksPrior,
      available: row.twoWeeksAgo === '1',
    }),
    createWorkingBlockDTOFromDate({
      date: threeWeeksPrior,
      available: row.threeWeeksAgo === '1',
    }),
  ];
};

export const POST = async () => {
  if (!userId) {
    return new Response('User ID is required in source code', { status: 400 });
  }

  if (!fileToRead) {
    return new Response('File path is required in source code', {
      status: 400,
    });
  }

  try {
    const csvData: CsvData = await readFileAndParseCsv();
    const workingBlocks = csvData.flatMap((row) => {
      return mapCsvRowToWorkingBlockDTO(row);
    });

    // Create working blocks
    workingBlocks.map((block) => {
      return workingBlockApi.create(block, {
        source: 'Sensor',
      });
    });

    return new Response(JSON.stringify(workingBlocks), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching file:', error);
    return new Response('Error fetching file', { status: 500 });
  }
};
