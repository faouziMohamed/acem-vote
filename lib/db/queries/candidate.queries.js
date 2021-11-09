import Candidate from '../models/candidate.model';
import User from '../models/user.model';

export const createCandidate = async (user) =>
  Candidate.create({ user: user._id, orgId: user.orgId });

export const findCandidate = async (user) =>
  Candidate.findOne({ user: user._id, orgId: user.orgId })
    .populate({
      path: 'user',
      select: '_id avatar firstname lastname',
    })
    .lean()
    .exec();

export const findAllCandidates = async () =>
  Candidate.aggregate([
    {
      $lookup: {
        from: 'users',
        localField: 'user',
        foreignField: '_id',
        as: 'user',
      },
    },
    { $unwind: '$user' },
    { $addFields: { user: { id: '$user._id' }, id: '$_id' } },
    {
      $project: {
        __v: 0,
        _id: 0,
        'user._id': 0,
        'user.__v': 0,
        'user.role': 0,
        'user.orgId': 0,
        'user.isCandidate': 0,
        'user.isFirstLogin': 0,
        'user.hasVoted': 0,
        'user.isLocked': 0,
      },
    },
  ]);

export const deleteCandidateById = async (_id) => {
  const c = await Candidate.findOneAndRemove({ _id }).lean().exec();
  if (!c) return false;
  const res = { candidate: c };
  const user = await undoCandidate(c);
  if (user) res.user = user;
  return res;
};

export const deleteCandidateByOrgId = async (orgId) => {
  const c = await Candidate.findOneAndRemove({ orgId }).lean().exec();
  if (!c) return false;
  const res = { candidate: c };
  const user = await undoCandidate(c);
  if (user) res.user = user;
  return res;
};

async function undoCandidate(c) {
  return User.findOneAndUpdate(
    { orgId: c.orgId, _id: c.user },
    { $set: { candidate: null } },
    { new: true },
  )
    .lean()
    .exec();
}

export const existsCandidateById = async (_id) => Candidate.exists({ _id });
export const existsCandidateByOrgId = async (orgId) =>
  Candidate.exists({ orgId });

export const updateCandidateById = async (_id, query = {}) =>
  Candidate.findOneAndUpdate({ _id }, query, { new: true }).lean().exec();

export const updateCandidateByOrgId = async (orgId, query = {}) =>
  Candidate.findOneAndUpdate({ orgId }, query, { new: true }).lean().exec();
