import { NextApiRequest, NextApiResponse } from 'next';
import { userApi } from '@/lib/firestoreApi';
import rejectIfMethodNotIncluded from '@/lib/rejectIfMethodNotIncluded';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const users = await userApi.getAll();
        res.status(200).json(users);
        break;
    }
  } catch (error) {
    console.error('API Error:', error);
    console.error(error?.toString());
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default rejectIfMethodNotIncluded(handler, ['GET']);
