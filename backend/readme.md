# 🌾 Crop Advisor Backend API

Weather-Adaptive Crop Suggestion System - Complete Backend Server

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Integration Points](#integration-points)

---

## ✨ Features

- **OTP-Based Authentication** - Secure phone-based login with JWT sessions
- **Farm Plot Management** - CRUD operations for farm data
- **Weather Integration** - 7-day forecast with real-time alerts
- **Soil Data Fetching** - Integration with Soil Health Card and SoilGrids APIs
- **ML-Powered Recommendations** - Crop suggestions based on weather, soil, and location
- **Type-Safe** - Full TypeScript implementation
- **Validation** - Zod schema validation on all endpoints
- **Clean Architecture** - MVC pattern with service layer

---

## 💻 Tech Stack

- **Runtime**: Node.js v18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + OTP
- **Validation**: Zod
- **HTTP Client**: Axios
- **Security**: Helmet, CORS

---

## 🚀 Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd crop-advisor-backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your actual values
nano .env
```

---

## 🔧 Environment Setup

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/crop_advisor

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRES_IN=7d

# External APIs
OTP_PROVIDER_API_KEY=your_twilio_or_msg91_key
WEATHER_API_KEY=your_openweathermap_api_key
SOIL_API_KEY=your_soil_health_card_api_key
ML_SERVICE_URL=http://localhost:5000/api/predict
```

### Getting API Keys

1. **OpenWeatherMap**: https://openweathermap.org/api
2. **Twilio (OTP)**: https://www.twilio.com/
3. **MSG91 (OTP)**: https://msg91.com/
4. **Soil Health Card**: https://soilhealth.dac.gov.in/

---

## 🏃 Running the Server

### Development Mode

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm start
```

### MongoDB Setup

**Local MongoDB:**
```bash
# Install MongoDB
brew install mongodb-community  # macOS
sudo apt install mongodb        # Ubuntu

# Start MongoDB
mongod --dbpath /path/to/data
```

**MongoDB Atlas (Cloud):**
1. Create account at https://www.mongodb.com/cloud/atlas
2. Create cluster
3. Get connection string
4. Update `MONGO_URI` in `.env`

---

## 📚 API Documentation

Base URL: `http://localhost:4000/api`

### Authentication Endpoints

#### Send OTP
```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "phone": "+919876543210"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "OTP sent successfully"
  }
}
```

---

#### Verify OTP
```http
POST /api/auth/verify-otp
Content-Type: application/json

{
  "phone": "+919876543210",
  "otp": "123456"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "phone": "+919876543210",
      "createdAt": "2025-11-18T10:30:00.000Z"
    }
  }
}
```

---

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "phone": "+919876543210",
    "createdAt": "2025-11-18T10:30:00.000Z"
  }
}
```

---

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### Farm Management Endpoints

#### Create Farm
```http
POST /api/farms
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "North Field",
  "location": {
    "lat": 28.6139,
    "lon": 77.2090
  },
  "soil": {
    "nitrogen": 245,
    "phosphorus": 18,
    "potassium": 210,
    "pH": 6.8
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "userId": "507f1f77bcf86cd799439011",
    "name": "North Field",
    "location": {
      "lat": 28.6139,
      "lon": 77.2090
    },
    "soil": {
      "nitrogen": 245,
      "phosphorus": 18,
      "potassium": 210,
      "pH": 6.8
    },
    "createdAt": "2025-11-18T10:35:00.000Z",
    "updatedAt": "2025-11-18T10:35:00.000Z"
  }
}
```

---

#### Get All User Farms
```http
GET /api/farms
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "name": "North Field",
      "location": { "lat": 28.6139, "lon": 77.2090 },
      "soil": { "nitrogen": 245, "phosphorus": 18, "potassium": 210, "pH": 6.8 },
      "createdAt": "2025-11-18T10:35:00.000Z"
    }
  ]
}
```

---

#### Get Farm by ID
```http
GET /api/farms/:id
Authorization: Bearer <token>
```

---

#### Update Farm
```http
PUT /api/farms/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "North Field Updated",
  "soil": {
    "nitrogen": 250,
    "phosphorus": 20,
    "potassium": 215,
    "pH": 7.0
  }
}
```

---

#### Delete Farm
```http
DELETE /api/farms/:id
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": "Farm deleted successfully"
  }
}
```

---

### Weather Endpoint

#### Get Weather for Farm
```http
GET /api/weather/:farmId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "temperature": 28.5,
    "humidity": 65,
    "rainfall": 15,
    "alerts": ["Moderate rainfall expected in next 48 hours"],
    "forecast": [
      {
        "date": "2025-11-19",
        "temp": 29,
        "humidity": 68,
        "rainfall": 20,
        "weather": "Partly Cloudy"
      },
      {
        "date": "2025-11-20",
        "temp": 27,
        "humidity": 72,
        "rainfall": 35,
        "weather": "Rainy"
      }
    ]
  }
}
```

---

### Soil Data Endpoint

#### Get Soil Data for Farm
```http
GET /api/soil/:farmId
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "nitrogen": 245,
    "phosphorus": 18,
    "potassium": 210,
    "pH": 6.8,
    "organic_carbon": 0.65,
    "source": "Soil Health Card"
  }
}
```

---

### Recommendations Endpoint

#### Get Crop Recommendations
```http
POST /api/recommendations
Authorization: Bearer <token>
Content-Type: application/json

