import { Response } from "express";

interface ErrorResponse {
  success: false;
  error: {
    message: string;
    code?: string;
    details?: any;
  };
  timestamp: string;
  path?: string;
}

interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}
export class ApiResponse {
  static success<T>(res: Response, data: T, statusCode: number = 200): Response {
    const response: SuccessResponse<T> = {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    statusCode: number = 500,
    details?: any,
    path?: string
  ): Response {
    const response: ErrorResponse = {
      success: false,
      error: {
        message,
        ...(details && { details }),
      },
      timestamp: new Date().toISOString(),
      ...(path && { path }),
    };
    return res.status(statusCode).json(response);
  }

  static validationError(res: Response, errors: any): Response {
    return this.error(res, 'Validation failed', 400, errors);
  }

  static notFound(res: Response, message: string = 'Resource not found'): Response {
    return this.error(res, message, 404);
  }

  static unauthorized(res: Response, message: string = 'Unauthorized'): Response {
    return this.error(res, message, 401);
  }

  static forbidden(res: Response, message: string = 'Forbidden'): Response {
    return this.error(res, message, 403);
  }

  static internalError(res: Response, message: string = 'Internal server error'): Response {
    return this.error(res, message, 500);
  }
}