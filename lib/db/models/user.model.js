import { model, Schema } from 'mongoose';

import {
  emailValidator,
  phoneValidator,
  startCase,
} from '../../utils/lib.utils';
import { schemaOptions, voteCategories } from './model.utils';

const userSchema = new Schema(
  {
    orgId: { type: String, required: true, unique: true },
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    avatar: { type: String, default: '/images/users/u-0.svg' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isFirstLogin: { type: Boolean, default: true },
    firstLoginDate: { type: Date, default: Date.now },
    isLocked: { type: Boolean, default: false },
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: emailValidator,
        message: '{VALUE} is not a valid email',
      },
    },
    phone: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: phoneValidator,
        message: '{VALUE} is not a valid phone number',
      },
    },
    events: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    completedEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    missedEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }],
    votedCategories: [
      {
        eventId: { type: Schema.Types.ObjectId, ref: 'Event' },
        catNames: { type: [String], enum: voteCategories },
        voteCompleted: { type: Boolean, default: false },
      },
    ],
    isCandidate: { type: Boolean, default: false },
    isMembershipActive: { type: Boolean, default: false },
  },
  { ...schemaOptions },
);

userSchema.index(
  { orgId: 1, email: 1, phone: 1, firstname: 1, lastname: 1 },
  { unique: true, sparse: true },
);

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
  if (this.isModified('email')) {
    this.email = this.email.toLowerCase();
  }
  return next();
});

const User = global.User || model('User', userSchema);
global.User = User;
export default User;
