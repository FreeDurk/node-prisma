// middleware/validation.middleware.ts

import { NextFunction, Request, Response } from "express";
import { ApiResponse } from "../lib/utils/response";
import { validate, ValidationError } from "class-validator";
import { plainToInstance } from "class-transformer";


export function validateBody(dtoClass: any) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const dtoInstance = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoInstance);
    
    if (errors.length > 0) {
      const formattedErrors = formatValidationErrors(errors);
      return ApiResponse.error(res, 'Validation failed', 400, formattedErrors);
    }
    
    req.body = dtoInstance;
    next();
  };
}
function formatValidationErrors(errors: ValidationError[]) {
  return errors.map(error => ({
    field: error.property,
    value: error.value,
    errors: Object.values(error.constraints || {})
  }));
}