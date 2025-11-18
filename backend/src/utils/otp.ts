export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Placeholder for OTP sending service
export const sendOTP = async (phone: string, otp: string): Promise<boolean> => {
  // TODO: Integrate with SMS provider (Twilio, MSG91, AWS SNS, etc.)
  console.log(`📱 Sending OTP ${otp} to ${phone}`);
  
  // Mock implementation
  if (process.env.NODE_ENV === 'development') {
    console.log(`✅ OTP sent successfully (DEV MODE): ${otp}`);
    return true;
  }

  // Real implementation placeholder
  // const response = await axios.post('https://sms-provider.com/send', {
  //   apiKey: config.otpProviderApiKey,
  //   phone,
  //   message: `Your Crop Advisor OTP is: ${otp}`,
  // });
  // return response.status === 200;

  return true;
};
