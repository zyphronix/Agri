import User from '../models/User';
import OTP from '../models/OTP';
import { generateOTP, sendOTP } from '../utils/otp';
import { generateToken } from '../utils/jwt';
import { AppError } from '../middleware/errorHandler';
import bcrypt from 'bcryptjs';

class AuthService {
  async sendOTP(phone: string): Promise<{ message: string }> {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Delete any existing OTPs for this phone
    await OTP.deleteMany({ phone });

    // Create new OTP record
    await OTP.create({ phone, otp, expiresAt });

    // Send OTP via SMS provider
    const sent = await sendOTP(phone, otp);
    if (!sent) {
      throw new AppError(500, 'Failed to send OTP');
    }

    return { message: 'OTP sent successfully' };
  }

  async verifyOTP(phone: string, otp: string): Promise<{ token: string; user: any }> {
    // Find valid OTP
    const otpRecord = await OTP.findOne({
      phone,
      otp,
      verified: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otpRecord) {
      throw new AppError(400, 'Invalid or expired OTP');
    }

    // Mark OTP as verified
    otpRecord.verified = true;
    await otpRecord.save();

    // Find or create user
    let user = await User.findOne({ phone });
    if (!user) {
      user = await User.create({ phone });
    }

    // Generate JWT token
    const token = generateToken(user._id.toString(), user.phone);

    return {
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: (user as any).name,
        createdAt: user.createdAt,
      },
    };
  }

  async register(phone: string, name: string, password: string): Promise<{ token: string; user: any }> {
    // Prevent duplicate
    const existing = await User.findOne({ phone });
    if (existing && existing.password) {
      throw new AppError(400, 'User already registered with password');
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = existing
      ? await User.findByIdAndUpdate(existing._id, { name, password: hashed }, { new: true })
      : await User.create({ phone, name, password: hashed });

    const token = generateToken(user!._id.toString(), user!.phone);

    return {
      token,
      user: {
        id: user!._id,
        phone: user!.phone,
        name: user!.name,
        createdAt: user!.createdAt,
      },
    };
  }

  async loginWithPassword(phone: string, password: string): Promise<{ token: string; user: any }> {
    const user = await User.findOne({ phone });
    if (!user || !user.password) {
      throw new AppError(400, 'Invalid phone or password');
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      throw new AppError(400, 'Invalid phone or password');
    }

    const token = generateToken(user._id.toString(), user.phone);

    return {
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        createdAt: user.createdAt,
      },
    };
  }

  async getCurrentUser(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return {
      id: user._id,
      phone: user.phone,
      name: (user as any).name,
      createdAt: user.createdAt,
    };
  }
}

export default new AuthService();
