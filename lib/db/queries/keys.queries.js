import Keys, { decryptPassphrase } from '../models/keys.model';

export async function createKeys({
  email,
  name,
  publicArmoredKey,
  privateArmoredKey,
  passphrase,
  knownEntities,
}) {
  await Keys.create({
    email,
    name,
    publicArmoredKey,
    privateArmoredKey,
    passphrase,
    knownEntities,
  });
}

export async function findKeys({ query = {}, filter = {} }) {
  const keys = await Keys.findOne(query, filter).lean().exec();
  if (keys) keys.passphrase = decryptPassphrase(keys.passphrase);
  return keys;
}
