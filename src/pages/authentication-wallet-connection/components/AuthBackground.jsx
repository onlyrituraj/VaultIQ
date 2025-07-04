import React from 'react';
import Icon from '../../../components/AppIcon';

const AuthBackground = () => {
  const cryptoIcons = [
    { name: 'Bitcoin', icon: 'CircleDollarSign', position: 'top-20 left-20', delay: '0s' },
    { name: 'Ethereum', icon: 'Zap', position: 'top-32 right-32', delay: '0.5s' },
    { name: 'Crypto', icon: 'TrendingUp', position: 'bottom-40 left-16', delay: '1s' },
    { name: 'Wallet', icon: 'Wallet', position: 'bottom-20 right-20', delay: '1.5s' },
    { name: 'Chart', icon: 'BarChart3', position: 'top-1/2 left-8', delay: '2s' },
    { name: 'Shield', icon: 'Shield', position: 'top-1/3 right-8', delay: '2.5s' }
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-surface to-secondary-50" />
      
      {/* Animated Crypto Icons */}
      {cryptoIcons.map((crypto, index) => (
        <div
          key={crypto.name}
          className={`absolute ${crypto.position} opacity-10 animate-pulse-soft`}
          style={{ animationDelay: crypto.delay }}
        >
          <Icon name={crypto.icon} size={48} color="var(--color-primary)" />
        </div>
      ))}
      
      {/* Geometric Shapes */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full opacity-20 animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-gradient-to-br from-accent-100 to-primary-100 rounded-lg rotate-45 opacity-20 animate-pulse-soft" style={{ animationDelay: '1s' }} />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, var(--color-primary) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>
    </div>
  );
};

export default AuthBackground;