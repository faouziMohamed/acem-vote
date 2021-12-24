import { model, Schema } from 'mongoose';

import { schemaOptions } from './model.utils';
import type { IAdminSchema } from './models.types';

const adminSchema: Schema<IAdminSchema> = new Schema(
  {
    username: String,
    password: { type: String, required: true },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      required: true,
    },
    privilegeLevel: {
      type: String,
      required: true,
      enum: ['admin', 'superAdmin'],
      default: 'admin',
    },
    notifications: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Notification' }],
    },
  },
  { ...schemaOptions },
);

adminSchema.index({ username: 1 }, { unique: true });
adminSchema.pre('save', function reformatValues(next) {
  if (this.isModified('username')) {
    this.username = this.username.toLowerCase();
  }
  next();
});

const Admin = global.Admin || model('Admin', adminSchema);
global.Admin = Admin;
export default Admin;
