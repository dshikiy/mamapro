'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, PlayCircle, Lock, Star, Clock, BookOpen } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { Course } from '@/types';

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadCourse = async () => {
      if (!params?.id) return;
      try {
        const response = await api.get(`/courses/${params.id}`);
        const data = response.data.data;
        setCourse(data || null);
        if (data?.lessons?.length) {
          setActiveLessonId(data.lessons[0].id);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadCourse();
  }, [params?.id]);

  const isPro = user?.subscription === 'pro' || user?.role === 'admin';

  const handleCompleteLesson = async (lessonId: string) => {
    if (!course || !isPro) return;
    setIsSaving(true);
    try {
      await api.put(`/courses/${course.id}/lessons/${lessonId}/complete`);
      setCourse((prev) => {
        if (!prev) return prev;
        const newCompleted = [...(prev.completedLessonIds || [])];
        if (!newCompleted.includes(lessonId)) {
          newCompleted.push(lessonId);
        }
        return {
          ...prev,
          completedLessonIds: newCompleted,
        };
      });
      setMessage('Урок отмечен как пройденный.');
    } catch (err) {
      console.error(err);
      setMessage('Не удалось сохранить прогресс.');
    } finally {
      setIsSaving(false);
      window.setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFBF9]">
        <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center bg-white p-10 rounded-[2.5rem] shadow-card border border-beige">
          <h2 className="text-2xl font-black text-dark-text mb-4">Курс не найден</h2>
          <button onClick={() => router.push('/learn')} className="text-sage font-bold hover:underline">Вернуться к обучению</button>
        </div>
      </div>
    );
  }

  const activeLesson = course.lessons.find((l) => l.id === activeLessonId) || course.lessons[0];
  const isLessonCompleted = course.completedLessonIds?.includes(activeLesson?.id || '');

  // Access control
  const showPaywall = course.is_pro && !isPro;

  return (
    <div className="min-h-screen pb-32 bg-[#FDFBF9]">
      <div className="px-4 pt-8 pb-4">
        <button
          onClick={() => router.push('/learn')}
          className="inline-flex items-center gap-2 text-sm font-bold text-warm-gray hover:text-sage transition"
        >
          <ArrowLeft size={18} /> Назад в каталог
        </button>
      </div>

      <div className="px-4 grid gap-8 lg:grid-cols-[1.3fr_0.7fr] max-w-7xl mx-auto">
        <div className="space-y-8">
          {/* Main Content Area */}
          <div className="rounded-[2.5rem] overflow-hidden bg-white shadow-card border border-beige animate-in fade-in slide-in-from-bottom-4 duration-500">
            {showPaywall ? (
              <div className="aspect-video bg-dark-text flex flex-col items-center justify-center text-center p-10 text-white">
                <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6">
                  <Lock size={40} className="text-white" />
                </div>
                <h2 className="text-2xl font-black mb-4">Этот курс доступен только в PRO</h2>
                <p className="text-white/60 max-w-sm mb-8">Оформите подписку, чтобы получить неограниченный доступ ко всем курсам и материалам платформы.</p>
                <button 
                  onClick={() => router.push('/pricing')}
                  className="bg-sage text-white font-black px-10 py-4 rounded-2xl shadow-elevated hover:bg-sage-dark transition scale-105"
                >
                  Оформить Pro подписку
                </button>
              </div>
            ) : activeLesson?.youtubeUrl ? (
              <div className="aspect-video bg-black relative">
                <iframe
                  src={activeLesson.youtubeUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            ) : (
              <div className="aspect-video bg-cream flex items-center justify-center">
                <img src={course.image} alt={course.title} className="w-full h-full object-cover opacity-50" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <PlayCircle size={64} className="text-white" />
                </div>
              </div>
            )}

            <div className="p-8">
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <span className="bg-sage-light text-sage-dark text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  {course.category}
                </span>
                <div className="flex items-center gap-1 text-warm-gray text-xs font-bold">
                  <Clock size={14} /> {course.duration} мин
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star size={14} className="fill-amber-500" /> 4.9
                </div>
              </div>

              <h1 className="text-3xl font-black text-dark-text mb-4 leading-tight">{course.title}</h1>
              <p className="text-warm-gray leading-relaxed mb-8">{course.description}</p>
              
              {activeLesson && !showPaywall && (
                <div className="mt-8 pt-8 border-t border-beige">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div>
                      <p className="text-[10px] font-black text-sage-dark uppercase tracking-widest mb-1">Текущий урок</p>
                      <h3 className="text-xl font-black text-dark-text">{activeLesson.title}</h3>
                    </div>
                    {isLessonCompleted && <span className="bg-sage/10 text-sage-dark px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter">Пройден</span>}
                  </div>
                  <p className="text-sm text-warm-gray mb-6">{activeLesson.description || 'В этом уроке мы разберем основные понятия и практические упражнения.'}</p>
                  
                  <button
                    disabled={isSaving || isLessonCompleted}
                    onClick={() => handleCompleteLesson(activeLesson.id)}
                    className={`w-full py-4 rounded-2xl font-black transition shadow-warm flex items-center justify-center gap-2 ${
                      isLessonCompleted 
                      ? 'bg-beige text-warm-gray cursor-default' 
                      : 'bg-sage text-white hover:bg-sage-dark'
                    }`}
                  >
                    {isLessonCompleted ? (
                      <><CheckCircle size={20} /> Пройдено</>
                    ) : isSaving ? (
                      'Сохраняем...'
                    ) : (
                      'Отметить как завершенный'
                    )}
                  </button>
                  {message && <p className="mt-4 text-center text-sm font-bold text-sage-dark">{message}</p>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar / Content List */}
        <div className="space-y-6">
          <div className="bg-white rounded-[2.5rem] p-8 border border-beige shadow-card sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-cream rounded-xl"><BookOpen size={20} className="text-dark-text" /></div>
              <h2 className="text-xl font-black text-dark-text">Программа</h2>
            </div>
            
            <div className="space-y-3">
              {course.lessons.map((lesson, idx) => {
                const isActive = lesson.id === activeLessonId;
                const isCompleted = course.completedLessonIds?.includes(lesson.id);
                return (
                  <button
                    key={lesson.id}
                    disabled={showPaywall && idx > 0}
                    onClick={() => setActiveLessonId(lesson.id)}
                    className={`w-full p-4 rounded-2xl text-left border-2 transition-all flex items-center gap-4 group ${
                      isActive 
                        ? 'border-sage bg-sage/5' 
                        : 'border-beige bg-white hover:border-sage-light'
                    } ${showPaywall && idx > 0 ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-black text-xs transition-colors ${
                      isActive ? 'bg-sage text-white' : 'bg-cream text-warm-gray group-hover:bg-sage-light group-hover:text-sage-dark'
                    }`}>
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-bold text-sm truncate ${isActive ? 'text-dark-text' : 'text-warm-gray group-hover:text-dark-text'}`}>
                        {lesson.title}
                      </p>
                      <p className="text-[10px] text-warm-gray font-medium">{lesson.duration} мин</p>
                    </div>
                    {(isCompleted || (showPaywall && idx > 0)) && (
                      <div className="flex-shrink-0">
                        {isCompleted ? <CheckCircle size={18} className="text-sage" /> : <Lock size={16} className="text-warm-gray" />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {showPaywall && (
              <div className="mt-8 p-6 rounded-3xl bg-rose-light/20 border border-rose/10 text-center">
                <p className="text-xs font-bold text-rose-dark mb-4">Для доступа к {course.lessons.length - 1} остальным урокам нужна подписка</p>
                <button 
                  onClick={() => router.push('/pricing')}
                  className="w-full bg-dark-text text-white py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition"
                >
                  Улучшить до PRO
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
