'use client';

import React from 'react';

interface ProgressBarProps {
  completed: number;
  total: number;
  label?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ completed, total, label }) => {
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <span className="font-medium text-dark-text">{label}</span>
          <span className="text-sm font-semibold text-accent-pink">
            {completed}/{total}
          </span>
        </div>
      )}
      <div className="w-full h-3 bg-beige rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-pink to-accent-purple rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-warm-gray text-center">{percentage}% Complete</p>
    </div>
  );
};
