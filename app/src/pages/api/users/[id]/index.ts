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
        await userApi.update(id, req.body);
        res.status(200).json({ message: 'User updated successfully' });
        break;
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default rejectIfMethodNotIncludedWrapper(handler, ['GET', 'PUT']);
