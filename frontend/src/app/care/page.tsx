'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Star, Filter, CheckCircle2 } from 'lucide-react';
import { SkeletonSpecialist } from '@/components/ui/SkeletonCard';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface TimeSlot {
  id: string;
  slot_date: string;
  slot_time: string;
  is_booked: boolean;
}

interface Specialist {
  id: string;
  name: string;
  title: string;
  specialty: string;
  rating: number;
  price: number;
  avatar: string;
  slots: TimeSlot[];
}

const TABS = ['Все', 'Психолог', 'ГВ', 'Педиатр', 'Сон'];

import { BookingModal } from '@/components/appointments/BookingModal';

export default function CarePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(true);
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [activeTab, setActiveTab] = useState('Все');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState('');
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const response = await api.get('/specialists');
        setSpecialists(response.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpecialists();
  }, []);

  useEffect(() => {
    if (toast) {
      const timeout = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timeout);
    }
  }, [toast]);

  const isPro = user?.subscription === 'pro';

  const filtered = specialists.filter((s) => {
    const matchTab = activeTab === 'Все' || s.specialty === activeTab;
    const matchSearch = !search || s.name.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleBook = (expert: Specialist) => {
    if (!isPro) {
      router.push('/pricing');
      return;
    }
    setSelectedSpecialist(expert);
    setBookingOpen(true);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-10">
        <div className="max-w-md w-full text-center rounded-3xl bg-white p-8 shadow-sm border border-beige">
          <p className="text-dark-text font-semibold">Пожалуйста, войдите, чтобы посмотреть специалистов.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32">
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] bg-dark-text text-white px-5 py-3 rounded-full shadow-elevated flex items-center gap-2 animate-slide-in whitespace-nowrap text-sm font-semibold">
          {toast}
        </div>
      )}

      <div className="px-4 pt-6 pb-4">
        <div className="flex flex-col gap-3 mb-4">
          <div>
            <h1 className="text-2xl font-black text-dark-text tracking-tight mb-1">Специалисты</h1>
            <p className="text-sm text-warm-gray">Выбирайте подходящего эксперта для вашей семьи.</p>
          </div>
          {!isPro && (
            <div className="rounded-3xl border border-rose/20 bg-rose-light/20 p-4 text-sm text-rose-dark">
              Вы сейчас на тарифе {user.subscription}. Обновите до Pro, чтобы получить доступ ко всем специалистам и консультациям.
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-2">
          <div className="flex-1 bg-white rounded-[1.2rem] shadow-sm border border-beige flex items-center px-4 py-3">
            <Search size={18} className="text-warm-gray mr-3 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск специалиста..."
              className="bg-transparent border-none outline-none w-full text-sm text-dark-text placeholder:text-warm-gray/70"
            />
          </div>
          <button
            onClick={() => router.push('/pricing')}
            className="bg-white rounded-[1.2rem] shadow-sm border border-beige w-12 flex items-center justify-center hover:bg-beige transition"
          >
            <Filter size={18} className="text-dark-text" />
          </button>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mt-4 no-scrollbar">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-2 rounded-xl text-sm font-bold transition-all flex-shrink-0 border ${
                activeTab === tab
                  ? 'bg-sage text-white border-sage shadow-warm'
                  : 'bg-white text-dark-text border-beige hover:bg-beige'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {isLoading ? (
          <SkeletonSpecialist />
        ) : (
          filtered.map((expert) => (
            <div
              key={expert.id}
              className="bg-white rounded-[2rem] p-5 shadow-card border border-beige transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex gap-4 mb-4">
                <img
                  src={expert.avatar}
                  alt={expert.name}
                  className="w-16 h-16 rounded-full object-cover shadow-soft border-2 border-beige"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-dark-text leading-tight text-base">{expert.name}</h3>
                        <div className="bg-sage text-white p-0.5 rounded-full" title="Верифицированный специалист">
                          <CheckCircle2 size={10} />
                        </div>
                      </div>
                      <p className="text-xs text-warm-gray mt-0.5">{expert.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2 bg-cream w-max px-2 py-1 rounded-lg">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-[11px] font-bold text-dark-text">{expert.rating}</span>
                  </div>
                </div>
              </div>

              <div className="bg-cream rounded-2xl p-3 border border-beige mb-4">
                <p className="text-[10px] font-bold text-warm-gray uppercase tracking-wider mb-2">Ближайшее время</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {expert.slots.map((slot) => (
                    <span
                      key={slot.id}
                      className={`min-w-[60px] rounded-xl py-1.5 text-xs font-bold ${
                        slot.is_booked
                          ? 'bg-warm-gray/10 text-warm-gray'
                          : 'bg-sage-light/30 text-sage-dark'
                      }`}
                    >
                      {slot.slot_time}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <Link
                  href={`/care/${expert.id}`}
                  className="text-center bg-white text-dark-text border border-beige rounded-2xl py-3.5 font-bold hover:bg-beige transition"
                >
                  Профиль
                </Link>
                <button
                  className="w-full bg-sage text-white font-bold py-3.5 rounded-2xl hover:bg-sage-dark transition shadow-warm"
                  onClick={() => handleBook(expert)}
                >
                  Записаться — {expert.price.toLocaleString('ru')} ₸
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {bookingOpen && selectedSpecialist && (
        <BookingModal
          specialist={selectedSpecialist as any}
          onClose={() => setBookingOpen(false)}
          onSuccess={() => {
            setToast('Вы успешно записаны! Проверьте вкладку "Записи" в профиле.');
            setBookingOpen(false);
          }}
        />
      )}
    </div>
  );
}
