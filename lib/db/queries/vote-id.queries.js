import AppError from '../../errors/app-error';
import VoteID from '../models/vote-id.model';

const addNewVoteID = async (userID) => {
  const voteID = new VoteID({ userID });
  await voteID.save();
  // eslint-disable-next-line no-console
  console.log('New vote Id added', voteID._id);
  return voteID._id;
};

const insertOneOrThrowError = async (userID) => {
  const voteID = await VoteID.findOne({ userID })
    .populate(
      'userID' /* {
      hasVoted: 1,
    } */,
    )
    .lean()
    .exec();
  console.log('voteID', voteID);
  if (!voteID) return addNewVoteID(userID);
  if (voteID.userID.hasVoted.length < 3) return voteID._id;
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
export const getNewVoteID = async (userID) => insertOneOrThrowError(userID);
export const findVoteIDById = async (id) => VoteID.findById(id).lean().exec();
