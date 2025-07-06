/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get a user by ID
 *     description: Returns a single user by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user object.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDTO'
 *             examples:
 *               user:
 *                 value:
 *                   id: "yXGO7YkiXpQDSSqyxHz1"
 *                   accountType: 1
 *                   email: "me@robruizr.dev"
 *                   name: "Roberto Ruiz"
 *                   officeId: "NZYeL9zhepNhAeQavl5X"
 *                   pronouns: "he/him"
 *                   userSettings: "{}"
 *                   title: "Ms. Sc."
 *                   department: "Engineering"
 *                   avatar: "https://example.com/avatar.jpg"
 *                   isPublic: true
 *                   available: "Available"
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a user by ID
 *     description: Updates a user's information by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *           example:
 *             name: "Roberto Ruiz"
 *             email: "me@robruizr.dev"
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 */
import { userApi } from '@/lib/firestoreApi';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId: id } = await params;

  if (typeof id !== 'string') {
    return new Response(`Invalid sensor ID`, {
      status: 404,
    });
  }
  try {
    const user = await userApi.getById(id);
    if (!user) {
      return new Response(`Invalid user ID`, {
        status: 404,
      });
    }
    return Response.json(user);
  } catch (error) {
    console.error('API Error:', error);
    return new Response(`Webhook error: ${String(error)}`, {
      status: 500,
    });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ userId: string }> },
) {
  const { userId: id } = await params;

  if (typeof id !== 'string') {
    return new Response(`Invalid user ID`, {
      status: 404,
    });
  }
  try {
    const user = await userApi.getById(id);
    if (!user) {
      return new Response(`Invalid user ID`, {
        status: 404,
      });
    }

    // Parse the request body
    const requestBody = await request.json();

    // Update the user
    await userApi.update(id, requestBody);

    return Response.json({
      message: 'User updated successfully',
    });
  } catch (error) {
    console.error('API Error:', error);
    return new Response(`Webhook error: ${String(error)}`, {
      status: 500,
    });
  }
}
