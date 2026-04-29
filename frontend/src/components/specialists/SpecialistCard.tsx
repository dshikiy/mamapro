'use client';

import React from 'react';
import { Specialist } from '@/types';
import { Star, Video, MessageCircle } from 'lucide-react';
import { Button } from '../shared/Button';
import Link from 'next/link';

interface SpecialistCardProps {
  specialist: Specialist;
  onBook?: () => void;
}

export const SpecialistCard: React.FC<SpecialistCardProps> = ({ specialist, onBook }) => {
  return (
    <div className="bg-white rounded-xl shadow-soft hover:shadow-warm transition border border-beige overflow-hidden group">
      {/* Avatar */}
      <div className="h-48 bg-gradient-to-br from-lavender to-soft-pink relative overflow-hidden">
        <img
          src={specialist.avatar}
          alt={specialist.name}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-dark-text">{specialist.name}</h3>
          <p className="text-sm text-warm-gray">{specialist.title}</p>
        </div>

        <p className="text-sm text-warm-gray line-clamp-2">{specialist.bio}</p>

        {/* Rating */}
        <div className="flex items-center space-x-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={i < Math.floor(specialist.rating) ? 'fill-accent-pink text-accent-pink' : 'text-beige'}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-dark-text">{specialist.rating.toFixed(1)}</span>
        </div>

        {/* Price */}
        <div className="text-lg font-semibold text-accent-pink">${specialist.price}/session</div>

        {/* Availability */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-dark-text uppercase tracking-wider">Available</p>
          <div className="flex flex-wrap gap-2">
            {specialist.availability.slice(0, 2).map((slot, idx) => (
              <div key={idx} className="text-xs px-2 py-1 bg-lavender rounded-full text-dark-text">
                {slot.day}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2 border-t border-beige">
          <Button variant="primary" size="sm" className="flex-1" onClick={onBook}>
            <Video size={16} />
            <span>Book</span>
          </Button>
          <Button variant="outline" size="sm" className="flex-1">
            <MessageCircle size={16} />
            <span>Chat</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
