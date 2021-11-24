import { model, Schema } from 'mongoose';

const voteEventSchema = new Schema(
  {
    eventName: { type: String, required: true, unique: true },
    eventDate: { type: Date, required: true },
    eventDuration: { type: String, required: true },
    eventOrganizer: { type: String, required: true },
    eventType: { type: String, enum: ['regional', 'global'], required: true },
    eventStatus: { type: String, enum: ['active', 'inactive'], required: true },
    eventCreatedBy: { type: model.Types.ObjectId, ref: 'User' },
    eventDescription: { type: String, default: '' },
    eventImage: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    eventVotes: [{ type: model.Types.ObjectId, ref: 'Vote' }],
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
  this.updatedAt = Date.now();
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
