import nextConnect from 'next-connect';

import AppError from '@/errors/app-error';
import { handleErrors } from '@/errors/http/handlers';
import { Request, Response } from '@/lib/lib.types';
import auth from '@/middlewares/authentication';
import { checkAuth } from '@/middlewares/init-middleware';
import { encryptMessage } from '@/security/aes.utils';
import { decryptReqBodyMsg, getUserKeys } from '@/utils/keys.utils';

const handler = nextConnect()
  .use(auth)
  .use(checkAuth('Vous devez vous connecter pour récupérer vos clés'));

interface ReqWithBody extends Request {
  body: {
    aesKeyEncrypted: string;
  };
}

handler.post(async (req: ReqWithBody, res: Response) => {
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
    const result = await getUserKeys({ name, email });
    if (!result)
      throw new AppError({
        message: 'Keys not found',
        code: 404,
        hint: 'You may need to generate keys before trying to get them',
      });
    const { keys } = result;
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
