import { CropRecommendation } from '@/services/recommendationService';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useState } from 'react';

interface CropCardProps {
  crop: CropRecommendation;
  rank?: number;
}

export const CropCard = ({ crop, rank }: CropCardProps) => {
  const { t, language } = useLanguage();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  const getScoreColor = () => {
    if (crop.suitabilityScore >= 80) return 'text-success';
    if (crop.suitabilityScore >= 60) return 'text-warning';
    return 'text-muted-foreground';
  };

  const getScoreBgColor = () => {
    if (crop.suitabilityScore >= 80) return 'bg-success/10';
    if (crop.suitabilityScore >= 60) return 'bg-warning/10';
    return 'bg-muted';
  };

  const handlePlayAudio = () => {
    // Mock audio playback
    setIsPlayingAudio(true);
    console.log('Playing audio explanation for:', crop.name);
    setTimeout(() => setIsPlayingAudio(false), 3000);
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-4">
          {rank && (
            <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full text-primary font-bold">
              {rank}
            </div>
          )}
          <div className="flex items-center gap-3">
            <span className="text-4xl">{crop.icon}</span>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{crop.name}</h3>
              {crop.localName && language === 'hi' && (
                <p className="text-sm text-muted-foreground">{crop.localName}</p>
              )}
            </div>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full ${getScoreBgColor()}`}>
          <p className={`text-sm font-bold ${getScoreColor()}`}>
            {crop.suitabilityScore}%
          </p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        {crop.reasons.map((reason, index) => (
          <div key={index} className="flex items-start gap-2">
            <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">{reason}</p>
          </div>
        ))}
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={handlePlayAudio}
        disabled={isPlayingAudio}
      >
        <Volume2 className={`h-4 w-4 mr-2 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
        {t('recommendations.listenExplanation')}
      </Button>
    </Card>
  );
};
