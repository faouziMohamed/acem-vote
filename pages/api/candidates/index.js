import nextConnect from 'next-connect';

import { findAllCandidates } from '../../../lib/db/queries/candidate.queries';
import CandidateError from '../../../lib/errors/candidate-error';
import { handleErrors } from '../../../lib/errors/http/handlers';
import auth from '../../../middleware/authentication';

const handler = nextConnect();

handler.use(auth).get(async (req, res) => {
  try {
    if (!req.user) {
      throw new CandidateError({
        message: 'You must be logged in to view your profile.',
        code: 401,
        hint: 'Try logging in before submitting request.',
      });
    }
    const candidates = await findAllCandidates();
    return res.json({ candidates });
  } catch (error) {
    return handleErrors(error, res, CandidateError);
  }
});

export default handler;
