import nextConnect from 'next-connect';

import { getLastEvent } from '../../lib/db/queries/vote-event.queries';
import AuthError from '../../lib/errors/auth-error';
import { handleErrors } from '../../lib/errors/http/handlers';
import auth from '../../middleware/authentication';

const handler = nextConnect();

handler.use(auth).get(async (req, res) => {
  try {
    const [event] = await getLastEvent();
    return res.json(event);
  } catch (error) {
    return handleErrors(error, res, AuthError);
  }
});

export default handler;
