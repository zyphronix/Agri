import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { createFarmPlot, detectLocation } from '@/services/farmService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MapPlaceholder } from '@/components/MapPlaceholder';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ArrowLeft, MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AddFarmPlot() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);
  const [formData, setFormData] = useState<{
    name: string;
    area: string;
    location: { lat: number; lon: number; address?: string };
    soilData: {
      nitrogen: string;
      phosphorus: string;
      potassium: string;
      ph: string;
    };
  }>({
    name: '',
    area: '',
    location: { lat: 0, lon: 0, address: '' },
    soilData: {
      nitrogen: '',
      phosphorus: '',
      potassium: '',
      ph: '',
    },
  });

  const handleDetectLocation = async () => {
    setIsDetecting(true);
    try {
      const location = await detectLocation();
      setFormData((prev) => ({ ...prev, location }));
      toast.success('Location detected successfully');
    } catch (error) {
      console.error('Failed to detect location:', error);
      toast.error('Failed to detect location');
    } finally {
      setIsDetecting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.area) {
      toast.error('Please fill all required fields');
      return;
    }

    setIsLoading(true);
    try {
      // map frontend form fields to backend expected schema (`soil` with `pH`)
      await createFarmPlot({
        name: formData.name,
        area: parseFloat(formData.area) || 0,
        location: formData.location,
        soil: {
          nitrogen: parseFloat(formData.soilData.nitrogen) || 0,
          phosphorus: parseFloat(formData.soilData.phosphorus) || 0,
          potassium: parseFloat(formData.soilData.potassium) || 0,
          pH: parseFloat(formData.soilData.ph) || 7,
        },
      });
      toast.success('Farm plot added successfully');
      navigate('/farm-plots');
    } catch (error) {
      console.error('Failed to create farm plot:', error);
      toast.error('Failed to create farm plot');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-6">
      <div className="bg-primary/5 pt-8 pb-6 px-4">
        <div className="max-w-2xl mx-auto">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <h1 className="text-2xl font-bold text-foreground">{t('farm.addPlot')}</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t('farm.plotName')} *
              </label>
              <Input
                placeholder="e.g., North Field"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t('farm.area')} *
              </label>
              <Input
                type="number"
                step="0.1"
                placeholder="e.g., 5"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t('farm.location')}
              </label>
              <Button
                type="button"
                variant="outline"
                className="w-full mb-3"
                onClick={handleDetectLocation}
                disabled={isDetecting}
              >
                {isDetecting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4 mr-2" />
                )}
                {t('farm.detectLocation')}
              </Button>
              
              <MapPlaceholder
                location={formData.location.lat !== 0 ? formData.location : undefined}
                className="h-48"
              />
              
              {formData.location.address && (
                <p className="text-sm text-muted-foreground mt-2">{formData.location.address}</p>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">{t('farm.soilInfo')}</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    {t('farm.nitrogen')}
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0-100"
                    value={formData.soilData.nitrogen}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        soilData: { ...formData.soilData, nitrogen: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    {t('farm.phosphorus')}
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0-100"
                    value={formData.soilData.phosphorus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        soilData: { ...formData.soilData, phosphorus: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    {t('farm.potassium')}
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0-100"
                    value={formData.soilData.potassium}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        soilData: { ...formData.soilData, potassium: e.target.value },
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    {t('farm.ph')}
                  </label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0-14"
                    value={formData.soilData.ph}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        soilData: { ...formData.soilData, ph: e.target.value },
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate(-1)}
                disabled={isLoading}
              >
                {t('farm.cancel')}
              </Button>
              <Button type="submit" className="flex-1" disabled={isLoading}>
                {isLoading ? <LoadingSpinner size="sm" /> : t('farm.save')}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
