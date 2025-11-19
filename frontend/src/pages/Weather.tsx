import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { getWeatherForecast, WeatherData } from '@/services/weatherService';
import { getFarmPlots, FarmPlot } from '@/services/farmService';
import { WeatherCard } from '@/components/WeatherCard';
import { BottomNav } from '@/components/BottomNav';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card } from '@/components/ui/card';
import { CloudSun } from 'lucide-react';

export default function Weather() {
  const { t } = useLanguage();
  const [forecast, setForecast] = useState<WeatherData[]>([]);
  const [locationName, setLocationName] = useState<string | undefined>(undefined);
  const [farmPlots, setFarmPlots] = useState<FarmPlot[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState<string>('current');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      try {
        const plots = await getFarmPlots();
        setFarmPlots(plots || []);
        await fetchForSelection('current', plots || []);
      } catch (err) {
        console.error('Failed to initialize weather page', err);
      } finally {
        setIsLoading(false);
      }
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchForSelection(selection: string, plotsArg?: FarmPlot[]) {
    setIsLoading(true);
    try {
      const plots = plotsArg ?? farmPlots;

      if (selection && selection !== 'current') {
        const resp = await getWeatherForecast(undefined, undefined, selection);
        setForecast(resp.forecast || []);
        const farm = plots.find((p) => p.id === selection);
        setLocationName(farm?.name ?? resp.location);
      } else {
        // current location flow
        let resp;
        if (navigator && 'geolocation' in navigator) {
          const pos = await new Promise<GeolocationPosition | null>((resolve) => {
            navigator.geolocation.getCurrentPosition((p) => resolve(p), () => resolve(null), { timeout: 8000 });
          });

          if (pos) {
            resp = await getWeatherForecast(pos.coords.latitude, pos.coords.longitude);
          }
        }

        if (!resp) {
          resp = await getWeatherForecast();
        }

        setForecast(resp.forecast || []);
        setLocationName(resp.location);
      }
    } catch (err) {
      console.error('Failed to fetch weather for selection', err);
    } finally {
      setIsLoading(false);
    }
  }

  const onSelectionChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedFarmId(val);
    await fetchForSelection(val);
  };

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
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">{t('weather.title')}</h1>
            <p className="text-sm text-muted-foreground">{t('weather.forecast')}</p>
            {locationName && <p className="text-sm text-muted-foreground">{locationName}</p>}
          </div>

          {/* Farm selector */}
          <div>
            <label className="text-xs text-muted-foreground mr-2">Show weather for</label>
            <select value={selectedFarmId} onChange={onSelectionChange} className="bg-card border border-border rounded-md p-2 text-sm">
              <option value="current">Current Location</option>
              {farmPlots.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {forecast.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">{t('weather.today')}</h2>
            <WeatherCard weather={forecast[0]} location={locationName} />
          </div>
        )}

        {forecast.length > 1 && (
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3 mt-6">Next 6 Days</h2>
            <div className="space-y-3">
              {forecast.slice(1).map((day, idx) => (
                <WeatherCard key={`${day.date}-${idx}`} weather={day} location={locationName} />
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
                .map((day) => (
                  <li key={day.date} className="text-sm text-foreground">
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
