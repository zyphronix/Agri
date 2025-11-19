import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { getFarmPlots, FarmPlot } from '@/services/farmService';
import { getCropRecommendations, CropRecommendation } from '@/services/recommendationService';
import { CropCard } from '@/components/CropCard';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function Recommendations() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const preselectedPlotId = searchParams.get('plotId');
  
  const [plots, setPlots] = useState<FarmPlot[]>([]);
  const [selectedPlotId, setSelectedPlotId] = useState<string>(preselectedPlotId || '');
  const [recommendations, setRecommendations] = useState<CropRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingPlots, setIsLoadingPlots] = useState(true);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);
  const API_BASE = (import.meta as any).env?.VITE_API_URL ?? '';

  useEffect(() => {
    const loadPlots = async () => {
      try {
        const data = await getFarmPlots();
        setPlots(data);
        if (data.length > 0 && !selectedPlotId) {
          setSelectedPlotId(data[0].id);
        }
      } catch (error) {
        console.error('Failed to load farm plots:', error);
        toast.error('Failed to load farm plots');
      } finally {
        setIsLoadingPlots(false);
      }
    };

    loadPlots();
  }, []);

  // Do not auto-trigger recommendations on plot change to avoid accidental requests

  // Load history whenever selected plot changes
  useEffect(() => {
    if (!selectedPlotId) { setHistory([]); return; }
    let mounted = true;
    (async () => {
      setLoadingHistory(true);
      try {
        const items = await loadHistoryForPlot(selectedPlotId);
        if (mounted) setHistory(items ?? []);
      } catch (err) {
        console.warn('Failed to load history', err);
      } finally {
        if (mounted) setLoadingHistory(false);
      }
    })();
    return () => { mounted = false; };
  }, [selectedPlotId]);

  // Clear shown recommendations when user selects a different farm
  useEffect(() => {
    setRecommendations([]);
    setActiveHistoryId(null);
  }, [selectedPlotId]);

  const handleGetRecommendations = async () => {
    if (!selectedPlotId) {
      toast.error('Please select a farm plot');
      return;
    }

    const plot = plots.find((p) => p.id === selectedPlotId);
    if (!plot) return;

    setIsLoading(true);
    try {
      const data = await getCropRecommendations(plot);
      setRecommendations(data);
      // refresh history after a new prediction is generated
      try { await loadHistoryForPlot(plot.id); } catch (e) { /* ignore */ }
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      toast.error('Failed to get recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch history helper used by this page (minimal: call backend history endpoint)
  const loadHistoryForPlot = async (plotId: string) => {
    setLoadingHistory(true);
    try {
      const token = localStorage.getItem('token');
      const headers: any = { 'Content-Type': 'application/json' };
      if (token) headers.Authorization = `Bearer ${token}`;
      const res = await fetch(`${API_BASE}/api/recommendations/history?farmId=${encodeURIComponent(plotId)}`, { headers });
      const contentType = res.headers.get('content-type') || '';
      if (!res.ok) {
        const text = await res.text().catch(() => '<unreadable>');
        console.error('History fetch failed', res.status, text);
        return [];
      }
      if (!contentType.includes('application/json')) {
        const text = await res.text().catch(() => '<non-json>');
        console.warn('History fetch returned non-JSON payload:', text);
        return [];
      }
      const payload = await res.json();
      const items = payload?.data ?? payload ?? [];
      setHistory(Array.isArray(items) ? items : []);
      return items;
    } finally {
      setLoadingHistory(false);
    }
  };

  // normalize different stored response shapes into CropRecommendation[]
  const normalizeBackendRecResponse = (raw: any): CropRecommendation[] => {
    if (!raw) return [];
    const dataObj = raw.data ?? raw;

    if (Array.isArray(dataObj?.top_predictions)) {
      return dataObj.top_predictions.map((p: any, i: number) => {
        let conf = Number(p.confidence) || 0;
        if (conf > 0 && conf <= 1) conf = Math.round(conf * 100);
        if (conf > 100) conf = 100;
        return { id: `h-${i}`, name: String(p.crop), suitabilityScore: conf, icon: '🌾', reasons: [] } as CropRecommendation;
      });
    }

    if (typeof dataObj?.prediction === 'string') {
      const predName = String(dataObj.prediction);
      const inputs = dataObj.inputs_received ?? dataObj.inputs ?? null;
      const reasons: string[] = [];
      if (inputs && typeof inputs === 'object') for (const [k, v] of Object.entries(inputs)) reasons.push(`${k}: ${v}`);
      return [{ id: `pred-0`, name: predName, suitabilityScore: 90, icon: '🌱', reasons }];
    }

    const arr = dataObj?.crops ?? dataObj?.recommendations ?? (Array.isArray(dataObj) ? dataObj : null);
    if (Array.isArray(arr)) {
      return arr.map((item: any, idx: number) => {
        const name = item.name || item.crop || item.cname || 'Unknown';
        const scoreRaw = item.score ?? item.suitability ?? item.confidence ?? 0;
        let score = Number(scoreRaw) || 0;
        if (score > 0 && score <= 1) score = Math.round(score * 100);
        if (score > 100) score = 100;
        return { id: item.id || `${idx}`, name: String(name), suitabilityScore: score, icon: item.icon || '🌾', reasons: [] } as CropRecommendation;
      });
    }

    return [];
  };

  if (isLoadingPlots) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-br from-success/10 via-success/5 to-background pt-8 pb-6 px-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="p-3 bg-success/10 rounded-lg">
            <TrendingUp className="h-6 w-6 text-success" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('recommendations.title')}</h1>
            <p className="text-sm text-muted-foreground">AI-powered suggestions</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {plots.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No farm plots available. Please add a farm plot first.</p>
            <Button onClick={() => window.location.href = '/add-farm-plot'}>Add Farm Plot</Button>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <label className="text-sm font-medium text-foreground block">
                {t('recommendations.selectPlot')}
              </label>
              <Select value={selectedPlotId} onValueChange={setSelectedPlotId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a farm plot" />
                </SelectTrigger>
                <SelectContent>
                  {plots.map((plot) => (
                    <SelectItem key={plot.id} value={plot.id}>
                      {plot.name} ({plot.area} acres)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                className="w-full"
                onClick={handleGetRecommendations}
                disabled={isLoading || !selectedPlotId}
              >
                {isLoading ? <LoadingSpinner size="sm" /> : t('recommendations.getRecommendations')}
              </Button>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {!isLoading && recommendations.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  {t('recommendations.topCrops')}
                </h2>
                <div className="space-y-4">
                  {recommendations.map((crop, index) => (
                    <CropCard key={crop.id} crop={crop} rank={index + 1} />
                  ))}
                </div>
              </div>
            )}

            {!isLoading && recommendations.length === 0 && selectedPlotId && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">{t('recommendations.noCrops')}</p>
              </div>
            )}

            {/* Minimal history display */}
            {selectedPlotId && (
              <div className="pt-6">
                <h3 className="text-md font-medium text-foreground mb-3">Recent Predictions</h3>
                {loadingHistory ? (
                  <div className="py-4"><LoadingSpinner size="sm" /></div>
                ) : history.length === 0 ? (
                  <div className="text-sm text-muted-foreground">No previous predictions</div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {history.map((entry) => {
                      const id = entry._id || entry.id || entry.createdAt || Math.random().toString(36).slice(2,8);
                      const when = entry.createdAt ? new Date(entry.createdAt).toLocaleString() : (entry.created ? new Date(entry.created).toLocaleString() : '—');
                      const raw = entry.response ?? entry.data ?? entry;
                      const recsPreview = normalizeBackendRecResponse(raw);
                      const primary = recsPreview && recsPreview.length > 0 ? recsPreview[0] : null;
                      return (
                        <button
                          key={id}
                          onClick={() => {
                            const recs = normalizeBackendRecResponse(raw);
                            setRecommendations(recs);
                            setActiveHistoryId(id);
                          }}
                          className={`p-3 text-left rounded border ${activeHistoryId === id ? 'border-primary' : 'border-border'} bg-card`}>
                          <div className="text-xs text-muted-foreground">{when}</div>
                          <div className="text-sm font-medium">{primary ? primary.name : (entry.success ? 'Success' : 'Result')}</div>
                          {primary && (
                            <div className="text-xs text-muted-foreground">Score: {primary.suitabilityScore ?? '—'}</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
