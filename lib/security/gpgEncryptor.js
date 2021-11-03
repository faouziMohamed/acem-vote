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

/**
 * Class for encrypting and decrypting messages with GPG.
 * Main algotihme use the asymetric encryption. By default, the asymetric
 * encryption used is `ecc` algorithm.
 * - You have the choice to use static methods to encrypt and decrypt messages
 * - or use instance methods to encrypt and decrypt messages
 */
export default class GPGEncryptor {
  #userIDs = [{}];
  #passphrase = '';
  #privateKey = '';
  #publicKey = '';
  #revocationCertificate = '';
  #instance = null;
  #foreignPubKeys = [];

  /**
   * @param {Array} userIDs : Array of user IDs containing name and email
   * @param {string} passphrase : Passphrase for the private key
   * @return Promise<MessageEncryption>
   */
  constructor({ userIDs = [], passphrase = '' }) {
    if (userIDs.length === 0) {
      throw new Error('At least one user ID required');
    }

    this.#passphrase = passphrase;
    this.#userIDs = userIDs;
  }

  /**
   * @async <br>
   * Initialize an object after it instantiation
   * - Generate a pair of keys
   * - Make them ready to encrypt and decrypt message
   * - Return the same instance with the keys ready to use
   * @return Promise<MessageEncryption>
   * */
  async init() {
    if (!this.#instance) {
      this.#instance = this;
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
   *
   */
  reset() {
    this.#instance = null;
    this.#publicKey = null;
    this.#privateKey = null;
    this.#foreignPubKeys = [];
  }

  async #generateKey(type = 'ecc') {
    const keyParameters = {
      type,
      userIDs: this.#userIDs,
      curve: 'ed25519',
      passphrase: this.#passphrase,
      format: 'armored',
      rsaBits: 4096,
    };

    return generateKey(keyParameters);
  }

  /**
   * @async <br>
   * Generate public in Object format and armored format key with using the parameters
   * passed in the constructor.
   * */
  async generateAsymetricKeys() {
    const keys = await this.#generateKey('ecc');
    this.#privateKey = keys.privateKey;
    this.#publicKey = keys.publicKey;
    this.#revocationCertificate = keys.revocationCertificate;
    return this.getPublicKeyBoth();
  }

  /**
   * @static, @async <br>
   * Generate public and private key with the given IDs and return the keys
   * as an object. Keys are in then `openpgp.key` format.
   * @param {Array} userIDs : Array of user IDs containing name and email
   * @param {string} passphrase : Passphrase for the private key
   * @return Promise<Object>
   *  */
  static async createAsymetricKeys(
    userIDs = [{ name: '', email: '' }],
    passphrase = '',
  ) {
    const keys = await generateKey({
      type: 'ecc',
      curve: 'ed25519',
      userIDs,
      passphrase,
    });
    return { pubKey: keys.publicKey, privKey: keys.privateKey };
  }

  /** Encrypt a message with the public key passed in parameter sign the
   * encrypted message with the private key of the current instance
   * @param {string} message : The message to encrypt
   * @param {string} pubKey : The public key to encrypt the message with
   * @return Promise<string>
   * */
  async encryptMessage(message, encryptionKey) {
    GPGEncryptor.#typeAndContentVerification(message, 'Message to encrypt');

    if (this.#foreignPubKeys.indexOf(encryptionKey) === -1) {
      this.#foreignPubKeys.push(encryptionKey);
    }

    const messageObject = await createMessage({ text: message });
    return encrypt({
      message: messageObject,
      encryptionKeys: encryptionKey,
      signingKeys: await this.#getPrivateKey(),
    });
  }

  /** Decrypt an encrypted message. The message is encrypted with the public key
   * of this instance.The decryptage will use the private key of this instance
   */
  async decryptMessage(encryptedArmoredMsg = '') {
    GPGEncryptor.#typeAndContentVerification(
      encryptedArmoredMsg,
      'Encrypted message',
    );
    const message = await readMessage({ armoredMessage: encryptedArmoredMsg });
    return decrypt({
      message,
      verificationKeys: await this.getPublicKey(),
      decryptionKeys: await this.#getPrivateKey(),
    });
  }

  static async encryptMessageStatic({
    message = '',
    armoredEncryptionKey = '',
  }) {
    GPGEncryptor.#typeAndContentVerification(message, 'Message to encrypt');
    GPGEncryptor.#typeAndContentVerification(
      armoredEncryptionKey,
      'Encryption public key',
    );

