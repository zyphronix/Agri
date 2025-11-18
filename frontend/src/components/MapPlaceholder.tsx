import { Card } from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface MapPlaceholderProps {
  location?: { lat: number; lon: number };
  className?: string;
}

export const MapPlaceholder = ({ location, className = '' }: MapPlaceholderProps) => {
  const { t } = useLanguage();

  return (
    <Card className={`flex items-center justify-center bg-muted/50 border-2 border-dashed border-border ${className}`}>
      <div className="text-center p-8">
        <MapPin className="h-12 w-12 text-primary mx-auto mb-3" />
        <p className="text-sm text-muted-foreground mb-1">
          Map will appear here
        </p>
        {location && (
          <p className="text-xs text-muted-foreground">
            {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
          </p>
        )}
      </div>
    </Card>
  );
};
