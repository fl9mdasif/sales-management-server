class AppError extends Error {
  public statusCode: number;

  constructor(statusCode: number, message: string, stack = '') {
    super(message);
    this.statusCode = statusCode;

    if (message) {
      this.message = message;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
