import { Schema, Types } from 'mongoose';

import AppError from '../../errors/app-error';
import User from '../models/user.model';

export async function createUser({
  orgId,
  firstname,
  lastname,
  isCandidate,
  candidate,
  details = {
    city: Schema.Types.ObjectId,
    email: '',
    phone: '',
    skills: [],
    description: '',
  },
}) {
  const userDetails = {
    city: details.city,
    skills: details.skills,
    description: details.description,
  };
  if (details.email) userDetails.email = details.email;
  if (details.phone) userDetails.phone = details.phone;
  const user = new User({ orgId, firstname, lastname, details: userDetails });

  if (isCandidate) {
    if (!candidate) {
      throw new AppError({
        message: "'candidate' is required when 'isCandidate' is true!",
        hint: "Please provide the 'candidate' object as expected or set 'isCandidate' to false",
        code: 400,
      });
    }
    const candidateData = {
      post: candidate.post,
      depositionDate: candidate.depositionDate || Date.now(),
      isCandidate: true,
    };
    user.candidate = candidateData;
  }

  return user.save();
}

const basicAggregation = [
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

export const existsUserByOrgId = async (orgId) => User.exists({ orgId });
export const existsUserById = async (_id) => User.exists({ _id });

export const findUserByOrgId = async (orgId) => {
  const [user] = await User.aggregate([
    { $match: { orgId } },
    ...basicAggregation,
  ]);
  return user;
};
export const findUserById = async (_id) => {
  const [user] = await User.aggregate([
    { $match: { _id: Types.ObjectId(_id) } },
    ...basicAggregation,
  ]);
  return user;
};

export const updateUserById = async (_id, query = {}) => {
  return User.findByIdAndUpdate(_id, query, { new: true }).lean().exec();
};

export const updateUserByOrgId = async (orgId, query = {}) => {
  return User.findOneAndUpdate({ orgId }, query, { new: true }).lean().exec();
};
export const deleteUserOrgId = async (orgId) => {
  return User.findOneAndDelete({ orgId }).lean().exec();
};

export const deleteUserById = async (_id) => {
  return User.findByIdAndDelete(_id).lean().exec();
};
