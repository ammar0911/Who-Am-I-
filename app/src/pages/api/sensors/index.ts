import { NextApiRequest, NextApiResponse } from 'next';
import rejectIfMethodNotIncludedWrapper from '@/lib/rejectIfMethodNotIncluded';
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
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const users = await sensorApi.getAll();
        res.status(200).json(users);
        break;
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default rejectIfMethodNotIncludedWrapper(handler, ['GET']);
