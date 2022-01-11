import type { AppErrorType } from './app-error';
import AppError from './app-error';

const errorMsg = 'Error occured when performed Trying to authenticate user';
export default class AuthError extends AppError {
  constructor({ message = errorMsg, code, hint }: AppErrorType) {
    super({ message, hint, code });
  }
}
