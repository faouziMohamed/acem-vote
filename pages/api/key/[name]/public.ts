import nextConnect from 'next-connect';

import AppError from '../../../../lib/errors/app-error';
import { handleErrors } from '../../../../lib/errors/http/handlers';
import type { Request, Response } from '../../../../lib/lib.types';
import type PGPEncryptor from '../../../../lib/security/pgpEncryptor';
import { ArmoredKeys } from '../../../../lib/security/security.types';
import {
  findUser,
  generateUserEmail,
  getServerKeys,
  getUserKeys,
} from '../../../../lib/utils/keys.utils';
import auth from '../../../../middleware/authentication';
import { checkAuth } from '../../../../middleware/init-middleware';

const handler = nextConnect()
  .use(auth)
  .use(checkAuth('Vous devez être connecté pour récupérer vos clés.'));

interface ReqWithQuery extends Request {
  query: { name: string };
}

handler.get(async (req: ReqWithQuery, res: Response) => {
  try {
    const { name: idName } = req.query;
    let caller: () => Promise<{ keys: ArmoredKeys; encryptor: PGPEncryptor }>;
    if (idName === 'server') {
      caller = getServerKeys;
    } else {
      const user = await findUser(idName);
      const name = `${user.firstname} ${user.lastname}`;
      const { email: mail } = user.details!;
      const { firstname, lastname, orgId } = user;
      const userEMail = generateUserEmail(firstname, lastname, orgId);
      const email = mail || userEMail;
      caller = () => getUserKeys({ name, email });
    }

    const { keys } = await caller();
    return res.json({ puconstbKey: keys.publicArmoredKey });
  } catch (error) {
    return handleErrors(error, res, AppError);
  }
});

export default handler;
