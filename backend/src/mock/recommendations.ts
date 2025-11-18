import { RecommendationResponse } from '../types';

export const mockRecommendations: RecommendationResponse = {
  crops: [
    {
      name: 'Wheat',
      score: 0.92,
      imageUrl: '/images/wheat.png',
      reason: 'Ideal nitrogen levels and temperature range for wheat cultivation',
    },
    {
      name: 'Maize',
      score: 0.88,
      imageUrl: '/images/maize.png',
      reason: 'Good soil pH and moderate rainfall supports maize growth',
    },
    {
      name: 'Rice',
      score: 0.85,
      imageUrl: '/images/rice.png',
      reason: 'High humidity and expected rainfall beneficial for rice',
    },
    {
      name: 'Cotton',
      score: 0.78,
      imageUrl: '/images/cotton.png',
      reason: 'Suitable temperature and potassium levels for cotton',
    },
    {
      name: 'Sugarcane',
      score: 0.72,
      imageUrl: '/images/sugarcane.png',
      reason: 'Adequate phosphorus and warm conditions support sugarcane',
    },
  ],
  explanationAudioUrl: 'https://mock-tts-service.com/audio/explanation-12345.mp3',
};
