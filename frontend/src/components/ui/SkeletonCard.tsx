'use client';

import React from 'react';

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => {
  return (
    <div className={`bg-white rounded-3xl p-5 shadow-card border border-beige ${className}`}>
      <div className="flex gap-4">
        <div className="skeleton w-20 h-20 rounded-2xl flex-shrink-0" />
        <div className="flex-1 space-y-3 pt-1">
          <div className="skeleton h-4 w-3/4 rounded-lg" />
          <div className="skeleton h-3 w-1/2 rounded-lg" />
          <div className="flex gap-2">
            <div className="skeleton h-5 w-16 rounded-full" />
            <div className="skeleton h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>
      <div className="skeleton h-11 w-full rounded-xl mt-5" />
    </div>
  );
};

export const SkeletonSpecialist: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map(i => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export const SkeletonMarketplaceGrid: React.FC = () => (
  <div className="grid grid-cols-2 gap-3">
    {[1, 2, 3, 4].map(i => (
      <div key={i} className="bg-white rounded-3xl p-3 shadow-card border border-beige">
        <div className="skeleton w-full aspect-square rounded-2xl mb-3" />
        <div className="skeleton h-3 w-4/5 rounded-lg mb-2" />
        <div className="skeleton h-4 w-2/5 rounded-lg" />
      </div>
    ))}
  </div>
);

export const SkeletonMarathonCard: React.FC = () => (
  <div className="bg-white rounded-3xl p-5 shadow-card border border-beige space-y-4">
    <div className="skeleton h-36 w-full rounded-2xl" />
    <div className="skeleton h-4 w-3/5 rounded-lg" />
    <div className="skeleton h-3 w-full rounded-lg" />
    <div className="skeleton h-3 w-4/5 rounded-lg" />
    <div className="flex justify-between">
      <div className="skeleton h-5 w-20 rounded-full" />
      <div className="skeleton h-9 w-28 rounded-xl" />
    </div>
  </div>
);

export const SkeletonProfileRow: React.FC = () => (
  <div className="space-y-3">
    {[1, 2, 3].map(i => (
      <div key={i} className="bg-white rounded-2xl p-4 shadow-card border border-beige flex items-center gap-4">
        <div className="skeleton w-10 h-10 rounded-full" />
        <div className="skeleton h-4 w-1/2 rounded-lg" />
      </div>
    ))}
  </div>
);
