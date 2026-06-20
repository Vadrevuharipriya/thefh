import { validationResult } from 'express-validator';
import { sendValidationError } from '../utils/responseHandler.js';

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendValidationError(res, 'Validation failed', errors.array());
  }
  next();
};
