import { model, Schema } from 'mongoose';

import { schemaOptions } from './model.utils';

const baseOptions = { ...schemaOptions, discriminatorKey: 'eventScope' };
const officeSchema = new Schema({}, baseOptions);
const officeModel = model('Office', officeSchema);

const regionalOfficeSchema = new Schema({
  cityName: { type: String, required: true, unique: true },
  secretaryName: { type: Schema.Types.ObjectId },
  controllerName: { type: Schema.Types.ObjectId },
  culturalOfficerName: { type: Schema.Types.ObjectId },
  sportsManagerName: { type: Schema.Types.ObjectId },
  treasurerName: { type: Schema.Types.ObjectId },
});

const executiveOfficeSchema = new Schema({
  president: { type: Schema.Types.ObjectId },
  vicePresidentName: { type: Schema.Types.ObjectId },
  statutaryAuditorName: { type: Schema.Types.ObjectId },
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
