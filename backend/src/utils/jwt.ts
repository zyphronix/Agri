import jwt from 'jsonwebtoken';
import config from '../config/env';

export const generateToken = (userId: string, phone: string): string => {
  return jwt.sign({ id: userId, phone }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
};
