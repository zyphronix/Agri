import jwt, { SignOptions, Secret, StringValue } from 'jsonwebtoken';
import config from '../config/env';

export const generateToken = (userId: string, phone: string): string => {
  const payload = { id: userId, phone };

  const options: SignOptions = {
    expiresIn: config.jwtExpiresIn as unknown as StringValue,
  };

  return jwt.sign(payload, config.jwtSecret as Secret, options);
};
