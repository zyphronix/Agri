import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getWeatherForecast, WeatherData } from '@/services/weatherService';
import { WeatherCard } from '@/components/WeatherCard';
import { BottomNav } from '@/components/BottomNav';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card } from '@/components/ui/card';
import { CloudSun } from 'lucide-react';

export default function Weather() {
  const { t } = useLanguage();
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadForecast = async () => {
      try {
        const data = await getWeatherForecast();
        setForecast(data);
      } catch (error) {
        console.error('Failed to load weather forecast:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadForecast();
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
      <div className="bg-gradient-to-br from-accent/10 via-accent/5 to-background pt-8 pb-6 px-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <div className="p-3 bg-accent/10 rounded-lg">
            <CloudSun className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{t('weather.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('weather.forecast')}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {forecast.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t('weather.today')}</h2>
            <WeatherCard weather={forecast[0]} />
          </div>
        )}

        {forecast.length > 1 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3 mt-6">Next 6 Days</h2>
            <div className="space-y-3">
              {forecast.slice(1).map((day, index) => (
                <WeatherCard key={index} weather={day} />
              ))}
            </div>
          </div>
        )}

        {forecast.some((day) => day.alert !== 'none') && (
          <Card className="p-6 bg-warning/10 border-warning mt-6">
            <h3 className="font-semibold text-foreground mb-2">Weather Alerts</h3>
            <ul className="space-y-2">
              {forecast
                .filter((day) => day.alert !== 'none')
                .map((day, index) => (
                  <li key={index} className="text-sm text-foreground">
                    <span className="font-medium">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}:
                    </span>{' '}
                    {day.alert === 'high'
                      ? 'Heavy rainfall expected. Take precautions.'
                      : 'Moderate weather conditions. Monitor crops.'}
                  </li>
                ))}
            </ul>
          </Card>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
