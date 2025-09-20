'use client';

import { useState } from 'react';
import { X, User, ShoppingBag, Building, MapPin, Globe } from 'lucide-react';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelected: (role: 'Buyer' | 'Seller', profileData?: any) => void;
  userInfo: {
    name: string;
    email: string;
    avatar?: string;
  };
}

export default function RoleSelectionModal({ 
  isOpen, 
  onClose, 
  onRoleSelected, 
  userInfo 
}: RoleSelectionModalProps) {
  const [selectedRole, setSelectedRole] = useState<'Buyer' | 'Seller'>('Buyer');
  const [profileData, setProfileData] = useState({
    company: '',
    bio: '',
    location: '',
    website: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onRoleSelected(selectedRole, profileData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              {userInfo.avatar && (
                <img 
                  src={userInfo.avatar} 
                  alt={userInfo.name}
                  className="w-12 h-12 rounded-full"
                />
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Welcome, {userInfo.name}!
                </h2>
                <p className="text-sm text-gray-600">{userInfo.email}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              How would you like to use Sellables?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className={`relative flex cursor-pointer rounded-lg p-4 border-2 transition-colors ${
                selectedRole === 'Buyer' 
                  ? 'border-green-500 bg-green-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="Buyer"
                  checked={selectedRole === 'Buyer'}
                  onChange={(e) => setSelectedRole(e.target.value as 'Buyer')}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <ShoppingBag className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Buy Research</div>
                    <div className="text-sm text-gray-500">Purchase product insights and research</div>
                  </div>
                </div>
              </label>

              <label className={`relative flex cursor-pointer rounded-lg p-4 border-2 transition-colors ${
                selectedRole === 'Seller' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="role"
                  value="Seller"
                  checked={selectedRole === 'Seller'}
                  onChange={(e) => setSelectedRole(e.target.value as 'Seller')}
                  className="sr-only"
                />
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Sell Research</div>
                    <div className="text-sm text-gray-500">List your product research and insights</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Profile Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Complete Your Profile</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    className="input pl-10"
                    placeholder="Your company name"
                    value={profileData.company}
                    onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    className="input pl-10"
                    placeholder="City, Country"
                    value={profileData.location}
                    onChange={(e) => setProfileData(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                Website
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Globe className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="website"
                  name="website"
                  type="url"
                  className="input pl-10"
                  placeholder="https://yourwebsite.com"
                  value={profileData.website}
                  onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={3}
                className="input"
                placeholder="Tell us about yourself..."
                value={profileData.bio}
                onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="btn btn-primary flex items-center"
            >
              {isSubmitting ? (
                <>
                  <div className="spinner w-4 h-4 mr-2" />
                  Creating Account...
                </>
              ) : (
                'Complete Setup'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
