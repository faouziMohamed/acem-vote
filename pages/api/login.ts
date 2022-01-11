import nc from 'next-connect';
import { IVerifyOptions } from 'passport-local';

import { IUserBasic } from '@/db/models/models.types';
import AuthError from '@/errors/auth-error';
import { handleErrors } from '@/errors/http/handlers';
import { NextFunction, Request, Response } from '@/lib/lib.types';
import auth from '@/middlewares/authentication';
import passport from '@/middlewares/passeport';

const loginHandler = nc();

loginHandler
  .use(auth)
  .post((req: Request, res: Response, next: NextFunction) => {
    try {
      const authCallback = (
        err: Error,
        user: IUserBasic,
        info: IVerifyOptions,
      ) => {
        if (err) return next(err);
        if (!user) return res.status(401).json({ error: info.message });
        return req.logIn(user, (e) => {
          return e ? next(e) : res.json(user);
        });
      };

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      passport.authenticate('local', authCallback)(req, res, next);
      // console.log('LOGIN API> ', req.user, '====');
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      error instanceof AuthError
        ? handleErrors(error, res, AuthError)
        : handleErrors(error, res);
    }
  });

export default loginHandler;
