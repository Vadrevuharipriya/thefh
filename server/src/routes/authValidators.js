import { body } from 'express-validator';

export const adminLoginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isString().trim().notEmpty().withMessage('Password is required'),
];

export const userSignupValidator = [
  body('name').isString().trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('password')
    .isString()
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

export const userLoginValidator = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isString().trim().notEmpty().withMessage('Password is required'),
];
