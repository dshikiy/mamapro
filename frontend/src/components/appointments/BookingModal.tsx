'use client';

import React, { useState } from 'react';
import { Specialist } from '@/types';
import { Button } from '../shared/Button';
import { Calendar, Clock, X } from 'lucide-react';
import api from '@/lib/api';

interface TimeSlot {
  id: string;
  slot_date: string;
  slot_time: string;
  is_booked: boolean;
}

interface BookingModalProps {
  specialist: Specialist;
  slot?: TimeSlot | null;
  onClose: () => void;
  onSuccess?: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ specialist, slot, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    date: slot?.slot_date ?? '',
    time: slot?.slot_time ?? '',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const body: any = {
        specialistId: specialist.id,
        notes: formData.notes,
      };

      if (slot?.id) {
        body.slotId = slot.id;
      } else if (formData.date && formData.time) {
        body.dateTime = `${formData.date}T${formData.time}`;
      }

      const response = await api.post('/appointments', body);

      if (response.data.success) {
        if (onSuccess) onSuccess();
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Не удалось записаться на консультацию');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-warm max-w-md w-full space-y-6 p-6 animate-slide-in">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-dark-text">Записаться на консультацию</h2>
          <button type="button" onClick={onClose} className="p-2 hover:bg-beige rounded-lg transition">
            <X size={24} />
          </button>
        </div>

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

        {slot ? (
          <div className="rounded-3xl border border-beige bg-cream p-4">
            <p className="text-sm text-warm-gray mb-2">Выбранный слот</p>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-base font-bold text-dark-text">{slot.slot_date}</p>
                <p className="text-sm text-warm-gray">{slot.slot_time}</p>
              </div>
              <span className="rounded-full bg-sage/10 text-sage-dark px-3 py-1 text-xs font-semibold">Свободный</span>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">Дата</label>
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
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">Время</label>
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
          </div>
        )}

        {error && (
          <div className="p-4 bg-soft-pink border border-accent-pink rounded-lg text-accent-pink text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">Комментарий</label>
          <textarea
            className="w-full px-4 py-3 border-2 border-beige rounded-lg focus:border-accent-pink focus:outline-none transition resize-none"
            rows={3}
            placeholder="Опишите ваш запрос..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <div className="p-4 bg-soft-pink rounded-lg">
          <p className="text-sm text-warm-gray mb-1">Стоимость сессии</p>
          <p className="text-2xl font-semibold text-accent-pink">{specialist.price.toLocaleString('ru')} ₸</p>
        </div>

        <div className="flex gap-3 pt-4 border-t border-beige">
          <Button type="button" variant="outline" size="lg" className="flex-1" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" variant="primary" size="lg" className="flex-1" isLoading={loading}>
            Подтвердить
          </Button>
        </div>
      </form>
    </div>
  );
};
