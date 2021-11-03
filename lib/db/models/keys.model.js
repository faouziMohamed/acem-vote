import { model, Schema } from 'mongoose';

import { decryptMessage, encryptMessage } from '../../security/aes.utils';

const keysSchema = new Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    name: { type: String, required: true },
    publicArmoredKey: { type: String, required: true },
    privateArmoredKey: { type: String, required: true },
    passphrase: { type: String, default: '' },
    knownEntities: {
      type: [{ name: { type: String }, publicKey: { type: String } }],
      default: [],
    },
  },
  {
    timeStamp: true,
    toObject: {
      transform: function transform(doc, ret) {
        delete ret.__v;
      },
    },
    toJSON: {
      transform: function transform(doc, ret) {
        delete ret.__v;
      },
    },
  },
);

keysSchema.index({ email: 1, _id: 1 }, { unique: true });
// Encrypt passphrase before saving to database
keysSchema.pre('save', function encryptPassPhrase(next) {
  if (this.isModified('passphrase')) {
    const encr = encryptMessage(
      this.passphrase,
      process.env.ENCRYPTION_SERVER_KEY_PASSPHRASE,
    );
    this.passphrase = encr.toString();
  }

  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  next();
});

export const decryptPassphrase = (passphrase) =>
  decryptMessage(passphrase, process.env.ENCRYPTION_SERVER_KEY_PASSPHRASE);

const Keys = global.Keys || model('Keys', keysSchema);
global.Keys = Keys;
export default Keys;
