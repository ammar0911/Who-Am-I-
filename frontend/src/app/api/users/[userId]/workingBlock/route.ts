import { workingBlockApi } from '@/lib/firestoreApi';
import { NextRequest } from 'next/server';

/**
 * @openapi
 * /api/users/{id}/workingBlock:
 *   get:
 *     tags:
 *       - Users
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
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId } = await params;

  if (typeof userId !== 'string') {
    return new Response(`Invalid user ID`, {
      status: 404,
    });
  }

  try {
    const workingBlocks = await workingBlockApi.getByUserId(userId);
    if (!workingBlocks) {
      return new Response(`No working blocks found for user ID: ${userId}`, {
        status: 404,
      });
    }
    return Response.json(workingBlocks);
  } catch (error) {
    console.error('API Error:', error);
    return new Response(`Webhook error: ${String(error)}`, {
      status: 500,
    });
  }
}
