export interface AppErrorType {
  message?: string;
  code?: number | string;
  hint?: string;
}
export default class AppError extends Error {
  public name: string;

  public _statusCode: number | string;

  public hint: string;

  constructor({ message, code, hint }: AppErrorType) {
    super(message || 'An error occured');
    this.name = this.constructor.name;
    this._statusCode = code || 500;
    this.hint = hint || '';
  }

  get stack(): string | undefined {
    return this.stack;
  }

  get statusCode(): number {
    return Number(this._statusCode);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      statusCode: this._statusCode,
      hint: this.hint,
    };
  }

  toString() {
    return `${this.name}: ${this.message}`;
  }

  toResponse() {
    return {
      error: this.message,
      hint: this.hint,
      statusCode: this._statusCode,
    };
  }

  toObject() {
    return this.toJSON();
  }
}
