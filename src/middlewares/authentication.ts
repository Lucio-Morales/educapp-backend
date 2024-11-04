import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export interface CustomRequest extends Request {
  user?: string | jwt.JwtPayload;
}

export const verifyToken = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader);

  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    res.status(401).json({ success: false, error: 'Token not provided.' });
  }

  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error('JWT secrett is not defined in enviroment variables.');
  }

  jwt.verify(token as string, jwtSecret, (error, decoded) => {
    if (error) {
      res.status(403).json({ success: true, error: 'Invalid token.' });
      return;
    }

    req.user = decoded;
    next();
  });
};
