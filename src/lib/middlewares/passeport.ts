/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import passport from 'passport';
import type { VerifyFunction } from 'passport-local';
import { Strategy as LocalStrategy } from 'passport-local';

import { IdType, IUserBasic } from '@/db/models/models.types';
import { findUserById, findUserByOrgId } from '@/db/queries/user.queries';

type DoneCB = (err: any, user?: false | IUserBasic | null | undefined) => void;

passport.serializeUser((user: any, done) => {
  return done(null, user.uid);
});

passport.deserializeUser(async (id: IdType, done: DoneCB) => {
  return done(null, await findUserById(id));
});

const verifyLogin: VerifyFunction = async (userid, _password, done) => {
  const msg = "Id non trouvé, veuillez vérifiez que vous l'avez bien saisie";
  const user = await findUserByOrgId(userid.trim().toLowerCase());
  if (!user) return done(null, false, { message: msg });
  return done(null, user);
};

passport.use(
  new LocalStrategy(
    { usernameField: 'userid', passwordField: 'userid' },
    verifyLogin,
  ),
);

export default passport;
