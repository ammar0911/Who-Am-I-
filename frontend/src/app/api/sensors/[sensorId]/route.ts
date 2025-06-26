import { sensorApi } from '@/lib/firestoreApi';

/**
 * @openapi
 * /api/sensors/{id}:
 *   get:
 *     summary: Get a sensor by ID
 *     description: Returns a single sensor by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The sensor ID
 *     responses:
 *       200:
 *         description: The sensor object.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "jtXtrYmcN8D0zLpjKzWI"
 *                 batteryStatus:
 *                   type: integer
 *                   example: 35
 *                 inputTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-04T15:47:43.913Z"
 *                 isOpen:
 *                   type: boolean
 *                   example: false
 *             examples:
 *               sensor:
 *                 value:
 *                   id: "jtXtrYmcN8D0zLpjKzWI"
 *                   batteryStatus: 35
 *                   inputTime: "2025-06-04T15:47:43.913Z"
 *                   isOpen: false
 *       400:
 *         description: Invalid sensor ID
 *       404:
 *         description: Sensor not found
 *       500:
 *         description: Internal Server Error
 *   put:
 *     summary: Update a sensor by ID
 *     description: Updates a sensor's battery status and open state by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The sensor ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               batteryStatus:
 *                 type: integer
 *                 example: 42
 *               isOpen:
 *                 type: boolean
 *                 example: true
 *           example:
 *             batteryStatus: 42
 *             isOpen: true
 *     responses:
 *       200:
 *         description: Sensor updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sensor updated successfully
 *       400:
 *         description: Invalid sensor ID or request body
 *       404:
 *         description: Sensor not found
 *       500:
 *         description: Internal Server Error
 */

export async function GET(
  request: Request,
  { params }: { params: Promise<{ sensorId: string }> }
) {
  const { sensorId: id } = await params;

  if (typeof id !== 'string') {
    return new Response(`Invalid sensor ID`, {
      status: 404,
    });
  }
  try {
    const sensor = await sensorApi.getById(id);
    if (!sensor) {
      return new Response(`Invalid sensor ID`, {
        status: 404,
      });
    }
    return Response.json(sensor);
  } catch (error) {
    console.error('API Error:', error);
    return new Response(`Webhook error: ${String(error)}`, {
      status: 500,
    });
  }
}

interface SensorPUTRequestBody {
  batteryStatus: number;
  isOpen: boolean;
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ sensorId: string }> }
) {
  const { sensorId: id } = await params;

  if (typeof id !== 'string') {
    return new Response(`Invalid sensor ID`, {
      status: 404,
    });
  }

  try {
    const { batteryStatus, isOpen } =
      (await request.json()) satisfies SensorPUTRequestBody;
    console.log('PUT request body:', { batteryStatus, isOpen });
    if (typeof batteryStatus !== 'number' || typeof isOpen !== 'boolean') {
      return new Response(`Invalid request body`, {
        status: 400,
      });
    }
    await sensorApi.update(id, {
      battery_status: batteryStatus,
      is_open: isOpen,
    });
    return Response.json({ message: 'Sensor updated successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(`Webhook error: ${String(error)}`, {
      status: 500,
    });
  }
}
