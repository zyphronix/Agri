import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { getCurrentWeather, WeatherData } from '@/services/weatherService';
import { getFarmPlots, FarmPlot } from '@/services/farmService';
import { WeatherCard } from '@/components/WeatherCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BottomNav } from '@/components/BottomNav';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Plus, Sprout, TrendingUp } from 'lucide-react';

export default function Dashboard() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [farmPlots, setFarmPlots] = useState<FarmPlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [weatherData, plots] = await Promise.all([
          getCurrentWeather(),
          getFarmPlots(),
        ]);
        setWeather(weatherData);
        setFarmPlots(plots);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background pt-8 pb-6 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground mb-1">{t('dashboard.welcome')}</h1>
          <p className="text-muted-foreground">{user?.name || user?.phoneNumber}</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 -mt-4 space-y-6">
        {weather && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t('dashboard.weatherSummary')}</h2>
            <WeatherCard weather={weather} compact />
          </div>
        )}

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">{t('dashboard.quickActions')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => navigate('/add-farm-plot')}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t('dashboard.addFarm')}</h3>
                  <p className="text-sm text-muted-foreground">Add new plot</p>
                </div>
              </div>
            </Card>

            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105"
              onClick={() => navigate('/farm-plots')}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-success/10 rounded-lg">
                  <Sprout className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t('dashboard.viewFarms')}</h3>
                  <p className="text-sm text-muted-foreground">{farmPlots.length} plots</p>
                </div>
              </div>
            </Card>

            <Card
              className="p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-105 sm:col-span-2"
              onClick={() => navigate('/recommendations')}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{t('dashboard.getRecommendations')}</h3>
                  <p className="text-sm text-muted-foreground">AI-powered crop suggestions</p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {farmPlots.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">{t('farm.title')}</h2>
              <Button variant="ghost" size="sm" onClick={() => navigate('/farm-plots')}>
                {t('common.view')}
              </Button>
            </div>
            <Card className="p-4">
              <div className="space-y-3">
                {farmPlots.slice(0, 3).map((plot) => (
                  <div
                    key={plot.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                    onClick={() => navigate(`/recommendations?plotId=${plot.id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <Sprout className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{plot.name}</p>
                        <p className="text-sm text-muted-foreground">{plot.area} acres</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
