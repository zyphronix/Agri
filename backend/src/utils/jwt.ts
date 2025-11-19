import jwt, { SignOptions, Secret } from 'jsonwebtoken';
import config from '../config/env';

export const generateToken = (userId: string, phone: string): string => {
  const payload = { id: userId, phone };

  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as any,   // <== FIX
  };

  return jwt.sign(payload, config.jwtSecret as Secret, options);
};
