import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  mongoUri: string;
  jwtSecret: string;
  jwtExpiresIn: string;
  nodeEnv: string;
  otpProviderApiKey: string;
  weatherApiKey: string;
  soilApiKey: string;
  mlServiceUrl: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '4000', 10),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/crop_advisor',
  jwtSecret: process.env.JWT_SECRET || 'default_secret_change_me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  nodeEnv: process.env.NODE_ENV || 'development',
  otpProviderApiKey: process.env.OTP_PROVIDER_API_KEY || '',
  weatherApiKey: process.env.WEATHER_API_KEY || '',
  soilApiKey: process.env.SOIL_API_KEY || '',
  mlServiceUrl: process.env.ML_SERVICE_URL || 'http://localhost:5000/api/predict',
};

export default config;
