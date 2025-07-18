import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Icon from '../../components/AppIcon';

const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signUp, signInWithGoogle, user, loading: authLoading, authError, clearError } = useAuth();
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    walletAddress: '',
    preferredCurrency: 'USD'
  });
  const [formError, setFormError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && user) {
      const from = location.state?.from?.pathname || '/portfolio-dashboard';
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when user starts typing
    if (formError) setFormError('');
    if (authError) clearError();
  };

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setFormError('Email and password are required');
      return false;
    }

    if (mode === 'signup') {
      if (!formData.fullName) {
        setFormError('Full name is required');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setFormError('Passwords do not match');
        return false;
      }
      
      if (formData.password.length < 6) {
        setFormError('Password must be at least 6 characters');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setFormError('');

    try {
      let result;
      
      if (mode === 'signin') {
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(formData.email, formData.password, {
          fullName: formData.fullName,
          walletAddress: formData.walletAddress || null,
          preferredCurrency: formData.preferredCurrency,
          notificationPreferences: {
            email: true,
            push: false,
            price_alerts: true,
            portfolio_updates: true
          }
        });
      }

      if (result?.success) {
        const from = location.state?.from?.pathname || '/portfolio-dashboard';
        navigate(from, { replace: true });
      }
    } catch (error) {
      setFormError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setFormError('');
    clearError();

    try {
      const result = await signInWithGoogle();
      
      if (result?.success) {
        // Google OAuth will redirect automatically
        // The redirect URL is set to /portfolio-dashboard in authService
      }
    } catch (error) {
      setFormError('Google sign-in failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      walletAddress: '',
      preferredCurrency: 'USD'
    });
    setFormError('');
    clearError();
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'demo@cryptofolio.com',
      password: 'demo123',
      confirmPassword: 'demo123',
      fullName: 'Demo User',
      walletAddress: '',
      preferredCurrency: 'USD'
    });
    setFormError('');
    clearError();
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Icon name="Loader2" size={24} className="animate-spin text-primary" />
          <span className="text-text-primary">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render if user is authenticated (will redirect)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Background Pattern */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-surface to-secondary-50" />
        
        {/* Animated Crypto Icons */}
        <div className="absolute top-20 left-20 opacity-10 animate-pulse-soft">
          <Icon name="Bitcoin" size={48} color="var(--color-primary)" />
        </div>
        <div className="absolute top-32 right-32 opacity-10 animate-pulse-soft" style={{ animationDelay: '0.5s' }}>
          <Icon name="Zap" size={48} color="var(--color-primary)" />
        </div>
        <div className="absolute bottom-40 left-16 opacity-10 animate-pulse-soft" style={{ animationDelay: '1s' }}>
          <Icon name="TrendingUp" size={48} color="var(--color-primary)" />
        </div>
        <div className="absolute bottom-20 right-20 opacity-10 animate-pulse-soft" style={{ animationDelay: '1.5s' }}>
          <Icon name="Wallet" size={48} color="var(--color-primary)" />
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-primary) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>
      
      <main className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Login Card */}
          <div className="bg-surface border border-border rounded-xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-8 text-center border-b border-border">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                  <Icon name="TrendingUp" size={24} color="white" />
                </div>
              </div>
              <h1 className="text-2xl font-bold text-text-primary mb-2">
                Welcome to VoltIQ
              </h1>
              <p className="text-text-secondary">
                {mode === 'signin' 
                  ? 'Sign in to access your portfolio' 
                  : 'Create your account to get started'
                }
              </p>
            </div>

            {/* Form */}
            <div className="px-6 py-6">
              {/* Error Display */}
              {(authError || formError) && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6">
                  <div className="flex items-center gap-2">
                    <Icon name="AlertCircle" size={16} />
                    <span className="text-sm">{authError || formError}</span>
                  </div>
                </div>
              )}

              {/* Google Sign In */}
              <Button
                variant="outline"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full mb-4 flex items-center justify-center gap-3"
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                {isLoading ? 'Connecting...' : 'Continue with Google'}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-surface text-text-secondary">Or continue with email</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {mode === 'signup' && (
                  <Input
                    type="text"
                    name="fullName"
                    placeholder="Full Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    required
                  />
                )}

                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />

                <Input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />

                {mode === 'signup' && (
                  <>
                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                    
                    <Input
                      type="text"
                      name="walletAddress"
                      placeholder="Wallet Address (Optional)"
                      value={formData.walletAddress}
                      onChange={handleInputChange}
                      disabled={isLoading}
                    />
                    
                    <div className="relative">
                      <select
                        name="preferredCurrency"
                        value={formData.preferredCurrency}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="BTC">BTC - Bitcoin</option>
                        <option value="ETH">ETH - Ethereum</option>
                      </select>
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Icon name="Loader2" size={16} className="animate-spin mr-2" />
                      {mode === 'signin' ? 'Signing In...' : 'Creating Account...'}
                    </>
                  ) : (
                    mode === 'signin' ? 'Sign In' : 'Create Account'
                  )}
                </Button>
              </form>

              {/* Demo Button */}
              <Button
                variant="outline"
                onClick={fillDemoCredentials}
                className="w-full mt-4"
                disabled={isLoading}
              >
                <Icon name="User" size={16} className="mr-2" />
                Use Demo Account
              </Button>

              {/* Toggle Mode */}
              <div className="text-center mt-6">
                <p className="text-sm text-text-secondary">
                  {mode === 'signin' ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="ml-1 text-primary hover:underline font-medium"
                    disabled={isLoading}
                  >
                    {mode === 'signin' ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>

              {/* Features */}
              <div className="space-y-3 mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-surface text-text-secondary">Features</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs text-text-secondary">
                  <div className="flex items-center gap-2">
                    <Icon name="Shield" size={14} />
                    <span>Secure Storage</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="BarChart3" size={14} />
                    <span>Real-time Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="Bell" size={14} />
                    <span>Price Alerts</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Icon name="TrendingUp" size={14} />
                    <span>Analytics</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-surface-secondary border-t border-border text-center">
              <p className="text-xs text-text-muted">
                Demo Credentials: demo@VoltIQ.com / demo123
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-6 text-center">
            <p className="text-sm text-text-secondary">
              By continuing, you agree to our{' '}
              <a href="/terms" className="text-primary hover:underline">Terms of Service</a>
              {' '}and{' '}
              <a href="/privacy" className="text-primary hover:underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AuthPage;