/**
 * @openapi
 * /api/users/{id}:
 *   get:
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
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   example: "yXGO7YkiXpQDSSqyxHz1"
 *                 accountType:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: "me@robruizr.dev"
 *                 name:
 *                   type: string
 *                   example: "Roberto Ruiz"
 *                 officeId:
 *                   type: string
 *                   example: "NZYeL9zhepNhAeQavl5X"
 *                 password:
 *                   type: string
 *                   example: "1234"
 *                 pronouns:
 *                   type: string
 *                   example: "he/him"
 *                 userSettings:
 *                   type: string
 *                   example: "{}"
 *             examples:
 *               user:
 *                 value:
 *                   id: "yXGO7YkiXpQDSSqyxHz1"
 *                   accountType: 1
 *                   email: "me@robruizr.dev"
 *                   name: "Roberto Ruiz"
 *                   officeId: "NZYeL9zhepNhAeQavl5X"
 *                   password: "1234"
 *                   pronouns: "he/him"
 *                   userSettings: "{}"
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal Server Error
 *   put:
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
import { NextApiRequest, NextApiResponse } from 'next';
import { userApi } from '@/lib/firestoreApi';
import rejectIfMethodNotIncludedWrapper from '@/lib/rejectIfMethodNotIncluded';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    switch (req.method) {
      case 'GET':
        const user = await userApi.getById(id);
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        res.status(200).json(user);
        break;

      case 'PUT':
        // await userApi.update(id, req.body);
        res
          .status(200)
          .json({
            message: 'User not updated. Method has not been implemented yet.',
          });
        break;
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default rejectIfMethodNotIncludedWrapper(handler, ['GET', 'PUT']);
