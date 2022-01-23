/* eslint-disable no-console */
import chalk from 'chalk';
import { connect, connection } from 'mongoose';

import type { Middleware, NextFunction, Request, Response } from '../lib.types';

export default function connectDB(handler: Middleware) {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (connection.readyState) return handler(req, res, next);
    await initiateDbConnexion();
    return handler(req, res, next);
  };
}

export async function initiateDbConnexion() {
  const DEV_DB_URI = 'mongodb://localhost:27017/acem-evote';
  const DB_URI = process.env.DB_URI || DEV_DB_URI;
  try {
    await connect(DB_URI);
    const connected = chalk.yellowBright('MongoDB Connection established');
    const { host, port, name } = connection;
    const conString = chalk.bold(`${host}:${port}/${name}`);
    console.log();
    console.log('>', `${connected} on ${conString}`);
    console.log();
    return connection;
  } catch (err) {
    return console.log('>', chalk.red(`MongoDB Connection error `, err));
  }
}
