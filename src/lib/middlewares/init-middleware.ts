import Cors from 'cors';
import ms from 'ms';

import connectDB from '@/db/config.db';
import type { NextFunction, Request, Response } from '@/lib/lib.types';

import session from './session.lib';

export const configSession = session({
  name: 'sc-user',
  secret: process.env.SESSION_SECRET || '',
  cookieOptions: {
    maxAge: ms('24d') / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    sameSite: 'lax',
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
