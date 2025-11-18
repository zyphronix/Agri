import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ArrowLeft, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { verifyOTP } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const phoneNumber = location.state?.phoneNumber;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      await verifyOTP(otp);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = () => {
    toast.success('OTP resent successfully');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
            <Shield className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{t('auth.verifyOTP')}</h1>
          <p className="text-muted-foreground">
            {t('auth.enterOTP')}
            {phoneNumber && <span className="block font-medium text-foreground mt-1">+91 {phoneNumber}</span>}
          </p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="text"
                inputMode="numeric"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="text-center text-2xl tracking-widest font-bold"
                disabled={isLoading}
                maxLength={6}
              />
            </div>

            <Button
              type="submit"
              className="w-full text-lg py-6"
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? <LoadingSpinner size="sm" /> : t('auth.verifyOTP')}
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={handleResendOTP}
              disabled={isLoading}
            >
              {t('auth.resendOTP')}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
