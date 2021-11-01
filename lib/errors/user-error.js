import AppError from './app-error';

export default class UserError extends AppError {
  constructor({
    message = 'Error occured when performed user request',
    code = 500 || '500',
    hint = '',
  } = {}) {
    super({ message, hint, code });
  }
}
