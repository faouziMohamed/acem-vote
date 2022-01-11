import type { Key, PrivateKey, PublicKey } from 'openpgp';
import {
  createMessage,
  decrypt,
  decryptKey,
  encrypt,
  generateKey,
  readKey,
  readMessage,
  readPrivateKey,
} from 'openpgp';

// eslint-disable-next-line import/extensions
import { assertNotEmptyStr } from '@/utils/lib.utils';

import type {
  ArmoredKeys,
  EncryptedMessage,
  GPGConstructorOptions,
  PubKey,
  UnarmoredKeys,
  UserId,
} from './security.types';

/**
 * Class for encrypting and decrypting messages with GPG.
 * Main algotihme use the asymetric encryption. By default, the asymetric
 * encryption used is `ecc` algorithm.
 * - You have the choice to use static methods to encrypt and decrypt messages
 * - or use instance methods to encrypt and decrypt messages
 */
export default class PGPEncryptor {
  private userIDs: UserId[];

  private passphrase: string;

  private privateArmoredKey: string;

  private publicArmoredKey: string;

  private revocationCertificate: string;

  private instance: PGPEncryptor | null = null;

  private _foreignPubKeys: string[];

  /**
   * @param  userIDs : Array of user IDs containing name and email
   * @param { passphrase : Passphrase for the private key
   * @return Promise<GPGEncryptor>
   */
  constructor({ userIDs, passphrase = '' }: GPGConstructorOptions) {
    if (userIDs.length === 0) {
      throw new Error('At least one user ID required');
    }
    this.passphrase = passphrase;
    this.userIDs = userIDs;
    this.privateArmoredKey = '';
    this.publicArmoredKey = '';
    this.revocationCertificate = '';
    this.instance = null;
    this._foreignPubKeys = [];
  }

  /**
   * @async <br>
   * Initialize an object after it instantiation
   * - Generate a pair of keys
   * - Make them ready to encrypt and decrypt message
   * - Return the same instance with the keys ready to use
   * @return Promise<GPGEncryptor>
   * */
  async init() {
    if (!this.instance) {
      this.instance = this;
      await this.generateAsymetricKeys();
      return this;
    }
    throw new Error('Message already initialized');
  }

  /**
   * Set all calculated field to non initialized state.
   * User will need to call the `.init()` method to initialize the object
   * before using it.
   * <br>
   * UserIDs and passphrase will remain unchanged. We recommend to create new
   * instance of the class if you need to change them.
   */
  reset() {
    this.instance = null;
    this.publicArmoredKey = '';
    this.privateArmoredKey = '';
    this._foreignPubKeys = [];
  }

  private async _generateKey(type: 'ecc' | 'rsa' = 'ecc') {
    return generateKey({
      type,
      userIDs: this.userIDs,
      curve: 'ed25519',
      passphrase: this.passphrase,
      format: 'armored',
      rsaBits: 4096,
    });
  }

  /**
   * @async <br>
   * Generate public and private key and return the armored format of the keys.
   * */
  async generateAsymetricKeys(): Promise<ArmoredKeys> {
    const keys = await this._generateKey('ecc');
    this.privateArmoredKey = keys.privateKey;
    this.publicArmoredKey = keys.publicKey;
    this.revocationCertificate = keys.revocationCertificate;
    return {
      publicArmoredKey: this.publicArmoredKey,
      privateArmoredKey: this.privateArmoredKey,
      revocationCertificate: this.revocationCertificate,
      passphrase: this.passphrase,
    };
  }

  /**
   * @static
   * @async
   * Generate public and private key with the given IDs and return the keys
   * as an object. Keys are in then `openpgp.key` format.
   * @param userIDs : Array of user IDs containing name and email
   * @param passphrase : Passphrase for the private key
   *  */
  static async createAsymetricKeys(
    userIDs: UserId[],
    passphrase = '',
  ): Promise<ArmoredKeys> {
    const keys = await generateKey({
      type: 'ecc',
      curve: 'ed25519',
      userIDs,
      passphrase,
      format: 'armored',
      rsaBits: 4096,
    });
    return {
      publicArmoredKey: keys.publicKey,
      privateArmoredKey: keys.privateKey,
      revocationCertificate: keys.revocationCertificate,
      passphrase,
    };
  }

  /** Encrypt a message with the public key passed in parameter sign the
   * encrypted message with the private key of the current instance
   * @param message : The message to encrypt
   * @param pubKey : The public key to encrypt the message with
   * @return Promise<string>
   * */
  async encryptMessage(message: string, encryptionKey: PublicKey) {
    assertNotEmptyStr(message, 'Message to encrypt');
    if (this._foreignPubKeys.indexOf(encryptionKey.armor()) === -1) {
      this._foreignPubKeys.push(encryptionKey.armor());
    }

    const messageObject = await createMessage({ text: message });
    return encrypt({
      message: messageObject,
      encryptionKeys: encryptionKey,
      signingKeys: await this._getUnarmoredPrivateKey(),
    });
  }

  /**
   * Encrypt a message with the public key passed in parameter sign the
   * @param message : The message to encrypt
   * @param armoredEncryptionKey : The public key to encrypt the message with
   * @return Promise<string> Encrypted message
   */
  static async encryptMessageStatic({
    message = '',
    armoredEncryptionKey = '',
  }) {
    assertNotEmptyStr(message, 'Message to encrypt');
    assertNotEmptyStr(armoredEncryptionKey, 'Encryption public key');
    const messageObject = await createMessage({ text: message });
    const pubKey = await readKey({ armoredKey: armoredEncryptionKey });
    return encrypt({ message: messageObject, encryptionKeys: pubKey });
  }

