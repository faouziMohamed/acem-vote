import nextConnect from 'next-connect';

import AuthError from '../../../lib/errors/auth-error';
import { handleErrors } from '../../../lib/errors/http/handlers';
import type { Request, Response } from '../../../lib/lib.types';
import { generateAndSaveVoteID } from '../../../lib/utils/keys.utils';
import auth from '../../../middleware/authentication';
import { checkAuth } from '../../../middleware/init-middleware';

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
