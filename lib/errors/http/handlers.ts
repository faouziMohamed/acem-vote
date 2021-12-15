import type { Response } from '../../lib.types';
import AppError from '../app-error';

export function handleErrors(e: AppError, res: Response, ErrorCls = AppError) {
  let error = e;
  if (!(e instanceof AppError)) {
    error = new ErrorCls({
      message: 'Bad request, verify your params and retry later',
      code: 400,
    });
    // eslint-disable-next-line no-console
    console.log('Error', (<Error>e).stack);
  }
  res.status(error.statusCode).json(error.toResponse());
}
