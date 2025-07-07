import { userApi } from '@/lib/firestoreApi';

/**
 * @openapi
 * /api/users/getAllPublicAndAvailable:
 *   get:
 *     tags:
 *       - Users
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
/** @TODO */
export async function GET() {
  // Not implemented yet
  return new Response(JSON.stringify(await userApi.getAll()), {
    status: 501,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
