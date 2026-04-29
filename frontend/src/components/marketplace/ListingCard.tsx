'use client';

import React from 'react';
import { Listing } from '@/types';
import { ShoppingBag, Heart } from 'lucide-react';
import { Button } from '../shared/Button';
import { format } from 'date-fns';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  return (
    <div className="bg-white rounded-xl shadow-soft border border-beige overflow-hidden hover:shadow-warm transition group">
      {/* Image */}
      <div className="h-40 bg-gradient-to-br from-lavender to-soft-pink relative overflow-hidden">
        <img
          src={listing.image}
          alt={listing.title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-soft hover:bg-soft-pink transition">
          <Heart size={18} className="text-accent-pink" />
        </button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="inline-block px-2 py-1 bg-lavender rounded-full text-xs font-medium text-dark-text">
          {listing.category}
        </div>

        <h3 className="font-semibold text-dark-text line-clamp-2">{listing.title}</h3>
        <p className="text-sm text-warm-gray line-clamp-2">{listing.description}</p>

        {listing.price && (
          <p className="text-lg font-semibold text-accent-pink">${listing.price}</p>
        )}

        <p className="text-xs text-warm-gray">{format(new Date(listing.createdAt), 'MMM d, yyyy')}</p>

        <Button variant="secondary" size="sm" className="w-full">
          <ShoppingBag size={16} />
          <span>View Details</span>
        </Button>
      </div>
    </div>
  );
};
