import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { User } from '../models/userModel.js';
import { Session } from '../models/sessionModel.js';

const ACCESS_MS = 15 * 60 * 1000;
const REFRESH_MS = 30 * 24 * 60 * 60 * 1000;

const signTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });
  return { accessToken, refreshToken };
};

export const registerUser = async ({ name, email, password }) => {
  const exists = await User.findOne({ email });
  if (exists) throw createError(409, 'Email in use');

  const hash = await bcrypt.hash(password, 10);
  const created = await User.create({ name, email, password: hash });
  const obj = created.toObject();
  delete obj.password;
  return obj;
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw createError(401, 'Invalid credentials');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw createError(401, 'Invalid credentials');

  await Session.deleteMany({ userId: user._id });

  const { accessToken, refreshToken } = signTokens(user._id);
  const now = Date.now();

  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now + ACCESS_MS),
    refreshTokenValidUntil: new Date(now + REFRESH_MS),
  });

  return { accessToken, refreshToken };
};

export const refreshSession = async (refreshToken) => {
  if (!refreshToken) throw createError(401, 'Refresh token missing');

  let payload;
  try {
    payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  } catch {
    throw createError(401, 'Invalid refresh token');
  }

  const old = await Session.findOne({ refreshToken });
  if (!old) throw createError(401, 'Session not found');

  await Session.deleteOne({ _id: old._id });

  const { accessToken, refreshToken: newRefresh } = signTokens(payload.userId);
  const now = Date.now();
  await Session.create({
    userId: payload.userId,
    accessToken,
    refreshToken: newRefresh,
    accessTokenValidUntil: new Date(now + ACCESS_MS),
    refreshTokenValidUntil: new Date(now + REFRESH_MS),
  });

  return { accessToken, refreshToken: newRefresh };
};

export const logoutUser = async (refreshToken) => {
  if (!refreshToken) return;
  await Session.deleteOne({ refreshToken });
};
