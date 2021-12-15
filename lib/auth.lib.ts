import Iron from '@hapi/iron';

import type { Session } from './lib.types';

export async function createLoginSession(session: Session, secret: string) {
  const createdAt = Date.now();
  const obj = { maxAge: session.maxAge, createdAt, path: '/' };
  const token = await Iron.seal(obj, secret, Iron.defaults);
  return token;
}

export async function getLoginSession(
  token: string,
  secret: string,
): Promise<Session> {
  const session = <Session>await Iron.unseal(token, secret, Iron.defaults);
  let expiresAt = 0;
  if (session.createdAt && session.maxAge)
    expiresAt = session.createdAt + session.maxAge;

  // Validate the expiration date of the session
  if (session.maxAge && Date.now() > expiresAt) {
    throw new Error('Session expired, please login again');
  }
  return session;
}
