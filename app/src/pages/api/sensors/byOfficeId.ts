import { sensorApi } from '@/lib/firestoreApi';
import { NextApiRequest, NextApiResponse } from 'next';

/**
 * @openapi
 * /api/sensors/byOfficeId?officeId={officeId}:
 *   get:
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
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { officeId } = req.query;

  if (typeof officeId !== 'string' || officeId.trim() === '') {
    return res.status(400).json({ error: 'Invalid office ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const sensors = await sensorApi.getByOfficeId(officeId);
        res.status(200).json(sensors);
        break;
      default:
        res.setHeader('Allow', ['GET']);
        return res
          .status(405)
          .json({ error: `Method ${req.method} Not Allowed` });
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default handler;
