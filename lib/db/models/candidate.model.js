import { model, Schema } from 'mongoose';

const candidateSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orgId: { type: String, required: true, unique: true },
    candidatePost: {
      type: String,
      required: true,
      enum: ['Président', 'Vice-président', 'Commissaire aux comptes'],
    },
    votes: {
      yes: { type: Number, min: 0, default: 0 },
      no: { type: Number, min: 0, default: 0 },
      abstain: { type: Number, min: 0, default: 0 },
    },
    isWinner: { type: Boolean, default: false },
    depositionDate: { type: Date, default: Date.now },
    details: { skills: [String], description: String },
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

candidateSchema.index(
  { orgId: 1, user: 1, candidatePost: 1 },
  { unique: true },
);

const Candidate = global.Candidate || model('Candidate', candidateSchema);
global.Candidate = Candidate;
export default Candidate;
