import { NextApiRequest, NextApiResponse } from 'next';

export default function rejectIfMethodNotIncluded(
  handler: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  allowedMethods: string[]
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (!allowedMethods.includes(req.method || '')) {
      res.setHeader('Allow', allowedMethods);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    return handler(req, res);
  };
}
