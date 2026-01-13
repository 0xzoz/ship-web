export class AppError extends Error {
  status: number;
  code: string;

  constructor(message: string, status: number, code: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export class BadRequestError extends AppError {
  constructor(message: string) {
    super(message, 400, "bad_request");
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized") {
    super(message, 401, "unauthorized");
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not Found") {
    super(message, 404, "not_found");
  }
}
