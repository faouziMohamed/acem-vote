/* eslint-disable @typescript-eslint/no-unsafe-argument */

import { serialize } from 'cookie';
import helmet from 'helmet';
import nextConnect from 'next-connect';

import type { Request, Response } from '@/lib/lib.types';
import { cors, headers, LOGIN_CK_NAME as name } from '@/lib/middlewares/init';
// import auth from '@/middlewares/authentication';
import passport from '@/lib/middlewares/passeport';
import session from '@/lib/middlewares/session.lib';

const logoutHandler = nextConnect();

logoutHandler
  .use(cors())
  .use(headers())
  .use(helmet())
  .use(
    session({
      name,
      secret: process.env.SESSION_SECRET || '',
      cookieOptions: { maxAge: 0 },
    }),
  )
  .use(passport.initialize())
  .use(passport.session())
  .get((req: Request, res: Response) => {
    req.logOut();
    res.setHeader('Set-Cookie', serialize(name, '', { maxAge: -1 }));
    res.status(204).end();
  });

export default logoutHandler;
