// ===========================================
// Centralized Error Handling
// Production-grade error middleware for Express
// ===========================================

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../config/logger';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Centralized error handler middleware
export const errorHandler = (
  err: Error | AppError | ZodError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default error values
  let statusCode = 500;
  let message = 'Internal Server Error';
  let isOperational = false;

  // Handle known operational errors
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    isOperational = err.isOperational;
  } 
  // Handle Zod validation errors
  else if (err instanceof ZodError) {
    statusCode = 400;
    message = 'Validation Error';
    isOperational = true;
    
    // Log detailed validation errors
    logger.warn({ 
      path: req.path, 
      errors: err.errors 
    }, 'Zod Validation Error');
  } 
  // Handle unknown errors
  else {
    logger.error({ 
      err, 
      path: req.path, 
      method: req.method 
    }, 'Unhandled Error');
  }

  // Don't leak error details in production
  const responseMessage = isOperational || process.env.NODE_ENV === 'development' 
    ? message 
    : 'Something went wrong';

  res.status(statusCode).json({
    success: false,
    error: {
      message: responseMessage,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

// 404 Not Found handler
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
  });
};
