import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { getCandidatesAggregate } from '@/db/queries/candidates.queries';
import CandidateError from '@/errors/candidate-error';
import { handleErrors } from '@/errors/http/handlers';
import type { ICandidateAPIResponse } from '@/lib/pages.types';
import auth from '@/middlewares/authentication';
import { checkAuth } from '@/middlewares/init-middleware';

const handler = nextConnect()
  .use(auth)
  // .use(checkAuth())
  .get(async (req, res: NextApiResponse<ICandidateAPIResponse>) => {
    try {
      const { data, count } = await getCandidatesAggregate(
        'Regional',
        'Kénitra',
      );
      return res.json({ data, count });
    } catch (error) {
      return handleErrors(error, res, CandidateError);
    }
  });

export default handler;
