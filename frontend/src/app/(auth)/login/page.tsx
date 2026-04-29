'use client';

import React from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { LoginForm } from '@/components/auth/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-text mb-2">Welcome Back</h1>
            <p className="text-warm-gray">Sign in to your account to continue</p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-xl shadow-soft border border-beige p-8 space-y-6">
            <LoginForm />

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-beige"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-warm-gray">Or</span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="space-y-3">
              <button className="w-full py-3 border-2 border-beige rounded-lg hover:border-lavender transition flex items-center justify-center space-x-2 font-medium text-dark-text">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.868-.013-1.703-2.782.603-3.369-1.343-3.369-1.343-.454-1.156-1.11-1.463-1.11-1.463-.908-.620.069-.608.069-.608 1.003.070 1.531 1.032 1.531 1.032.892 1.530 2.341 1.888 2.909 1.442.092-1.120.350-1.887.636-2.320-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.390-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.650 0 0 .840-.270 2.750 1.025A9.578 9.578 0 0110 4.817c.85.004 1.705.114 2.504.336 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.100 2.651.640.700 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.180.578.688.480C17.137 18.193 20 14.440 20 10.017 20 4.484 15.522 0 10 0z"></path>
                </svg>
                <span>Continue with GitHub</span>
              </button>
              <button className="w-full py-3 border-2 border-beige rounded-lg hover:border-lavender transition flex items-center justify-center space-x-2 font-medium text-dark-text">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M19.6 10.23c0-.82-.15-1.42-.4-1.8H10v3.26h5.5c-.26 1.37-1.04 2.18-2.21 2.84v2.84h3.52c2.1-1.93 3.28-4.74 3.28-8.14z"></path>
                  <path d="M13.46 15.13c-.83.8-1.48 1.35-3.46 1.35-2.64 0-4.84-1.74-4.84-4.15 0-2.42 2.2-4.15 4.84-4.15 1.3 0 2.74.55 3.54 1.3l2.64-2.64c-1.3-1.3-4.04-2.8-6.18-2.8-4.95 0-8.92 3.97-8.92 8.92 0 4.95 3.97 8.92 8.92 8.92 3.48 0 5.9-1.4 7.68-4.34l-2.82-2.2z"></path>
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-warm-gray">
              Don't have an account?{' '}
              <Link href="/register" className="text-accent-pink hover:text-accent-purple font-semibold transition">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
