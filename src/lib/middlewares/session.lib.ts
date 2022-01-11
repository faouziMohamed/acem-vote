import { parse, serialize } from 'cookie';

// import AuthError from '@/errors/auth-error';
import type {
  NextFunction,
  Request,
  Response,
  Session,
  SessionProps,
} from '@/lib/lib.types';

import { createLoginSession, getLoginSession } from './auth.lib';

function parseCookies(req: Request) {
  // For API Routes we don't need to parse the cookies.
  if (req.cookies) return req.cookies;
  // For pages we do need to parse the cookies.
  const cookie = req.headers?.cookie || '';
  return parse(cookie);
}

export default function session({ name, secret, cookieOptions }: SessionProps) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const unsealed = await unsealCookie(req, name, secret, res);
      req.session = unsealed;
      // We are proxying res.end to commit the session cookie
      // eslint-disable-next-line @typescript-eslint/unbound-method
      const oldEnd = res.end;
      res.end = async function resEndProxy(...args) {
        if (res.writableEnded || res.headersSent) return;
        if (cookieOptions.maxAge) req.session.maxAge = cookieOptions.maxAge;
        const newToken = await createLoginSession(req.session, secret);
        res.setHeader('Set-Cookie', serialize(name, newToken, cookieOptions));
        oldEnd.apply(this, args);
      };
      next();
    } catch (e) {
      next(e);
    }
  };
}

async function unsealCookie(
  req: Request,
  name: string,
  secret: string,
  res: Response,
) {
  const cookies = parseCookies(req);
  const token = <string>cookies[name];
  let unsealed: Session = {};
  if (token) {
    try {
      unsealed = await getLoginSession(token, secret);
    } catch (e) {
      // If the token is invalid, we should remove it from the cookie.
      res.setHeader('Set-Cookie', serialize(name, '', { maxAge: -1 }));

      // throw new AuthError({
      //   code: 500,
      //   message: 'Vous devez vous connecter pour continuer',
      //   hint: 'Connectez-vous pour pour utilisez nos services',
      // });
    }
  }
  return unsealed;
}
