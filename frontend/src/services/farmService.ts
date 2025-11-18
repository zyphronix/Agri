export interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  ph: number;
}

export interface FarmPlot {
  id: string;
  name: string;
  location: {
    lat: number;
    lon: number;
    address?: string;
  };
  area: number; // in acres
  soilData: SoilData;
  createdAt: string;
  updatedAt: string;
}

// Mock storage
let mockFarmPlots: FarmPlot[] = [
  {
    id: '1',
    name: 'North Field',
    location: {
      lat: 28.6139,
      lon: 77.2090,
      address: 'Near Delhi, India',
    },
    area: 5,
    soilData: {
      nitrogen: 45,
      phosphorus: 30,
      potassium: 35,
      ph: 6.5,
    },
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

export async function getFarmPlots(): Promise<FarmPlot[]> {
  // TODO: Replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 300));
  return [...mockFarmPlots];
}

export async function getFarmPlot(id: string): Promise<FarmPlot | null> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockFarmPlots.find(plot => plot.id === id) || null;
}

export async function createFarmPlot(plot: Omit<FarmPlot, 'id' | 'createdAt' | 'updatedAt'>): Promise<FarmPlot> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const newPlot: FarmPlot = {
    ...plot,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  mockFarmPlots.push(newPlot);
  return newPlot;
}

export async function updateFarmPlot(id: string, updates: Partial<Omit<FarmPlot, 'id' | 'createdAt'>>): Promise<FarmPlot> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const index = mockFarmPlots.findIndex(plot => plot.id === id);
  if (index === -1) {
    throw new Error('Farm plot not found');
  }
  
  mockFarmPlots[index] = {
    ...mockFarmPlots[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  return mockFarmPlots[index];
}

export async function deleteFarmPlot(id: string): Promise<void> {
  await new Promise(resolve => setTimeout(resolve, 300));
  mockFarmPlots = mockFarmPlots.filter(plot => plot.id !== id);
}

export async function detectLocation(): Promise<{ lat: number; lon: number; address?: string }> {
  // TODO: Replace with actual geolocation API
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock location
  return {
    lat: 28.6139 + (Math.random() - 0.5) * 0.1,
    lon: 77.2090 + (Math.random() - 0.5) * 0.1,
    address: 'Detected location near Delhi',
  };
}
