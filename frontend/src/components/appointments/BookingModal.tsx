'use client';

import React, { useState } from 'react';
import { Specialist } from '@/types';
import { Button } from '../shared/Button';
import { Calendar, Clock, X } from 'lucide-react';
import api from '@/lib/api';

interface BookingModalProps {
  specialist: Specialist;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ specialist, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/appointments', {
        specialistId: specialist.id,
        dateTime: `${formData.date}T${formData.time}`,
        notes: formData.notes,
      });

      if (response.data.success) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-warm max-w-md w-full space-y-6 p-6 animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-dark-text">Book Appointment</h2>
          <button onClick={onClose} className="p-2 hover:bg-beige rounded-lg transition">
            <X size={24} />
          </button>
        </div>

        {/* Specialist Info */}
        <div className="flex items-center space-x-4 p-4 bg-lavender rounded-lg">
          <img
            src={specialist.avatar}
            alt={specialist.name}
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <p className="font-semibold text-dark-text">{specialist.name}</p>
            <p className="text-sm text-warm-gray">{specialist.title}</p>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-soft-pink border border-accent-pink rounded-lg text-accent-pink text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 text-warm-gray" size={20} />
              <input
                type="date"
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-beige rounded-lg focus:border-accent-pink focus:outline-none transition"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Time</label>
            <div className="relative">
              <Clock className="absolute left-3 top-3 text-warm-gray" size={20} />
              <input
                type="time"
                required
                className="w-full pl-10 pr-4 py-3 border-2 border-beige rounded-lg focus:border-accent-pink focus:outline-none transition"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Notes (optional)</label>
            <textarea
              className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-accent-pink focus:outline-none transition resize-none"
              rows={3}
              placeholder="Describe your concerns..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          {/* Price */}
          <div className="p-4 bg-soft-pink rounded-lg">
            <p className="text-sm text-warm-gray mb-1">Session Price</p>
            <p className="text-2xl font-semibold text-accent-pink">${specialist.price}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-beige">
            <Button variant="outline" size="lg" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" size="lg" className="flex-1" isLoading={loading}>
              Confirm Booking
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
