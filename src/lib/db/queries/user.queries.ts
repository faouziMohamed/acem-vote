import type { PipelineStage } from 'mongoose';
import { Types } from 'mongoose';

import type { IdType, IUserBasic, IUserSchema } from '@/db/models/models.types';
import { UserRole, VoteCategories } from '@/db/models/models.types';
import User, { DEFAULT_USER_AVATAR } from '@/db/models/user.model';
import AppError from '@/errors/app-error';

export const voteDefaults: IUserSchema['voteDetails'] = {
  post: VoteCategories.DEFAULT,
  votes: { yes: 0, no: 0, abstain: 0 },
  isWinner: false,
  depositionDate: new Date(0),
};

export async function createUser({
  orgId,
  firstname,
  lastname,
  isCandidate,
  voteDetails = voteDefaults,
  details,
  isMembershipActive = false,
  role = UserRole.USER,
  avatar = DEFAULT_USER_AVATAR,
}: IUserSchema) {
  const userDetails: IUserSchema['details'] = {
    city: details?.city,
    skills: details?.skills || [],
    description: details?.description || '',
  };
  if (details?.email) userDetails.email = details.email;
  if (details?.phone) userDetails.phone = details.phone;
  const user = new User({
    orgId,
    firstname,
    lastname,
    details: userDetails,
    isMembershipActive,
    role,
    avatar,
  });

  if (isCandidate) {
    if (!voteDetails) {
      throw new AppError({
        message: "'candidate' is required when 'isCandidate' is true!",
        hint: "Please provide the 'candidate' object as expected or set 'isCandidate' to false",
        code: 400,
      });
    }
    const voteData: IUserSchema['voteDetails'] = {
      post: voteDetails.post,
      depositionDate: voteDetails.depositionDate || voteDefaults.depositionDate,
      votes: voteDetails.votes || voteDefaults.votes,
      isWinner: voteDetails.isWinner || voteDefaults.isWinner,
    };
    user.isCandidate = true;
    user.voteDetails = voteData;
  }
  return user.save();
}

const basicAggregation: PipelineStage[] = [
  {
    $lookup: {
      from: 'offices',
      localField: 'details.city',
      foreignField: '_id',
      as: 'details.city',
    },
  },
  { $unwind: '$details.city' },
  {
    $addFields: {
      uid: { $toString: '$_id' },
      'details.city.cityId': { $toString: '$details.city._id' },
    },
  },

  {
    $project: {
      _id: 0,
      __v: 0,
      candidate: 0,
      'details.city._id': 0,
      'details.city.eventScope': 0,
      'details.city.__v': 0,
    },
  },
];

export const existsUserByOrgId = async (orgId: string) =>
  User.exists({ orgId });
export const existsUserById = async (_id: IdType) => User.exists({ _id });

export const findUserByOrgId = async (orgId: IdType) => {
  const [user]: IUserBasic[] = await User.aggregate([
    { $match: { orgId } },
    ...basicAggregation,
  ]);
  return user;
};
export const findUserById = async (_id: IdType) => {
  const [user]: IUserBasic[] = await User.aggregate([
    { $match: { _id: new Types.ObjectId(_id) } },
    ...basicAggregation,
  ]);
  return user;
};

export const updateUserById = async (_id: IdType, query: object = {}) => {
  return User.findByIdAndUpdate(_id, query, { new: true }).lean().exec();
};

export const updateUserByOrgId = async (orgId: string, query: object = {}) => {
  return User.findOneAndUpdate({ orgId }, query, { new: true }).lean().exec();
};
export const deleteUserOrgId = async (orgId: string) => {
  return User.findOneAndDelete({ orgId }).lean().exec();
};

export const deleteUserById = async (_id: IdType) => {
  return User.findByIdAndDelete(_id).lean().exec();
};
