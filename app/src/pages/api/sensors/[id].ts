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
import { sensorApi } from '@/lib/firestoreApi';
import rejectIfMethodNotIncluded from '@/lib/rejectIfMethodNotIncluded';
import { NextApiRequest, NextApiResponse } from 'next';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid sensor ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const sensor = await sensorApi.getById(id);
        if (!sensor) {
          return res.status(404).json({ error: 'Sensor not found' });
        }
        res.status(200).json(sensor);
        break;

      case 'PUT':
        const { batteryStatus, isOpen } = req.body;
        console.log('PUT request body:', { batteryStatus, isOpen });
        if (typeof batteryStatus !== 'number' || typeof isOpen !== 'boolean') {
          return res.status(400).json({ error: 'Invalid request body' });
        }
        await sensorApi.update(id, {
          battery_status: batteryStatus,
          is_open: isOpen,
        });
        res.status(200).json({ message: 'Sensor updated successfully' });
        break;
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default rejectIfMethodNotIncluded(handler, ['GET', 'PUT']);
