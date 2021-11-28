import nextConnect from 'next-connect';

// import { findAllCandidates } from '../../../lib/db/queries/candidate.queries';
import CandidateError from '../../../lib/errors/candidate-error';
import { handleErrors } from '../../../lib/errors/http/handlers';
import auth from '../../../middleware/authentication';
import { checkAuth } from '../../../middleware/init-middleware';

const handler = nextConnect()
  .use(auth)
  .use(checkAuth())
  .get(async (req, res) => {
    try {
      const candidates = []; // await findAllCandidates();
      return res.json({ candidates });
    } catch (error) {
      return handleErrors(error, res, CandidateError);
    }
  });

export default handler;
