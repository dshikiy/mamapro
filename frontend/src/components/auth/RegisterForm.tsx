'use client';

import React, { useState } from 'react';
import { Button } from '../shared/Button';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      if (response.data.success) {
        login(response.data.data.user, response.data.data.token);
        if (onSuccess) onSuccess();
        else router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-4 bg-soft-pink border border-accent-pink rounded-lg text-accent-pink text-sm">
          {error}
        </div>
      )}

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-dark-text mb-2">Full Name</label>
        <div className="relative">
          <User className="absolute left-3 top-3 text-warm-gray" size={20} />
          <input
            type="text"
            required
            className="w-full pl-10 pr-4 py-3 border-2 border-beige rounded-lg focus:border-accent-pink focus:outline-none transition"
            placeholder="Your full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-dark-text mb-2">Email</label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-warm-gray" size={20} />
          <input
            type="email"
            required
            className="w-full pl-10 pr-4 py-3 border-2 border-beige rounded-lg focus:border-accent-pink focus:outline-none transition"
            placeholder="your@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium text-dark-text mb-2">Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-warm-gray" size={20} />
          <input
            type={showPassword ? 'text' : 'password'}
            required
            className="w-full pl-10 pr-10 py-3 border-2 border-beige rounded-lg focus:border-accent-pink focus:outline-none transition"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 text-warm-gray hover:text-accent-pink transition"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium text-dark-text mb-2">Confirm Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-warm-gray" size={20} />
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            required
            className="w-full pl-10 pr-10 py-3 border-2 border-beige rounded-lg focus:border-accent-pink focus:outline-none transition"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 text-warm-gray hover:text-accent-pink transition"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full">
        Create Account
      </Button>
    </form>
  );
};
