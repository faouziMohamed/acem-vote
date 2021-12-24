import type { CookieSerializeOptions } from 'cookie';
import type Express from 'express';

import { IUserBasic } from './db/models/models.types';

export interface Session {
  maxAge?: number;
  path?: string;
  createdAt?: number;
}

export interface Response extends Express.Response {
  session: Session;
  end(...args: unknown[]): void;
}

export interface Request extends Express.Request {
  cookies: { [key: string]: string | number };
  session: Session;
  user: IUserBasic;
}

export type UserType = IUserBasic;

export type NextFunction = Express.NextFunction;

export type CookieOptions = CookieSerializeOptions;

export interface SessionProps {
  name: string;
  secret: string;
  cookieOptions: CookieOptions;
}

export type Middleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => void;
