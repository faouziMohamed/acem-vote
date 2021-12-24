import nextConnect from 'next-connect';

import type { Request, Response } from '../../../lib/lib.types';
import auth from '../../../middleware/authentication';

const handler = nextConnect();

handler.use(auth).get((req: Request, res: Response) => {
  try {
    // console.log(req.user);
    if (!req.user) return res.json({ user: false });
    const { user } = req;
    return res.json({ user });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log((<Error>error).message);
    return res.status(500).json({ error: 'Un problème viens de survenir' });
  }
});

export default handler;
