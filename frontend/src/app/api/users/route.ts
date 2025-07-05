import { userApi } from '@/lib/firestoreApi';

/**
 * @openapi
 * /api/users:
 *   get:
 *     summary: Get all users
 *     description: Returns a list of all users.
 *     responses:
 *       200:
 *         description: A list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserDTO'
 *             examples:
 *               users:
 *                 value:
 *                   - id: "yXGO7YkiXpQDSSqyxHz1"
 *                     accountType: 1
 *                     email: "me@robruizr.dev"
 *                     name: "Roberto Ruiz"
 *                     officeId: "NZYeL9zhepNhAeQavl5X"
 *                     pronouns: "he/him"
 *                     userSettings: "{}"
 *                     title: "Ms. Sc."
 *                     department: "Engineering"
 *                     avatar: "https://example.com/avatar.jpg"
 *                     isPublic: true
 *                     available: "Available"
 *       500:
 *         description: Internal Server Error
 */
export async function GET() {
  try {
    const users = await userApi.getAll();
    return Response.json(users);
  } catch (error) {
    console.error('API Error:', error);
    return new Response(`Webhook error: ${String(error)}`, {
      status: 500,
    });
  }
}
