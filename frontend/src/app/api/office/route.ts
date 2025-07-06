import { officeApi } from '@/lib/firestoreApi';

/**
 * @openapi
 * /api/office:
 *   get:
 *     tags:
 *       - Office
 *     summary: Get all offices
 *     description: Retrieve a list of all offices from the database
 *     responses:
 *       200:
 *         description: Successfully retrieved offices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/OfficeDTO'
 *       500:
 *         description: Internal server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Webhook error: Database connection failed"
 */
export const GET = async () => {
  try {
    const offices = await officeApi.getAll();
    return Response.json(offices);
  } catch (error) {
    console.error('API Error:', error);
    return new Response(`Webhook error: ${String(error)}`, {
      status: 500,
    });
  }
};
