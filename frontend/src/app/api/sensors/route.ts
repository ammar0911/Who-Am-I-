import { sensorApi } from '@/lib/firestoreApi';

/**
 * @openapi
 * /api/sensors:
 *   get:
 *     summary: Get all sensors
 *     description: Returns a list of all sensors.
 *     responses:
 *       200:
 *         description: A list of sensors.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: jtXtrYmcN8D0zLpjKzWI
 *                   batteryStatus:
 *                     type: integer
 *                     example: 35
 *                   inputTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2025-06-04T15:47:43.913Z"
 *                   isOpen:
 *                     type: boolean
 *                     example: false
 *             examples:
 *               sensors:
 *                 value:
 *                   - id: jtXtrYmcN8D0zLpjKzWI
 *                     batteryStatus: 35
 *                     inputTime: "2025-06-04T15:47:43.913Z"
 *                     isOpen: false
 *       500:
 *         description: Internal Server Error
 */
export async function GET() {
  try {
    const sensors = await sensorApi.getAll();
    return Response.json(sensors);
  } catch (error) {
    console.error('API Error:', error);
    return new Response(`Webhook error: ${String(error)}`, {
      status: 500,
    });
  }
}
