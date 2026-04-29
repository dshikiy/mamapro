import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const validateEmail = () =>
  body('email').isEmail().normalizeEmail();

export const validatePassword = () =>
  body('password').isLength({ min: 8 });

export const validateName = () =>
  body('name').isLength({ min: 2 }).trim();

export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array(),
    });
  }
  next();
};
