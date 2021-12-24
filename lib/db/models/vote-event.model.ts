import { model, Schema } from 'mongoose';

import { capitalize } from '../../utils/lib.utils';
import { schemaOptions } from './model.utils';
import type {
  IExecutiveEventSchema,
  IRegionalEventSchema,
  IVoteEventSchema,
} from './models.types';

const voteEventSchema = new Schema<IVoteEventSchema>(
  {
    eventName: { type: String, required: true, unique: true },
    startDate: { type: Date, required: true },
    eventDuration: { type: Number, required: true },
    eventStatus: { type: String, required: true, enum: ['open', 'close'] },
    eventImage: { type: String, default: '' },
    eventDescription: { type: String, default: '' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'Admin' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    candidates: { type: [{ type: Schema.Types.ObjectId, ref: 'User' }] },
  },
  { ...schemaOptions, discriminatorKey: 'eventScope' },
);

voteEventSchema.pre<IVoteEventSchema>('save', function preSave(next) {
  this.updatedAt = new Date(Date.now());
  this.eventName = capitalize(this.eventName);
  next();
});

voteEventSchema.index({ eventName: 1 }, { unique: true });
const VoteEvent = global.VoteEvent || model('VoteEvent', voteEventSchema);
global.VoteEvent = VoteEvent;

const executiveSchema = new Schema<IExecutiveEventSchema>({
  executiveMembers: {
    type: Schema.Types.ObjectId,
    ref: 'Executive',
    required: true,
  },
});

const regionalSchema = new Schema<IRegionalEventSchema>({
  eventLocation: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
});

const ExecutiveEvent =
  global.ExecutiveEvent ||
  VoteEvent.discriminator('executiveEvent', executiveSchema);

global.ExecutiveEvent = ExecutiveEvent;

const RegionalEvent =
  global.RegionalEvent ||
  VoteEvent.discriminator('regionalEvent', regionalSchema);

global.RegionalEvent = RegionalEvent;

export { ExecutiveEvent, RegionalEvent };
