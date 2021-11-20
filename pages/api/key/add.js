import nextConnect from 'next-connect';

import { createKeys } from '../../../lib/db/queries/keys.queries';
import { updateUserByOrgId } from '../../../lib/db/queries/user.queries';
import AppError from '../../../lib/errors/app-error';
import { handleErrors } from '../../../lib/errors/http/handlers';
import { generateRandomString } from '../../../lib/security/aes.utils';
import { generateGPGNewKeys } from '../../../lib/utils/keys.utils';
import auth from '../../../middleware/authentication';
import { checkAuth } from '../../../middleware/init-middleware';

const handler = nextConnect()
  .use(auth)
  .use(
    checkAuth(
      'Vous devez être connecté pour pouvoir enregistrer de nouveaux clés.',
    ),
  );

handler.post(async (req, res) => {
  try {
    const { user } = req;
    const name = `${user.firstname} ${user.lastname}`;
    const { orgId: oid } = user;
    const email = `${user.firstname}.${user.lastname}-${oid}@acem.evote.com`;
    const passphrase = generateRandomString(100);

    try {
      const encryptor = await generateGPGNewKeys({ name, email, passphrase });
      const armoredKeysWithPassphrase = encryptor.getArmoredKeys();
      await createKeys({ name, email, ...armoredKeysWithPassphrase });
    } catch (error) {
      const message = 'Impossible de sauvegarder les clés';
      const hint = 'Votre compte est déjà configurée.';
      throw new AppError({ message, code: 400, hint });
    }
    req.user = await updateUserByOrgId(oid, { $set: { isFirstLogin: false } });
    res.status(201).json({ message: 'Ok' });
  } catch (error) {
    handleErrors(error, res, AppError);
  }
});

export default handler;
