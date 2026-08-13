import dotenv from 'dotenv';
dotenv.config();

function getRequiredEnv(key: string): string {

  const value = process.env[key];

  if (!value || value.trim() === '') {
    throw new Error(`[FATAL CONFIG ERROR] Missing required environment variable: "${key}". Check your .env file.`);
  }

  return value.trim();
}

export const env = {

  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 4000,
  DATABASE_URL: getRequiredEnv('DATABASE_URL'),
  JWT_SECRET: getRequiredEnv('JWT_SECRET'),
  
};