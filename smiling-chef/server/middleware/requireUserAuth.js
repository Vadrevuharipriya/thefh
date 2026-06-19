import { getTokenFromRequest, verifyJwtToken } from '../utils/auth.js';
import { sendUnauthorized } from '../utils/responseHandler.js';

const requireUserAuth = async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return sendUnauthorized(res, 'No token provided');
  }

  try {
    const decoded = verifyJwtToken(token);
    req.userId = decoded.userId;
    next();
  } catch {
    return sendUnauthorized(res, 'Invalid or expired token');
  }
};

export default requireUserAuth;
