import type { AppErrorType } from './app-error';
import AppError from './app-error';

const errorMsg = 'Error occured when performed candidate request';

export default class UserError extends AppError {
  constructor({ message = errorMsg, code, hint }: AppErrorType) {
    super({ message, hint, code });
  }
}