    const messageObject = await createMessage({ text: message });
    const pubKey = await readKey({ armoredKey: armoredEncryptionKey });
    return encrypt({
      message: messageObject,
      encryptionKeys: pubKey,
    });
  }

  static async readArmoredPublicKey(armoredPublicKey = '') {
    return readKey({ armoredKey: armoredPublicKey });
  }

  static async decryptMessageStatic({
    encryptedArmoredMsg,
    armoredDecryptionKeys = '',
    passphrase = '',
  }) {
    GPGEncryptor.#typeAndContentVerification(
      encryptedArmoredMsg,
      'Encrypted message',
    );
    GPGEncryptor.#typeAndContentVerification(
      armoredDecryptionKeys,
      'Decryption Key',
    );
    let privateKey = armoredDecryptionKeys;
    if (passphrase) {
      privateKey = await decryptKey({
        privateKey: await readPrivateKey({ armoredKey: armoredDecryptionKeys }),
        passphrase,
      });
    }
    const message = await readMessage({ armoredMessage: encryptedArmoredMsg });
    return decrypt({
      message,
      decryptionKeys: privateKey,
    }).catch(() => {
      throw new Error(`Invalid passphrase`);
    });
  }

  get userID() {
    return this.#userIDs[0];
  }

  get foreignPubKeys() {
    return this.#foreignPubKeys;
  }

  getPublicArmoredKey() {
    if (this.#instance) {
      return this.#publicKey;
    }
    throw new Error('Instance not initialized');
  }

  async getPublicKey() {
    if (this.#instance) {
      return readKey({ armoredKey: this.#publicKey });
    }
    throw new Error('Instance not initialized');
  }

  async getPublicKeyBoth() {
    if (this.#instance) {
      return { pubKey: await this.getPublicKey(), publicKey: this.#publicKey };
    }
    throw new Error('Instance not initialized');
  }

  getPrivateArmoredKey() {
    if (this.#instance) {
      return this.#privateKey;
    }
    throw new Error('Instance not initialized');
  }

  async getPrivateKey() {
    if (this.#instance) {
      return this.#getPrivateKey();
    }
    throw new Error('Instance not initialized');
  }

  async getPrivateKeyBoth() {
    if (this.#instance) {
      return {
        privKey: await this.getPrivateKey(),
        privateKey: this.#privateKey,
      };
    }
    throw new Error('Instance not initialized');
  }

  getArmoredKeys() {
    if (this.#instance) {
      return {
        privateArmoredKey: this.#privateKey,
        publicArmoredKey: this.#publicKey,
        passphrase: this.#passphrase,
      };
    }
    throw new Error('Instance not initialized');
  }

  async getKeys() {
    if (this.#instance) {
      return {
        privateKey: await this.getPrivateKey(),
        publicKey: await this.getPublicKey(),
        passphrase: this.#passphrase,
      };
    }
    throw new Error('Instance not initialized');
  }

  async #getPrivateKey() {
    if (this.#instance) {
      return this.#passphrase
        ? decryptKey({
            privateKey: await readPrivateKey({ armoredKey: this.#privateKey }),
            passphrase: this.#passphrase,
          })
        : readPrivateKey({ armoredKey: this.#privateKey });
    }
    throw new Error('Instance not initialized');
  }

  toJSON() {
    return this.#instance
      ? {
          userIDs: this.#userIDs,
          publicKey: this.#publicKey,
          foreignPubKeys: this.#foreignPubKeys,
        }
      : {};
  }

  static #typeAndContentVerification(text, name) {
    if (typeof text !== 'string') {
      throw new Error(
        `Expected ${name} to be of type 'string' but got type '${typeof text}'`,
      );
    } else if (!text) {
      throw new Error(`Empty ${name} not allowed`);
    }
  }

  /**
   * @static
   * Create and return an instance of {@link GPGEncryptor} using a publicArmoredKey,
   * a privateKeyArmored key and it passphrase to decrypt it.
   * - The passphrase is optional.<br>
   * - An exception will be thrown if the private
   * Armored key is encrypted but no passphrase is provided.
   * @param {string} publicArmoredKey - The armored public key
   * @param {string} privateKeyArmored - The armored private key
   * @param {string} passphrase - The passphrase to decrypt the private key
   */
  static async fromArmoredKeys({
    publicArmoredKey,
    privateArmoredKey,
    passphrase = '',
  }) {
    GPGEncryptor.#typeAndContentVerification(publicArmoredKey, 'Public key');
    GPGEncryptor.#typeAndContentVerification(privateArmoredKey, 'Private key');
    await decryptKey({
      privateKey: await readPrivateKey({ armoredKey: privateArmoredKey }),
      passphrase,
    }).catch(() => {
      throw new Error('Invalid passphrase');
    });
    const publicKey = await readKey({ armoredKey: publicArmoredKey });
    const userIDs = GPGEncryptor.#getUserIDs(publicKey);

    const that = new GPGEncryptor({ userIDs, passphrase });
    that.#privateKey = privateArmoredKey;
    that.#publicKey = publicArmoredKey;
    that.#instance = that;
    return that;
  }

  static #getUserIDs(publicKey) {
    return [
      ...publicKey.users.map((u) => ({
        name: u.userID.name,
        email: u.userID.email,
      })),
    ];
  }
}
