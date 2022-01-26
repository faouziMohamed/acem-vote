import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import type { IBasicRegionalEvent } from '@/db/models/models.types';
import { getLastEvent } from '@/db/queries/vote-event.queries';
import AuthError from '@/errors/auth-error';
import { handleErrors } from '@/errors/http/handlers';
import type { Request } from '@/lib/lib.types';
import auth from '@/lib/middlewares';

const handler = nextConnect();

handler
  .use(auth)
  .get(async (req: Request, res: NextApiResponse<IBasicRegionalEvent>) => {
    try {
      const event = await getLastEvent();
      res.status(200).json({ ...event });
    } catch (error) {
      handleErrors(error, res, AuthError);
    }
  });

export default handler;
