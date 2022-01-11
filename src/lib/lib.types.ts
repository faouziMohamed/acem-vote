import type { CookieSerializeOptions } from 'cookie';
import type Express from 'express';

import { IUserBasic } from './db/models/models.types';

export interface Session {
  maxAge?: number;
  path?: string;
  createdAt?: number;
}

declare type Send<T> = (body: T) => void;

// @ts-expect-error: we are not using the res.end function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface Response<D = any> extends Express.Response<D> {
  session: Session;
  send: Send<D>;
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
