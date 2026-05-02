'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', { name, email, password });
      if (response.data.success) {
        login(response.data.data.user, response.data.data.token);
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Произошла ошибка при регистрации');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex flex-col px-6 py-8">
      {/* Back Button */}
      <button onClick={() => router.back()} className="w-10 h-10 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 hover:bg-beige transition">
        <ArrowLeft size={20} className="text-dark-text" />
      </button>

      <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-dark-text mb-2">Создать аккаунт ✨</h1>
          <p className="text-warm-gray text-sm">Присоединяйтесь к платформе поддержки мам</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {error && (
            <div className="bg-rose-light/30 text-rose-dark px-4 py-3 rounded-2xl text-sm font-semibold border border-rose/30">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-medium-gray uppercase tracking-wider mb-2 block">Имя</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={18} className="text-warm-gray" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full bg-white pl-11 pr-4 py-3.5 rounded-2xl outline-none border-2 border-transparent focus:border-sage text-sm text-dark-text placeholder:text-warm-gray shadow-sm transition"
                placeholder="Как к вам обращаться?"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-medium-gray uppercase tracking-wider mb-2 block">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={18} className="text-warm-gray" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white pl-11 pr-4 py-3.5 rounded-2xl outline-none border-2 border-transparent focus:border-sage text-sm text-dark-text placeholder:text-warm-gray shadow-sm transition"
                placeholder="ваша@почта.kz"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-medium-gray uppercase tracking-wider mb-2 block">Пароль</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={18} className="text-warm-gray" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-white pl-11 pr-12 py-3.5 rounded-2xl outline-none border-2 border-transparent focus:border-sage text-sm text-dark-text placeholder:text-warm-gray shadow-sm transition"
                placeholder="Минимум 6 символов"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center"
              >
                {showPassword ? <EyeOff size={18} className="text-warm-gray hover:text-dark-text" /> : <Eye size={18} className="text-warm-gray hover:text-dark-text" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email || !password || !name}
            className="w-full bg-sage text-white font-bold py-4 rounded-2xl mt-6 disabled:opacity-50 hover:bg-sage-dark transition shadow-warm active:scale-[0.98]"
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <p className="text-center text-sm text-warm-gray mt-8 font-medium">
          Уже есть аккаунт?{' '}
          <Link href="/login" className="text-sage-dark font-bold hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
}
