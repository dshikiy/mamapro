'use client';

import React, { useState } from 'react';
import { Button } from '../shared/Button';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onSuccess?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      if (response.data.success) {
        login(response.data.data.user, response.data.data.token);
        if (onSuccess) onSuccess();
        else router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
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

      <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full">
        Sign In
      </Button>
    </form>
  );
};
