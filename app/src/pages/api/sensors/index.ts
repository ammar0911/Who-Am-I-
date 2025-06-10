import { NextApiRequest, NextApiResponse } from 'next';
import rejectIfMethodNotIncludedWrapper from '@/lib/rejectIfMethodNotIncluded';
import { sensorApi } from '@/lib/firestoreApi';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case 'GET':
        const users = await sensorApi.getAll();
        res.status(200).json(users);
        break;
    }
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default rejectIfMethodNotIncludedWrapper(handler, ['GET']);
