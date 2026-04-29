import { request, Request, Response } from 'express';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { createUser, findUserByEmail, findUserById } from '../models/User';
import { asyncHandler, AppError } from '../middleware/errorHandler';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  // Check if user exists
  const existingUser = await findUserByEmail(email);
  if (existingUser) {
    throw new AppError(400, 'User already exists');
  }

  // Hash password
  const hashedPassword = await hashPassword(password);

  // Create user
  const user = await createUser(email, name, hashedPassword);

  // Generate token
  const token = generateToken(user.id, user.role);

  // Return response
  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subscription: user.subscription,
      },
      token,
    },
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Find user
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  // Compare password
  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  // Generate token
  const token = generateToken(user.id, user.role);

  // Return response
  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        subscription: user.subscription,
      },
      token,
    },
  });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await findUserById(req.user!.userId);
  if (!user) {
    throw new AppError(404, 'User not found');
  }

  res.status(200).json({
    success: true,
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      subscription: user.subscription,
      bio: user.bio,
      avatar: user.avatar,
    },
  });
});
