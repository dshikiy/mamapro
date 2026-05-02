import dotenv from 'dotenv';

dotenv.config();

const corsOrigin = process.env.CORS_ORIGIN 
  ? process.env.CORS_ORIGIN.split(',') 
  : ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  databaseUrl: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/mampro',
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-it-in-prod',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  corsOrigin: corsOrigin,
};
