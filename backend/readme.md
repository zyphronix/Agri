
-----

# 🌾 Crop Advisor – Backend API

This is the server-side application for **Crop Advisor**, handling user authentication, farm data management, weather aggregation, and orchestration between the frontend and the ML prediction service.

-----

## 🛠 Tech Stack

  * **Runtime:** Node.js (TypeScript)
  * **Framework:** Express.js
  * **Database:** MongoDB (via Mongoose)
  * **HTTP Client:** Axios (for external API calls to Weather/ML services)

-----

## ⚡ Quick Start (Development)

1.  **Install dependencies:**

    ```bash
    cd backend
    npm install
    ```

2.  **Run development server:**

    ```bash
    npm run dev
    ```

3.  **Server Status:**
    The server listens on the port defined in your `.env` file. By default, the app expects an active MongoDB connection to start successfully.

-----

## 🔐 Environment Variables

Create a `.env` file in the root of the `backend` directory.

```env
# Database
MONGO_URI=mongodb://localhost:27017/crop_advisor

# Security
JWT_SECRET=your_super_secret_jwt_key
PORT=5000

# External APIs
WEATHER_API_KEY=your_openweather_api_key
OTP_PROVIDER_API_KEY=your_sms_provider_key

# Machine Learning Service
# Link to Python backend: [Check GitHub Repository]
ML_SERVICE_URL=http://localhost:8000/predict
```

-----

## 📡 Notable Endpoints

All endpoints are prefixed with `/api`. Most require a valid JWT token in the header.

### 👤 Authentication

  * `POST /api/auth/login` — Login or request an OTP.
  * `POST /api/auth/verify` — Verify OTP and issue JWT access token.

### 🚜 Farm Management

  * `GET /api/farms` — List the authenticated user's farm plots.
  * `POST /api/farms` — Create a new farm plot.

### 🌦️ Weather & Climate

  * `GET /api/weather` — Fetch weather forecasts (proxied/cached).

### 🤖 Recommendations (ML Integration)

  * `POST /api/recommendations`
      * Requests crop recommendations for a specific `farmId`.
      * Calls the configured **ML Service**.
      * Persists successful responses to `PredictionHistory`.
  * `GET /api/recommendations/history?farmId={id}`
      * Returns recent prediction history for a specific farm.
  * `GET /api/recommendations/seasonal?farmId={id}`
      * Returns 90-day seasonal aggregates for the farm.

-----

## 💾 Data & Persistence

The application uses **MongoDB** via **Mongoose**. Key data models include:

  * **`User`**: Stores profile and authentication data.
  * **`FarmPlot`**: Stores geolocation, soil data (N-P-K, pH), and plot names.
  * **`PredictionHistory`**: An audit log that stores inputs sent to the ML model and the successful crop suggestions returned.

-----

## 🧠 Behavior Notes

  * **ML Integration:** The recommendation flow prioritizes the `ML_SERVICE_URL`. Successful ML responses are saved. If the ML service fails, the system **does not** persist mock or fallback predictions to ensure data integrity.
  * **Seasonal Data:** The backend includes a seasonal climate fetcher backed by **Open-Meteo**. It calculates 90-day aggregates. The recommendation service composes payloads using both DB soil values and these seasonal aggregates before sending them to the ML model.
  * **Safety:** OTP sending is guarded in development mode to prevent accidental SMS charges or spam.

-----

## 🐛 Debugging & Development

  * **External Calls:** `console.log` statements are included around external provider calls (Weather/ML) to help trace request/response cycles.
  * **Common Proxy Issue:** If the frontend fetch to `/api/...` returns the frontend's `index.html` (HTML instead of JSON), verify:
    1.  The `VITE_API_URL` in the frontend is correct.
    2.  The Vite proxy configuration (if used) matches the backend port.

-----

## ✅ Tests & Linting

Run linting and TypeScript checks using the repository scripts:

```bash
npm run lint
npm run build
```

-----

## 📜 License

MIT

-----