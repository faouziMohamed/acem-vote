import Cors from 'cors';

import connectDB from '@/db/config.db';
import type { NextFunction, Request, Response } from '@/lib/lib.types';
import { daysToSeconds } from '@/utils/lib.utils';

import session from './session.lib';

export const LOGIN_CK_NAME = 'sc-user';

export const configSession = session({
  name: LOGIN_CK_NAME,
  secret: process.env.SESSION_SECRET || '',
  cookieOptions: {
    maxAge: daysToSeconds(30),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: true,
  },
});

export const cors = () =>
  Cors({
    methods: ['GET', 'POST', 'PUT'],
    origin: true,
    credentials: true,
  });

export const headers =
  () => (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT');
    res.setHeader('Access-Control-Allow-Credentials', 1);
    next();
  };

export const connectDatabase = () => connectDB((_req, _res, next) => next());

export const checkAuth =
  (message = 'Vous devez vous connecter pour accéder à cette ressource') =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: message });
    return next();
  };
