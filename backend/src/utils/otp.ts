import axios from 'axios';
import config from '../config/env';

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP using Fast2SMS (expects API key in config.otpProviderApiKey)
export const sendOTP = async (phone: string, otp: string): Promise<boolean> => {
  // Normalize phone: remove non-digits
  const digits = phone.replace(/\D/g, '');
  // If 10 digits assume Indian local and prefix country code 91
  const number = digits.length === 10 ? `91${digits}` : digits;

  const message = `Your Crop Advisor OTP is: ${otp}`;

  // In development, don't actually send SMS
  if (process.env.NODE_ENV === 'development') {
    console.log(`📱 [DEV] Sending OTP ${otp} to ${phone} (normalized: ${number})`);
    return true;
  }

  const apiKey = config.otpProviderApiKey;
  if (!apiKey) {
    console.warn('No OTP provider API key configured, skipping SMS send');
    return false;
  }

  try {
    // Try Fast2SMS OTP-specific route first (per user's suggestion)
    const url = 'https://www.fast2sms.com/dev/bulkV2';
    const otpPayload = {
      route: 'otp',
      variables_values: otp,
      numbers: number,
    };

    try {
      const res = await axios.post(url, otpPayload, {
        headers: {
          authorization: apiKey,
          'Content-Type': 'application/json',
        },
        timeout: 8000,
      });

      if (res.status === 200) {
        const d = res.data || {};
        // Many Fast2SMS responses include `return: true` or `data` on success
        if (d.return === true || d.success === true || d.data) return true;
        if (typeof d === 'string' && d.toLowerCase().includes('success')) return true;
      }

      // If OTP route didn't indicate success, fall back to text route
      console.warn('Fast2SMS otp route returned non-success, falling back to bulk text send', res.status, res.data);
    } catch (err: any) {
      console.warn('Fast2SMS otp route failed, will attempt bulk text send', err?.message || err);
    }

    // Fallback: send plain message via bulkV2 text route
    const fallbackPayload = {
      route: 'v3',
      message,
      language: 'english',
      numbers: number,
    };

    const fallbackRes = await axios.post(url, fallbackPayload, {
      headers: {
        authorization: apiKey,
        'Content-Type': 'application/json',
      },
      timeout: 8000,
    });

    if (fallbackRes.status === 200) {
      const d = fallbackRes.data || {};
      if (d.return === true || d.success === true || d.data) return true;
      if (typeof d === 'string' && d.toLowerCase().includes('success')) return true;
    }

    console.warn('Fast2SMS send returned non-success (fallback)', fallbackRes.status, fallbackRes.data);
    return false;
  } catch (error: any) {
    console.error('Failed to send OTP via Fast2SMS:', error?.message || error);
    return false;
  }
};
