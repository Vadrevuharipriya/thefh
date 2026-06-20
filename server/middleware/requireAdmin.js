import { getTokenFromRequest, verifyJwtToken } from '../utils/auth.js';
import { sendUnauthorized, sendForbidden } from '../utils/responseHandler.js';

const requireAdmin = (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return sendUnauthorized(res, 'No token provided');
  }

  try {
    const decoded = verifyJwtToken(token);
    if (decoded.role !== 'admin') {
      return sendForbidden(res, 'Admin access required');
    }

    req.admin = decoded;
    next();
  } catch {
    return sendUnauthorized(res, 'Invalid or expired token');
  }
};

export default requireAdmin;
