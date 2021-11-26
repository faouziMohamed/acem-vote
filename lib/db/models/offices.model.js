import { model, Schema } from 'mongoose';

import { startCase } from '../../utils/lib.utils';
import { schemaOptions } from './model.utils';

const regionalOfficeSchema = new Schema(
  {
    cityName: { type: Schema.Types.ObjectId, required: true, unique: true },
    secretaryName: { type: Schema.Types.ObjectId, required: true },
    controllerName: { type: Schema.Types.ObjectId, required: true },
    culturalOfficerName: { type: Schema.Types.ObjectId, required: true },
    sportsManagerName: { type: Schema.Types.ObjectId, required: true },
    treasurerName: { type: Schema.Types.ObjectId, required: true },
  },
  { ...schemaOptions },
);

const executiveOfficeSchema = new Schema(
  {
    president: { type: Schema.Types.ObjectId, required: true },
    vicePresidentName: { type: Schema.Types.ObjectId, required: true },
    statutaryAuditorName: { type: Schema.Types.ObjectId, required: true },
  },
  { ...schemaOptions },
);

regionalOfficeSchema.index({ cityName: 1 }, { unique: true });
regionalOfficeSchema.pre('save', function reformatValues(next) {
  const names = [
    'cityName',
    'secretaryName',
    'controllerName',
    'culturalOfficerName',
    'sportsManagerName',
    'treasurerName',
  ];
  names.forEach((name) => {
    if (this.isModified(name)) this[name] = startCase(this[name]);
  });
  next();
});

executiveOfficeSchema.index(
  { president: 1, vicePresidentName: 1, statutaryAuditorName: 1 },
  { unique: true },
);

executiveOfficeSchema.pre('save', function reformatValues(next) {
  const names = ['president', 'vicePresidentName', 'statutaryAuditorName'];
  names.forEach((name) => {
    if (this.isModified(name)) this[name] = startCase(this[name]);
  });
  next();
});

const RegionalOffice =
  global.RegionalOffice || model('RegionalOffice', regionalOfficeSchema);

const ExecutiveOffice =
  global.ExecutiveOffice || model('ExecutiveOffice', executiveOfficeSchema);
global.RegionalOffice = RegionalOffice;
global.ExecutiveOffice = ExecutiveOffice;
export { ExecutiveOffice, RegionalOffice };
