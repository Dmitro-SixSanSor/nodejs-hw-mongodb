import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import bcrypt from 'bcrypt';
import { User } from '../models/userModel.js';
import { Session } from '../models/sessionModel.js';
import { sendResetPasswordEmail } from '../services/email.js';
import * as authService from '../services/auth.js';

export const sendResetEmailController = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw createError(404, 'User not found!');

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: '5m',
  });
  const url = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

  try {
    await sendResetPasswordEmail(email, url);
  } catch {
    throw createError(500, 'Failed to send the email, please try again later.');
  }

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
};

export const resetPasswordController = async (req, res) => {
  const { token, password } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw createError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({ email: payload.email });
  if (!user) throw createError(404, 'User not found!');

  const hash = await bcrypt.hash(password, 10);
  await User.updateOne({ _id: user._id }, { password: hash });

  await Session.deleteMany({ userId: user._id });

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
export const registerController = async (req, res) => {
  const user = await authService.registerUser(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};

export const loginController = async (req, res) => {
  const { accessToken, refreshToken } = await authService.loginUser(req.body);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: { accessToken },
  });
};

export const refreshController = async (req, res) => {
  const { accessToken, refreshToken } = await authService.refreshSession(
    req.cookies.refreshToken,
  );

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
};

export const logoutController = async (req, res) => {
  await authService.logoutUser(req.cookies.refreshToken);
  res.clearCookie('refreshToken');
  res.status(204).send();
};
