import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const generateToken = (userId: string, email: string) => {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT secret is not defined in environment variables.');
  }

  const token = jwt.sign({ id: userId, email: email }, jwtSecret);
  return token;
};
