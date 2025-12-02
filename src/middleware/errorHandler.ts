import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Validações Zod
  if (err instanceof ZodError) {
    const message = err.errors.map((e) => e.message).join('; ');
    return res.status(400).json({
      statusCode: 400,
      error: 'Bad Request',
      message
    });
  }

  const statusCode = err.statusCode || 500;
  const error = err.error || (statusCode === 500 ? 'Internal Server Error' : 'Error');
  const message =
    err.message || 'Ocorreu um erro inesperado.';

  // Em dev você pode logar stack trace completa
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(err);
  }

  return res.status(statusCode).json({
    statusCode,
    error,
    message
  });
}
