import React, { useState, useEffect } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const LocalizationSettings = ({ isExpanded, onToggle }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [localizationSettings, setLocalizationSettings] = useState({
    language: 'en',
    region: 'US',
    timezone: 'America/New_York',
    taxRegion: 'US'
  });

  const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'pt', name: 'Português', flag: '🇧🇷' }
  ];

  const regions = [
    { code: 'US', name: 'United States', currency: 'USD' },
    { code: 'EU', name: 'European Union', currency: 'EUR' },
    { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
    { code: 'JP', name: 'Japan', currency: 'JPY' },
    { code: 'KR', name: 'South Korea', currency: 'KRW' },
    { code: 'CN', name: 'China', currency: 'CNY' },
    { code: 'IN', name: 'India', currency: 'INR' },
    { code: 'AU', name: 'Australia', currency: 'AUD' }
  ];

  const timezones = [
    { value: 'America/New_York', label: 'Eastern Time (ET)' },
    { value: 'America/Chicago', label: 'Central Time (CT)' },
    { value: 'America/Denver', label: 'Mountain Time (MT)' },
    { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
    { value: 'Europe/London', label: 'Greenwich Mean Time (GMT)' },
    { value: 'Europe/Paris', label: 'Central European Time (CET)' },
    { value: 'Asia/Tokyo', label: 'Japan Standard Time (JST)' },
    { value: 'Asia/Seoul', label: 'Korea Standard Time (KST)' },
    { value: 'Asia/Shanghai', label: 'China Standard Time (CST)' },
    { value: 'Asia/Kolkata', label: 'India Standard Time (IST)' }
  ];

  const taxRegions = [
    { code: 'US', name: 'United States', description: 'IRS tax reporting requirements' },
    { code: 'CA', name: 'Canada', description: 'CRA tax reporting requirements' },
    { code: 'GB', name: 'United Kingdom', description: 'HMRC tax reporting requirements' },
    { code: 'DE', name: 'Germany', description: 'German tax reporting requirements' },
    { code: 'AU', name: 'Australia', description: 'ATO tax reporting requirements' },
    { code: 'JP', name: 'Japan', description: 'Japanese tax reporting requirements' },
    { code: 'OTHER', name: 'Other/Not Listed', description: 'Generic tax reporting format' }
  ];

  useEffect(() => {
    // Load language preference from localStorage
    const savedLanguage = localStorage.getItem('selectedLanguage');
    if (savedLanguage) {
      setCurrentLanguage(savedLanguage);
      setLocalizationSettings(prev => ({ ...prev, language: savedLanguage }));
    }
  }, []);

  const handleLanguageChange = (languageCode) => {
    setCurrentLanguage(languageCode);
    setLocalizationSettings(prev => ({ ...prev, language: languageCode }));
    localStorage.setItem('selectedLanguage', languageCode);
    
    // Trigger language change event for other components
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: languageCode }));
  };

  const handleSettingChange = (key, value) => {
    setLocalizationSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSaveSettings = () => {
    localStorage.setItem('localizationSettings', JSON.stringify(localizationSettings));
    console.log('Localization settings saved:', localizationSettings);
  };

  const getLocalizedText = (key) => {
    const translations = {
      en: {
        welcome: 'Welcome to VoltIQ',
        portfolio: 'Your Portfolio',
        balance: 'Total Balance',
        transactions: 'Recent Transactions'
      },
      es: {
        welcome: 'Bienvenido a VoltIQ',
        portfolio: 'Tu Portafolio',
        balance: 'Saldo Total',
        transactions: 'Transacciones Recientes'
      },
      fr: {
        welcome: 'Bienvenue sur VoltIQ',
        portfolio: 'Votre Portefeuille',
        balance: 'Solde Total',
        transactions: 'Transactions Récentes'
      },
      de: {
        welcome: 'Willkommen bei VoltIQ',
        portfolio: 'Ihr Portfolio',
        balance: 'Gesamtsaldo',
        transactions: 'Letzte Transaktionen'
      },
      ja: {
        welcome: 'VoltIQへようこそ',
        portfolio: 'あなたのポートフォリオ',
        balance: '総残高',
        transactions: '最近の取引'
      },
      ko: {
        welcome: 'VoltIQ에 오신 것을 환영합니다',
        portfolio: '귀하의 포트폴리오',
        balance: '총 잔액',
        transactions: '최근 거래'
      },
      zh: {
        welcome: '欢迎使用VoltIQ',
        portfolio: '您的投资组合',
        balance: '总余额',
        transactions: '最近交易'
      }
    };

    return translations[currentLanguage]?.[key] || translations.en[key];
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-secondary transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon name="Globe" size={20} color="var(--color-secondary)" />
          <h3 className="text-lg font-semibold text-text-primary">Localization</h3>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-text-muted" 
        />
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-6">
          {/* Language Selection */}
          <div className="space-y-4">
            <h4 className="font-medium text-text-primary">Language</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    currentLanguage === language.code
                      ? 'border-primary bg-primary-50 text-primary' :'border-border hover:border-border-dark text-text-secondary'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{language.flag}</span>
                    <div>
                      <p className="font-medium">{language.name}</p>
                      <p className="text-xs opacity-70">{language.code.toUpperCase()}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Language Preview */}
          <div className="p-4 bg-surface-secondary rounded-lg">
            <h5 className="font-medium text-text-primary mb-3">Preview</h5>
            <div className="space-y-2 text-sm">
              <p className="text-text-primary">{getLocalizedText('welcome')}</p>
              <p className="text-text-secondary">{getLocalizedText('portfolio')}</p>
              <p className="text-text-secondary">{getLocalizedText('balance')}: $124,567.89</p>
              <p className="text-text-secondary">{getLocalizedText('transactions')}</p>
            </div>
          </div>

          {/* Region Selection */}
          <div className="space-y-4">
            <h4 className="font-medium text-text-primary">Region</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {regions.map((region) => (
                <button
                  key={region.code}
                  onClick={() => handleSettingChange('region', region.code)}
                  className={`p-3 rounded-lg border text-left transition-all ${
                    localizationSettings.region === region.code
                      ? 'border-primary bg-primary-50' :'border-border hover:border-border-dark'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${
                        localizationSettings.region === region.code ? 'text-primary' : 'text-text-primary'
                      }`}>
                        {region.name}
                      </p>
                      <p className="text-sm text-text-muted">Currency: {region.currency}</p>
                    </div>
                    {localizationSettings.region === region.code && (
                      <Icon name="Check" size={16} color="var(--color-primary)" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Timezone Selection */}
          <div className="space-y-4">
            <h4 className="font-medium text-text-primary">Timezone</h4>
            <select
              value={localizationSettings.timezone}
              onChange={(e) => handleSettingChange('timezone', e.target.value)}
              className="w-full p-3 border border-border rounded-lg bg-surface text-text-primary"
            >
              {timezones.map((timezone) => (
                <option key={timezone.value} value={timezone.value}>
                  {timezone.label}
                </option>
              ))}
            </select>
            <p className="text-sm text-text-muted">
              Current time: {new Date().toLocaleString('en-US', { 
                timeZone: localizationSettings.timezone,
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>

          {/* Tax Region */}
          <div className="space-y-4">
            <h4 className="font-medium text-text-primary">Tax Reporting Region</h4>
            <p className="text-sm text-text-muted">
              Select your tax jurisdiction for accurate reporting and compliance
            </p>
            <div className="space-y-2">
              {taxRegions.map((region) => (
                <button
                  key={region.code}
                  onClick={() => handleSettingChange('taxRegion', region.code)}
                  className={`w-full p-3 rounded-lg border text-left transition-all ${
                    localizationSettings.taxRegion === region.code
                      ? 'border-primary bg-primary-50' :'border-border hover:border-border-dark'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${
                        localizationSettings.taxRegion === region.code ? 'text-primary' : 'text-text-primary'
                      }`}>
                        {region.name}
                      </p>
                      <p className="text-sm text-text-muted">{region.description}</p>
                    </div>
                    {localizationSettings.taxRegion === region.code && (
                      <Icon name="Check" size={16} color="var(--color-primary)" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Compliance Information */}
          <div className="p-4 bg-warning-50 border border-warning-100 rounded-lg">
            <div className="flex items-start gap-3">
              <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />
              <div>
                <h5 className="font-medium text-warning mb-1">Compliance Notice</h5>
                <p className="text-sm text-warning">
                  Tax regulations vary by jurisdiction. Please consult with a tax professional 
                  for advice specific to your situation. VoltIQ provides tools for tracking 
                  but does not provide tax advice.
                </p>
              </div>
            </div>
          </div>

          {/* Save Settings */}
          <div className="flex justify-end pt-4 border-t border-border">
            <Button
              variant="primary"
              onClick={handleSaveSettings}
              iconName="Save"
              iconPosition="left"
            >
              Save Localization Settings
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalizationSettings;