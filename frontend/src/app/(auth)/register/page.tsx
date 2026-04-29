'use client';

import React from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { RegisterForm } from '@/components/auth/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-dark-text mb-2">Join Our Community</h1>
            <p className="text-warm-gray">Create an account to get started</p>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-xl shadow-soft border border-beige p-8 space-y-6">
            <RegisterForm />

            {/* Sign In Link */}
            <p className="text-center text-warm-gray">
              Already have an account?{' '}
              <Link href="/login" className="text-accent-pink hover:text-accent-purple font-semibold transition">
                Sign in
              </Link>
            </p>
          </div>

          {/* Info */}
          <div className="mt-8 p-6 bg-white rounded-xl shadow-soft border border-beige space-y-3">
            <h3 className="font-semibold text-dark-text">By joining, you get:</h3>
            <ul className="space-y-2 text-sm text-warm-gray">
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Access to specialist network</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Curated video courses</span>
              </li>
              <li className="flex items-center space-x-2">
                <svg className="w-5 h-5 text-sage" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Community support & resources</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
