import Candidate from '../models/candidate.model';
import User from '../models/user.model';

export async function createUser({
  orgId,
  firstname,
  lastname,
  role = 'user',
  avatar = '',
  isCandidate = false,
  candidateData = {
    details: { skills: '', description: '' },
    candidatePost: 'Non spécifié',
  },
}) {
  const user = await User.create({
    orgId,
    firstname,
    lastname,
    role,
    avatar,
    isCandidate,
  });
  const added = { user };
  if (isCandidate) {
    const candidate = await Candidate.create({
      user: user._id,
      orgId: user.orgId,
      ...candidateData,
    });
    added.candidate = candidate;
  }
  return added;
}

export const existsUserByOrgId = async (orgId) => User.exists({ orgId });
export const existsUserById = async (_id) => User.exists({ _id });

export const findUserByOrgId = async (orgId) =>
  User.findOne({ orgId }).lean().exec();
export const findUserById = async (_id) => User.findById(_id).lean().exec();

export const updateUserById = async (_id, query = {}) =>
  User.findByIdAndUpdate(_id, query, { new: true }).lean().exec();

export const updateUserByOrgId = async (orgId, query = {}) =>
  User.findOneAndUpdate({ orgId }, query, { new: true }).lean().exec();

export const deleteUserOrgId = async (orgId) => {
  const user = await User.findOneAndDelete({ orgId }).lean().exec();
  if (!user) return false;

  const res = { user };
  if (user.isCandidate) {
    const candidate = await Candidate.findOneAndDelete({ orgId }).lean().exec();
    if (candidate) res.candidate = candidate;
  }
  return res;
};

export const deleteUserById = async (_id) => {
  const user = await User.findByIdAndDelete(_id).lean().exec();
  if (!user) return false;

  const res = { user };
  if (user.isCandidate) {
    const candidate = await Candidate.findByIdAndDelete(_id).lean().exec();
    if (candidate) res.candidate = candidate;
  }
  return res;
};
