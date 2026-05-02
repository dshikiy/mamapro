'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Star, Calendar, Clock, MessageCircle } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { BookingModal } from '@/components/appointments/BookingModal';
import { Specialist as SpecialistType } from '@/types';

interface TimeSlot {
  id: string;
  slot_date: string;
  slot_time: string;
  is_booked: boolean;
}

export default function SpecialistProfilePage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [specialist, setSpecialist] = useState<SpecialistType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const fetchSpecialist = async () => {
      if (!params?.id) return;
      try {
        const response = await api.get(`/specialists/${params.id}`);
        setSpecialist(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpecialist();
  }, [params?.id]);

  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timeout);
    }
  }, [toast]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full text-center rounded-3xl bg-white p-8 shadow-sm border border-beige">
          <p className="text-dark-text font-semibold">Пожалуйста, войдите, чтобы посмотреть профиль специалиста.</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-beige text-dark-text">Загрузка специалиста...</div>
      </div>
    );
  }

  if (!specialist) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="rounded-3xl bg-white p-8 shadow-sm border border-beige text-dark-text">Специалист не найден.</div>
      </div>
    );
  }

  const isPro = user.subscription === 'pro';

  const slotGroups = (specialist.slots ?? []).reduce<Record<string, TimeSlot[]>>((acc, slot) => {
    if (!acc[slot.slot_date]) {
      acc[slot.slot_date] = [];
    }
    acc[slot.slot_date].push(slot);
    return acc;
  }, {});

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setBookingOpen(true);
  };

  return (
    <div className="min-h-screen pb-32">
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] bg-dark-text text-white px-5 py-3 rounded-full shadow-elevated flex items-center gap-2 animate-slide-in whitespace-nowrap text-sm font-semibold">
          {toast}
        </div>
      )}

      <div className="px-4 pt-6 pb-4">
        <button
          onClick={() => router.push('/care')}
          className="inline-flex items-center gap-2 text-sm font-semibold text-sage hover:text-sage-dark"
        >
          <ArrowLeft size={16} /> Назад к специалистам
        </button>
      </div>

      <div className="px-4 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <div className="rounded-[2rem] bg-white shadow-card border border-beige p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <img
                src={specialist.avatar}
                alt={specialist.name}
                className="w-28 h-28 rounded-[1.5rem] object-cover shadow-soft border-2 border-beige"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-black text-dark-text">{specialist.name}</h1>
                <p className="text-sm text-warm-gray mt-2">{specialist.title}</p>
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-beige px-4 py-2 text-sm font-semibold text-dark-text">
                  <Star size={16} className="text-amber-500" /> {specialist.rating}
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-cream p-4 border border-beige">
                <p className="text-xs uppercase text-warm-gray tracking-[0.2em]">Специализация</p>
                <p className="mt-2 font-semibold text-dark-text">{specialist.specialty}</p>
              </div>
              <div className="rounded-3xl bg-cream p-4 border border-beige">
                <p className="text-xs uppercase text-warm-gray tracking-[0.2em]">Стоимость</p>
                <p className="mt-2 font-semibold text-dark-text">{specialist.price.toLocaleString('ru')} ₸</p>
              </div>
            </div>

            {!isPro && (
              <div className="mt-6 rounded-3xl border border-rose/20 bg-rose-light/20 p-4 text-sm text-rose-dark">
                Для записи на консультацию и просмотра полной информации нужна подписка Pro.
              </div>
            )}
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => router.push(`/chat?with=${specialist.user_id}`)}
                className="flex-1 bg-white border-2 border-sage text-sage-dark font-black py-4 rounded-3xl hover:bg-sage-light/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageCircle size={20} />
                Написать сообщение
              </button>
            </div>
          </div>

          <div className="rounded-[2rem] bg-white shadow-card border border-beige p-6">
            <h2 className="text-xl font-black text-dark-text mb-4">О специалисте</h2>
            <p className="text-sm leading-relaxed text-warm-gray">{specialist.bio || 'Описание специалиста скоро появится.'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-[2rem] bg-white shadow-card border border-beige p-6">
            <div className="flex items-center justify-between gap-4 mb-4">
              <div>
                <p className="text-xs uppercase text-warm-gray tracking-[0.2em]">Доступные слоты</p>
                <h2 className="text-xl font-black text-dark-text">Записаться</h2>
              </div>
              <div className="text-sm font-semibold text-warm-gray">{Object.keys(slotGroups).length} дней</div>
            </div>

            {Object.entries(slotGroups).map(([slotDate, slots]) => (
              <div key={slotDate} className="mb-5 last:mb-0">
                <p className="text-sm font-semibold text-dark-text mb-3">{slotDate}</p>
                <div className="flex flex-wrap gap-2">
                  {slots.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => handleSelectSlot(slot)}
                      disabled={!isPro}
                      className="rounded-2xl border border-beige bg-cream px-4 py-3 text-sm font-semibold text-dark-text transition hover:bg-beige disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Calendar size={14} className="inline-block mr-2 text-sage" />
                      {slot.slot_time}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-6 rounded-3xl bg-sage-light/20 p-4 text-sm text-dark-text">
              <div className="flex items-center gap-2 mb-2">
                <Clock size={16} className="text-sage" />
                <span className="font-semibold">Приблизительное время консультации:</span>
              </div>
              <p>45 минут. После записи вы получите подтверждение и инструкцию на email.</p>
            </div>
          </div>
        </div>
      </div>

      {bookingOpen && selectedSlot && (
        <BookingModal
          specialist={specialist as any}
          slot={selectedSlot}
          onClose={() => setBookingOpen(false)}
          onSuccess={() => {
            setToast('Запись оформлена. Проверьте свои уведомления.');
            setBookingOpen(false);
          }}
        />
      )}
    </div>
  );
}
