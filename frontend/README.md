
-----

# 🌾 Crop Advisor – Weather-Adaptive Crop Suggestion System

**Crop Advisor** is a mobile-first Progressive Web App (PWA) that recommends the best crops based on weather, soil nutrients, and farm location.

> Built for accessibility with large buttons, simple language, and multilingual support.

-----

## 🚀 Features

  * **User Authentication:** OTP-based mobile login.
  * **Farm Management:** Add, Edit, and Delete farm plots.
  * **Location Services:** GPS location support & integration-ready maps.
  * **Soil Analysis:** Manual soil input (N-P-K values + pH levels).
  * **Weather Integration:** 7-day weather forecast.
  * **Smart Recommendations:** Top 3 crop suggestions (Name + Confidence %).
  * **Localization:** Full support for **English** & **Hindi**.
  * **PWA Capabilities:** Installable on devices with offline support.
  * **Real-time Data:** Connected to backend services for live updates.

-----

## 🗂 Project Structure

```text
src/
├── components/                # Reusable UI components
│   ├── ui/                    # Base UI elements from shadcn/ui
│   ├── BottomNav.tsx          # Bottom navigation bar for mobile UI
│   ├── CropCard.tsx           # Card to display a crop recommendation
│   ├── FarmPlotCard.tsx       # Card to display farm plot summaries
│   ├── LanguageSelector.tsx   # Dropdown for language switching
│   ├── LoadingSpinner.tsx     # Reusable loading indicator
│   ├── MapPlaceholder.tsx     # Placeholder map UI (integration-ready)
│   └── WeatherCard.tsx        # Card showing weather information
│
├── context/                   # Global app contexts
│   ├── AuthContext.tsx        # Handles login state + JWT storage
│   └── LanguageContext.tsx    # Manages selected language across app
│
├── i18n/                      # Multi-language support
│   ├── en.json                # English translations
│   ├── hi.json                # Hindi translations
│   └── index.ts               # i18n configuration + helper functions
│
├── pages/                     # Screens/pages of the app
│   ├── AddFarmPlot.tsx        # Form to create new farm plot
│   ├── Dashboard.tsx          # Home dashboard (weather + quick actions)
│   ├── EditFarmPlot.tsx       # Edit existing farm plot
│   ├── FarmPlots.tsx          # List of all farm plots
│   ├── Login.tsx              # Phone number login screen
│   ├── NotFound.tsx           # 404 page
│   ├── Recommendations.tsx    # Shows top 3 crop suggestions
│   ├── Settings.tsx           # Language + account settings
│   ├── VerifyOTP.tsx          # OTP verification screen
│   └── Weather.tsx            # Full weather forecast view
│
├── services/                   # API service layer (connected to backend)
│   ├── authService.ts         # Login + OTP requests
│   ├── farmService.ts         # Farm plot CRUD operations
│   ├── recommendationService.ts# Fetches crop recommendations
│   ├── soilService.ts         # Soil data fetching
│   └── weatherService.ts      # Weather data fetching
│
├── App.tsx                    # Main application wrapper with routes
└── main.tsx                   # Entry point for rendering the React app
```

-----

## 🛠 Tech Stack

  * **Core:** React 18 + TypeScript
  * **Build Tool:** Vite
  * **Styling:** Tailwind CSS + shadcn/ui
  * **State Management:** Context API + React Query
  * **Routing:** React Router v6
  * **Icons:** Lucide Icons
  * **Notifications:** Sonner
  * **PWA:** Service Worker + Web Manifest

-----

## 📦 Installation

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Run development server:**

    ```bash
    npm run dev
    ```

3.  **Build for production:**

    ```bash
    npm run build
    ```

4.  **Preview production build:**

    ```bash
    npm run preview
    ```

-----

## 🌐 Environment Setup

Create a `.env` file in the root directory and add your backend URL:

```env
VITE_API_BASE_URL=your-backend-url
```

-----

## 📱 PWA Features

This application is designed to function like a native app:

  * **Installable:** Can be added to the home screen on Android, iOS, and Desktop.
  * **Offline Mode:** View cached screens and previously loaded data without an internet connection.
  * **Performance:** Optimized for fast load times on 3G/4G networks.

-----

## 🎨 Design Philosophy

  * **Clean and Farmer-Friendly:** Minimalistic interface focusing on utility.
  * **Accessibility:** Large buttons and high-contrast colors for outdoor visibility.
  * **Icon-First Navigation:** Intuitive UI that requires minimal reading.

-----

## 🙏 Acknowledgments

Built to empower farmers with data-backed insights for better crop choices. 🌾💚

-----