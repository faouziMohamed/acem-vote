import { model, Schema } from 'mongoose';

import { schemaOptions } from './model.utils';
import type {
  IExecutiveOfficeSchema,
  IRegionalOfficeSchema,
} from './models.types';

const baseOptions = { ...schemaOptions, discriminatorKey: 'eventScope' };
const officeSchema = new Schema({}, baseOptions);
const officeModel = model('Office', officeSchema);

const regionalOfficeSchema: Schema<IRegionalOfficeSchema> = new Schema({
  cityName: { type: String, required: true, unique: true },
  secretaryName: { type: Schema.Types.ObjectId, ref: 'User' },
  controllerName: { type: Schema.Types.ObjectId, ref: 'User' },
  culturalOfficerName: { type: Schema.Types.ObjectId, ref: 'User' },
  sportsManagerName: { type: Schema.Types.ObjectId, ref: 'User' },
  treasurerName: { type: Schema.Types.ObjectId, ref: 'User' },
});

const executiveOfficeSchema: Schema<IExecutiveOfficeSchema> = new Schema({
  presidentName: { type: Schema.Types.ObjectId, ref: 'User' },
  vicePresidentName: { type: Schema.Types.ObjectId, ref: 'User' },
  statutaryAuditorName: { type: Schema.Types.ObjectId, ref: 'User' },
});

regionalOfficeSchema.index({ cityName: 1 }, { unique: true });
executiveOfficeSchema.index(
  { president: 1, vicePresidentName: 1, statutaryAuditorName: 1 },
  { unique: true },
);

const RegionalOffice =
  global.RegionalOffice ||
  officeModel.discriminator('Regional', regionalOfficeSchema);

const ExecutiveOffice =
  global.ExecutiveOffice ||
  officeModel.discriminator('Executive', executiveOfficeSchema);

global.RegionalOffice = RegionalOffice;
global.ExecutiveOffice = ExecutiveOffice;
export { ExecutiveOffice, RegionalOffice };
