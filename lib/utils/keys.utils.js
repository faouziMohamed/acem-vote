import { createKeys, findKeys } from '../db/queries/keys.queries';
import { findUserByOrgId } from '../db/queries/user.queries';
import AppError from '../errors/app-error';
import GPGEncryptor from '../security/gpgEncryptor';

export async function generateGPGNewKeys({
  name = '',
  email = '',
  passphrase = '',
}) {
  return new GPGEncryptor({ userIDs: [{ name, email }], passphrase }).init();
}

export async function generateNewServerKeys() {
  const name = `${process.env.ENCRYPTION_SERVER_KEY_NAME}`;
  const email = process.env.ENCRYPTION_SERVER_KEY_EMAIL;
  const passphrase = process.env.ENCRYPTION_SERVER_KEY_PASSPHRASE;
  const encryptor = await generateGPGNewKeys({ name, email, passphrase });

  const keys = encryptor.getArmoredKeys();
  const options = {
    ...keys,
    ...encryptor.userID,
    knownEntities: encryptor.foreignPubKeys,
  };

  await createKeys(options);
  // eslint-disable-next-line no-console
  console.log('Created new server keys');
  // eslint-disable-next-line no-console
  console.log(`${name} keys created!`);
  return { serverGPGEncryptor: encryptor, keys };
}

export async function getServerKeys() {
  const filter = {
    _id: 0,
    publicArmoredKey: 1,
    privateArmoredKey: 1,
    passphrase: 1,
  };
  const name = process.env.ENCRYPTION_SERVER_KEY_NAME;
  const email = process.env.ENCRYPTION_SERVER_KEY_EMAIL;

  const keys = await getKeys({ name, email, filter });

  return keys || generateNewServerKeys();
}

export async function getUserKeys({ name, email }) {
  const filter = {
    _id: 0,
    publicArmoredKey: 1,
    privateArmoredKey: 1,
    passphrase: 1,
  };
  return getKeys({ name, email }, filter);
}

async function getKeys({ name, email, filter = {} }) {
  const keys = await findKeys({ query: { name, email }, filter });
  if (keys) {
    const encryptor = await GPGEncryptor.fromArmoredKeys({ ...keys });
    return { keys, serverGPGEncryptor: encryptor };
  }
  return false;
}

export async function findUser(idName) {
  const user = await findUserByOrgId(idName);
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
