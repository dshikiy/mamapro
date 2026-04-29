'use client';

import React from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { SpecialistList } from '@/components/specialists/SpecialistList';
import { Search, Filter } from 'lucide-react';

export default function SpecialistsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-dark-text mb-2">Our Specialists</h1>
              <p className="text-warm-gray">Connect with experienced professionals who understand your journey</p>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3.5 text-warm-gray" size={20} />
                <input
                  type="text"
                  placeholder="Search by specialty or name..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-beige rounded-lg focus:border-accent-pink focus:outline-none transition"
                />
              </div>
              <button className="px-6 py-3 border-2 border-beige rounded-lg hover:border-accent-pink transition flex items-center justify-center space-x-2 font-medium text-dark-text">
                <Filter size={20} />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Specialists Grid */}
          <SpecialistList />
        </div>
      </div>

      <Footer />
    </div>
  );
}
