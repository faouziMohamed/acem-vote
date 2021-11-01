import passport from 'passport';
import LocalStrategy from 'passport-local';

import { findUserById, findUserByOrgId } from '../lib/db/queries/user.queries';

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (req, id, done) =>
  done(null, await findUserById(id)),
);

async function verifyLogin(userid, password, done) {
  const msg = "Id non trouvé, veuillez vérifiez que vous l'avez bien saisie";
  const user = await findUserByOrgId(userid.trim().toLowerCase());
  if (!user) return done(null, false, { error: msg });
  return done(null, user);
}

passport.use(
  new LocalStrategy(
    { usernameField: 'userid', passwordField: 'userid' },
    verifyLogin,
  ),
);

export default passport;
