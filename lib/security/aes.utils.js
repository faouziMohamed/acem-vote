import { decrypt, encrypt } from 'crypto-js/aes';
import UTF8 from 'crypto-js/enc-utf8';
import { nanoid } from 'nanoid';

export const generateAESKey = (size = 100) => nanoid(size);
export const encryptMessage = (message, key) => encrypt(message, key);
export const decryptMessage = (message, key) =>
  decrypt(message.toString(), key).toString(UTF8);
export const generateRandomString = (size = 100) => nanoid(size);
