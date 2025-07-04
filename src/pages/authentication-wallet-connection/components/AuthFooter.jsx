import React from 'react';
import Icon from '../../../components/AppIcon';

const AuthFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Security', href: '#' },
    { label: 'Help Center', href: '#' }
  ];

  return (
    <footer className="relative z-10 mt-12 pt-8 border-t border-border">
      <div className="text-center space-y-4">
        {/* Links */}
        <div className="flex flex-wrap justify-center gap-6">
          {footerLinks.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-text-secondary hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        
        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-sm text-text-secondary">
          <Icon name="Shield" size={16} color="var(--color-success)" />
          <span>Secured with industry-standard encryption</span>
        </div>
        
        {/* Copyright */}
        <div className="text-sm text-text-muted">
          <p>&copy; {currentYear} CryptoFolio. All rights reserved.</p>
          <p className="mt-1">Built for the decentralized future</p>
        </div>
      </div>
    </footer>
  );
};

export default AuthFooter;