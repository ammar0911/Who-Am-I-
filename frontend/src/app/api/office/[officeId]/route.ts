import { officeApi } from '@/lib/firestoreApi';
import { OfficeDTO } from '@/types';

/**
 * @openapi
 * /api/office/{officeId}:
 *   put:
 *     tags:
 *       - Office
 *     summary: Update an office by ID
 *     description: Update an existing office with the provided data
 *     parameters:
 *       - name: officeId
 *         in: path
 *         required: true
 *         description: The unique identifier of the office to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OfficeDTO'
 *     responses:
 *       200:
 *         description: Office updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/OfficeDTO'
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Invalid office data provided"
 *       404:
 *         description: Office not found
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Office with ID 'abc123' not  found"
 *       500:
 *         description: Internal server error
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Webhook error: Database connection failed"
 */
export const PUT = async (
  request: Request,
  { params }: { params: Promise<{ officeId: string }> },
) => {
  try {
    const { officeId } = await params;
    const body: Omit<OfficeDTO, 'id'> = await request.json();

    const existingOffice = await officeApi.getById(officeId);
    if (!existingOffice) {
      return new Response(`Office with ID '${officeId}' not found`, {
        status: 404,
      });
    }

    const updatedOffice = await officeApi.update(officeId, body);
    return Response.json(updatedOffice);
  } catch (error) {
    console.error('API Error:', error);
    return new Response(`Webhook error: ${String(error)}`, {
      status: 500,
    });
  }
};
