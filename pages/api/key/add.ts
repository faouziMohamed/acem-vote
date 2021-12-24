import nextConnect from 'next-connect';

import {
  findUserByOrgId,
  updateUserByOrgId,
} from '../../../lib/db/queries/user.queries';
import AppError from '../../../lib/errors/app-error';
import { handleErrors } from '../../../lib/errors/http/handlers';
import type { Request, Response } from '../../../lib/lib.types';
import { generateRandomString } from '../../../lib/security/aes.utils';
import {
  generateNewUserKeys,
  generateUserEmail,
} from '../../../lib/utils/keys.utils';
import auth from '../../../middleware/authentication';
import { checkAuth } from '../../../middleware/init-middleware';

const handler = nextConnect()
  .use(auth)
  .use(
    checkAuth(
      'Vous devez être connecté pour pouvoir enregistrer de nouveaux clés.',
    ),
  );

handler.post(async (req: Request, res: Response) => {
  try {
    const { user } = req;
    const name = `${user.firstname} ${user.lastname}`;
    const { orgId: oid } = user;
    const email = generateUserEmail(user.firstname, user.lastname, oid);
    const passphrase = generateRandomString(100);
    await generateNewUserKeys(name, email, passphrase);
    await updateUserByOrgId(oid, { $set: { isFirstLogin: false } });
    req.user = await findUserByOrgId(oid);
    res.status(201).json({ message: 'Ok' });
  } catch (error) {
    handleErrors(error, res, AppError);
  }
});

export default handler;
