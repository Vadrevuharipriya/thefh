import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import {
  clearAuthCookie,
  getTokenFromRequest,
  issueAuthCookie,
  signJwtToken,
  verifyJwtToken
} from '../utils/auth.js';
import {
  sendSuccess,
  sendError,
  sendValidationError,
  sendUnauthorized,
  sendServerError
} from '../utils/responseHandler.js';
const FRONTEND_URL = process.env.CLIENT_URL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const getBaseUrl = () => {
  return process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
};

// ─── ADMIN LOGIN ─────────────────────────────────────────────
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendValidationError(res, 'Email and password required');
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email !== adminEmail || password !== adminPassword) {
    return sendUnauthorized(res, 'Invalid credentials');
  }

  const token = signJwtToken({ email, role: 'admin' });
  issueAuthCookie(res, token);

  return sendSuccess(res, { user: { email, role: 'admin' } }, 'Login successful', 200);
};

// ─── USER SIGNUP ─────────────────────────────────────────────
export const userSignup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return sendValidationError(res, 'Name, email and password required');
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return sendError(res, 'User already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = signJwtToken({ userId: user._id, email: user.email });
    issueAuthCookie(res, token);

    return sendSuccess(res, {
      user: { id: user._id, name: user.name, email: user.email }
    }, 'User created successfully', 201);
  } catch (err) {
    console.error('[Backend] POST /api/auth/signup - Error:', err);
    return sendServerError(res, 'Failed to create user');
  }
};

// ─── USER LOGIN ─────────────────────────────────────────────
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return sendValidationError(res, 'Email and password required');
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return sendUnauthorized(res, 'Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return sendUnauthorized(res, 'Invalid credentials');
    }

    const token = signJwtToken({ userId: user._id, email: user.email });
    issueAuthCookie(res, token);

    return sendSuccess(res, {
      user: { id: user._id, name: user.name, email: user.email }
    }, 'Login successful', 200);
  } catch (err) {
    console.error('[Backend] POST /api/auth/login - Error:', err);
    return sendServerError(res, 'Login failed');
  }
};

export const getCurrentUser = (req, res) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return sendUnauthorized(res, 'No token provided');
  }

  try {
    const decoded = verifyJwtToken(token);
    return sendSuccess(res, {
      authenticated: true,
      role: decoded.role,
      userId: decoded.userId,
      email: decoded.email
    }, 'User authenticated');
  } catch {
    return sendUnauthorized(res, 'Invalid or expired token');
  }
};

export const logout = (req, res) => {
  clearAuthCookie(res);
  return sendSuccess(res, null, 'Logged out successfully', 200);
};

// ─── GOOGLE OAUTH ─────────────────────────────────────────────
export const googleAuth = (req, res) => {
  console.log("BASE_URL =", getBaseUrl());

  const redirectUri = `${getBaseUrl()}/api/auth/google/callback`;

  console.log("GOOGLE REDIRECT URI =", redirectUri);

  const url =
    `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${redirectUri}` +
    `&response_type=code&scope=profile email`;

  res.redirect(url);
};

export const googleCallback = async (req, res) => {
  const code = req.query.code;
  const { OAuth2Client } = await import('google-auth-library');
  const client = new OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, `${getBaseUrl()}/api/auth/google/callback`);

  try {
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });
    if (!user) {
      const newUser = await User.create({
        name,
        email,
        password: await bcrypt.hash(Math.random().toString(36), 10),
      });
      user = newUser;
    }

    const token = signJwtToken({ userId: user._id, email: user.email });
    issueAuthCookie(res, token);

    res.redirect(`${FRONTEND_URL}/auth/google/callback?userId=${user._id}&name=${encodeURIComponent(name)}&email=${email}`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect(`${FRONTEND_URL}/`);
  }
};
