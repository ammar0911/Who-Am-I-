import { NextRequest } from 'next/server';

import { sensorApi } from '@/lib/firestoreApi';

/**
 * @openapi
 * /api/sensors/byOfficeId:
 *   get:
 *     tags:
 *       - Sensor
 *     summary: Get sensors by office ID
 *     description: Returns a list of sensors associated with a specific office ID.
 *     parameters:
 *       - in: query
 *         name: officeId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the office to filter sensors by.
 *     responses:
 *       200:
 *         description: A list of sensors for the specified office ID.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "sensor123"
 *                   name:
 *                     type: string
 *                     example: "Temperature Sensor"
 *                   officeId:
 *                     type: string
 *                     example: "office456"
 *                   inputTime:
 *                     type: string
 *                     format: date-time
 *                     example: "2023-10-01T12:00:00Z"
 *       400:
 *         description: Invalid office ID provided.
 *       500:
 *         description: Internal Server Error
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const officeId = searchParams.get('officeId');

  if (typeof officeId !== 'string' || officeId.trim() === '') {
    return new Response(`Invalid office ID`, {
      status: 404,
    });
  }

  try {
    const sensors = await sensorApi.getByOfficeId(officeId);
    return Response.json(sensors);
  } catch (error) {
    console.error('API Error:', error);
    return new Response(`Webhook error: ${String(error)}`, {
      status: 500,
    });
  }
}
