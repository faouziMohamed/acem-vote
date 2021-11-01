import { model, Schema } from 'mongoose';

const voteIDschema = new Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timeStamp: true,
    toObject: {
      transform: function transform(doc, ret) {
        delete ret.__v;
      },
    },
    toJSON: {
      transform: function transform(doc, ret) {
        delete ret.__v;
      },
    },
  },
);

voteIDschema.index({ _id: 1, userID: 1 }, { unique: true });

const VoteID = global.VoteID || model('VoteID', voteIDschema);
global.VoteID = VoteID;
export default VoteID;
