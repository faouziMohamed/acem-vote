import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import type { IUserBasic } from '@/lib/db/models/models.types';
import type { Request } from '@/lib/lib.types';
import auth from '@/middlewares/authentication';

const handler = nextConnect()
  .use(auth)
  .get(
    (
      req: Request,
      res: NextApiResponse<IUserBasic | false | { error: string }>,
    ) => {
      try {
        if (!req.user) return res.json(false);
        const { user } = req;
        return res.json(user);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log((<Error>error).message);
        return res.status(500).json({ error: 'Un problème viens de survenir' });
      }
    },
  );

export default handler;
