export interface SoilData {
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  pH: number;
}

export interface FarmPlot {
  id: string;
  name: string;
  location: {
    lat: number;
    lon: number;
    address?: string;
  };
  area: number;
  soil: SoilData;
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
    soil: {
      nitrogen: 45,
      phosphorus: 30,
      potassium: 35,
      pH: 6.5,
    },
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
  },
];

import api from '@/lib/api';

function normalizeFarm(f: any): FarmPlot {
  return {
    id: f._id || f.id,
    name: f.name,
    area: f.area ?? 0,
    location: f.location || { lat: 0, lon: 0 },
    soil: f.soil || { nitrogen: 0, phosphorus: 0, potassium: 0, pH: 7 },
    createdAt: f.createdAt || new Date().toISOString(),
    updatedAt: f.updatedAt || new Date().toISOString(),
  };
}

export async function getFarmPlots(): Promise<FarmPlot[]> {
  const res = await api.get('/api/farms');
  const data = res?.data || res || [];
  return Array.isArray(data) ? data.map(normalizeFarm) : [];
}

export async function getFarmPlot(id: string): Promise<FarmPlot | null> {
  const res = await api.get(`/api/farms/${id}`);
  const data = res?.data || res || null;
  return data ? normalizeFarm(data) : null;
}

export async function createFarmPlot(plot: { name: string; area: number; location: { lat: number; lon: number; address?: string }; soil: SoilData }): Promise<FarmPlot> {
  const res = await api.post('/api/farms', plot);
  const data = res?.data || res;
  return normalizeFarm(data);
}

export async function updateFarmPlot(id: string, updates: Partial<Omit<FarmPlot, 'id' | 'createdAt'>>): Promise<FarmPlot> {
  const res = await api.put(`/api/farms/${id}`, updates);
  const data = res?.data || res;
  return normalizeFarm(data);
}

export async function deleteFarmPlot(id: string): Promise<void> {
  await api.del(`/api/farms/${id}`);
}

export async function detectLocation(): Promise<{ lat: number; lon: number; address?: string }> {
  if ('geolocation' in navigator) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude });
        },
        (err) => {
          // fallback to server-side or mock
          resolve({ lat: 28.6139 + (Math.random() - 0.5) * 0.1, lon: 77.2090 + (Math.random() - 0.5) * 0.1, address: 'Detected location (fallback)' });
        },
        { timeout: 5000 }
      );
    });
  }

  // fallback mock
  return {
    lat: 28.6139 + (Math.random() - 0.5) * 0.1,
    lon: 77.2090 + (Math.random() - 0.5) * 0.1,
    address: 'Detected location (fallback)',
  };
}
