import { model, Schema } from 'mongoose';

import { startCase } from '../../utils/lib.utils';

const userSchema = new Schema(
  {
    orgId: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    avatar: { type: String, default: '/images/users/u-0.svg' },
    role: { type: String, default: 'user' },
    isCandidate: { type: Boolean, default: false },
    isFirstLogin: { type: Boolean, default: true },
    hasVoted: { type: Boolean, default: false },
    isLocked: { type: Boolean, default: false },
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

userSchema.index({ orgId: 1, firstname: 1, lastname: 1 });

userSchema.pre('save', function reformatValues(next) {
  if (this.isModified('orgId')) {
    this.orgId = this.orgId.toLowerCase();
  }
  if (this.isModified('firstname')) {
    this.set({ firstname: startCase(this.firstname) });
  }
  if (this.isModified('lastname')) {
    this.set({ lastname: startCase(this.lastname) });
  }
  return next();
});

const User = global.User || model('User', userSchema);
global.User = User;
export default User;
