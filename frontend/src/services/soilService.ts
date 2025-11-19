import { SoilData } from './farmService';
import api from '@/lib/api';

export interface SoilHealthCard {
  cardNumber: string;
  issuedDate: string;
  soil: SoilData;
  organicCarbon?: number;
  electricalConductivity?: number;
}

// Mock soil health card data
const mockSoilHealthCard: SoilHealthCard = {
  cardNumber: 'SHC123456789',
  issuedDate: new Date(Date.now() - 90 * 86400000).toISOString(),
  soil: {
    nitrogen: 45,
    phosphorus: 30,
    potassium: 35,
    pH: 6.5,
  },
  organicCarbon: 0.5,
  electricalConductivity: 0.3,
};

export async function getSoilHealthCard(farmPlotId: string): Promise<SoilHealthCard | null> {
  try {
    const res = await api.get(`/api/soil/${farmPlotId}`);
    return res?.data || res || null;
  } catch (e) {
    console.warn('Soil API failed, returning mock soil health card', e);
    // fall back to mock behavior
    if (Math.random() > 0.5) return mockSoilHealthCard;
    return null;
  }
}

export async function updateSoilData(farmPlotId: string, soilData: SoilData): Promise<void> {
  try {
    // Use farm update endpoint to update soil data
    await api.put(`/api/farms/${farmPlotId}`, { soil: soilData });
  } catch (e) {
    console.warn('Failed to update soil data on server, ignoring', e);
  }
}

export async function analyzeSoilQuality(soilData: SoilData): Promise<{
  quality: 'excellent' | 'good' | 'moderate' | 'poor';
  suggestions: string[];
}> {
  // TODO: Replace with actual analysis API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const { nitrogen, phosphorus, potassium, pH } = soilData;
  
  // Simple mock analysis
  const suggestions: string[] = [];
  let quality: 'excellent' | 'good' | 'moderate' | 'poor' = 'good';
  
  if (pH < 6.0 || pH > 7.5) {
    suggestions.push('pH level needs adjustment');
    quality = 'moderate';
  }
  
  if (nitrogen < 40) {
    suggestions.push('Consider adding nitrogen-rich fertilizer');
    quality = 'moderate';
  }
  
  if (phosphorus < 25) {
    suggestions.push('Phosphorus levels are low');
  }
  
  if (potassium < 30) {
    suggestions.push('Potassium supplementation recommended');
  }
  
  if (suggestions.length === 0) {
    quality = 'excellent';
    suggestions.push('Soil quality is excellent for most crops');
  }
  
  return { quality, suggestions };
}
