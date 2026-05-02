import * as jwt from 'jsonwebtoken';
import { config } from '../config/env';

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign(
    { userId, role },
    config.jwtSecret as any,
    {
      expiresIn: config.jwtExpire as any,
    }
  ) as string;
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const decodeToken = (token: string): any => {
  return jwt.decode(token);
};
