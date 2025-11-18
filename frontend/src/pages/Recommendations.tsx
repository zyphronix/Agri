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

  useEffect(() => {
    if (preselectedPlotId && selectedPlotId === preselectedPlotId) {
      handleGetRecommendations();
    }
  }, [preselectedPlotId, selectedPlotId]);

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
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      toast.error('Failed to get recommendations');
    } finally {
      setIsLoading(false);
    }
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
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
