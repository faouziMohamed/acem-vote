import type { IKeyFilter } from '@/utils/utils.types';

import Keys, { decryptPassphrase } from '../models/keys.model';

interface ICreateKeys {
  email: string;
  name: string;
  publicArmoredKey: string;
  privateArmoredKey: string;
  passphrase: string;
  knownEntities?: string[];
  revocationCertificate?: string;
}

export async function createKeys({
  email,
  name,
  publicArmoredKey,
  privateArmoredKey,
  passphrase,
  knownEntities,
  revocationCertificate = '',
}: ICreateKeys) {
  await Keys.create({
    email,
    name,
    publicArmoredKey,
    privateArmoredKey,
    passphrase,
    knownEntities,
    revocationCertificate,
  });
}
type IQueryKeys =
  | { name: string; email?: string }
  | { email: string; name?: string };

interface IQueryFilter {
  query: IQueryKeys;
  filter: IKeyFilter;
}

export async function findEntityKeys({ query, filter }: IQueryFilter) {
  const keys = await Keys.findOne(query, filter).lean().exec();
  if (keys) keys.passphrase = decryptPassphrase(keys.passphrase || '');
  return keys;
}
