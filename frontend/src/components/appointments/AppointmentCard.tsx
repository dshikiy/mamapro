'use client';

import React from 'react';
import { Appointment } from '@/types';
import { format, isBefore } from 'date-fns';
import { Calendar, Clock } from 'lucide-react';
import { Button } from '../shared/Button';

interface AppointmentCardProps {
  appointment: Appointment;
}

type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled' | 'upcoming';

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const appointmentDate = new Date(appointment.dateTime);
  const now = new Date();

  const statusColors = {
    upcoming: 'bg-lavender text-dark-text',
    scheduled: 'bg-lavender text-dark-text', // 'scheduled' is treated as 'upcoming' for display
    completed: 'bg-sage text-dark-text',
    cancelled: 'bg-beige text-warm-gray',
  };

  return (
    <div className="bg-white rounded-lg shadow-soft border border-beige p-6 hover:shadow-warm transition">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-dark-text">{appointment.specialist.name}</h3>
          <p className="text-sm text-warm-gray">{appointment.specialist.title}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
            statusColors[appointment.status as AppointmentStatus] || 'bg-beige text-warm-gray'
          }`}
        >
          {appointment.status}
        </span>
      </div>

      <div className="space-y-3 mb-4 pb-4 border-b border-beige">
        <div className="flex items-center space-x-3 text-warm-gray">
          <Calendar size={16} />
          <span className="text-sm">{format(appointmentDate, 'MMMM d, yyyy')}</span>
        </div>
        <div className="flex items-center space-x-3 text-warm-gray">
          <Clock size={16} />
          <span className="text-sm">
            {format(appointmentDate, 'h:mm a')} • {appointment.duration} minutes
          </span>
        </div>
      </div>

      {appointment.notes && (
        <div className="mb-4 p-3 bg-soft-pink rounded-lg">
          <p className="text-xs font-semibold text-accent-pink mb-1 uppercase tracking-wider">Notes</p>
          <p className="text-sm text-dark-text">{appointment.notes}</p>
        </div>
      )}

      <div className="flex gap-3">
        {(appointment.status === 'scheduled' || (appointment.status === 'upcoming' && isBefore(now, appointmentDate))) && (
          <>
            <Button variant="primary" size="sm" className="flex-1">
              Join Session
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Reschedule
            </Button>
          </>
        )}
        {appointment.status === 'completed' && <Button variant="secondary" size="sm" className="flex-1">
          Leave Feedback
        </Button>}
      </div>
    </div>
  );
};
