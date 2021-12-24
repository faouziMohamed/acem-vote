import type { IUserBasic } from '../db/models/models.types';
import { createKeys, findEntityKeys } from '../db/queries/keys.queries';
import { findUserByOrgId } from '../db/queries/user.queries';
import { getNewVoteID } from '../db/queries/vote-id.queries';
import AppError from '../errors/app-error';
import type { Request } from '../lib.types';
import { generateRandomString } from '../security/aes.utils';
import PGPEncryptor from '../security/pgpEncryptor';
import type { ArmoredKeys, UserId } from '../security/security.types';
import type { IGetKeysParams } from './utils.types';

export const generateUserEmail = (
  fname: string,
  lname: string,
  orgId: string,
) => `${fname}.${lname}-${orgId}@acem.evote.com`;
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
  /* eslint-disable no-console */
  console.log('Created new server keys');
  console.log(`${name} keys created!`);
  /* eslint-enable no-console */
  return generateNewKeys(name, email, passphrase);
}

export async function generateNewUserKeys(
  name: string,
  email: string,
  passphrase: string,
) {
  try {
    return await generateNewKeys(name, email, passphrase);
  } catch (error) {
    const message = 'Impossible de sauvegarder les clés';
    const hint = 'Votre compte est déjà configurée.';
    throw new AppError({ message, code: 400, hint });
  }
}

async function generateNewKeys(
  name: string,
  email: string,
  passphrase: string,
) {
  const encryptor = await generateNewPGPKeys({ name, email, passphrase });
  const keys = encryptor.getArmoredKeys();
  const { privateArmoredKey, publicArmoredKey, revocationCertificate } = keys;

  await createKeys({
    name,
    email,
    privateArmoredKey,
    publicArmoredKey,
    passphrase,
    revocationCertificate,
  });

  return { keys, encryptor };
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
  return getKeys({ name, email, filter });
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
  const serverName = process.env.ENCRYPTION_SERVER_KEY_NAME;
  if (!keys) {
    return name === serverName
      ? generateNewServerKeys()
      : generateNewUserKeys(name, email, generateRandomString());
  }
  const { privateArmoredKey, passphrase } = keys;
  const encryptor = await PGPEncryptor.fromArmoredPrivateKey(
    privateArmoredKey,
    passphrase,
  );
  const genKeys: ArmoredKeys = encryptor.getArmoredKeys();
  return { keys: genKeys, encryptor };
}

export async function findUser(orgId: string): Promise<IUserBasic> {
  const user: IUserBasic = await findUserByOrgId(orgId);
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
  const { encryptor } = await getServerKeys();
  const decryptedMsg = await encryptor.decryptMessage(encrypted);
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
  const { encryptor } = await getServerKeys();
  const voteIdEncrypted = await encryptMsg(publicArmoredKey, encryptor, voteID);
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
