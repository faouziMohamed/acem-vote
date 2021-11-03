import nextConnect from 'next-connect';

import { createKeys } from '../../../lib/db/queries/keys.queries';
import { updateUserByOrgId } from '../../../lib/db/queries/user.queries';
import AppError from '../../../lib/errors/app-error';
import { handleErrors } from '../../../lib/errors/http/handlers';
import { getServerKeys } from '../../../lib/utils/keys.utils';
import auth from '../../../middleware/authentication';

const handler = nextConnect().use(auth);

handler.post(async (req, res) => {
  try {
    if (!req.user) {
      throw new AppError({
        message:
          'Vous devez être connecté pour pouvoir enregistrer de nouveau clés.',
        code: 401,
        hint: 'Connectez-vous et réessayez.',
      });
    }
    const { user } = req;
    const armoredKeysWithPassphrase = await decryptReqBodyMsg({ ...req.body });
    ensureKeysArePassedOrThrow(armoredKeysWithPassphrase);
    const name = `${user.firstname} ${user.lastname}`;
    const { orgId: oid } = user;
    const email = `${user.firstname}.${user.lastname}-${oid}@acem.evote.com`;

    try {
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

function ensureKeysArePassedOrThrow({
  publicArmoredKey,
  privateArmoredKey,
  passphrase,
}) {
  if (!publicArmoredKey && !privateArmoredKey && !passphrase) {
    const message =
      'Une clé Publique, clé privée et son ' +
      "passphrase sont attendu mais rien n'a été donné";

    throw new AppError({
      message,
      code: 400,
      hint: 'Mettez les clé et le passphrase sur le contenu de le requête',
    });
  } else if (!publicArmoredKey) {
    throw new AppError({
      message: "Une clé Publique est attendu mais rien n'a été donné",
      code: 400,
      hint: 'Mettez la clé publique sur le contenu de le requête',
    });
  } else if (!privateArmoredKey) {
    throw new AppError({
      message: "Une clé Privée est attendu mais rien n'a été donné",
      code: 400,
      hint: 'Mettez la clé privée sur le contenu de le requête',
    });
  } else if (!passphrase) {
    throw new AppError({
      message: "Un passphrase est attendu mais rien n'a été donné",
      code: 400,
      hint: 'Mettez le passphrase sur le contenu de le requête',
    });
  }
}

export async function decryptReqBodyMsg({ encrypted, toObject = true }) {
  const { serverGPGEncryptor } = await getServerKeys();
  const decryptedMessage = await serverGPGEncryptor.decryptMessage(encrypted);
  return toObject ? JSON.parse(decryptedMessage.data) : decryptedMessage.data;
}
