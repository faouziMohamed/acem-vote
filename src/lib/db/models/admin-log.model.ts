import { model, Schema } from 'mongoose';

import { schemaOptions } from './model.utils';
import type { IAdminLogSchema } from './models.types';

const adminLogSchema: Schema<IAdminLogSchema> = new Schema(
  {
    admin: { type: Schema.Types.ObjectId, ref: 'Admin', required: true },
    actions: { type: [String], required: true },
    logDate: { type: Date, default: Date.now },
  },
  { ...schemaOptions },
);

adminLogSchema.index({ admin: 1, logDate: -1 });

const AdminLog = global.AdminLog || model('AdminLog', adminLogSchema);
global.AdminLog = AdminLog;
export default AdminLog;
