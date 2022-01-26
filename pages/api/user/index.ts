import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect';

import AppError from '@/errors/app-error';
import type { IUserBasic } from '@/lib/db/models/models.types';
import { Request } from '@/lib/lib.types';
import auth from '@/lib/middlewares';

interface QueryTypes {
  long: { q?: string; query: string };
  short: { q: string; query?: string };
}
interface ReqWithQuery extends Request {
  query: QueryTypes[keyof QueryTypes];
  user: IUserBasic;
}
const handler = nextConnect()
  .use(auth)
  .get(
    (
      req: ReqWithQuery,
      res: NextApiResponse<IUserBasic | false | { error: string }>,
    ) => {
      const { query } = req;

      console.log(query);
      try {
        if (!req.user) return res.json(false);
        if (query.q !== undefined && query.query !== undefined) {
          throw new AppError({
            message: 'You can only use one query parameter : q or query',
            hint: 'Try using only one of them',
            code: 400,
          });
        }

        if (query.q || query.query) {
          const q = <string>(query.q || query.query);
          return retrieveData(q, req, res);
        }

        const { user } = req;
        return res.json(user);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log((<Error>error).message);
        return res.status(500).json({ error: 'Un problème viens de survenir' });
      }
    },
  );

export default handler;
function retrieveData(
  query: string,
  req: ReqWithQuery,
  res: NextApiResponse<false | IUserBasic | { error: string }>,
) {
  const { user } = req;
  return res.json(user);
}
