'use client';

import React, { useState, useEffect } from 'react';
import { PlayCircle, Clock, BookOpen, Star, Heart, CheckCircle2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';

export default function LearnPage() {
  const [toastMessage, setToastMessage] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [activeCategory, setActiveCategory] = useState('Все');

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const courses = [
    {
      title: 'Сон малыша: от 0 до 6 месяцев',
      author: 'Марина Соколова (Сомнолог)',
      category: 'Сон',
      lessons: 3,
      time: '2 часа',
      img: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      youtubeLinks: [
        { title: 'Урок 1: Базовые потребности', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Урок 2: Режим дня', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Урок 3: Ассоциации на сон', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      ]
    },
    {
      title: 'Как сохранить отношения после родов',
      author: 'Асель Нургалиева (Психолог)',
      category: 'Отношения',
      lessons: 2,
      time: '1.5 часа',
      img: 'https://images.unsplash.com/photo-1544126592-807ade215a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      youtubeLinks: [
        { title: 'Урок 1: Кризис в паре', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Урок 2: Разделение обязанностей', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      ]
    },
    {
      title: 'Первый прикорм без стресса',
      author: 'Тимур Омаров (Педиатр)',
      category: 'Здоровье малыша',
      lessons: 4,
      time: '3 часа',
      img: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
      youtubeLinks: [
        { title: 'Урок 1: Когда начинать', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Урок 2: Пищевой интерес', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Урок 3: Овощи и каши', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
        { title: 'Урок 4: Аллергены', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      ]
    }
  ];

  const filteredCourses = activeCategory === 'Все' ? courses : courses.filter(c => c.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen bg-transparent p-4 pb-32 animate-fade-in relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] bg-dark-text text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-slide-in whitespace-nowrap text-sm font-bold">
          <CheckCircle2 size={18} className="text-sage" />
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <header className="py-6">
        <h1 className="text-3xl font-bold text-dark-text tracking-tight mb-2">Обучение</h1>
        <p className="text-warm-gray">Видеокурсы и марафоны от экспертов MamaPro.</p>
      </header>

      {/* Featured Marathon */}
      <section className="mb-8">
        <h2 className="text-xl font-bold text-dark-text mb-4">Популярный марафон</h2>
        
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-accent-purple to-soft-pink p-[2px] shadow-warm">
          <div className="absolute top-0 right-0 p-4 opacity-30">
             <Heart size={100} className="fill-white" />
          </div>
          <div className="bg-white/95 backdrop-blur-xl rounded-[30px] p-6 relative z-10 flex flex-col h-full">
            <div className="flex items-start justify-between mb-3">
              <span className="bg-accent-purple/15 text-accent-purple text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">21 день</span>
              <div className="flex items-center gap-1 bg-cream px-2 py-1 rounded-lg">
                <Star size={12} className="fill-amber-400 text-amber-400" />
                <span className="text-xs font-bold text-dark-text">4.9</span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-dark-text mb-2 leading-tight">Счастливая мама</h3>
            <p className="text-sm text-warm-gray mb-6">Полная перезагрузка: от усталости к ресурсу за три недели с психологом.</p>
            
            <div className="mt-auto flex items-center justify-between">
               <div className="flex flex-col">
                <span className="text-[10px] text-warm-gray uppercase tracking-wider font-semibold">Цена</span>
                <span className="text-sm font-bold text-dark-text">Бесплатно с Pro</span>
              </div>
              <a 
                href="https://www.youtube.com/playlist?list=PL2-q-xEQvUymmPjD0oEib0A7g9Y67VzF4"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setToastMessage('Марафон открыт в новой вкладке!')}
                className="bg-dark-text text-white rounded-xl py-3 px-6 font-medium hover:bg-black transition-colors shadow-soft"
              >
                Начать марафон
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-2 no-scrollbar">
        {['Все', 'Психология', 'Здоровье малыша', 'Отношения', 'Сон'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveCategory(tab)}
            className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-sm active:scale-95 ${
              activeCategory === tab 
                ? 'bg-dark-text text-white' 
                : 'bg-white text-warm-gray border border-white hover:bg-cream'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Video Courses List */}
      <section>
        <h2 className="text-xl font-bold text-dark-text mb-4">Видеокурсы</h2>
        <div className="grid gap-4">
          {filteredCourses.map((course, idx) => (
            <button 
              key={idx} 
              onClick={() => setSelectedCourse(course)}
              className="text-left bg-white rounded-[2rem] p-4 shadow-softer border border-white flex gap-4 active:scale-95 transition-transform"
            >
              <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden flex-shrink-0 relative">
                <img src={course.img} alt={course.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                   <PlayCircle className="text-white opacity-80" size={32} />
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-dark-text leading-tight mb-1">{course.title}</h3>
                <p className="text-xs text-warm-gray mb-3">{course.author}</p>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[10px] text-warm-gray font-medium bg-cream px-2 py-1 rounded-md">
                    <BookOpen size={12} />
                    <span>{course.lessons} уроков</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-warm-gray font-medium bg-cream px-2 py-1 rounded-md">
                    <Clock size={12} />
                    <span>{course.time}</span>
                  </div>
                </div>
              </div>
            </button>
          ))}
          {filteredCourses.length === 0 && (
             <p className="text-sm text-warm-gray text-center py-8">Курсы в этой категории скоро появятся!</p>
          )}
        </div>
      </section>

      {/* Video Links Modal */}
      <Modal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} title={selectedCourse?.title || "Курс"}>
        {selectedCourse && (
          <div className="space-y-4">
            <p className="text-sm text-warm-gray mb-4">Выберите видеоурок для перехода на YouTube. Приятного просмотра!</p>
            <div className="space-y-2">
              {selectedCourse.youtubeLinks?.map((link: any, idx: number) => (
                <a 
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setToastMessage(`Ссылка на ${link.title} открыта!`)}
                  className="w-full bg-cream p-4 rounded-xl font-bold text-sm text-dark-text hover:bg-beige transition flex justify-between items-center active:scale-95"
                >
                  <span className="truncate pr-4">{link.title}</span>
                  <PlayCircle size={20} className="text-accent-pink flex-shrink-0" />
                </a>
              ))}
            </div>
            <button 
              onClick={() => setSelectedCourse(null)}
              className="w-full mt-4 text-center text-warm-gray font-semibold text-sm py-2 hover:text-dark-text"
            >
               Закрыть список
            </button>
          </div>
        )}
      </Modal>

    </div>
  );
}
