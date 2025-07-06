import { officeApi } from '@/lib/firestoreApi';
import { OfficeDTO } from '@/types';

/**
 * @openapi
 * /api/offices:
 *   get:
 *     tags:
 *       - Offices
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

/**
 * @openapi
 * /api/offices:
 *   post:
 *     tags:
 *       - Offices
 *     summary: Create a new office
 *     description: Create a new office with the provided data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OfficeDTO'
 *           example:
 *             name: "Main Office"
 *             sensorId: "sensor-123"
 *     responses:
 *       200:
 *         description: Office created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfficeDTO'
 *       400:
 *         description: Bad request - Missing required fields
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Office name is required"
 *       500:
 *         description: Internal server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Webhook error: Database connection failed"
 */
export const POST = async (request: Request) => {
  try {
    const body = (await request.json()) as OfficeDTO;
    if (!body.name) {
      return new Response('Office name is required', { status: 400 });
    }

    const newOffice = await officeApi.create(body);
    return Response.json(newOffice);
  } catch (error) {
    console.error('API Error:', error);
    return new Response(`Webhook error: ${String(error)}`, {
      status: 500,
    });
  }
};
