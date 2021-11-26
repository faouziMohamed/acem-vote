import { model, Schema } from 'mongoose';

import { capitalize } from '../../utils/lib.utils';
import { eventScopes, schemaOptions, voteCategories } from './model.utils';

const voteEventSchema = new Schema(
  {
    eventName: { type: String, required: true, unique: true },
    eventDate: { type: Date, required: true },
    eventDuration: { type: String, required: true },
    eventScope: {
      type: String,
      enum: eventScopes,
      required: true,
    },
    eventLocation: {
      type: Schema.Types.ObjectId,
      ref: 'Location',
      required: true,
    },
    executiveMembers: {
      type: Schema.Types.ObjectId,
      ref: 'Executive',
      required: true,
    },
    eventImage: { type: String, default: '' },
    eventStatus: { type: String, required: true, enum: ['open', 'close'] },
    eventDescription: { type: String, default: '' },
    createdBy: { type: model.Types.ObjectId, ref: 'Admin' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    candidates: { type: [{ type: Schema.Types.ObjectId, ref: 'Candidate' }] },
    voteCategories: { type: [String], enum: voteCategories },
  },
  { ...schemaOptions },
);

voteEventSchema.pre('save', async function preSave(next) {
  this.updatedAt = Date.now();
  this.eventName = capitalize(this.eventName);
  next();
});

voteEventSchema.index({ eventName: 1 }, { unique: true });

const VoteEvent = global.VoteEvent || model('VoteEvent', voteEventSchema);
global.VoteEvent = VoteEvent;
export default VoteEvent;
