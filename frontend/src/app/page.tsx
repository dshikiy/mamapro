'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Calendar, PlayCircle, Star, ChevronRight, BookOpen, MessageCircle, Users } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

const MOODS = [
  { emoji: '😴', label: 'Устала' },
  { emoji: '😐', label: 'Нормально' },
  { emoji: '🙂', label: 'Хорошо' },
  { emoji: '😊', label: 'Отлично' },
  { emoji: '✨', label: 'Супер!' },
];

const CATEGORIES = [
  { label: 'Психолог', color: 'bg-rose-light text-rose-dark', href: '/care?cat=Психолог' },
  { label: 'ГВ', color: 'bg-sage-light text-sage-dark', href: '/care?cat=ГВ' },
  { label: 'Педиатр', color: 'bg-[#E8E6F0] text-[#9E96C0]', href: '/care?cat=Педиатр' },
  { label: 'Сон', color: 'bg-beige text-warm-gray', href: '/care?cat=Сон' },
];

const SPECIALISTS = [
  { name: 'Асель Нургалиева', title: 'Перинатальный психолог', rating: 4.9, img: 'https://i.pravatar.cc/150?img=32' },
  { name: 'Мадина Касымова', title: 'Консультант по ГВ', rating: 5.0, img: 'https://i.pravatar.cc/150?img=43' },
  { name: 'Тимур Омаров', title: 'Педиатр', rating: 4.8, img: 'https://i.pravatar.cc/150?img=11' },
];

const COURSES = [
  { title: 'Послеродовое восстановление', author: 'Асель Н.', time: '42 мин', img: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=400&q=80' },
  { title: 'Основы ГВ', author: 'Мадина К.', time: '1 час', img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80' },
];

export default function Home() {
  const [activeMood, setActiveMood] = useState<number | null>(null);
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const [latestSpecialists, setLatestSpecialists] = useState<any[]>([]);
  const [latestCourses, setLatestCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      const [specRes, courseRes] = await Promise.all([
        api.get('/specialists'),
        api.get('/courses')
      ]);
      setLatestSpecialists(specRes.data.data.slice(0, 3));
      setLatestCourses(courseRes.data.data.slice(0, 2));
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (mounted && !isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (!mounted) return null;

  return (
    <div className="min-h-screen pb-32">
      {/* ── Hero Section ── */}
      <section className="px-4 pt-6 pb-6">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#DBC2BA] to-[#F0E6E4] p-6 shadow-card">
          <div className="relative z-10 w-2/3">
            <div className="flex items-center gap-2 mb-1">
              <p className="text-sm text-white/90 font-medium">С возвращением,</p>
              {user?.subscription === 'pro' && (
                <span className="bg-white/30 backdrop-blur-md text-white text-[9px] px-2 py-0.5 rounded-full font-black uppercase tracking-widest border border-white/20">
                  Pro ✨
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black text-white leading-tight mb-4">
              {user?.name || 'Мама'}! 🌸
            </h1>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/care"
                className="inline-block bg-white/20 backdrop-blur-md text-white font-bold px-4 py-2 rounded-xl text-sm border border-white/40 hover:bg-white/30 transition shadow-sm"
              >
                Записаться к врачу
              </Link>
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 bg-dark-text text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-black transition shadow-warm"
                >
                  <Calendar size={14} /> Админка
                </Link>
              )}
              {user?.role === 'specialist' && (
                <Link
                  href="/specialist"
                  className="inline-flex items-center gap-2 bg-accent-pink text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-accent-purple transition shadow-warm"
                >
                  <Users size={14} /> Мой кабинет
                </Link>
              )}
            </div>
          </div>

          <img
            src="https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80"
            alt="Mom and baby"
            className="absolute top-0 right-0 h-full w-1/2 object-cover object-left mask-image-linear-left"
            style={{ maskImage: 'linear-gradient(to right, transparent, black 40%)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)' }}
          />
        </div>
      </section>

      <div className="px-4 space-y-8">
        {/* ── Mood Tracker ── */}
        <section className="bg-white rounded-[2rem] p-5 shadow-card border border-beige">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-black text-dark-text flex items-center gap-2">
              <Calendar size={18} className="text-sage-dark" />
              Календарь
            </h2>
          </div>
          <div className="flex justify-around">
            {MOODS.map((mood, i) => (
              <button
                key={i}
                onClick={() => setActiveMood(i)}
                className="flex flex-col items-center gap-1.5 group"
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl border-2 transition-all shadow-sm ${activeMood === i
                  ? 'bg-sage border-sage scale-110 shadow-warm'
                  : 'bg-cream border-transparent group-hover:border-sage group-hover:bg-sage-light/40'
                  }`}>
                  {mood.emoji}
                </div>
                <span className={`text-[9px] font-bold transition-colors ${activeMood === i ? 'text-sage-dark' : 'text-warm-gray'}`}>
                  {mood.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* ── Categories ── */}
        <section>
          <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.label}
                href={cat.href}
                className={`flex-shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm ${cat.color}`}
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </section>

        {/* ── Specialists ── */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-dark-text">Наши специалисты</h2>
            <Link href="/care" className="text-sm font-bold text-sage-dark hover:opacity-80 flex items-center">
              Все <ChevronRight size={16} />
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar -mx-1 px-1">
            {loading ? (
              [1, 2, 3].map(i => <div key={i} className="flex-shrink-0 w-[140px] h-40 bg-cream animate-pulse rounded-3xl" />)
            ) : (
              latestSpecialists.map((sp, i) => (
                <Link key={i} href="/care" className="flex-shrink-0 w-[140px] bg-white rounded-3xl p-4 shadow-card border border-beige text-center group hover:shadow-elevated transition">
                  <img src={sp.avatar || 'https://i.pravatar.cc/150'} alt={sp.name} className="w-16 h-16 rounded-full mx-auto mb-3 object-cover shadow-soft group-hover:scale-105 transition-transform" />
                  <h4 className="font-bold text-dark-text text-sm leading-tight mb-1 truncate">{sp.name}</h4>
                  <p className="text-[10px] text-warm-gray mb-2">{sp.title}</p>
                  <div className="flex items-center justify-center gap-1 bg-cream rounded-lg py-1">
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-bold text-dark-text">{sp.rating}</span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        {/* ── Courses ── */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-black text-dark-text">Курсы</h2>
            <Link href="/learn" className="text-sm font-bold text-sage-dark hover:opacity-80 flex items-center">
              Все <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {loading ? (
              [1, 2].map(i => <div key={i} className="h-40 bg-cream animate-pulse rounded-3xl" />)
            ) : (
              latestCourses.map((course, i) => (
                <Link key={i} href="/learn" className="bg-white rounded-[1.5rem] overflow-hidden shadow-card border border-beige group">
                  <div className="h-24 relative overflow-hidden bg-cream">
                    <img src={course.image || 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=400&q=80'} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <PlayCircle className="text-white/80" size={24} />
                    </div>
                  </div>
                  <div className="p-3">
                    <h4 className="font-bold text-dark-text text-[11px] leading-tight mb-1 line-clamp-2 h-7">{course.title}</h4>
                    <div className="flex items-center justify-between text-[9px] text-warm-gray">
                      <span>{course.instructor}</span>
                      <span className="bg-cream px-1.5 py-0.5 rounded font-medium">{course.duration} мин</span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}