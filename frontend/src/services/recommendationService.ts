import { FarmPlot } from './farmService';
import api from '@/lib/api';

export interface CropRecommendation {
  id: string;
  name: string;
  localName?: string;
  suitabilityScore: number; // 0-100
  icon: string;
  reasons: string[];
  audioExplanation?: string;
}

// Mock crop data
const mockCrops = [
  { name: 'Rice', localName: 'धान', icon: '🌾' },
  { name: 'Wheat', localName: 'गेहूं', icon: '🌾' },
  { name: 'Corn', localName: 'मक्का', icon: '🌽' },
  { name: 'Potato', localName: 'आलू', icon: '🥔' },
  { name: 'Tomato', localName: 'टमाटर', icon: '🍅' },
  { name: 'Cotton', localName: 'कपास', icon: '☁️' },
  { name: 'Sugarcane', localName: 'गन्ना', icon: '🎋' },
  { name: 'Soybean', localName: 'सोयाबीन', icon: '🫘' },
];

export async function getCropRecommendations(farmPlot: FarmPlot): Promise<CropRecommendation[]> {
  // Call backend recommendation endpoint
  try {
    const res = await api.post('/api/recommendations', { farmId: farmPlot.id });
    // Backend may return { success: true, data: { crops: [...] } } or { success: true, data: [...] }
    const payload = res?.data || res;

    // If payload contains .crops use it
    if (payload && typeof payload === 'object') {
      if (Array.isArray(payload)) {
        return payload as CropRecommendation[];
      }
      if (Array.isArray((payload as any).crops)) {
        return (payload as any).crops as CropRecommendation[];
      }
      if (Array.isArray((payload as any).recommendations)) {
        return (payload as any).recommendations as CropRecommendation[];
      }
    }

    // Fallback: if it's a single object with crop items under unknown key, try to extract array values
    if (payload && typeof payload === 'object') {
      const vals = Object.values(payload).find((v) => Array.isArray(v));
      if (Array.isArray(vals)) return vals as CropRecommendation[];
    }

    return [];
  } catch (e) {
    console.warn('Recommendations API failed, falling back to mock', e);
    // fallback to previous mock logic
    const recommendations: CropRecommendation[] = [];
    const { pH, nitrogen, phosphorus, potassium } = farmPlot.soil;
    for (let i = 0; i < 5; i++) {
      const crop = mockCrops[i % mockCrops.length];
      const baseScore = 60 + Math.random() * 30;
      let score = baseScore;
      if (pH >= 6.0 && pH <= 7.5) score += 10;
      if (nitrogen > 40) score += 5;
      if (phosphorus > 25) score += 5;
      if (potassium > 30) score += 5;
      score = Math.min(100, Math.round(score));
      const reasons: string[] = [];
      if (score > 85) {
        reasons.push('Excellent soil conditions');
        reasons.push('Optimal weather forecast');
      } else if (score > 70) {
        reasons.push('Good soil nutrients');
        reasons.push('Suitable weather conditions');
      } else {
        reasons.push('Moderate soil conditions');
        reasons.push('May need soil amendment');
      }
      recommendations.push({
        id: `${i + 1}`,
        name: crop.name,
        localName: crop.localName,
        suitabilityScore: score,
        icon: crop.icon,
        reasons,
        audioExplanation: `mock-audio-${crop.name.toLowerCase()}.mp3`,
      });
    }
    return recommendations.sort((a, b) => b.suitabilityScore - a.suitabilityScore);
  }
}

export async function generateAudioExplanation(text: string, language: 'en' | 'hi' = 'en'): Promise<string> {
  // TODO: Replace with actual TTS API
  console.log('Generating audio explanation:', text, 'in', language);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock audio URL
  return 'mock-audio-explanation.mp3';
}

export async function getSeasonalClimateForFarm(farmId: string): Promise<any> {
  try {
    const res = await api.get(`/api/recommendations/seasonal?farmId=${encodeURIComponent(farmId)}`);
    // backend returns { success: true, data: { ... } }
    const payload = res?.data || res;
    return payload?.data || payload || null;
  } catch (err) {
    console.warn('Failed to fetch seasonal climate for farm', err);
    return null;
  }
}
