Agri — Backend

## Tech stack

- Node.js (TypeScript)
- Express
- Mongoose (MongoDB)
- Axios (external API calls)

## Quick start (development)

1. Install dependencies

```powershell
cd backend
npm install
```

2. Run development server

```powershell
npm run dev
```

3. The server listens on the port set in your environment (see below). By default the app expects a MongoDB connection.

## Important environment variables

Create a `.env` file or set these variables in your environment:

- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret used for signing JWT tokens
- `PORT` — server port (optional, default in config)
- `WEATHER_API_KEY` — OpenWeather API key
- `ML_SERVICE_URL` — external ML prediction service URL (check my github for python backend implementation)
- `OTP_PROVIDER_API_KEY` — provider key for OTP/SMS (if used)

## Notable endpoints

- `POST /api/auth/login` — login / request OTP
- `POST /api/auth/verify` — verify OTP and issue JWT
- `GET /api/farms` — list user's farm plots (authenticated)
- `POST /api/farms` — create a farm plot (authenticated)
- `GET /api/weather` — weather forecasts (authenticated)

- `POST /api/recommendations` — request crop recommendations for a `farmId` (authenticated). This calls the configured ML service and persists successful responses to `PredictionHistory`.
- `GET /api/recommendations/history?farmId={id}` — returns recent prediction history for a farm (authenticated).
- `GET /api/recommendations/seasonal?farmId={id}` — returns 90-day seasonal aggregates for the farm (authenticated).

All endpoints are under `/api` and most are protected by JWT-based `authMiddleware`.

## Data & persistence

- MongoDB is used via Mongoose. Key models include `User`, `FarmPlot`, and `PredictionHistory` (stores successful prediction inputs and responses).

## Behavior notes

- The recommendation flow prefers the configured `ML_SERVICE_URL`. Successful ML responses are saved to `PredictionHistory`. Failed ML calls do not persist mock/fallback predictions.
- The backend provides a seasonal climate fetcher backed by Open‑Meteo for 90-day aggregates; the recommendations service composes ML payloads from DB soil values and seasonal aggregates.
- OTP sending is guarded in development to avoid accidental SMS sends.

## Debugging & development tips

- Use `console` logs added around external provider calls for quick debugging.
- If frontend fetch to `/api/...` returns the frontend `index.html`, ensure the frontend `VITE_API_URL` is set correctly or proxy is configured.

## Tests and linting

- Run linting and TypeScript checks using your repository scripts (e.g., `npm run lint`, `npm run build`).

## License

MIT
