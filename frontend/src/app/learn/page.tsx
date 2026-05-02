'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PlayCircle, Clock, Star, Sparkles, Lock, ChevronRight } from 'lucide-react';
import { SkeletonMarathonCard } from '@/components/ui/SkeletonCard';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Course } from '@/types';

export default function LearnPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState<'Марафоны' | 'Курсы'>('Марафоны');
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [marathons, setMarathons] = useState<any[]>([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'Курсы') {
        const res = await api.get('/courses');
        setCourses(res.data.data);
      } else {
        const res = await api.get('/marathons');
        setMarathons(res.data.data);
      }
    } catch (error) {
      console.error('Error loading learn data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const isPro = user?.subscription === 'pro' || user?.role === 'admin';

  return (
    <div className="min-h-screen pb-32 bg-[#FDFBF9]">
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] bg-dark-text text-white px-5 py-3 rounded-full shadow-elevated flex items-center gap-2 animate-slide-in whitespace-nowrap text-sm font-semibold">
          {toast}
        </div>
      )}

      <div className="px-4 pt-10 pb-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <h1 className="text-4xl font-black text-dark-text tracking-tight flex items-center gap-3">
              Академия Мам
              <Sparkles className="text-amber-400" size={32} />
            </h1>
            <p className="text-warm-gray text-lg font-medium max-w-md leading-relaxed">
              Развивайтесь и учитесь вместе с лучшими экспертами в области материнства.
            </p>
          </div>
          
          <div className="flex bg-beige/50 backdrop-blur-md rounded-[2rem] p-1.5 border border-beige shadow-sm">
            {(['Марафоны', 'Курсы'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-8 py-3 rounded-2xl text-sm font-black transition-all duration-300 ${
                  activeTab === tab
                    ? 'bg-white text-dark-text shadow-warm'
                    : 'text-warm-gray hover:text-dark-text'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'Марафоны' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isLoading ? (
              [1, 2, 3].map(i => <SkeletonMarathonCard key={i} />)
            ) : marathons.length > 0 ? (
              marathons.map((marathon) => (
                <div key={marathon.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-card border border-beige hover:border-sage transition-all duration-300 flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <img src={marathon.image || 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80'} alt={marathon.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border border-white/30">
                        7 Дней интенсив
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-black text-dark-text mb-3 leading-tight group-hover:text-sage transition-colors">{marathon.title}</h3>
                    <p className="text-warm-gray text-sm mb-8 line-clamp-2 leading-relaxed">{marathon.description}</p>

                    <div className="mt-auto pt-6 border-t border-beige flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cream flex items-center justify-center font-black text-xs text-sage-dark border border-beige">
                          {marathon.instructor_name?.[0] || 'A'}
                        </div>
                        <div>
                          <p className="text-xs font-black text-dark-text">{marathon.instructor_name || 'Асель Нургалиева'}</p>
                          <p className="text-[10px] font-bold text-warm-gray">Психолог</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => router.push(`/marathons/${marathon.id}`)}
                        className="p-3 bg-cream rounded-2xl text-dark-text hover:bg-sage hover:text-white transition-all shadow-sm group/btn"
                      >
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-beige">
                <p className="text-warm-gray font-black text-lg">Марафоны скоро появятся 🌸</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Курсы' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {isLoading ? (
              [1, 2, 3, 4].map(i => <div key={i} className="h-64 bg-white rounded-[2rem] animate-pulse border border-beige" />)
            ) : courses.length > 0 ? (
              courses.map((course) => {
                const isLocked = course.is_pro && !isPro;
                return (
                  <button
                    key={course.id}
                    onClick={() => router.push(`/courses/${course.id}`)}
                    className="bg-white rounded-[2rem] overflow-hidden shadow-card border border-beige group text-left hover:border-sage transition-all duration-300"
                  >
                    <div className="h-36 relative overflow-hidden bg-cream">
                      <img src={course.image || 'https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=600&q=80'} alt={course.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                          <PlayCircle className="text-sage-dark" size={24} />
                        </div>
                      </div>
                      {course.is_pro && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-dark-text/90 backdrop-blur-md text-white text-[9px] font-black px-2.5 py-1 rounded-full border border-white/20 tracking-widest uppercase">
                          <Sparkles size={10} className="text-amber-400" />
                          PRO
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[9px] font-black text-sage-dark uppercase tracking-widest px-2 py-0.5 bg-sage-light/30 rounded-md">
                          {course.category}
                        </span>
                      </div>
                      <h4 className="font-black text-dark-text text-sm leading-snug mb-4 line-clamp-2 group-hover:text-sage transition-colors h-10">{course.title}</h4>
                      <div className="flex items-center justify-between pt-4 border-t border-beige">
                        <div className="flex items-center gap-1.5 text-warm-gray">
                          <Clock size={12} />
                          <span className="text-[10px] font-bold">{course.duration} мин</span>
                        </div>
                        {isLocked ? (
                          <div className="flex items-center gap-1 text-rose-dark">
                            <Lock size={12} />
                            <span className="text-[9px] font-black uppercase tracking-tighter">Закрыто</span>
                          </div>
                        ) : (
                          <span className="text-[9px] font-black text-sage-dark uppercase tracking-tighter">Доступно</span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="col-span-full py-32 text-center bg-white rounded-[3rem] border border-dashed border-beige">
                <p className="text-warm-gray font-black text-lg">Библиотека курсов пополняется 🌸</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
