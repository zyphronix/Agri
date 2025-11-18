import { z } from 'zod';

export const sendOtpSchema = z.object({
  body: z.object({
    phone: z.string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must not exceed 15 digits')
      .regex(/^\+?[0-9]+$/, 'Invalid phone number format'),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    phone: z.string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must not exceed 15 digits'),
    otp: z.string()
      .length(6, 'OTP must be 6 digits')
      .regex(/^[0-9]+$/, 'OTP must contain only numbers'),
  }),
});

export const registerSchema = z.object({
  body: z.object({
    phone: z.string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must not exceed 15 digits')
      .regex(/^\+?[0-9]+$/, 'Invalid phone number format'),
    name: z.string().min(1, 'Name is required').max(100),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    phone: z.string()
      .min(10, 'Phone number must be at least 10 digits')
      .max(15, 'Phone number must not exceed 15 digits')
      .regex(/^\+?[0-9]+$/, 'Invalid phone number format'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
  }),
});
