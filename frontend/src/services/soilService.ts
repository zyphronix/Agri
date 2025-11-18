import { SoilData } from './farmService';

export interface SoilHealthCard {
  cardNumber: string;
  issuedDate: string;
  soilData: SoilData;
  organicCarbon?: number;
  electricalConductivity?: number;
}

// Mock soil health card data
const mockSoilHealthCard: SoilHealthCard = {
  cardNumber: 'SHC123456789',
  issuedDate: new Date(Date.now() - 90 * 86400000).toISOString(),
  soilData: {
    nitrogen: 45,
    phosphorus: 30,
    potassium: 35,
    ph: 6.5,
  },
  organicCarbon: 0.5,
  electricalConductivity: 0.3,
};

export async function getSoilHealthCard(farmPlotId: string): Promise<SoilHealthCard | null> {
  // TODO: Replace with actual API call to fetch soil health card
  console.log('Fetching soil health card for farm plot:', farmPlotId);
  
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // 50% chance of having a soil health card (mock behavior)
  if (Math.random() > 0.5) {
    return mockSoilHealthCard;
  }
  
  return null;
}

export async function updateSoilData(farmPlotId: string, soilData: SoilData): Promise<void> {
  // TODO: Replace with actual API call
  console.log('Updating soil data for farm plot:', farmPlotId, soilData);
  
  await new Promise(resolve => setTimeout(resolve, 500));
}

export async function analyzeSoilQuality(soilData: SoilData): Promise<{
  quality: 'excellent' | 'good' | 'moderate' | 'poor';
  suggestions: string[];
}> {
  // TODO: Replace with actual analysis API
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const { nitrogen, phosphorus, potassium, ph } = soilData;
  
  // Simple mock analysis
  const suggestions: string[] = [];
  let quality: 'excellent' | 'good' | 'moderate' | 'poor' = 'good';
  
  if (ph < 6.0 || ph > 7.5) {
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
