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
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     example: "yXGO7YkiXpQDSSqyxHz1"
 *                   accountType:
 *                     type: integer
 *                     example: 1
 *                   email:
 *                     type: string
 *                     example: "me@robruizr.dev"
 *                   name:
 *                     type: string
 *                     example: "Roberto Ruiz"
 *                   officeId:
 *                     type: string
 *                     example: "NZYeL9zhepNhAeQavl5X"
 *                   password:
 *                     type: string
 *                     example: "1234"
 *                   pronouns:
 *                     type: string
 *                     example: "he/him"
 *                   userSettings:
 *                     type: string
 *                     example: "{}"
 *             examples:
 *               users:
 *                 value:
 *                   - id: "yXGO7YkiXpQDSSqyxHz1"
 *                     accountType: 1
 *                     email: "me@robruizr.dev"
 *                     name: "Roberto Ruiz"
 *                     officeId: "NZYeL9zhepNhAeQavl5X"
 *                     password: "1234"
 *                     pronouns: "he/him"
 *                     userSettings: "{}"
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
