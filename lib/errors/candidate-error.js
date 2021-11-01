import AppError from './app-error';

export default class CandidateError extends AppError {
  constructor({
    message = 'Error occured when performed candidate request',
    code = 500 || '500',
    hint = '',
  } = {}) {
    super({ message, hint, code });
  }
}
