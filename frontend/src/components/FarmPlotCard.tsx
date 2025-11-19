import { FarmPlot } from '@/services/farmService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Edit, Trash2, Sprout } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getSeasonalClimateForFarm } from '@/services/recommendationService';

interface FarmPlotCardProps {
  plot: FarmPlot;
  onEdit?: (plot: FarmPlot) => void;
  onDelete?: (plot: FarmPlot) => void;
}

export const FarmPlotCard = ({ plot, onEdit, onDelete }: FarmPlotCardProps) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [seasonal, setSeasonal] = useState<any | null>(null);
  const [loadingSeasonal, setLoadingSeasonal] = useState(false);
  const [seasonalError, setSeasonalError] = useState<string | null>(null);

  const getSoilQualityColor = () => {
    const { nitrogen, phosphorus, potassium, pH } = plot.soil;
    const avgNutrient = (nitrogen + phosphorus + potassium) / 3;
    const isPhGood = pH >= 6.0 && pH <= 7.5;

    if (avgNutrient > 40 && isPhGood) return 'text-success';
    if (avgNutrient > 30) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Sprout className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">{plot.name}</h3>
            <p className="text-sm text-muted-foreground">{plot.area} acres</p>
          </div>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(plot)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(plot)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2 mb-4 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
        <p>{plot.location.address || `${plot.location.lat.toFixed(4)}, ${plot.location.lon.toFixed(4)}`}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-muted-foreground">N-P-K</p>
            <p className={`text-sm font-medium ${getSoilQualityColor()}`}>
            {plot.soil.nitrogen}-{plot.soil.phosphorus}-{plot.soil.potassium}
          </p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">pH</p>
            <p className={`text-sm font-medium ${getSoilQualityColor()}`}>
            {plot.soil.pH}
          </p>
        </div>
      </div>

      <Button
        className="w-full mt-4"
        variant="outline"
        onClick={() => navigate(`/recommendations?plotId=${plot.id}`)}
      >
        {t('dashboard.getRecommendations')}
      </Button>

      <div className="mt-3">
        <Button
          className="w-full"
          size="sm"
          variant="ghost"
          onClick={async () => {
            setSeasonalError(null);
            setLoadingSeasonal(true);
            try {
              const res = await getSeasonalClimateForFarm(plot.id);
              if (!res) throw new Error('No data');
              setSeasonal(res);
            } catch (err: any) {
              setSeasonal(null);
              setSeasonalError(err?.message || 'Failed to load seasonal data');
            } finally {
              setLoadingSeasonal(false);
            }
          }}
        >
          {loadingSeasonal ? 'Loading 90-day climate...' : 'Load 90-day climate'}
        </Button>

        {seasonalError && (
          <p className="mt-2 text-sm text-destructive">{seasonalError}</p>
        )}

        {seasonal && (
          <div className="mt-3 border-t pt-3 text-sm text-muted-foreground">
            <p><strong>90-day Avg Temp:</strong> {seasonal.temperature_90_day_avg ?? '—'} °C</p>
            <p><strong>90-day Avg Humidity:</strong> {seasonal.humidity_90_day_avg ?? '—'} %</p>
            <p><strong>90-day Rainfall Sum:</strong> {seasonal.rainfall_90_day_sum ?? '—'} mm</p>
          </div>
        )}
      </div>
    </Card>
  );
};
