import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { getLastEvent } from '@/db/queries/vote-event.queries';
import AuthError from '@/errors/auth-error';
import { handleErrors } from '@/errors/http/handlers';
import {
  IBasicRegionalEvent,
  VoteCategories,
} from '@/lib/db/models/models.types';
import type { Request } from '@/lib/lib.types';
import auth from '@/lib/middlewares';

const handler = nextConnect();

type IEventResponse = IBasicRegionalEvent & {
  posts: VoteCategories[];
};

const posts = Object.values(VoteCategories).filter(
  (v) => v !== VoteCategories.DEFAULT,
);

handler
  .use(auth)
  .get(async (req: Request, res: NextApiResponse<IEventResponse>) => {
    try {
      const event = await getLastEvent();
      res.status(200).json({ ...event, posts });
    } catch (error) {
      handleErrors(error, res, AuthError);
    }
  });

export default handler;
