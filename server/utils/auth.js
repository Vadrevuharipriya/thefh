import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export const AUTH_COOKIE_NAME = 'accessToken';

export const getAuthCookieOptions = () => ({
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  maxAge: 24 * 60 * 60 * 1000,
  path: '/',
});

export const getClearCookieOptions = () => ({
  httpOnly: true,
  secure: true,
  sameSite: 'strict',
  path: '/',
});

export const signJwtToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });

export const issueAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
};

export const clearAuthCookie = (res) => {
  res.clearCookie(AUTH_COOKIE_NAME, getClearCookieOptions());
};

export const getTokenFromRequest = (req) => req.cookies?.[AUTH_COOKIE_NAME];

export const verifyJwtToken = (token) => jwt.verify(token, JWT_SECRET);
