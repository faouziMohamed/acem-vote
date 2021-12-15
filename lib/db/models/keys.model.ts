/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { model, Schema } from 'mongoose';

import { decryptMessage, encryptMessage } from '../../security/aes.utils';
import { schemaOptions } from './model.utils';
import type { IKeysSchema } from './models.types';

const keysSchema: Schema<IKeysSchema> = new Schema<IKeysSchema>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true },
    publicArmoredKey: { type: String, required: true },
    privateArmoredKey: { type: String, required: true },
    revocationCertificate: { type: String, default: null },
    passphrase: { type: String, default: '' },
    knownEntities: {
      type: [{ name: { type: String }, publicKey: { type: String } }],
      default: [],
    },
  },
  { ...schemaOptions },
);

keysSchema.index({ email: 1, _id: 1 }, { unique: true });
// Encrypt passphrase before saving to database
keysSchema.pre('save', function encryptPassPhrase(next) {
  if (this.isModified('passphrase') && this.passphrase) {
    const encr = encryptMessage(
      this.passphrase,
      process.env.ENCRYPTION_SERVER_KEY_PASSPHRASE!,
    );
    this.passphrase = encr.toString();
  }

  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  next();
});

export const decryptPassphrase = (passphrase: string) =>
  decryptMessage(passphrase, process.env.ENCRYPTION_SERVER_KEY_PASSPHRASE!);

const Keys = global.Keys || model('Keys', keysSchema);
global.Keys = Keys;
export default Keys;
