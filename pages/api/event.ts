import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { getLastEvent } from '@/db/queries/vote-event.queries';
import AuthError from '@/errors/auth-error';
import { handleErrors } from '@/errors/http/handlers';
import type { IBasicRegionalEvent } from '@/lib/db/models/models.types';
import type { Request } from '@/lib/lib.types';
import auth from '@/middlewares/authentication';

const handler = nextConnect();

handler
  .use(auth)
  .get(async (req: Request, res: NextApiResponse<IBasicRegionalEvent>) => {
    try {
      const event = await getLastEvent();
      res.status(200).json(event);
    } catch (error) {
      handleErrors(error, res, AuthError);
    }
  });

export default handler;
