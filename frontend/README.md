# 🌾 Crop Advisor - Weather-Adaptive Crop Suggestion System

A Progressive Web App (PWA) that provides AI-powered crop recommendations based on real-time weather data and soil conditions. Built for farmers with a mobile-first, low-literacy-friendly interface.

## 🚀 Features

### Core Functionality
- **User Authentication** - Phone number + OTP verification
- **Farm Plot Management** - Add, edit, and delete farm plots with GPS location
- **Weather Forecasting** - 7-day weather forecast with alerts
- **Soil Data Management** - Track N-P-K levels and pH
- **Crop Recommendations** - AI-powered suggestions with suitability scores
- **Audio Explanations** - Voice-based guidance for low-literacy users
- **Multi-language Support** - English and Hindi (easily extendable)

### Technical Features
- ✅ Progressive Web App (PWA)
- ✅ Offline-capable
- ✅ Mobile-first responsive design
- ✅ Installable on mobile devices
- ✅ Service worker for caching
- ✅ i18n internationalization

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom + shadcn/ui
- **State Management**: React Query + Context API
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Notifications**: Sonner

## 📱 User Flows

1. **Authentication**
   - Login with phone number
   - Verify OTP
   - Auto-redirect to dashboard

2. **Dashboard**
   - View today's weather summary
   - Quick actions (Add farm, View farms, Get recommendations)
   - Recent farm plots overview

3. **Farm Management**
   - List all farm plots
   - Add new plot with GPS detection
   - Edit plot details
   - Delete plots (with confirmation)
   - Input soil data (N, P, K, pH)

4. **Weather**
   - Current weather conditions
   - 7-day forecast with charts
   - Weather alerts (high/moderate)

5. **Recommendations**
   - Select farm plot
   - Get top 5 crop suggestions
   - View suitability scores
   - Listen to audio explanations

6. **Settings**
   - Change language (EN/HI)
   - View profile
   - Logout

## 🗂 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base shadcn components
│   ├── BottomNav.tsx   # Bottom navigation
│   ├── CropCard.tsx    # Crop recommendation card
│   ├── FarmPlotCard.tsx
│   ├── LanguageSelector.tsx
│   ├── LoadingSpinner.tsx
│   ├── MapPlaceholder.tsx
│   └── WeatherCard.tsx
├── context/            # React contexts
│   ├── AuthContext.tsx
│   └── LanguageContext.tsx
├── i18n/              # Internationalization
│   ├── en.json
│   ├── hi.json
│   └── index.ts
├── pages/             # Page components
│   ├── AddFarmPlot.tsx
│   ├── Dashboard.tsx
│   ├── EditFarmPlot.tsx
│   ├── FarmPlots.tsx
│   ├── Login.tsx
│   ├── NotFound.tsx
│   ├── Recommendations.tsx
│   ├── Settings.tsx
│   ├── VerifyOTP.tsx
│   └── Weather.tsx
├── services/          # API service layer (mocked)
│   ├── authService.ts
│   ├── farmService.ts
│   ├── recommendationService.ts
│   ├── soilService.ts
│   └── weatherService.ts
├── App.tsx           # Main app component
└── main.tsx         # Entry point
```

## 🔌 Service Integration

All services are currently mocked with placeholder functions. To integrate real APIs:

### Weather Service
Replace `getWeatherForecast()` in `src/services/weatherService.ts` with actual API calls to weather services (e.g., OpenWeatherMap, Weather.gov).

### Farm Service
Replace CRUD operations in `src/services/farmService.ts` with backend API calls.

### Recommendation Service
Replace `getCropRecommendations()` in `src/services/recommendationService.ts` with ML model API calls.

### Soil Service
Replace `getSoilHealthCard()` in `src/services/soilService.ts` with government database API integration.

## 🌐 Adding More Languages

1. Create new JSON file in `src/i18n/` (e.g., `ta.json` for Tamil)
2. Add language to `src/i18n/index.ts`:
```typescript
import ta from './ta.json';

export const translations = {
  en,
  hi,
  ta, // Add here
};

export const languages = [
  // ... existing
  { code: 'ta' as Language, name: 'Tamil', nativeName: 'தமிழ்' },
];
```

## 📦 Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🔧 Environment Setup

This app runs entirely on the frontend with mocked data. No environment variables needed for development.

For production, you'll need to:
1. Set up backend APIs for each service
2. Configure API endpoints in service files
3. Add authentication tokens/API keys as needed

## 📱 PWA Installation

### Desktop
- Chrome: Click install icon in address bar
- Edge: Click "App available" prompt

### Mobile
- **iOS**: Safari → Share → Add to Home Screen
- **Android**: Chrome → Menu → Add to Home Screen

## 🎨 Design System

The app uses a farmer-friendly design with:
- **Primary Color**: Agricultural Green (#16a34a)
- **Secondary Color**: Earth Brown
- **Accent Color**: Sky Blue (for weather)
- Large, touch-friendly buttons
- High-contrast text for readability
- Icon-first navigation for low-literacy users

## 🤝 Contributing

This is a template/starter project. Feel free to:
- Add real API integrations
- Enhance ML recommendation logic
- Improve UI/UX
- Add more languages
- Implement voice recognition for input

## 📄 License

MIT License - Feel free to use this project as a template for your own agricultural tech solutions.

## 🙏 Acknowledgments

Built with love for farmers worldwide 🌾
