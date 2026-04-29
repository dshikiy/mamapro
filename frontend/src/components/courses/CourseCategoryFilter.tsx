'use client';

import React, { useState } from 'react';
import { Button } from '../shared/Button';

const categories = [
  { id: 'all', label: '🌟 All', count: 24 },
  { id: 'parenting', label: '👶 Parenting', count: 8 },
  { id: 'psychology', label: '🧠 Psychology', count: 7 },
  { id: 'postpartum', label: '💝 Postpartum', count: 5 },
  { id: 'stress', label: '🧘 Stress', count: 2 },
  { id: 'relationships', label: '❤️ Relationships', count: 2 },
];

interface CourseCategoryFilterProps {
  onCategoryChange?: (category: string) => void;
}

export const CourseCategoryFilter: React.FC<CourseCategoryFilterProps> = ({ onCategoryChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleSelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    if (onCategoryChange) onCategoryChange(categoryId);
  };

  return (
    <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => handleSelect(category.id)}
          className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition flex items-center space-x-2 ${
            selectedCategory === category.id
              ? 'bg-accent-pink text-white shadow-soft'
              : 'bg-lavender text-dark-text hover:bg-soft-pink'
          }`}
        >
          <span>{category.label}</span>
          <span className="text-xs opacity-75">({category.count})</span>
        </button>
      ))}
    </div>
  );
};
