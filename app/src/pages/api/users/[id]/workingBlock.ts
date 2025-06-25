import { NextApiRequest, NextApiResponse } from 'next';
import { workingBlockApi } from '@/lib/firestoreApi';
import rejectIfMethodNotIncludedWrapper from '@/lib/rejectIfMethodNotIncluded';

/**
 * @openapi
 * /api/users/{id}/workingBlock:
 *   get:
 *     summary: Get working block by user ID
 *     description: Returns the working block for a specific user.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user to retrieve the working block for.
 *     responses:
 *       200:
 *         description: Working block found successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "block123"
 *                 userId:
 *                   type: string
 *                   example: "user123"
 *                 startTime:
 *                   type: string
 *                   format: date-time
 *                   example: "2025-06-04T15:47:43.913Z"
 */
async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const workingBlocks = await workingBlockApi.getByUserId(id);
    res.status(200).json(workingBlocks);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default rejectIfMethodNotIncludedWrapper(handler, ['GET']);
