'use client';

import React from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { ListingCard } from '@/components/marketplace/ListingCard';
import { Listing } from '@/types';
import { Button } from '@/components/shared/Button';
import { Plus, Search, Filter } from 'lucide-react';

const MOCK_LISTINGS: Listing[] = [
  {
    id: '1',
    userId: 'user1',
    title: 'Gently used stroller',
    description: 'Perfect condition, barely used',
    category: 'Baby Gear',
    image: 'https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=400&h=300&fit=crop',
    price: 150,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    userId: 'user2',
    title: 'Maternity clothing set',
    description: 'Size M, excellent condition',
    category: 'Clothing',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=300&fit=crop',
    price: 80,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '3',
    userId: 'user3',
    title: 'Baby monitor with video',
    description: 'Smart connectivity, night vision',
    category: 'Electronics',
    image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=400&h=300&fit=crop',
    price: 120,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
  {
    id: '4',
    userId: 'user4',
    title: 'Organic baby books',
    description: 'Set of 5 educational books',
    category: 'Books',
    image: 'https://images.unsplash.com/photo-1507842217343-583cfbb8d2b7?w=400&h=300&fit=crop',
    price: 45,
    status: 'active',
    createdAt: new Date().toISOString(),
  },
];

export default function MarketplacePage() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-dark-text mb-2">Marketplace</h1>
                <p className="text-warm-gray">Buy and sell items with our community</p>
              </div>
              <Button variant="primary" size="md" className="space-x-2">
                <Plus size={20} />
                <span>Sell Item</span>
              </Button>
            </div>

            {/* Search & Filter */}
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3.5 text-warm-gray" size={20} />
                <input
                  type="text"
                  placeholder="Search items..."
                  className="w-full pl-12 pr-4 py-3 border-2 border-beige rounded-lg focus:border-accent-pink focus:outline-none transition"
                />
              </div>
              <button className="px-6 py-3 border-2 border-beige rounded-lg hover:border-accent-pink transition flex items-center justify-center space-x-2 font-medium text-dark-text">
                <Filter size={20} />
                <span>Filter</span>
              </button>
            </div>
          </div>

          {/* Listings Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {MOCK_LISTINGS.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
