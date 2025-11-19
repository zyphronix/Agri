
-----

# 🌾 Crop Advisor

**Weather-Adaptive Crop Suggestion System**

Crop Advisor is a full-stack solution designed to empower farmers with data-backed insights. It combines a mobile-first **Progressive Web App (PWA)** with a robust **Node.js backend** and **Machine Learning integration** to recommend the best crops based on real-time weather, soil nutrients, and geolocation.

-----

## 🚀 Key Features

### 📱 Frontend (Client)

  * **Farmer-Centric UI:** Large buttons, high-contrast colors, and simple navigation.
  * **PWA Capabilities:** Installable on Android/iOS with offline support.
  * **Localization:** Full English & Hindi support.
  * **Farm Management:** GPS-based plot mapping and manual soil health input.

### ⚙️ Backend (Server)

  * **Orchestration:** Manages data flow between the App, Weather APIs, and ML Models.
  * **Smart Aggregation:** Calculates 90-day seasonal weather aggregates.
  * **Secure Auth:** OTP-based login and JWT session management.
  * **ML Integration:** Bridges user data with Python-based prediction services.

-----

## 🛠 Tech Stack Overview

| **Domain** | **Technologies** |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, PWA |
| **Backend** | Node.js, Express.js, TypeScript, Mongoose |
| **Database** | MongoDB |
| **Services** | OpenWeather API, Open-Meteo, Python ML Service (External) |

-----

## 📂 Repository Structure

This repository is organized as a monorepo containing both the client and server applications.

```text
root/
├── backend/             # Express.js API & Database Logic
│   ├── src/             # Source code (Controllers, Models, Routes)
│   └── package.json     # Server dependencies
│
├── frontend/            # React PWA & UI Logic
│   ├── src/             # Components, Pages, Contexts
│   ├── public/          # Static assets & Manifest
│   └── package.json     # Client dependencies
│
└── README.md            # You are here
```

-----

## ⚡ Quick Start Guide

To run the full application locally, you will need to set up the Backend and Frontend in parallel.

### Prerequisites

  * Node.js (v16+)
  * MongoDB (Running locally or via Atlas)
  * (Optional) Python ML Service running on port 8000

### Step 1: Backend Setup

1.  Navigate to the backend folder:
    ```bash
    cd backend
    npm install
    ```
2.  Create a `.env` file in `/backend` with the following keys:
    ```env
    MONGO_URI=mongodb://localhost:27017/crop_advisor
    JWT_SECRET=your_secret_key
    PORT=5000
    WEATHER_API_KEY=your_openweather_key
    ML_SERVICE_URL=http://localhost:8000/predict
    ```
3.  Start the server:
    ```bash
    npm run dev
    ```
    *Server will run on `http://localhost:5000`*

### Step 2: Frontend Setup

1.  Open a new terminal and navigate to the frontend folder:
    ```bash
    cd frontend
    npm install
    ```
2.  Create a `.env` file in `/frontend`:
    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```
3.  Start the client:
    ```bash
    npm run dev
    ```
    *App will run on `http://localhost:5173` (or similar)*

-----

## 📘 Detailed Documentation

### 🖥️ Frontend Details

The frontend is built using **Vite** and **React 18**. It uses **React Query** for server state management and **Context API** for global UI state (Auth/Language).

  * **PWA:** The app caches assets via a service worker, allowing farmers to view previously loaded data (like farm plots) even without a signal.
  * **Architecture:**
      * `services/`: Handles all HTTP requests to the backend.
      * `i18n/`: Manages JSON translation files (en/hi).
      * `components/ui/`: Reusable atomic components (shadcn).

### 📡 Backend Details

The backend is a REST API built with **Express**. It acts as the logic gatekeeper.

  * **Recommendation Flow:**
    1.  User requests recommendation for a `FarmId`.
    2.  Backend fetches Soil Data (DB) + 90-Day Weather Aggregate (Open-Meteo).
    3.  Payload is sent to the `ML_SERVICE_URL`.
    4.  Result is saved to `PredictionHistory` and returned to the user.
  * **Auth:** Uses JWT tokens. The OTP system is guarded in dev mode (logs to console instead of sending SMS).

-----

## 🧪 Testing & Linting

Both folders contain their own linting and build scripts.

**Backend:**

```bash
cd backend && npm run lint
```

**Frontend:**

```bash
cd frontend && npm run build
```

-----

## 📜 License

This project is licensed under the **MIT License**.

-----

## 🙏 Acknowledgments

Built to bridge the gap between technology and agriculture. 🌾💚