  /** Decrypt an encrypted message. The message is encrypted with the public key
   * of this instance.The decryptage will use the private key of this instance
   */
  async decryptMessage(encryptedArmoredMsg: string) {
    assertNotEmptyStr(encryptedArmoredMsg, 'Encrypted message');
    const message = await readMessage({ armoredMessage: encryptedArmoredMsg });
    const unarmoredMsg = await decrypt({
      message,
      verificationKeys: await this.getPublicKey(),
      decryptionKeys: await this._getUnarmoredPrivateKey(),
    });
    return unarmoredMsg;
  }

  static async decryptMessageStatic({
    encryptedArmoredMsg,
    armoredDecryptionKeys,
    passphrase = '',
  }: EncryptedMessage) {
    assertNotEmptyStr(encryptedArmoredMsg, 'Encrypted message');
    assertNotEmptyStr(armoredDecryptionKeys, 'Decryption Key');
    const privateKey = await PGPEncryptor.assertPassphraseIsCorrect(
      armoredDecryptionKeys,
      passphrase,
    );

    const message = await readMessage({ armoredMessage: encryptedArmoredMsg });
    return decrypt({ message, decryptionKeys: privateKey });
  }

  static async readArmoredPublicKey(armoredPublicKey: string): Promise<PubKey> {
    return readKey({ armoredKey: armoredPublicKey });
  }

  get foreignPubKeys(): string[] {
    return this._foreignPubKeys;
  }

  get userID(): UserId {
    return this.userIDs[0];
  }

  getPublicArmoredKey(): string | never {
    if (this.instance) return this.publicArmoredKey;
    throw new Error('Instance not initialized');
  }

  getPrivateArmoredKey(): string | never {
    if (this.instance) return this.privateArmoredKey;
    throw new Error('Instance not initialized');
  }

  async getPublicKey(): Promise<Key | never> {
    if (this.instance) return readKey({ armoredKey: this.publicArmoredKey });
    throw new Error('Instance not initialized');
  }

  async getPrivateKey(): Promise<PrivateKey | never> {
    if (this.instance) return this._getUnarmoredPrivateKey();
    throw new Error('Instance not initialized');
  }

  getArmoredKeys(): ArmoredKeys | never {
    if (this.instance) {
      return {
        privateArmoredKey: this.privateArmoredKey,
        publicArmoredKey: this.publicArmoredKey,
        passphrase: this.passphrase,
      };
    }
    throw new Error('Instance not initialized');
  }

  async getUnarmoredKeys(): Promise<UnarmoredKeys | never> {
    if (this.instance) {
      return {
        privateKey: await this.getPrivateKey(),
        publicKey: await this.getPublicKey(),
        passphrase: this.passphrase,
      };
    }
    throw new Error('Instance not initialized');
  }

  private async _getUnarmoredPrivateKey(): Promise<PrivateKey | never> {
    if (this.instance) {
      return this.passphrase
        ? decryptKey({
            privateKey: await readPrivateKey({
              armoredKey: this.privateArmoredKey,
            }),
            passphrase: this.passphrase,
          })
        : readPrivateKey({ armoredKey: this.privateArmoredKey });
    }
    throw new Error('Instance not initialized');
  }

  toJSON() {
    return this.instance
      ? {
          userIDs: this.userIDs,
          publicKey: this.publicArmoredKey,
          foreignPubKeys: this._foreignPubKeys,
        }
      : {};
  }

  /**
   * @static
   * Create and return an instance of {@link PGPEncryptor} using a privateKeyArmored key and it passphrase to decrypt it.
   * - The passphrase is optional.<br>
   * - An exception will be thrown if the private
   * Armored key is encrypted but no passphrase was provided.
   * @param privateKeyArmored - The armored private key
   * @param passphrase - The passphrase to decrypt the private key
   */

  static async fromArmoredPrivateKey(
    privateArmoredKey: string,
    passphrase = '',
  ) {
    assertNotEmptyStr(privateArmoredKey, 'Private key');
    const privateKey = await PGPEncryptor.assertPassphraseIsCorrect(
      privateArmoredKey,
      passphrase,
    );
    const publicKey = privateKey.toPublic();
    const userIDs: UserId[] = PGPEncryptor.getUserIDsFromKey(publicKey);
    const that = new PGPEncryptor({ userIDs, passphrase });
    that.privateArmoredKey = privateArmoredKey;
    that.publicArmoredKey = publicKey.armor();
    that.instance = that;
    return that;
  }

  private static async assertPassphraseIsCorrect(
    privateArmoredKey: string,
    passphrase: string,
  ): Promise<PrivateKey | never> {
    return decryptKey({
      privateKey: await readPrivateKey({ armoredKey: privateArmoredKey }),
      passphrase,
    }).catch(() => {
      throw new Error('Invalid passphrase, please provide a valid passphrase');
    });
  }

  static getUserIDsFromKey(publicKey: Key): UserId[] {
    return [
      ...publicKey.users.map((u) => ({
        name: u.userID?.name || '',
        email: u.userID?.email || '',
      })),
    ];
  }
}
