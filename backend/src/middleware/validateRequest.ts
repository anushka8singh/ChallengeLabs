// ===========================================
// Request Validation Middleware
// Validates request body using Zod schemas
// ===========================================

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { errorResponse } from '../utils/apiResponse';

export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      errorResponse(
        res,
        'Validation failed',
        400,
        result.error.flatten().fieldErrors
      );
      return;
    }

    // Replace req.body with validated data
    req.body = result.data;
    next();
  };
};
