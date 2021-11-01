import AppError from './app-error';

export default class AuthError extends AppError {
  constructor({
    message = 'Error occured when performed Trying to authenticate user',
    code = 500 || '500',
    hint = '',
  } = {}) {
    super({ message, hint, code });
  }
}
