import Candidate from '../models/candidate.model';
import User from '../models/user.model';

export const createCandidate = async (user) =>
  Candidate.create({ user: user._id });

export const findCandidate = async (user) =>
  Candidate.findOne({ user: user._id })
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

export const deleteCandidate = async (_id) => {
  const c = await Candidate.findOneAndRemove({ _id }).lean().exec();
  if (!c) return false;
  const res = { candidate: c };
  const user = await User.findOneAndUpdate(
    { _id: c.user },
    { $set: { candidate: null } },
    { new: true },
  )
    .lean()
    .exec();
  if (user) res.user = user;
  return res;
};

export const existsCandidate = async (_id) => Candidate.exists({ _id });

export const updateCandidate = async (_id, query = {}) =>
  Candidate.findOneAndUpdate({ _id }, query, { new: true }).lean().exec();
