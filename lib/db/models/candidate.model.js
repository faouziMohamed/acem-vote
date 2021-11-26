import { model, Schema } from 'mongoose';

import { eventScopes, schemaOptions, voteCategories } from './model.utils';

const candidateSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orgId: { type: String, required: true, unique: true },
    post: {
      type: String,
      required: true,
      enum: voteCategories,
    },
    votes: {
      yes: { type: Number, min: 0, default: 0 },
      no: { type: Number, min: 0, default: 0 },
      abstain: { type: Number, min: 0, default: 0 },
    },
    isWinner: { type: Boolean, default: false },
    depositionDate: { type: Date, default: Date.now },
    details: { skills: [String], description: String, slogan: String },
    scope: { type: String, enum: eventScopes, default: 'local' },
  },
  { ...schemaOptions },
);

candidateSchema.index(
  { orgId: 1, user: 1, candidatePost: 1 },
  { unique: true },
);

const Candidate = global.Candidate || model('Candidate', candidateSchema);
global.Candidate = Candidate;
export default Candidate;
