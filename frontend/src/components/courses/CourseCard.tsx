'use client';

import React from 'react';
import { Course } from '@/types';
import { Play, Clock, User } from 'lucide-react';
import { Button } from '../shared/Button';

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const categoryLabels = {
    parenting: '👶 Parenting',
    psychology: '🧠 Psychology',
    postpartum: '💝 Postpartum',
    stress: '🧘 Stress',
    relationships: '❤️ Relationships',
  };

  return (
    <div
      className="bg-white rounded-xl shadow-soft border border-beige overflow-hidden hover:shadow-warm transition cursor-pointer group"
      onClick={onClick}
    >
      {/* Image */}
      <div className="h-40 bg-gradient-to-br from-lavender to-soft-pink relative overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition flex items-center justify-center">
          <Play className="text-white fill-white" size={40} />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="inline-block px-3 py-1 bg-lavender rounded-full text-xs font-medium text-dark-text">
          {categoryLabels[course.category]}
        </div>

        <h3 className="font-semibold text-dark-text line-clamp-2">{course.title}</h3>
        <p className="text-sm text-warm-gray line-clamp-2">{course.description}</p>

        <div className="flex items-center justify-between text-xs text-warm-gray pt-3 border-t border-beige">
          <div className="flex items-center space-x-1">
            <Clock size={14} />
            <span>{course.duration} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Play size={14} />
            <span>{course.lessons.length} lessons</span>
          </div>
          <div className="flex items-center space-x-1">
            <User size={14} />
            <span className="truncate">{course.instructor}</span>
          </div>
        </div>

        <Button variant="secondary" size="sm" className="w-full">
          Start Course
        </Button>
      </div>
    </div>
  );
};
