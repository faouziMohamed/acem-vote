import nextConnect from 'next-connect';

import AuthError from '@/errors/auth-error';
import { handleErrors } from '@/errors/http/handlers';
import type { Request, Response } from '@/lib/lib.types';
import auth from '@/middlewares/authentication';
import { checkAuth } from '@/middlewares/init-middleware';
import { generateAndSaveVoteID } from '@/utils/keys.utils';

const handler = nextConnect();

handler
  .use(auth)
  .use(checkAuth())
  .post(async (req: Request, res: Response) => {
    try {
      const voteIdEncrypted = await generateAndSaveVoteID(req);
      res.status(200).json({ voteIdEncrypted });
    } catch (error) {
      handleErrors(error, res, AuthError);
    }
  });

export default handler;
