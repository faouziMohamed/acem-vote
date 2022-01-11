import { model, Schema } from 'mongoose';

import { capitalize } from '@/utils/lib.utils';

import { schemaOptions } from './model.utils';
import type { INotificationSchema } from './models.types';

const notificationSchema: Schema<INotificationSchema> = new Schema(
  {
    title: { type: String, required: true },
    message: { type: String, required: true },
    overview: { type: String, default: '' },
    date: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    seen: { type: Boolean, default: false },
  },
  { ...schemaOptions },
);

notificationSchema.index({ date: -1, title: 1, user: 1 }, { unique: true });
notificationSchema.pre('save', function reformatValues(next) {
  if (this.isModified('title')) {
    this.title = capitalize(this.title);
  }
  if (this.isModified('message')) {
    this.message = capitalize(this.message);
  }
  next();
});

const ANotification =
  global.ANotification || model('ANotification', notificationSchema);
global.ANotification = ANotification;
export default ANotification;
