import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const AccountSettings = ({ isExpanded, onToggle }) => {
  const [profileData, setProfileData] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "Crypto enthusiast and portfolio manager with 5+ years of experience in digital assets.",
    location: "San Francisco, CA",
    website: "https://alexjohnson.crypto"
  });

  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  const handleProfileUpdate = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handlePasswordChange = () => {
    if (passwordData.new !== passwordData.confirm) {
      alert('New passwords do not match');
      return;
    }
    console.log('Changing password');
    setPasswordData({ current: '', new: '', confirm: '' });
    setShowPasswordChange(false);
  };

  return (
    <div className="bg-surface border border-border rounded-lg">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-surface-secondary transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon name="User" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-text-primary">Account Settings</h3>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-text-muted" 
        />
      </button>

      {isExpanded && (
        <div className="p-4 pt-0 space-y-6">
          {/* Profile Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-text-primary">Profile Information</h4>
            
            <div className="flex items-start gap-4">
              <div className="relative">
                <Image
                  src={profileData.avatar}
                  alt="Profile Avatar"
                  className="w-20 h-20 rounded-full object-cover"
                />
                <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                  <Icon name="Camera" size={12} color="white" />
                </button>
              </div>
              
              <div className="flex-1 space-y-3">
                {isEditing ? (
                  <>
                    <Input
                      type="text"
                      placeholder="Full Name"
                      value={profileData.name}
                      onChange={(e) => handleProfileUpdate('name', e.target.value)}
                    />
                    <Input
                      type="email"
                      placeholder="Email Address"
                      value={profileData.email}
                      onChange={(e) => handleProfileUpdate('email', e.target.value)}
                    />
                    <Input
                      type="text"
                      placeholder="Location"
                      value={profileData.location}
                      onChange={(e) => handleProfileUpdate('location', e.target.value)}
                    />
                    <Input
                      type="url"
                      placeholder="Website"
                      value={profileData.website}
                      onChange={(e) => handleProfileUpdate('website', e.target.value)}
                    />
                    <textarea
                      placeholder="Bio"
                      value={profileData.bio}
                      onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                      className="w-full p-3 border border-border rounded-lg resize-none h-20 text-sm"
                    />
                  </>
                ) : (
                  <div className="space-y-2">
                    <h5 className="font-medium text-text-primary">{profileData.name}</h5>
                    <p className="text-sm text-text-secondary">{profileData.email}</p>
                    <p className="text-sm text-text-muted">{profileData.location}</p>
                    <p className="text-sm text-text-secondary">{profileData.bio}</p>
                    {profileData.website && (
                      <a 
                        href={profileData.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {profileData.website}
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button variant="primary" onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Password Management */}
          <div className="space-y-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-text-primary">Password & Security</h4>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowPasswordChange(!showPasswordChange)}
              >
                Change Password
              </Button>
            </div>

            {showPasswordChange && (
              <div className="space-y-3 p-4 bg-surface-secondary rounded-lg">
                <Input
                  type="password"
                  placeholder="Current Password"
                  value={passwordData.current}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                />
                <Input
                  type="password"
                  placeholder="New Password"
                  value={passwordData.new}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                />
                <Input
                  type="password"
                  placeholder="Confirm New Password"
                  value={passwordData.confirm}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                />
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={handlePasswordChange}>
                    Update Password
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowPasswordChange(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Email Preferences */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="font-medium text-text-primary">Email Preferences</h4>
            <div className="space-y-3">
              {[
                { id: 'marketing', label: 'Marketing emails', description: 'Product updates and promotions' },
                { id: 'security', label: 'Security alerts', description: 'Login attempts and security notifications' },
                { id: 'portfolio', label: 'Portfolio updates', description: 'Weekly portfolio performance summaries' }
              ].map((pref) => (
                <div key={pref.id} className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg">
                  <div>
                    <p className="font-medium text-text-primary">{pref.label}</p>
                    <p className="text-sm text-text-muted">{pref.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked={pref.id === 'security'} />
                    <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountSettings;