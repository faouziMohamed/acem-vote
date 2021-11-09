import nextConnect from 'next-connect';

import AppError from '../../../../lib/errors/app-error';
import { handleErrors } from '../../../../lib/errors/http/handlers';
import {
  findUser,
  getServerKeys,
  getUserKeys,
} from '../../../../lib/utils/keys.utils';
import auth from '../../../../middleware/authentication';
import { checkAuth } from '../../../../middleware/init-middleware';

const handler = nextConnect()
  .use(auth)
  .use(checkAuth('Vous devez être connecté pour récupérer vos clés.'));

handler.get(async (req, res) => {
  try {
    const { name: idName } = req.query;
    let caller;
    if (idName === 'server') {
      caller = getServerKeys;
    } else {
      const user = await findUser(idName);
      const name = `${user.firstname} ${user.lastname}`;
      caller = () => getUserKeys({ name, email: user.email });
    }

    const { keys } = await caller();
    return res.json({ pubKey: keys.publicArmoredKey });
  } catch (error) {
    return handleErrors(error, res, AppError);
  }
});

export default handler;
