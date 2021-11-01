import nc from 'next-connect';

import AuthError from '../../lib/errors/auth-error';
import { handleErrors } from '../../lib/errors/http/handlers';
import auth from '../../middleware/authentication';
import passport from '../../middleware/passeport';

const loginHandler = nc();

loginHandler.use(auth).post((req, res, next) => {
  try {
    const authCallback = (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.status(401).json(info);
      return req.logIn(user, (e) => (e ? next(e) : res.json(user)));
    };

    passport.authenticate('local', authCallback)(req, res, next);
  } catch (error) {
    handleErrors(error, res, AuthError);
  }
});

export default loginHandler;
