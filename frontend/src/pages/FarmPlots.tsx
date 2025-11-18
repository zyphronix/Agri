import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { getFarmPlots, deleteFarmPlot, FarmPlot } from '@/services/farmService';
import { FarmPlotCard } from '@/components/FarmPlotCard';
import { Button } from '@/components/ui/button';
import { BottomNav } from '@/components/BottomNav';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function FarmPlots() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [plots, setPlots] = useState<FarmPlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [plotToDelete, setPlotToDelete] = useState<FarmPlot | null>(null);

  const loadPlots = async () => {
    try {
      const data = await getFarmPlots();
      setPlots(data);
    } catch (error) {
      console.error('Failed to load farm plots:', error);
      toast.error('Failed to load farm plots');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPlots();
  }, []);

  const handleEdit = (plot: FarmPlot) => {
    navigate(`/edit-farm-plot/${plot.id}`);
  };

  const handleDelete = (plot: FarmPlot) => {
    setPlotToDelete(plot);
  };

  const confirmDelete = async () => {
    if (!plotToDelete) return;

    try {
      await deleteFarmPlot(plotToDelete.id);
      setPlots(plots.filter((p) => p.id !== plotToDelete.id));
      toast.success('Farm plot deleted successfully');
    } catch (error) {
      console.error('Failed to delete farm plot:', error);
      toast.error('Failed to delete farm plot');
    } finally {
      setPlotToDelete(null);
    }
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
      <div className="bg-primary/5 pt-8 pb-6 px-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{t('farm.title')}</h1>
          <Button onClick={() => navigate('/add-farm-plot')}>
            <Plus className="h-4 w-4 mr-2" />
            {t('common.add')}
          </Button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {plots.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">{t('farm.noPlots')}</p>
            <Button onClick={() => navigate('/add-farm-plot')}>
              <Plus className="h-4 w-4 mr-2" />
              {t('farm.addPlot')}
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {plots.map((plot) => (
              <FarmPlotCard
                key={plot.id}
                plot={plot}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      <AlertDialog open={!!plotToDelete} onOpenChange={() => setPlotToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('farm.deletePlot')}</AlertDialogTitle>
            <AlertDialogDescription>{t('farm.deleteConfirm')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('common.close')}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNav />
    </div>
  );
}
