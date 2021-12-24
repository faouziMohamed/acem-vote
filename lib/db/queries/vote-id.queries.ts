import type { LeanDocument, Types } from 'mongoose';

import AppError from '../../errors/app-error';
import type {
  IdType,
  IUserSchema,
  IVoteIDSchema,
} from '../models/models.types';
import VoteID from '../models/vote-id.model';

const addNewVoteID = async (userID: IdType): Promise<IdType> => {
  const voteID = new VoteID({ userID });
  await voteID.save();
  // eslint-disable-next-line no-console
  console.log('New vote Id added', voteID._id);
  return <IdType>voteID._id;
};

const insertOneOrThrowError = async (userID: IdType) => {
  type ResPop = LeanDocument<
    IVoteIDSchema & { _id: IdType } & { userID: IUserSchema }
  >;

  const voteID: ResPop = await VoteID.findOne({ userID })
    .populate<{ userID: IUserSchema }>({
      path: userID,
      select: '+completedEvents',
    })
    .orFail()
    .lean()
    .exec();
  // eslint-disable-next-line no-console
  console.log('voteID', voteID);
  if (!voteID) return addNewVoteID(userID);
  const user = <IUserSchema>voteID.userID;
  // TODO: find the event associated with the voteID and check if it is completed
  if (user?.votedCategories!.length < 3) return <Types.ObjectId>voteID._id;
  throw new AppError({
    message:
      'Vous ne pouvez pas voter une seconde foix! ' +
      'Si vous réesayez, votre compte sera banni',
    code: 401,
  });
};

/**
 * @async
 * Generate and return a vote ID for the user ID passed in the parameter.
 * - if no voteID is associated with the user:
 *   - generate a new voteID and return it
 * - if a voteID is already associated with the user:
 *   - return that id if user has not yet voted
 *   - Throw an error if user has already voted
 * @param {string} userID
 * @returns {string} voteID
 * @throws AppError
 */
export const getNewVoteID = async (userID: IdType) =>
  insertOneOrThrowError(userID);
export const findVoteIDById = async (id: IdType) =>
  VoteID.findById(id).lean().exec();
