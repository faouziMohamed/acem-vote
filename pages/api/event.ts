import nextConnect from 'next-connect';

import { getLastEvent } from '../../lib/db/queries/vote-event.queries';
import AuthError from '../../lib/errors/auth-error';
import { handleErrors } from '../../lib/errors/http/handlers';
import type { Request, Response } from '../../lib/lib.types';
import auth from '../../middleware/authentication';

const handler = nextConnect();

handler.use(auth).get(async (req: Request, res: Response) => {
  try {
    const event = await getLastEvent();
    console.log(event, 'event');
    res.status(200).json(event);
  } catch (error) {
    console.log('Errrooooor');

    handleErrors(error, res, AuthError);
  }
});

export default handler;
