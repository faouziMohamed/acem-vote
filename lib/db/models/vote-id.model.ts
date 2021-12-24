import type { Model } from 'mongoose';
import { model, Schema } from 'mongoose';

import { schemaOptions } from './model.utils';
import type { IVoteIDSchema } from './models.types';

const voteIDschema = new Schema<IVoteIDSchema>(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { ...schemaOptions },
);

voteIDschema.index({ userID: 1 }, { unique: true });

const VoteID: Model<IVoteIDSchema> =
  global.VoteID || model('VoteID', voteIDschema);

global.VoteID = VoteID;
export default VoteID;
