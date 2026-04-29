'use client';

import React, { useState } from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/shared/Button';
import { Mail, Phone, MapPin, Edit2, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleSave = () => {
    // Save to backend
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-soft border border-beige p-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-dark-text">My Profile</h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 hover:bg-beige rounded-lg transition"
              >
                <Edit2 size={20} className="text-accent-pink" />
              </button>
            </div>

            {/* Avatar & Basic Info */}
            <div className="flex items-center space-x-6 pb-8 border-b border-beige">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-lavender to-soft-pink flex items-center justify-center">
                <span className="text-3xl font-bold text-accent-pink">{user?.name?.[0] || 'M'}</span>
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-dark-text">{user?.name}</h2>
                <p className="text-warm-gray mb-3 capitalize">
                  {user?.subscription} Plan Member
                </p>
                <div className="inline-block px-3 py-1 bg-lavender rounded-full text-xs font-medium text-dark-text">
                  {user?.role}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Full Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-accent-pink focus:outline-none transition disabled:bg-cream"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-warm-gray" size={20} />
                  <input
                    type="email"
                    disabled={!isEditing}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border-2 border-beige rounded-lg focus:border-accent-pink focus:outline-none transition disabled:bg-cream"
                  />
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">Bio</label>
                <textarea
                  disabled={!isEditing}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-accent-pink focus:outline-none transition disabled:bg-cream resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-beige">
              {isEditing && (
                <>
                  <Button variant="outline" size="md" className="flex-1" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" size="md" className="flex-1" onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              )}
              {!isEditing && (
                <Button variant="soft" size="md" className="w-full" onClick={() => setIsEditing(true)}>
                  <Edit2 size={18} />
                  <span>Edit Profile</span>
                </Button>
              )}
            </div>
          </div>

          {/* Subscription */}
          <div className="mt-8 bg-white rounded-xl shadow-soft border border-beige p-8">
            <h2 className="text-xl font-bold text-dark-text mb-6">Subscription</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-warm-gray">Current Plan</span>
                <span className="font-semibold text-dark-text capitalize">{user?.subscription}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-warm-gray">Next billing</span>
                <span className="font-semibold text-dark-text">March 15, 2024</span>
              </div>
              <Button variant="secondary" size="md" className="w-full">
                Manage Subscription
              </Button>
            </div>
          </div>

          {/* Logout */}
          <div className="mt-8">
            <Button variant="outline" size="lg" className="w-full space-x-2 text-accent-pink border-accent-pink" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
