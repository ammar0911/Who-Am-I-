import { workingBlockApi } from '@/lib/firestoreApi';
import predictForDayOfWeek from '@/lib/predictForDayOfWeek';
import { MLModelFeature, WorkingBlockDTO } from '@/types';

interface RequestBody {
  userId: string;
  date: string;
}

export const POST = async (req: Request) => {
  try {
    const { userId, date } = (await req.json()) as RequestBody;

    if (!userId) {
      return new Response('User ID is required', { status: 400 });
    }

    if (!date) {
      return new Response('Date is required', { status: 400 });
    }

    // @TODO: Optimise this.
    const currentDate = new Date();
    currentDate.setUTCHours(0, 0, 0, 0);
    const threeWeeksBefore = new Date(currentDate);
    threeWeeksBefore.setDate(currentDate.getDate() - 21);

    const allWorkingBlocksSince3WeeksAgo =
      await workingBlockApi.getAllForUserAfterDate({
        user: userId,
        date: threeWeeksBefore,
        source: 'Sensor',
      });

    const workingBlockMapByDay: Record<string, WorkingBlockDTO[]> = {};

    // Group working blocks by day
    allWorkingBlocksSince3WeeksAgo.forEach((block) => {
      const blockDate = new Date(block.startTime);
      blockDate.setUTCHours(0, 0, 0, 0);
      const dateKey = blockDate.toISOString();

      if (!workingBlockMapByDay[dateKey]) {
        workingBlockMapByDay[dateKey] = [];
      }
      workingBlockMapByDay[dateKey].push(block);
    });

    // map data for every day of the week
    const workingBlockByDay = Object.entries(workingBlockMapByDay).map(
      ([dateKey, blocks]) => {
        const blockDate = new Date(dateKey);
        const blockDayOfWeek = blockDate.getDay();

        return {
          date: blockDate.toISOString(),
          dayOfWeek: blockDayOfWeek,
          blocks,
        };
      },
    );

    // Group by day of the week
    const groupedByDayOfWeek: Record<string, WorkingBlockDTO[]> = {};

    workingBlockByDay.forEach((day) => {
      const dayOfWeek = day.dayOfWeek;

      if (!groupedByDayOfWeek[dayOfWeek]) {
        groupedByDayOfWeek[dayOfWeek] = [];
      }
      groupedByDayOfWeek[dayOfWeek].push(...day.blocks);
    });

    // Make subgroups based on the date, ignoring time.
    const subGroupedByDayOfWeek: Record<
      string,
      Record<string, WorkingBlockDTO[]>
    > = {};

    Object.entries(groupedByDayOfWeek).forEach(([dayOfWeek, blocks]) => {
      subGroupedByDayOfWeek[dayOfWeek] = {};

      // Create slots for every date, corresponding to their day of the week.
      blocks.forEach((block) => {
        const blockDate = new Date(block.startTime);
        blockDate.setUTCHours(0, 0, 0, 0);
        const dateKey = blockDate.toISOString();

        if (!subGroupedByDayOfWeek[dayOfWeek][dateKey]) {
          subGroupedByDayOfWeek[dayOfWeek][dateKey] = [];
        }
      });

      // Populate the subgroups with the actual blocks by date.
      blocks.forEach((block) => {
        const blockDate = new Date(block.startTime);
        blockDate.setUTCHours(0, 0, 0, 0);
        const dateKey = blockDate.toISOString();

        if (subGroupedByDayOfWeek[dayOfWeek][dateKey]) {
          subGroupedByDayOfWeek[dayOfWeek][dateKey].push(block);
        }
      });
    });

    // Convert every subArray to a boolean array based on availability.
    const booleanSubGroupedByDayOfWeek: Record<
      string,
      Record<string, boolean[]>
    > = {};

    Object.entries(subGroupedByDayOfWeek).forEach(([dayOfWeek, dateBlocks]) => {
      booleanSubGroupedByDayOfWeek[dayOfWeek] = {};

      Object.entries(dateBlocks).forEach(([dateKey, blocks]) => {
        booleanSubGroupedByDayOfWeek[dayOfWeek][dateKey] = blocks.map(
          (block) => block.availability === 'Available',
        );
      });
    });

    /**
     * Convert to Feature Types.
     * Key indicates the day of the week (0-6, where 0 is Sunday).
     * The array contains the following values: [TimeOfDay, wasAvailableOneWeekAgo, wasAvailableTwoWeeksAgo, wasAvailableThreeWeeksAgo]
     * TimeOfDay is a number representing the hour of the day. It starts from 0 and ends at 11. 0 represents 8 am, 1 represents 9 am, and so on.
     * The availability values are binary (1 for available, 0 for not available).
     */
    const features: Record<string, MLModelFeature[]> = {};

    Object.entries(booleanSubGroupedByDayOfWeek).forEach(
      ([dayOfWeek, dateBlocks]) => {
        features[dayOfWeek] = [];
        const keysForDay = Object.keys(dateBlocks).sort();

        const [threeWeeksAgoKey, twoWeeksAgoKey, oneWeeksAgoKey] = keysForDay;
        dateBlocks[threeWeeksAgoKey].forEach((_, index) => {
          const feature: MLModelFeature = [
            index,
            dateBlocks[threeWeeksAgoKey][index] ? 1 : 0,
            dateBlocks[twoWeeksAgoKey][index] ? 1 : 0,
            dateBlocks[oneWeeksAgoKey][index] ? 1 : 0,
          ];
          features[dayOfWeek].push(feature);
        });
      },
    );

    // Create predictions for every day of the week
    const predictionsByDayOfWeek: Record<string, boolean[]> = {};

    Object.entries(features).forEach(([dayOfWeek, dayFeatures]) => {
      predictionsByDayOfWeek[dayOfWeek] = predictForDayOfWeek(dayFeatures);
    });

    // Convert predictions to WorkingBlockDTOs for the upcoming days
    const predictionsForUpcomingDays: Omit<WorkingBlockDTO, 'id'>[] = [];
    const today = new Date();
    Object.entries(predictionsByDayOfWeek).forEach(
      ([dayOfWeek, predictions]) => {
        const dayIndex = Number(dayOfWeek);
        const predictionDate = new Date(today);
        predictionDate.setDate(
          today.getDate() + ((dayIndex + 7 - today.getDay()) % 7),
        );
        predictionDate.setUTCHours(0, 0, 0, 0);

        predictions.forEach((isAvailable, index) => {
          const startTime = new Date(predictionDate);
          startTime.setHours(index + 8); // 8 am is the start of the day in this model
          const endTime = new Date(startTime);
          endTime.setHours(endTime.getHours() + 1); // 1 hour blocks

          predictionsForUpcomingDays.push({
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            userId: userId,
            source: 'Prediction',
            availability: isAvailable ? 'Available' : 'NotAvailable',
            googleCalendarEventId: null,
          });
        });
      },
    );

    const promisesList = predictionsForUpcomingDays.map(
      (workingBlockPrediction) => {
        return workingBlockApi.create(workingBlockPrediction, {
          source: 'Prediction',
        });
      },
    );

    await Promise.all(promisesList);

    return new Response(JSON.stringify(predictionsForUpcomingDays), {
      headers: {
        'Content-Type': 'application/json',
      },
      status: 200,
    });
  } catch (error) {
    console.error('Error in predictAvailabilityForUser:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
};
