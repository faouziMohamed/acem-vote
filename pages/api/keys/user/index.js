import nextConnect from 'next-connect';

import AppError from '../../../../lib/errors/app-error';
import { handleErrors } from '../../../../lib/errors/http/handlers';
import { encryptMessage } from '../../../../lib/security/aes.utils';
import {
  decryptReqBodyMsg,
  getUserKeys,
} from '../../../../lib/utils/keys.utils';
import auth from '../../../../middleware/authentication';
import { checkAuth } from '../../../../middleware/init-middleware';

const handler = nextConnect()
  .use(auth)
  .use(checkAuth('Vous devez vous connecter pour récupérer vos clés'));

handler.post(async (req, res) => {
  try {
    const { aesKeyEncrypted: encrypted } = req.body;
    if (!encrypted) {
      throw new AppError({
        message: 'Aucune clé AES n’a été fournie.',
        code: 400,
        hint: 'Réessayez en fournissant une clé AES.',
      });
    }

    const { user } = req;
    const name = `${user.firstname} ${user.lastname}`;
    const { orgId: oid } = user;
    const email = `${user.firstname}.${user.lastname}-${oid}@acem.evote.com`;
    const { keys } = await getUserKeys({ name, email });
    const { publicArmoredKey: publicKey, privateArmoredKey: privateKey } = keys;
    const { passphrase } = keys;
    const decrypted = await decryptReqBodyMsg({ encrypted, toObject: false });
    const msg = JSON.stringify({ publicKey, privateKey, passphrase });
    const keysEncrypted = encryptMessage(msg, decrypted)?.toString();
    res.status(200).json({ keysEncrypted });
  } catch (error) {
    handleErrors(error, res, AppError);
  }
});

export default handler;
