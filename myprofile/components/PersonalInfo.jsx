"use client"

import { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const PersonalInfo = ({ addNotification, status, profileData, setProfileData }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState({...profileData});

  const getStatusDisplay = () => {
    switch(status) {
      case 'offline':
        return { text: 'offline', color: 'bg-gray-500' };
      case 'dnd':
        return { text: 'do not disturb', color: 'bg-red-500' };
      default:
        return { text: 'online', color: 'bg-green-500' };
    }
  };

  const statusInfo = getStatusDisplay();

  const handleEdit = () => {
    setOriginalData({...profileData});
    setIsEditing(true);
  };

  const handleSave = () => {
    const changes = [];
    if (profileData.name !== originalData.name) changes.push('name');
    if (profileData.title !== originalData.title) changes.push('title');
    if (profileData.email !== originalData.email) changes.push('email');
    if (profileData.phone !== originalData.phone) changes.push('phone');
    if (profileData.birthday !== originalData.birthday) changes.push('birthday');
    if (profileData.location !== originalData.location) changes.push('location');

    setIsEditing(false);
    if (changes.length > 0) {
      addNotification('profile', `Profile updated: ${changes.join(', ')} changed`);
    }
  };

  const handleCancel = () => {
    setProfileData({...originalData});
    setIsEditing(false);
  };

  return (
    <div className="flex-1 p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Personal Information</h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleCancel}
                className="bg-gray-300 text-black px-6 py-2 rounded-lg font-medium hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="bg-cyan-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-cyan-500 transition-colors"
              >
                Save Profile
              </button>
            </>
          ) : (
            <button 
              onClick={handleEdit}
              className="bg-cyan-400 text-black px-6 py-2 rounded-lg font-medium hover:bg-cyan-500 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-8 shadow-sm">
        <div className="flex gap-8">
          <div className="flex-shrink-0">
            <div className="w-48 h-48 bg-gradient-to-br from-cyan-300 to-cyan-500 rounded-full flex items-center justify-center shadow-lg">
              <svg width="96" height="96" viewBox="0 0 96 96" fill="none">
                <rect x="24" y="32" width="48" height="40" rx="4" stroke="black" strokeWidth="3" fill="none"/>
                <circle cx="36" cy="44" r="4" fill="black"/>
                <path d="M24 56 L40 68 L72 40" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="text-3xl font-bold border-b-2 border-cyan-400 focus:outline-none"
                />
              ) : (
                <h3 className="text-3xl font-bold">{profileData.name}</h3>
              )}
              <span className="flex items-center gap-1 text-gray-600 text-sm">
                <span className={`w-2 h-2 ${statusInfo.color} rounded-full`}></span>
                {statusInfo.text}
              </span>
            </div>
            
            {isEditing ? (
              <input
                type="text"
                value={profileData.title}
                onChange={(e) => setProfileData({ ...profileData, title: e.target.value })}
                className="text-gray-400 mb-8 border-b border-gray-300 focus:outline-none focus:border-cyan-400"
              />
            ) : (
              <p className="text-gray-400 mb-8">{profileData.title}</p>
            )}
            
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <Mail className="text-gray-400 mt-1" size={20} />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Email</p>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      className="text-gray-600 w-full border-b border-gray-300 focus:outline-none focus:border-cyan-400"
                    />
                  ) : (
                    <p className="text-gray-600">{profileData.email}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Phone className="text-gray-400 mt-1" size={20} />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Phone</p>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      className="text-gray-600 w-full border-b border-gray-300 focus:outline-none focus:border-cyan-400"
                    />
                  ) : (
                    <p className="text-gray-600">{profileData.phone}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <svg className="text-gray-400 mt-1" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="14" height="14" rx="2"/>
                  <path d="M3 8h14M7 2v4M13 2v4"/>
                </svg>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Birthday</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.birthday}
                      onChange={(e) => setProfileData({ ...profileData, birthday: e.target.value })}
                      className="text-gray-600 w-full border-b border-gray-300 focus:outline-none focus:border-cyan-400"
                    />
                  ) : (
                    <p className="text-gray-600">{profileData.birthday}</p>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="text-gray-400 mt-1" size={20} />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Location</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.location}
                      onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                      className="text-gray-600 w-full border-b border-gray-300 focus:outline-none focus:border-cyan-400"
                    />
                  ) : (
                    <p className="text-gray-600">{profileData.location}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalInfo;
