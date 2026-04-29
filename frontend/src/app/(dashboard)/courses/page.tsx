'use client';

import React, { useState } from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { CourseCategoryFilter } from '@/components/courses/CourseCategoryFilter';
import { CourseCard } from '@/components/courses/CourseCard';
import { Course } from '@/types';

const MOCK_COURSES: Course[] = [
  {
    id: '1',
    title: 'Understanding Postpartum Depression',
    description: 'Learn about PPD symptoms and coping strategies',
    category: 'postpartum',
    lessons: [{ id: '1', title: 'Intro', description: 'Learn basics', youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ', duration: 5, order: 1 }],
    instructor: 'Dr. Sarah Smith',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    duration: 45,
  },
  {
    id: '2',
    title: 'Positive Parenting Techniques',
    description: 'Practical strategies for effective parenting',
    category: 'parenting',
    lessons: [{ id: '1', title: 'Intro', description: 'Learn basics', youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ', duration: 10, order: 1 }],
    instructor: 'Dr. John Doe',
    image: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=400&h=300&fit=crop',
    duration: 60,
  },
  {
    id: '3',
    title: 'Stress Management 101',
    description: 'Reduce stress with proven techniques',
    category: 'stress',
    lessons: [{ id: '1', title: 'Intro', description: 'Learn basics', youtubeUrl: 'https://youtu.be/dQw4w9WgXcQ', duration: 15, order: 1 }],
    instructor: 'Dr. Emma Johnson',
    image: 'https://images.unsplash.com/photo-1493514789560-586cb221d7f7?w=400&h=300&fit=crop',
    duration: 50,
  },
];

export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [courses, setCourses] = useState(MOCK_COURSES);

  const filteredCourses = selectedCategory === 'all' ? courses : courses.filter(c => c.category === selectedCategory);

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold text-dark-text mb-2">Video Courses</h1>
              <p className="text-warm-gray">Learn from experts at your own pace</p>
            </div>

            {/* Categories */}
            <CourseCategoryFilter onCategoryChange={setSelectedCategory} />
          </div>

          {/* Courses Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
