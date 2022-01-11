import type { Key, PrivateKey, PublicKey } from 'openpgp';

export interface UserId {
  name: string;
  email: string;
}

export interface GPGConstructorOptions {
  userIDs: UserId[];
  passphrase?: string;
}

export interface ArmoredKeys {
  publicArmoredKey: string;
  privateArmoredKey: string;
  passphrase?: string;
  revocationCertificate?: string;
}

export interface UnarmoredKeys {
  privateKey: PrivateKey;
  publicKey: PubKey;
  passphrase?: string;
}

export interface EncryptedMessage {
  encryptedArmoredMsg: string;
  armoredDecryptionKeys: string;
  passphrase?: string;
}

export type PubKey = Key | PublicKey;
export type PrivKey = PrivateKey;
