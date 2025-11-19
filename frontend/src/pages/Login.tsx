import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { LanguageSelector } from '@/components/LanguageSelector';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Sprout, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'otp' | 'password'>('otp');
  const [isLoading, setIsLoading] = useState(false);
  const { login, loginWithPassword } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (phoneNumber.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }

    setIsLoading(true);
    try {
      if (mode === 'otp') {
        await login(phoneNumber);
        toast.success('OTP sent successfully');
        navigate('/verify-otp', { state: { phoneNumber } });
      } else {
        await loginWithPassword(phoneNumber, password);
        toast.success('Logged in successfully');
        navigate('/dashboard');
      }
    } catch (error) {
      const msg = (error as Error).message || 'Login failed';
      if (mode === 'otp') {
        toast.error(msg.includes('OTP') ? msg : 'Failed to send OTP. Please try again.');
      } else {
        toast.error(msg.includes('Invalid') ? 'Invalid phone or password' : 'Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-4">
            <Sprout className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{t('app.title')}</h1>
          <p className="text-muted-foreground">{t('app.subtitle')}</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">
                {t('auth.phoneNumber')}
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="tel"
                  placeholder={t('auth.enterPhone')}
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="pl-10 text-lg"
                  disabled={isLoading}
                  maxLength={10}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Login method</label>
              <div className="space-x-2">
                <button type="button" onClick={() => setMode('otp')} className={`px-3 py-1 rounded ${mode === 'otp' ? 'bg-primary text-white' : 'bg-transparent'}`}>OTP</button>
                <button type="button" onClick={() => setMode('password')} className={`px-3 py-1 rounded ${mode === 'password' ? 'bg-primary text-white' : 'bg-transparent'}`}>Password</button>
              </div>
            </div>

            {mode === 'password' && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}

            <Button
              type="submit"
              className="w-full text-lg py-6"
              disabled={
                isLoading || phoneNumber.length !== 10 || (mode === 'password' && password.length < 6)
              }
            >
              {isLoading ? (
                <LoadingSpinner size="sm" />
              ) : mode === 'otp' ? (
                t('auth.sendOTP')
              ) : (
                t('auth.login') || 'Login'
              )}
            </Button>
          </form>
        </Card>

        <div className="mt-6 flex justify-center">
          <LanguageSelector />
        </div>

        <div className="mt-4 text-center">
          <a href="/register" className="text-sm text-primary underline">Create an account</a>
        </div>
      </div>
    </div>
  );
}
