'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlayCircle, Calendar, MessageSquare, BookOpen, ArrowRight, Heart, CheckCircle2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';

export default function Home() {
  const [toastMessage, setToastMessage] = useState('');
  const [activeMood, setActiveMood] = useState<number | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);
  const [diaryText, setDiaryText] = useState('');

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleMoodSelect = (idx: number, label: string) => {
    setActiveMood(idx);
    setToastMessage(`Настроение "${label}" сохранено в дневник!`);
  };

  const handleSaveDiary = () => {
    if (!diaryText.trim()) return;
    setDiaryText('');
    setIsDiaryModalOpen(false);
    setToastMessage('Запись успешно добавлена в дневник!');
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent p-4 pb-32 animate-fade-in relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-dark-text text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-slide-in whitespace-nowrap text-sm font-bold">
          <CheckCircle2 size={18} className="text-sage" />
          {toastMessage}
        </div>
      )}

      {/* Header Profile Area */}
      <header className="flex justify-between items-center py-6 mt-2">
        <div>
          <h1 className="text-2xl font-medium text-dark-text tracking-tight">Доброе утро,</h1>
          <p className="text-3xl font-bold text-accent-pink tracking-tight">Айгерим 🌸</p>
        </div>
        <Link href="/profile" className="h-12 w-12 rounded-full bg-soft-pink border-2 border-white shadow-soft flex items-center justify-center overflow-hidden cursor-pointer hover:scale-105 transition-transform">
          <img src="https://i.pravatar.cc/150?img=5" alt="Profile" className="h-full w-full object-cover" />
        </Link>
      </header>

      {/* Daily Emotion/Tracker Card */}
      <section className="bg-white/80 rounded-3xl p-5 shadow-softer border border-white backdrop-blur-md mb-6">
        <h2 className="text-sm font-semibold text-warm-gray mb-4 uppercase tracking-wider text-center">Как вы сегодня себя чувствуете?</h2>
        <div className="flex justify-between">
          {[
            { emoji: '😴', label: 'Устала' },
            { emoji: '😐', label: 'Нормально' },
            { emoji: '🙂', label: 'Хорошо' },
            { emoji: '😊', label: 'Отлично' },
            { emoji: '✨', label: 'Супер' }
          ].map((mood, i) => (
            <button 
              key={i} 
              onClick={() => handleMoodSelect(i, mood.label)}
              className="flex flex-col items-center gap-2 group transition-transform hover:-translate-y-1"
            >
              <div className={`h-12 w-12 rounded-full flex items-center justify-center text-xl border-2 transition-all shadow-sm ${
                activeMood === i 
                  ? 'bg-sage border-sage scale-110' 
                  : 'bg-cream border-transparent group-hover:border-sage group-hover:bg-sage/20'
              }`}>
                {mood.emoji}
              </div>
              <span className={`text-[10px] font-medium transition-colors ${activeMood === i ? 'text-sage font-bold' : 'text-warm-gray'}`}>
                {mood.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Today's Focus (Marathon) */}
      <section className="mb-8">
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-xl font-bold text-dark-text">Фокус дня</h2>
          <Link href="/learn" className="text-sm font-medium text-accent-purple hover:opacity-80">Все курсы</Link>
        </div>
        
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-accent-pink to-accent-purple p-[2px] shadow-warm">
          <div className="absolute top-0 right-0 p-4 opacity-20">
             <Heart size={80} className="fill-white" />
          </div>
          <div className="bg-white/95 backdrop-blur-xl rounded-[30px] p-6 relative z-10">
            <div className="flex items-start justify-between mb-3">
              <span className="bg-accent-pink/15 text-accent-pink text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">День 3 из 7</span>
            </div>
            <h3 className="text-2xl font-bold text-dark-text mb-1 leading-tight">Материнство<br />без стресса</h3>
            <p className="text-sm text-warm-gray mb-6">Сегодня: Как справляться с недосыпом</p>
            
            <button 
              onClick={() => setIsLessonModalOpen(true)}
              className="w-full bg-dark-text text-white rounded-2xl py-4 px-4 flex items-center justify-center gap-2 font-medium hover:bg-black transition-colors shadow-soft"
            >
              <PlayCircle size={20} className="text-accent-pink" />
              Начать урок
            </button>
          </div>
        </div>
      </section>

      {/* Upcoming Reminders */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-dark-text mb-4">Предстоящее</h2>
        <Link href="/care" className="block bg-white rounded-[2rem] p-4 shadow-softer border border-white flex items-center gap-4 hover:bg-cream/50 transition">
          <div className="h-16 w-16 rounded-2xl bg-lavender/30 flex flex-col items-center justify-center text-accent-purple shadow-inner">
            <span className="text-xs font-bold uppercase">Окт</span>
            <span className="text-xl font-black">24</span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-dark-text">Сессия с доктором Асель</h4>
            <p className="text-sm text-warm-gray mt-1">14:00 • Видеозвонок</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-cream flex items-center justify-center text-dark-text hover:bg-sage/50 transition mr-1">
            <ArrowRight size={20} className="text-warm-gray" />
          </div>
        </Link>
      </section>

      {/* Quick Actions Grid */}
      <section>
        <h2 className="text-xl font-bold text-dark-text mb-4">Быстрые действия</h2>
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={() => setIsDiaryModalOpen(true)}
            className="text-left bg-gradient-to-br from-soft-pink/40 to-white p-5 rounded-[2rem] shadow-softer border border-white flex flex-col items-start gap-4 active:scale-95 transition-transform group"
          >
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-accent-pink shadow-sm group-hover:scale-110 transition-transform">
              <BookOpen size={20} />
            </div>
            <div>
              <span className="text-sm font-bold text-dark-text block">Мой дневник</span>
              <span className="text-xs text-warm-gray">Записать мысли</span>
            </div>
          </button>
          
          <Link href="/community" className="bg-gradient-to-br from-sage/40 to-white p-5 rounded-[2rem] shadow-softer border border-white flex flex-col items-start gap-4 active:scale-95 transition-transform group">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-sage shadow-sm group-hover:scale-110 transition-transform">
              <MessageSquare size={20} />
            </div>
            <div>
              <span className="text-sm font-bold text-dark-text block">Анонимно</span>
              <span className="text-xs text-warm-gray">Задать вопрос</span>
            </div>
          </Link>
        </div>
      </section>

      {/* MODALS */}
      <Modal isOpen={isLessonModalOpen} onClose={() => setIsLessonModalOpen(false)} title="Урок 3: Сон малыша">
        <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-4 relative flex items-center justify-center group cursor-pointer">
          <img src="https://images.unsplash.com/photo-1544126592-807ade215a0b?auto=format&fit=crop&w=800&q=80" alt="Video cover" className="w-full h-full object-cover opacity-60" />
          <PlayCircle size={64} className="text-white absolute group-hover:scale-110 transition-transform" />
        </div>
        <p className="text-sm text-warm-gray mb-4">В этом уроке мы разберем основные причины, почему малыш часто просыпается ночью, и научимся выстраивать мягкие ритуалы укладывания.</p>
        <button 
          onClick={() => {
            setIsLessonModalOpen(false);
            setToastMessage('Урок отмечен как пройденный!');
          }}
          className="w-full bg-accent-pink text-white font-bold py-3 rounded-xl hover:bg-accent-pink/90 transition"
        >
          Завершить урок
        </button>
      </Modal>

      <Modal isOpen={isDiaryModalOpen} onClose={() => setIsDiaryModalOpen(false)} title="Новая запись">
        <textarea 
          value={diaryText}
          onChange={(e) => setDiaryText(e.target.value)}
          placeholder="Что вас беспокоит или радует сегодня? Выпишите это сюда..."
          className="w-full h-32 bg-cream p-4 rounded-2xl outline-none border-2 border-transparent focus:border-accent-pink resize-none text-sm text-dark-text placeholder:text-warm-gray mb-4"
        ></textarea>
        <button 
          onClick={handleSaveDiary}
          disabled={!diaryText.trim()}
          className="w-full bg-dark-text text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition"
        >
          Сохранить в дневник
        </button>
      </Modal>

    </div>
  );
}
