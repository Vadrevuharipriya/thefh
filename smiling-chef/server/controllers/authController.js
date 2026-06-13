import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const getBaseUrl = () => {
  return process.env.BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
};

// ─── ADMIN LOGIN ─────────────────────────────────────────────
export const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (email !== adminEmail || password !== adminPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { email, role: 'admin' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({ token });
};

// ─── USER SIGNUP ─────────────────────────────────────────────
export const userSignup = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password required' });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('[Backend] POST /api/auth/signup - Error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// ─── USER LOGIN ─────────────────────────────────────────────
export const userLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    console.error('[Backend] POST /api/auth/login - Error:', err);
    res.status(500).json({ error: 'Login failed' });
  }
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

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.redirect(`${FRONTEND_URL}/auth/google/callback?token=${token}&userId=${user._id}&name=${encodeURIComponent(name)}&email=${email}`);
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    res.redirect(`${FRONTEND_URL}/`);
  }
};
