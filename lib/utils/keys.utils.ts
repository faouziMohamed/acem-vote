import type { IUserBasic } from '../db/models/models.types';
import { createKeys, findEntityKeys } from '../db/queries/keys.queries';
import { findUserByOrgId } from '../db/queries/user.queries';
import { getNewVoteID } from '../db/queries/vote-id.queries';
import AppError from '../errors/app-error';
import type { Request } from '../lib.types';
import PGPEncryptor from '../security/pgpEncryptor';
import type { ArmoredKeys, UserId } from '../security/security.types';
import type { IGetKeysParams } from './utils.types';

export async function generateNewPGPKeys({
  name = '',
  email = '',
  passphrase = '',
}): Promise<PGPEncryptor> {
  return new PGPEncryptor({ userIDs: [{ name, email }], passphrase }).init();
}

export async function generateNewServerKeys() {
  const name = process.env.ENCRYPTION_SERVER_KEY_NAME!;
  const email = process.env.ENCRYPTION_SERVER_KEY_EMAIL!;
  const passphrase = process.env.ENCRYPTION_SERVER_KEY_PASSPHRASE!;
  const encryptor = await generateNewPGPKeys({ name, email, passphrase });

  const keys = encryptor.getArmoredKeys();
  const {
    privateArmoredKey = '',
    publicArmoredKey = '',
    revocationCertificate = '',
  } = keys;

  const options = {
    privateArmoredKey,
    publicArmoredKey,
    revocationCertificate,
    passphrase,
    knownEntities: encryptor.foreignPubKeys,
    name,
    email,
  };

  await createKeys(options);
  // eslint-disable-next-line no-console
  console.log('Created new server keys');
  // eslint-disable-next-line no-console
  console.log(`${name} keys created!`);
  return { serverPGPEncryptor: encryptor, keys };
}

export async function getServerKeys() {
  const filter = {
    _id: 0,
    publicArmoredKey: 1,
    privateArmoredKey: 1,
    passphrase: 1,
  };
  const name = process.env.ENCRYPTION_SERVER_KEY_NAME || '';
  const email = process.env.ENCRYPTION_SERVER_KEY_EMAIL || '';

  const keys = await getKeys({ name, email, filter });

  return keys || generateNewServerKeys();
}

export async function getUserKeys({ name, email }: UserId) {
  const filter = {
    _id: 0,
    publicArmoredKey: 1,
    privateArmoredKey: 1,
    passphrase: 1,
  };
  return getKeys({ name, email, filter });
}

async function getKeys({ name, email, filter = {} }: IGetKeysParams) {
  const keys = await findEntityKeys({ query: { name, email }, filter });
  if (keys && keys.privateArmoredKey) {
    const { privateArmoredKey } = keys;
    const { passphrase = '' } = keys;
    const encryptor = await PGPEncryptor.fromArmoredPrivateKey(
      privateArmoredKey,
      passphrase,
    );
    return { keys, serverPGPEncryptor: encryptor };
  }
  return false;
}

export async function findUser(idName: string): Promise<IUserBasic> {
  const user: IUserBasic = await findUserByOrgId(idName);
  if (!user) {
    throw new AppError({
      message: 'Utilisateur non trouvé.',
      code: 404,
      hint: "Verifier que l'id de que vous avez donné est correcte est correct.",
    });
  }

  if (user.isFirstLogin) {
    throw new AppError({
      message: "Cet utisateur n'a pas encore de clé",
      code: 404,
      hint: "L'utilisateur doit d'abord se connecter pour avoir des clés de cryptages",
    });
  }
  return user;
}

export function ensureKeysArePassedOrThrow({
  publicArmoredKey,
  privateArmoredKey,
  passphrase,
}: ArmoredKeys) {
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

interface IDecryptMessage {
  encrypted: string;
  toObject: boolean;
}

export async function decryptReqBodyMsg({
  encrypted,
  toObject = true,
}: IDecryptMessage): Promise<string> {
  const { serverPGPEncryptor } = await getServerKeys();
  const decryptedMsg = await serverPGPEncryptor.decryptMessage(encrypted);
  const msg = decryptedMsg.data.toString();
  return toObject ? (JSON.parse(msg) as string) : msg;
}
interface ReqBody extends Request {
  body: ArmoredKeys;
}

export async function generateAndSaveVoteID(req: ReqBody) {
  const { publicArmoredKey } = req.body;
  if (!publicArmoredKey) {
    const message = "Aucune clé publique n'a été fournie";
    throw new AppError({ message, code: 400 });
  }

  const id = await getNewVoteID(req.user.uid).then((_id) => _id.toString());
  const voteID = JSON.stringify({ id });
  const { serverPGPEncryptor: serverEnc } = await getServerKeys();
  const voteIdEncrypted = await encryptMsg(publicArmoredKey, serverEnc, voteID);
  return voteIdEncrypted;
}

export async function encryptMsg(
  armoredPublicKey: string,
  encryptor: PGPEncryptor,
  message: string,
): Promise<string> {
  const publicKey = await PGPEncryptor.readArmoredPublicKey(armoredPublicKey);
  const voteIdEncrypted = await encryptor.encryptMessage(message, publicKey);
  return voteIdEncrypted;
}

export async function encryptGeneratedKeys(
  encryptor: PGPEncryptor,
  serverArmoredPubKey: string,
): Promise<string> {
  const unencryptedMessage = JSON.stringify(encryptor.getArmoredKeys());
  const pubKey = await PGPEncryptor.readArmoredPublicKey(serverArmoredPubKey);
  const encrypted = await encryptor.encryptMessage(unencryptedMessage, pubKey);
  return encrypted;
}
