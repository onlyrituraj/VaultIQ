import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import AccountSettings from './components/AccountSettings';
import DisplayPreferences from './components/DisplayPreferences';
import NotificationSettings from './components/NotificationSettings';
import PrivacySecurity from './components/PrivacySecurity';
import LocalizationSettings from './components/LocalizationSettings';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SettingsProfileManagement = () => {
  const [expandedSections, setExpandedSections] = useState({
    account: true,
    display: false,
    notifications: false,
    privacy: false,
    localization: false
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('account');

  const sections = [
    {
      id: 'account',
      title: 'Account Settings',
      icon: 'User',
      description: 'Profile information and account management'
    },
    {
      id: 'display',
      title: 'Display Preferences',
      icon: 'Palette',
      description: 'Theme, currency, and dashboard customization'
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      icon: 'Bell',
      description: 'Price alerts and communication preferences'
    },
    {
      id: 'privacy',
      title: 'Privacy & Security',
      icon: 'Shield',
      description: 'Wallet connections and data management'
    },
    {
      id: 'localization',
      title: 'Localization',
      icon: 'Globe',
      description: 'Language, region, and tax settings'
    }
  ];

  const handleSectionToggle = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleSectionClick = (sectionId) => {
    setActiveSection(sectionId);
    setExpandedSections(prev => ({
      ...Object.keys(prev).reduce((acc, key) => ({ ...acc, [key]: false }), {}),
      [sectionId]: true
    }));
    setSidebarOpen(false);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 pb-20 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary">Settings</h1>
                <p className="text-text-secondary mt-2">
                  Manage your account preferences and customize your CryptoFolio experience
                </p>
              </div>
              
              {/* Mobile Menu Toggle */}
              <Button
                variant="outline"
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                iconName="Menu"
              />
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => {
                        handleSectionClick(section.id);
                        scrollToSection(section.id);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                        activeSection === section.id
                          ? 'bg-primary-50 text-primary border border-primary-200' :'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                      }`}
                    >
                      <Icon 
                        name={section.icon} 
                        size={20} 
                        color={activeSection === section.id ? 'var(--color-primary)' : 'currentColor'} 
                      />
                      <div>
                        <p className="font-medium">{section.title}</p>
                        <p className="text-xs opacity-70">{section.description}</p>
                      </div>
                    </button>
                  ))}
                </nav>

                {/* Quick Actions */}
                <div className="mt-8 p-4 bg-surface border border-border rounded-lg">
                  <h3 className="font-medium text-text-primary mb-3">Quick Actions</h3>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start" iconName="Download">
                      Export Data
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start" iconName="RefreshCw">
                      Reset Settings
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start" iconName="HelpCircle">
                      Get Help
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <div className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50" onClick={() => setSidebarOpen(false)}>
                <div className="fixed left-0 top-0 bottom-0 w-80 bg-surface p-6 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-text-primary">Settings Menu</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSidebarOpen(false)}
                      iconName="X"
                    />
                  </div>
                  
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => {
                          handleSectionClick(section.id);
                          scrollToSection(section.id);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                          activeSection === section.id
                            ? 'bg-primary-50 text-primary border border-primary-200' :'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
                        }`}
                      >
                        <Icon 
                          name={section.icon} 
                          size={20} 
                          color={activeSection === section.id ? 'var(--color-primary)' : 'currentColor'} 
                        />
                        <div>
                          <p className="font-medium">{section.title}</p>
                          <p className="text-xs opacity-70">{section.description}</p>
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Account Settings */}
              <div id="section-account">
                <AccountSettings
                  isExpanded={expandedSections.account}
                  onToggle={() => handleSectionToggle('account')}
                />
              </div>

              {/* Display Preferences */}
              <div id="section-display">
                <DisplayPreferences
                  isExpanded={expandedSections.display}
                  onToggle={() => handleSectionToggle('display')}
                />
              </div>

              {/* Notification Settings */}
              <div id="section-notifications">
                <NotificationSettings
                  isExpanded={expandedSections.notifications}
                  onToggle={() => handleSectionToggle('notifications')}
                />
              </div>

              {/* Privacy & Security */}
              <div id="section-privacy">
                <PrivacySecurity
                  isExpanded={expandedSections.privacy}
                  onToggle={() => handleSectionToggle('privacy')}
                />
              </div>

              {/* Localization Settings */}
              <div id="section-localization">
                <LocalizationSettings
                  isExpanded={expandedSections.localization}
                  onToggle={() => handleSectionToggle('localization')}
                />
              </div>

              {/* Save All Changes */}
              <div className="flex justify-end pt-6 border-t border-border">
                <div className="flex gap-3">
                  <Button variant="outline">
                    Reset All Settings
                  </Button>
                  <Button variant="primary" iconName="Save" iconPosition="left">
                    Save All Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsProfileManagement;