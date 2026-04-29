'use client';

import React, { useState, useEffect } from 'react';
import { Search, Star, Filter, Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';

const experts = [
  {
    id: 1,
    name: 'Доктор Асель Нургалиева',
    title: 'Перинатальный психолог',
    rating: 4.9,
    reviews: 128,
    price: '12 000 ₸',
    image: 'https://i.pravatar.cc/150?img=32',
    tags: ['Тревожность', 'После родов', 'Сон'],
    availableToday: true,
  },
  {
    id: 2,
    name: 'Доктор Тимур Омаров',
    title: 'Педиатр',
    rating: 4.8,
    reviews: 94,
    price: '15 000 ₸',
    image: 'https://i.pravatar.cc/150?img=11',
    tags: ['Новорожденные', 'Питание', 'Развитие'],
    availableToday: false,
  },
  {
    id: 3,
    name: 'Мадина Касымова',
    title: 'Консультант по ГВ',
    rating: 5.0,
    reviews: 205,
    price: '10 000 ₸',
    image: 'https://i.pravatar.cc/150?img=43',
    tags: ['Грудное вскармливание', 'Сцеживание', 'Завершение ГВ'],
    availableToday: true,
  }
];

export default function CarePage() {
  const [activeTab, setActiveTab] = useState('Психологи');
  const [toastMessage, setToastMessage] = useState('');
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [selectedTime, setSelectedTime] = useState<string>('');

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleBook = () => {
    if (!selectedTime) return;
    setToastMessage(`Вы успешно записаны к ${selectedExpert.name} на ${selectedTime}!`);
    setSelectedExpert(null);
    setSelectedTime('');
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

      {/* Header */}
      <header className="py-6">
        <h1 className="text-3xl font-bold text-dark-text tracking-tight mb-2">Найти специалиста</h1>
        <p className="text-warm-gray">Запишитесь на онлайн-консультацию к проверенным экспертам.</p>
      </header>

      {/* Search and Filter */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 bg-white rounded-[1.5rem] shadow-softer border border-white flex items-center px-5 py-3">
          <Search size={20} className="text-warm-gray mr-3" />
          <input 
            type="text" 
            placeholder="Поиск по имени или профилю..." 
            className="bg-transparent border-none outline-none w-full text-sm text-dark-text placeholder:text-warm-gray/70"
          />
        </div>
        <button className="bg-white rounded-[1.5rem] shadow-softer border border-white w-14 flex items-center justify-center text-dark-text hover:bg-beige transition">
          <Filter size={20} />
        </button>
      </div>

      {/* Categories Horizontal Scroll */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-2 no-scrollbar">
        {['Психологи', 'Педиатры', 'Гинекологи', 'Консультанты по сну'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-6 py-3 rounded-full text-sm font-semibold transition-all shadow-sm ${
              activeTab === tab 
                ? 'bg-dark-text text-white' 
                : 'bg-white text-warm-gray border border-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Experts List */}
      <div className="space-y-4">
        {experts.map((expert) => (
          <div key={expert.id} className="bg-white rounded-[2rem] p-5 shadow-softer border border-white flex flex-col gap-4 relative overflow-hidden group">
            <div className="flex gap-4">
              <div className="relative">
                <img src={expert.image} alt={expert.name} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-sm" />
                {expert.availableToday && (
                  <span className="absolute -bottom-2 -right-2 bg-sage text-green-800 text-[10px] font-bold px-2 py-1 rounded-lg border-2 border-white shadow-sm uppercase">
                    Сегодня
                  </span>
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-dark-text leading-tight">{expert.name}</h3>
                    <p className="text-xs text-accent-purple font-medium mt-1">{expert.title}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-cream px-2 py-1 rounded-lg">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-dark-text">{expert.rating}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {expert.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-cream text-warm-gray px-2.5 py-1 rounded-md font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-cream/50 mt-1">
              <div className="flex flex-col">
                <span className="text-[10px] text-warm-gray uppercase tracking-wider font-semibold">За сеанс</span>
                <span className="text-sm font-bold text-dark-text">{expert.price}</span>
              </div>
              <button 
                onClick={() => setSelectedExpert(expert)}
                className="bg-accent-pink hover:bg-accent-pink/90 text-white text-sm font-bold py-3 px-6 rounded-xl transition-colors shadow-warm flex items-center gap-2"
              >
                <CalendarIcon size={18} />
                Записаться
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      <Modal isOpen={!!selectedExpert} onClose={() => setSelectedExpert(null)} title="Запись на онлайн сессию">
        {selectedExpert && (
          <div className="space-y-4">
            <div className="flex items-center gap-4 bg-cream p-4 rounded-2xl">
              <img src={selectedExpert.image} alt={selectedExpert.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h4 className="font-bold text-dark-text leading-none">{selectedExpert.name}</h4>
                <span className="text-xs text-warm-gray">{selectedExpert.title}</span>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-dark-text mb-2 text-sm">Доступное время на завтра:</h4>
              <div className="grid grid-cols-3 gap-2">
                {['10:00', '11:30', '14:00', '15:30', '17:00'].map(time => (
                  <button 
                    key={time}
                    onClick={() => setSelectedTime(time)}
                    className={`py-2 rounded-xl text-sm font-bold transition ${selectedTime === time ? 'bg-dark-text text-white' : 'bg-cream text-dark-text border border-transparent hover:border-warm-gray'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleBook}
              disabled={!selectedTime}
              className="w-full bg-accent-pink text-white font-bold py-3.5 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-pink/90 transition shadow-warm mt-4"
            >
              Подтвердить запись за {selectedExpert.price}
            </button>
          </div>
        )}
      </Modal>

    </div>
  );
}