{
  "farmId": "507f1f77bcf86cd799439012"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "crops": [
      {
        "name": "Wheat",
        "score": 0.92,
        "imageUrl": "/images/wheat.png",
        "reason": "Ideal nitrogen levels and temperature range"
      },
      {
        "name": "Maize",
        "score": 0.88,
        "imageUrl": "/images/maize.png",
        "reason": "Good soil pH and moderate rainfall"
      },
      {
        "name": "Rice",
        "score": 0.85,
        "imageUrl": "/images/rice.png",
        "reason": "High humidity beneficial for rice"
      }
    ],
    "explanationAudioUrl": "https://mock-tts-service.com/audio/explanation.mp3"
  }
}
```

---

### Health Check

```http
GET /api/health
```

**Response:**
```json
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-11-18T10:30:00.000Z"
}
```

---

## 📁 Project Structure

```
src/
├── config/              # Configuration files
│   ├── env.ts          # Environment variables
│   └── db.ts           # Database connection
├── models/             # Mongoose models
│   ├── User.ts         # User schema
│   ├── FarmPlot.ts     # Farm plot schema
│   └── OTP.ts          # OTP schema
├── routes/             # API routes
│   ├── auth.routes.ts
│   ├── farm.routes.ts
│   ├── weather.routes.ts
│   ├── soil.routes.ts
│   ├── recommendation.routes.ts
│   └── index.ts        # Route aggregator
├── controllers/        # Request handlers
│   ├── auth.controller.ts
│   ├── farm.controller.ts
│   ├── weather.controller.ts
│   ├── soil.controller.ts
│   └── recommendation.controller.ts
├── services/           # Business logic
│   ├── auth.service.ts
│   ├── farm.service.ts
│   ├── weather.service.ts
│   ├── soil.service.ts
│   └── recommendation.service.ts
├── middleware/         # Express middleware
│   ├── auth.middleware.ts
│   ├── errorHandler.ts
│   └── validate.ts
├── validations/        # Zod schemas
│   ├── auth.validation.ts
│   ├── farm.validation.ts
│   └── recommendation.validation.ts
├── utils/              # Helper functions
│   ├── jwt.ts
│   └── otp.ts
├── mock/               # Mock data
│   ├── weather.ts
│   ├── soil.ts
│   └── recommendations.ts
├── types/              # TypeScript types
│   └── index.ts
└── index.ts            # Server entry point
```

---

## 🔌 Integration Points

### 1. OTP Provider Integration

**Location:** `src/utils/otp.ts`

```typescript
export const sendOTP = async (phone: string, otp: string): Promise<boolean> => {
  // TODO: Integrate with Twilio, MSG91, or AWS SNS
  const response = await axios.post('https://api.twilio.com/2010-04-01/Accounts/YOUR_ACCOUNT_SID/Messages.json', {
    To: phone,
    From: 'YOUR_TWILIO_NUMBER',
    Body: `Your Crop Advisor OTP is: ${otp}`
  }, {
    auth: {
      username: 'YOUR_ACCOUNT_SID',
      password: 'YOUR_AUTH_TOKEN'
    }
  });
  
  return response.status === 201;
};
```

---

### 2. Weather API Integration

**Location:** `src/services/weather.service.ts`

```typescript
async fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const response = await axios.get(
    `https://api.openweathermap.org/data/2.5/forecast`,
    {
      params: {
        lat,
        lon,
        appid: config.weatherApiKey,
        units: 'metric',
      },
    }
  );
  
  // Transform and return data
  return this.transformWeatherData(response.data);
}
```

---

### 3. Soil Health Card API

**Location:** `src/services/soil.service.ts`

```typescript
async fetchSoilHealthCard(lat: number, lon: number): Promise<SoilData | null> {
  try {
    const response = await axios.get(
      `https://soilhealth.dac.gov.in/api/getdata`,
      {
        params: { lat, lon, apiKey: config.soilApiKey },
      }
    );
    return response.data;
  } catch (error) {
    return null;
  }
}
```

---

### 4. ML Microservice Integration

**Location:** `src/services/recommendation.service.ts`

```typescript
private async callMLService(payload: any): Promise<RecommendationResponse> {
  const response = await axios.post(config.mlServiceUrl, payload, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 30000,
  });
  
  return response.data;
}
```

**Expected ML Service Payload:**
```json
{
  "location": { "lat": 28.6139, "lon": 77.2090 },
  "weather": {
    "temperature": 28.5,
    "humidity": 65,
    "rainfall": 15
  },
  "soil": {
    "nitrogen": 245,
    "phosphorus": 18,
    "potassium": 210,
    "pH": 6.8
  }
}
```

---

## 🧪 Testing the API

### Using cURL

```bash
# Send OTP
curl -X POST http://localhost:4000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210"}'

# Verify OTP
curl -X POST http://localhost:4000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "otp": "123456"}'

# Create Farm (replace TOKEN)
curl -X POST http://localhost:4000/api/farms \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Farm",
    "location": {"lat": 28.6139, "lon": 77.2090},
    "soil": {"nitrogen": 245, "phosphorus": 18, "potassium": 210, "pH": 6.8}
  }'
```

### Using Postman

1. Import the API endpoints
2. Set `Authorization` header: `Bearer <your-token>`
3. Test each endpoint sequentially

---

## 🛡️ Security Features

- **JWT Authentication** - Secure token-based sessions
- **Helmet** - Sets security HTTP headers
- **CORS** - Configurable cross-origin requests
- **Input Validation** - Zod schema validation on all inputs
- **Rate Limiting** - TODO: Add express-rate-limit
- **Password Hashing** - Not needed (OTP-based auth)

---

## 🚦 Error Responses

All errors follow this format:

```json
{
  "success": false,
  "message": "Error message here",
  "errors": [
    {
      "field": "field.name",
      "message": "Specific error message"
    }
  ]
}
```

**Common Status Codes:**
- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `404` - Not Found
- `500` - Internal Server Error

---

## 📝 License

MIT License - Feel free to use this project for your applications.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

---

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Email: support@cropadvisor.com

---

**Built with ❤️ for farmers everywhere 🌾**