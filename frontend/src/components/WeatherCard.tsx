import { WeatherData } from '@/services/weatherService';
import { Card } from '@/components/ui/card';
import { Cloud, CloudRain, Sun, Wind, Droplets } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface WeatherCardProps {
  weather: WeatherData;
  compact?: boolean;
}

export const WeatherCard = ({ weather, compact = false }: WeatherCardProps) => {
  const { t } = useLanguage();

  const getWeatherIcon = () => {
    const condition = weather.condition.toLowerCase();
    if (condition.includes('rain')) return <CloudRain className="h-8 w-8 text-accent" />;
    if (condition.includes('cloud')) return <Cloud className="h-8 w-8 text-muted-foreground" />;
    return <Sun className="h-8 w-8 text-warning" />;
  };

  const getAlertColor = () => {
    if (weather.alert === 'high') return 'bg-destructive/10 border-destructive';
    if (weather.alert === 'moderate') return 'bg-warning/10 border-warning';
    return 'bg-card border-border';
  };

  if (compact) {
    return (
      <Card className={`p-4 ${getAlertColor()}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getWeatherIcon()}
            <div>
              <p className="text-2xl font-bold text-foreground">{weather.temperature.current}°C</p>
              <p className="text-sm text-muted-foreground">{weather.condition}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">
              {weather.temperature.min}° / {weather.temperature.max}°
            </p>
            {weather.alert !== 'none' && (
              <span className={`text-xs font-medium ${weather.alert === 'high' ? 'text-destructive' : 'text-warning'}`}>
                {t(`weather.${weather.alert}Alert`)}
              </span>
            )}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${getAlertColor()}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">
            {new Date(weather.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </p>
          <div className="flex items-center gap-3">
            {getWeatherIcon()}
            <p className="text-4xl font-bold text-foreground">{weather.temperature.current}°C</p>
          </div>
          <p className="text-muted-foreground mt-2">{weather.condition}</p>
        </div>
        {weather.alert !== 'none' && (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${weather.alert === 'high' ? 'bg-destructive text-destructive-foreground' : 'bg-warning text-warning-foreground'}`}>
            {t(`weather.${weather.alert}Alert`)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border">
        <div className="flex items-center gap-2">
          <Droplets className="h-4 w-4 text-accent" />
          <div>
            <p className="text-xs text-muted-foreground">{t('weather.humidity')}</p>
            <p className="text-sm font-medium text-foreground">{weather.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-xs text-muted-foreground">{t('weather.windSpeed')}</p>
            <p className="text-sm font-medium text-foreground">{weather.windSpeed} km/h</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CloudRain className="h-4 w-4 text-accent" />
          <div>
            <p className="text-xs text-muted-foreground">{t('weather.rainfall')}</p>
            <p className="text-sm font-medium text-foreground">{weather.rainfall} mm</p>
          </div>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{t('weather.temperature')}</p>
          <p className="text-sm font-medium text-foreground">
            {weather.temperature.min}° - {weather.temperature.max}°
          </p>
        </div>
      </div>
    </Card>
  );
};
