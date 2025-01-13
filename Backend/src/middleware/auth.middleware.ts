import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '../types/user.type';

interface JwtPayload {
  id: number;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  emailVerified: boolean;
}

export const authMiddleware = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    (req as any).user = null;
    return next();
  }

  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'secret'
    ) as JwtPayload;

    (req as any).user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      firstName: decoded.firstName,
      lastName: decoded.lastName,
      emailVerified: decoded.emailVerified
    };
  } catch (error) {
    (req as any).user = null;
  }

  next();
};
