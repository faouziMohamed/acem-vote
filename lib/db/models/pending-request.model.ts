import { model, Schema } from 'mongoose';

import { schemaOptions } from './model.utils';
import type { IPendingRequestSchema } from './models.types';

const pendingRequestSchema: Schema<IPendingRequestSchema> = new Schema(
  {
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    requestType: {
      type: String,
      enum: ['setAdmin', 'setCandidate', 'unsetCandidate', 'unsetAdmin'],
      required: true,
    },
    requestDetails: { type: String, required: true },
    requestDate: { type: Date, default: Date.now },
    requestStatus: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    requestComment: { type: String, default: '' },
    requestCommentDate: { type: Date, default: Date.now },
  },
  { ...schemaOptions },
);

pendingRequestSchema.index({ requestDate: -1, userID: 1 });

const PendingRequest =
  global.PendingRequest || model('PendingRequest', pendingRequestSchema);

global.PendingRequest = PendingRequest;
export default PendingRequest;
