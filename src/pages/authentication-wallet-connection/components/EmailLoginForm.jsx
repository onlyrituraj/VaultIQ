import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const EmailLoginForm = ({ isLoading, setIsLoading }) => {
  const { signIn, signUp, authError, clearError } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState('signin'); // 'signin' or 'signup'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [formError, setFormError] = useState('');

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
          full_name: formData.fullName
        });
      }

      if (result?.success) {
        navigate('/portfolio-dashboard');
      }
    } catch (error) {
      setFormError('Something went wrong. Please try again.');
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
      fullName: ''
    });
    setFormError('');
    clearError();
  };

  const fillDemoCredentials = () => {
    setFormData({
      email: 'demo@cryptofolio.com',
      password: 'demo123',
      confirmPassword: 'demo123',
      fullName: 'Demo User'
    });
    setFormError('');
    clearError();
  };

  return (
    <div className="space-y-6">
      {/* Error Display */}
      {(authError || formError) && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          <div className="flex items-center gap-2">
            <Icon name="AlertCircle" size={16} />
            <span className="text-sm">{authError || formError}</span>
          </div>
        </div>
      )}

      {/* Form */}
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
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            disabled={isLoading}
            required
          />
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
        className="w-full"
        disabled={isLoading}
      >
        <Icon name="User" size={16} className="mr-2" />
        Use Demo Account
      </Button>

      {/* Toggle Mode */}
      <div className="text-center">
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

      {/* Additional Features */}
      <div className="space-y-3">
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
  );
};

export default EmailLoginForm;