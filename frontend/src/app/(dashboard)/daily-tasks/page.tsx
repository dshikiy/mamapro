'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { TaskItem } from '@/components/daily-tasks/TaskItem';
import { ProgressBar } from '@/components/daily-tasks/ProgressBar';
import { DailyTask } from '@/types';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';
import { Button } from '@/components/shared/Button';

const MOCK_TASKS: DailyTask[] = [
  {
    id: '1',
    userId: 'user1',
    title: '10-minute meditation',
    description: 'Start your day with mindfulness',
    completed: true,
    completedAt: new Date().toISOString(),
    dueDate: format(new Date(), 'yyyy-MM-dd'),
  },
  {
    id: '2',
    userId: 'user1',
    title: 'Journal your feelings',
    description: 'Write down 3 positive things from today',
    completed: true,
    completedAt: new Date().toISOString(),
    dueDate: format(new Date(), 'yyyy-MM-dd'),
  },
  {
    id: '3',
    userId: 'user1',
    title: 'Connect with a friend',
    description: 'Send a message or call someone',
    completed: false,
    dueDate: format(new Date(), 'yyyy-MM-dd'),
  },
  {
    id: '4',
    userId: 'user1',
    title: 'Drink water (8 glasses)',
    description: 'Stay hydrated throughout the day',
    completed: false,
    dueDate: format(new Date(), 'yyyy-MM-dd'),
  },
  {
    id: '5',
    userId: 'user1',
    title: 'Do a 15-minute walk',
    description: 'Get some fresh air and movement',
    completed: false,
    dueDate: format(new Date(), 'yyyy-MM-dd'),
  },
];

export default function DailyTasksPage() {
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const completed = tasks.filter(t => t.completed).length;
  const total = tasks.length;

  const handleToggleTask = (taskId: string) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          completed: !t.completed,
          completedAt: !t.completed ? new Date().toISOString() : undefined,
        };
      }
      return t;
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-bold text-dark-text mb-2">Daily Tasks</h1>
                <p className="text-warm-gray">Complete your daily wellness routine</p>
              </div>
              <Button variant="primary" size="md" className="space-x-2">
                <Plus size={20} />
                <span>Add Task</span>
              </Button>
            </div>

            {/* Date Info */}
            <div className="text-sm text-warm-gray">
              {format(new Date(), 'EEEE, MMMM d, yyyy')}
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-xl shadow-soft border border-beige p-8">
            <ProgressBar completed={completed} total={total} label="Today's Progress" />
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} onToggle={handleToggleTask} />
            ))}
          </div>

          {/* Motivation Card */}
          <div className="bg-gradient-to-r from-lavender to-soft-pink rounded-xl shadow-soft border border-beige p-8 text-center text-dark-text space-y-4">
            <h3 className="text-xl font-bold">Keep it up! 🌟</h3>
            <p>You're {Math.round((completed / total) * 100)}% through your daily routine. Stay consistent!</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
