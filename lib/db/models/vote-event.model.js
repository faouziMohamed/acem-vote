import { model, Schema } from 'mongoose';

const voteEventSchema = new Schema(
  {
    eventID: { type: String, required: true, unique: true },
    eventName: { type: String, required: true, unique: true },
    eventDate: { type: Date, required: true, unique: true },
    eventTimeStart: { type: Date, required: true, unique: true },
    eventDuration: { type: Number, required: true, unique: true },
    eventLocation: { type: String, required: true, unique: true },
    eventDescription: { type: String },
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

voteEventSchema.index({ eventID: 1, eventName: 1 }, { unique: true });

const VoteEvent = global.VoteEvent || model('VoteEvent', voteEventSchema);
global.VoteEvent = VoteEvent;
export default VoteEvent;
