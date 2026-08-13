import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthenticatedRequest, JwtPayload, ErrorResponseData } from '../types';

export const authenticateJwt = (req: AuthenticatedRequest, res: Response<ErrorResponseData>, next: NextFunction): void => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authorization header missing or invalid' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {

    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
    req.user = decoded;

    next();
    
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
};