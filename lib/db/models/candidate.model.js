import { model, Schema } from 'mongoose';

const candidatSchema = Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orgId: { type: String, required: true, unique: true },
    voiceCount: { type: Number, required: true, min: 0, default: 0 },
    candidatePost: { type: String, required: true },
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

candidatSchema.index({ orgId: 1, user: 1, candidatePost: 1 }, { unique: true });

const Candidate = global.Candidate || model('Candidate', candidatSchema);
global.Candidate = Candidate;
export default Candidate;
