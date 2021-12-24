import type { Response } from '../../lib.types';
import AppError from '../app-error';

export function handleErrors(e: unknown, res: Response, ErrorCls = AppError) {
  let error = e;
  let CustomError = ErrorCls;
  if (ErrorCls === null || ErrorCls === undefined) {
    CustomError = AppError;
  }

  if (!(e instanceof AppError)) {
    error = new CustomError({
      message: 'Bad request, verify your params and retry later',
      code: 400,
    });
    // eslint-disable-next-line no-console
    console.log('Error', (<Error>e).stack);
  }

  res
    .status((error as AppError).statusCode)
    .json((error as AppError).toResponse());
}
