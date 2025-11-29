import { Request, Response, NextFunction } from 'express';
import { AppError } from '../lib/utils/errors';
import { ApiResponse } from '../lib/utils/response';
import { Prisma } from '../../generated/prisma/client';


export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return ApiResponse.error(
      res,
      err.message,
      err.statusCode,
      undefined,
      req.path
    );
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002':
        return ApiResponse.error(
          res,
          'A record with this value already exists',
          409,
          { field: err.meta?.target },
          req.path
        );
      case 'P2025':
        return ApiResponse.notFound(res, 'Record not found');
      case 'P2003':
        return ApiResponse.error(
          res,
          'Foreign key constraint failed',
          400,
          undefined,
          req.path
        );
      default:
        return ApiResponse.error(
          res,
          'Database error occurred',
          500,
          process.env.NODE_ENV === 'development' ? err.message : undefined,
          req.path
        );
    }
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return ApiResponse.validationError(res, {
      message: 'Invalid data provided',
    });
  }

  console.error('Unhandled error:', err);
  return ApiResponse.internalError(
    res,
    process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  );
};