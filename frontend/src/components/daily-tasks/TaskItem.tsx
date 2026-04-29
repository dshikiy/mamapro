'use client';

import React from 'react';
import { DailyTask } from '@/types';
import { CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';

interface TaskItemProps {
  task: DailyTask;
  onToggle?: (taskId: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  return (
    <div
      className={`p-4 rounded-lg border-2 transition ${
        task.completed
          ? 'border-sage bg-sage/20'
          : 'border-beige bg-white hover:border-lavender'
      }`}
    >
      <div className="flex items-start space-x-3">
        <button
          onClick={() => onToggle?.(task.id)}
          className="pt-0.5 flex-shrink-0 transition hover:scale-110"
        >
          {task.completed ? (
            <CheckCircle2 className="text-sage fill-sage" size={24} />
          ) : (
            <Circle className="text-beige hover:text-accent-pink" size={24} />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h4
            className={`font-medium transition ${
              task.completed ? 'text-warm-gray line-through' : 'text-dark-text'
            }`}
          >
            {task.title}
          </h4>
          <p className="text-sm text-warm-gray mt-1">{task.description}</p>
          <p className={`text-xs mt-2 ${task.completed ? 'text-sage' : 'text-beige'}`}>
            Due: {format(new Date(task.dueDate), 'MMM d, yyyy')}
          </p>
        </div>

        {task.completed && (
          <div className="flex-shrink-0 px-2 py-1 bg-sage/30 rounded-full">
            <span className="text-xs font-semibold text-sage">Done</span>
          </div>
        )}
      </div>
    </div>
  );
};
