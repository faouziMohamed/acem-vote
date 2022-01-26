import { NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import { getCandidatesAggregate } from '@/db/queries/candidates.queries';
import CandidateError from '@/errors/candidate-error';
import { handleErrors } from '@/errors/http/handlers';
import auth from '@/lib/middlewares';
import { checkAuth } from '@/lib/middlewares/init';
import type { ICandidateAPIResponse } from '@/lib/pages.types';

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
