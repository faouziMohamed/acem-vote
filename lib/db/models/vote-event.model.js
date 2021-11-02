import { model, Schema } from 'mongoose';

const voteEventSchema = new Schema(
  {
    eventName: { type: String, required: true, unique: true },
    eventDate: { type: Date, required: true },
    eventDuration: { type: String, required: true },
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

// restrict collection to have only one document
voteEventSchema.pre('save', async function preSave(next) {
  const doc = await this.constructor.findOne({});
  if (doc) {
    next(new Error('Only one document is allowed'));
  } else {
    next();
  }
});

voteEventSchema.index({ eventName: 1 }, { unique: true });

const VoteEvent = global.VoteEvent || model('VoteEvent', voteEventSchema);
global.VoteEvent = VoteEvent;
export default VoteEvent;
