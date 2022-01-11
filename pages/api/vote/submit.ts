import nextConnect from 'next-connect';

import {
  existsCandidate,
  updateCandidate,
} from '@/db/queries/candidate.queries';
import { updateUserByOrgId } from '@/db/queries/user.queries';
import { findVoteIDById } from '@/db/queries/vote-id.queries';
import AppError from '@/errors/app-error';
import AuthError from '@/errors/auth-error';
import { handleErrors } from '@/errors/http/handlers';
import auth from '@/middlewares/authentication';
import { checkAuth } from '@/middlewares/init-middleware';
import { getServerKeys } from '@/utils/keys.utils';

const handler = nextConnect();

handler
  .use(auth)
  .use(checkAuth())
  .post(async (req, res) => {
    try {
      const voteBallot = await getEncryptedBodyMessage(req);
      /* candidateId, vote, context, voterId, cOrgId, voteID */
      const { vote, context, candidateId: cid, voteID } = voteBallot;
      const { user } = req;
      const { hasVoted, hasCompletedVote } = user;
      if (hasCompletedVote) {
        throw new AppError({
          msg: 'Vous avez déjà voté, vous ne pouvez plus voter',
          code: 400,
        });
      }
      const id = await findVoteIDById(voteID);
      if (!id) {
        const message =
          'Vote ID non trouvé, êtes-vous sûr que vous avez suivi le' +
          ' processus de vote correctement ?';
        const hint = 'Recommencez le processus de vote';
        throw new AppError({ message, code: 400, hint });
      }

      if (!(await existsCandidate(cid))) {
        const message =
          'Candidat non trouvé, êtes-vous sûr que vous avez suivi le' +
          ' processus de vote correctement ?';
        const hint = 'Recommencez le processus de vote';
        throw new AppError({ message, code: 400, hint });
      }

      const categories = [
        'Président',
        'Vice-président',
        'Commissaire aux comptes',
      ];

      if (!categories.includes(context)) {
        const message = 'Le contexte de vote est incorrect';
        const hint = 'Recommencez le processus de vote';
        throw new AppError({ message, code: 400, hint });
      }

      const possibleVotes = ['yes', 'no', 'abstain'];
      if (!possibleVotes.includes(vote)) {
        const message = 'Le vote est incorrect';
        const hint = 'Recommencez le processus de vote';
        throw new AppError({ message, code: 400, hint });
      }
      // verifiy if all values in contextEnum are in user.hasVoted
      const votedAll = () => categories.every((c) => hasVoted.includes(c));
      if (votedAll()) {
        const message = 'Vous avez déjà voté pour tous les contextes';
        throw new AppError({ message, code: 401 });
      }

      if (user.hasVoted.includes(context)) {
        const message =
          'Vous avez déjà voté pour ce contexte, ' +
          'vous ne pouvez pas encore revoter';
        throw new AppError({ message, code: 401 });
      }

      // increment the selected vote context  in candidate schema
      const inc = {};
      const field = `votes.${vote}`;
      inc[field] = 1;
      await updateCandidate(cid, { $inc: inc });

      // update user schema to add the context and set hasCompletedVote to true if all context are voted
      req.user = await updateUserByOrgId(user.orgId, {
        $push: { hasVoted: context },
        $set: { hasCompletedVote: user.hasVoted.length >= 2 },
      });

      res.status(201).json({ message: 'ok' });
    } catch (error) {
      handleErrors(error, res, AuthError);
    }
  });

export default handler;

export async function getEncryptedBodyMessage(req) {
  const { voteEncrypted } = req.body;
  if (!voteEncrypted) {
    throw new AppError({ message: "Aucune vote n'a été envoyé" });
  }

  const { serverGPGEncryptor: serverEnc } = await getServerKeys();
  const { data: vote } = await serverEnc.decryptMessage(voteEncrypted);
  return JSON.parse(vote);
}
