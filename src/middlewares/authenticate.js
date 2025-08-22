import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { Session } from '../models/sessionModel.js';

export const authenticate = async (req, res, next) => {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return next(createError(401, 'No token provided'));

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const session = await Session.findOne({ accessToken: token });
    if (!session) return next(createError(401, 'Session not found'));

    req.user = { _id: payload.userId };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(createError(401, 'Access token expired'));
    }
    return next(createError(401, 'Invalid token'));
  }
};
