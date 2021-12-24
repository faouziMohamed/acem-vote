import { PipelineStage, Types } from 'mongoose';

import AppError from '../../errors/app-error';
import type { IdType, IUserBasic, IUserSchema } from '../models/models.types';
import User from '../models/user.model';

export async function createUser({
  orgId,
  firstname,
  lastname,
  isCandidate,
  candidate,
  details,
}: IUserSchema) {
  const userDetails: IUserSchema['details'] = {
    city: details?.city,
    skills: details?.skills,
    description: details?.description,
  };
  if (details?.email) userDetails.email = details.email;
  if (details?.phone) userDetails.phone = details.phone;
  const user = new User({
    orgId,
    firstname,
    lastname,
    details: userDetails,
  });

  if (isCandidate) {
    if (!candidate) {
      throw new AppError({
        message: "'candidate' is required when 'isCandidate' is true!",
        hint: "Please provide the 'candidate' object as expected or set 'isCandidate' to false",
        code: 400,
      });
    }
    const candidateData: IUserSchema['candidate'] = {
      post: candidate.post,
      depositionDate: candidate.depositionDate || new Date(Date.now()),
    };
    user.isCandidate = true;
    user.candidate = candidateData;
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
    $addFields: { uid: '$_id', 'details.city.cityId': '$details.city._id' },
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
