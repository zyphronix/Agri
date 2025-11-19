import { FarmPlot } from './farmService';
import api from '@/lib/api';

export interface CropRecommendation {
  id: string;
  name: string;
  localName?: string;
  suitabilityScore: number; // 0-100
  icon: string;
  reasons: string[];
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

    // Normalize different backend response shapes into CropRecommendation[]
    const rawList: any[] = ((): any[] => {
      if (!payload) return [];
      if (Array.isArray(payload)) return payload as any[];
      if (Array.isArray((payload as any).crops)) return (payload as any).crops;
      if (Array.isArray((payload as any).recommendations)) return (payload as any).recommendations;
      // some backends wrap under data
      if (Array.isArray((payload as any).data)) return (payload as any).data;
      // try to find the first array field
      const found = Object.values(payload).find((v) => Array.isArray(v));
      if (Array.isArray(found)) return found as any[];
      // If backend returned a single prediction object (e.g. { success: true, data: { prediction: 'muskmelon', inputs_received: {...} } })
      const dataObj = (payload as any).data ?? payload;
      if (dataObj && typeof dataObj.prediction === 'string') {
        // Also support the new `top_predictions` array schema
        if (Array.isArray(dataObj.top_predictions) && dataObj.top_predictions.length > 0) {
          return dataObj.top_predictions.map((p: any) => ({ crop: p.crop, confidence: p.confidence }));
        }
        return [{ prediction: dataObj.prediction, inputs_received: dataObj.inputs_received ?? dataObj.inputs ?? null }];
      }
      return [];
    })();

    // Map raw items to our CropRecommendation shape with safe defaults
    const normalized: CropRecommendation[] = rawList.map((item: any, idx: number) => {
      // handle ML single-prediction shape or top_predictions items
      if (item && (item.prediction && typeof item.prediction === 'string')) {
        const predName = String(item.prediction);
        const inputs = item.inputs_received || item.inputs || null;
        const reasons: string[] = [];
        if (inputs && typeof inputs === 'object') {
          for (const [k, v] of Object.entries(inputs)) {
            reasons.push(`${k}: ${v}`);
          }
        }
        return {
          id: `pred-${idx}`,
          name: predName,
          localName: undefined,
          suitabilityScore: 90,
          icon: '🌱',
          reasons,
        } as CropRecommendation;
      }

      // If item looks like { crop, confidence }
      if (item && (item.crop || item.name) && (item.confidence !== undefined)) {
        const cropName = item.crop || item.name;
        let confidence = Number(item.confidence) || 0;
        // confidence might be 0-1 or 0-100
        if (confidence > 0 && confidence <= 1) confidence = Math.round(confidence * 100);
        if (confidence > 100) confidence = 100;
        const reasons: string[] = [];
        if (item.inputs_received && typeof item.inputs_received === 'object') {
          for (const [k, v] of Object.entries(item.inputs_received)) reasons.push(`${k}: ${v}`);
        }
        return {
          id: item.id || `${idx}`,
          name: String(cropName),
          localName: undefined,
          suitabilityScore: confidence,
          icon: '🌾',
          reasons,
        } as CropRecommendation;
      }

      const id = item.id || item._id || `${idx}`;
      const name = item.name || item.crop || item.crop_name || item.cname || 'Unknown';
      const localName = item.localName || item.local_name || item.c_local || undefined;
      const scoreRaw = item.suitabilityScore ?? item.score ?? item.suitability ?? (item.probability !== undefined ? Math.round(Number(item.probability) * 100) : undefined);
      const suitabilityScore = Number(scoreRaw ?? 0);
      const icon = item.icon || '🌾';
      let reasons: string[] = [];
      if (Array.isArray(item.reasons)) reasons = item.reasons;
      else if (typeof item.reasons === 'string') reasons = [item.reasons];
      else if (item.reason) reasons = Array.isArray(item.reason) ? item.reason : [String(item.reason)];
      else if (item.reasons_text) reasons = [String(item.reasons_text)];
      else if (item.explanations && Array.isArray(item.explanations)) reasons = item.explanations;
      return {
        id,
        name,
        localName,
        suitabilityScore: Number.isFinite(suitabilityScore) ? suitabilityScore : 0,
        icon,
        reasons,
      } as CropRecommendation;
    });

    return normalized;
  } catch (e) {
    console.error('Recommendations API failed:', e);
    // Surface error to caller instead of returning mock data
    throw e;
  }
}

// audio explanation generation removed

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
