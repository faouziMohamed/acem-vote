import { Model, model, models, Schema } from 'mongoose';

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

const VoteID = <Model<IVoteIDSchema>>(
  (models.VoteID || model('VoteID', voteIDschema))
);

export default VoteID;
