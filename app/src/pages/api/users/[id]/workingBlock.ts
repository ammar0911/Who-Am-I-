import { NextApiRequest, NextApiResponse } from 'next';
import { workingBlockApi } from '@/lib/firestoreApi';
import rejectIfMethodNotIncludedWrapper from '@/lib/rejectIfMethodNotIncluded';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const workingBlocks = await workingBlockApi.getByUserId(id);
    res.status(200).json(workingBlocks);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default rejectIfMethodNotIncludedWrapper(handler, ['GET']);
