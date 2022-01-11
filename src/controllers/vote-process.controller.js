import { findVoteIDById } from '../lib/db/queries/vote-id.queries';
import AppError from '../lib/errors/app-error';

export async function handleCoUserVerification(userVote) {
  const { voteID } = userVote;
  const id = await findVoteIDById(voteID);
  if (!id) {
    const message =
      'Vote ID non trouvé, êtes-vous sûr que vous avez suivi le' +
      ' processus de vote correctement ?';
    const hint = 'Recommencez le processus de vote';
    throw new AppError({ message, code: 400, hint });
  }
  return userVote;
}
