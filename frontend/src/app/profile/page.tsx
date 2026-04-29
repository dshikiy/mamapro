'use client';

import React, { useState, useEffect } from 'react';
import { Settings, CreditCard, Activity, BookHeart, Baby, ChevronRight, LogOut, Crown, CheckCircle2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState('Профиль');
  const [toastMessage, setToastMessage] = useState('');
  
  // Modals state
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);

  // Data state
  const [diaryText, setDiaryText] = useState('');
  const [diaryEntries, setDiaryEntries] = useState([
    { date: 'Сегодня, 10:30', mood: 'Устала 😴', text: 'Опять не спали полночи. Алихан плакал из-за зубов. Чувствую себя истощенной, но посмотрела урок марафона — стало легче.' },
    { date: '21 Окт, 18:00', mood: 'Отлично 😊', text: 'Первый раз оставила малыша с мужем и сходила на маникюр. Я так скучала по этому чувству свободы!' }
  ]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleSaveDiary = () => {
    if (!diaryText.trim()) return;
    setDiaryEntries([{ date: 'Только что', mood: 'Хорошо 🙂', text: diaryText }, ...diaryEntries]);
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

      {/* Header */}
      <header className="flex justify-between items-center py-6">
        <h1 className="text-3xl font-bold text-dark-text tracking-tight">Профиль</h1>
        <button 
          onClick={() => setToastMessage('Настройки скоро появятся')}
          className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-dark-text shadow-softer hover:scale-105 transition-transform"
        >
          <Settings size={20} />
        </button>
      </header>

      {/* User Info Card */}
      <div className="bg-white rounded-[2rem] p-5 shadow-softer border border-white flex items-center gap-5 mb-6">
        <div className="h-20 w-20 rounded-full bg-soft-pink border-4 border-cream shadow-inner flex items-center justify-center overflow-hidden flex-shrink-0">
          <img src="https://i.pravatar.cc/150?img=5" alt="Aigerim" className="h-full w-full object-cover" />
        </div>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-dark-text leading-tight">Айгерим</h2>
          <p className="text-sm text-warm-gray mb-2">Мама Алихана (6 мес)</p>
          <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-accent-pink to-accent-purple text-white px-3 py-1 rounded-full shadow-sm">
             <Crown size={12} className="text-white" />
             <span className="text-[10px] font-bold uppercase tracking-wider">Pro Подписка</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar border-b border-beige">
        {['Профиль', 'Дневник', 'Тесты', 'Подписка'].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-sm ${
              activeTab === tab 
                ? 'bg-dark-text text-white' 
                : 'bg-white text-warm-gray border border-white'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      
      {activeTab === 'Профиль' && (
        <section className="space-y-3 animate-fade-in mt-2">
          {[
             { icon: Activity, label: 'История встреч' },
             { icon: CreditCard, label: 'Способы оплаты' },
             { icon: Baby, label: 'Данные малыша' },
          ].map((item, idx) => (
             <button 
               key={idx} 
               onClick={() => setToastMessage(`Раздел "${item.label}" в разработке`)}
               className="w-full bg-white rounded-2xl p-4 shadow-softer border border-white flex items-center justify-between active:scale-95 transition-transform"
             >
               <div className="flex items-center gap-4">
                 <div className="h-10 w-10 rounded-full bg-cream flex items-center justify-center text-warm-gray">
                   <item.icon size={20} />
                 </div>
                 <span className="font-semibold text-dark-text">{item.label}</span>
               </div>
               <ChevronRight size={20} className="text-warm-gray opacity-50" />
             </button>
          ))}
          
          <button 
            onClick={() => setToastMessage('Вы вышли из аккаунта')}
            className="w-full bg-transparent border-2 border-beige rounded-2xl p-4 flex items-center justify-center gap-2 mt-8 text-warm-gray font-semibold hover:bg-beige/30 transition active:scale-95"
          >
             <LogOut size={18} /> Выйти из аккаунта
          </button>
        </section>
      )}

      {activeTab === 'Дневник' && (
        <section className="space-y-4 animate-fade-in mt-2">
          <div className="bg-gradient-to-br from-soft-pink/40 to-white rounded-[2rem] p-5 shadow-softer border border-white relative overflow-hidden mb-2">
            <h3 className="font-bold text-dark-text text-lg mb-1">Дневник мамы</h3>
            <p className="text-sm text-warm-gray mb-4">Пишите сюда свои эмоции, трудности и радости. Это помогает снять стресс.</p>
            <button 
              onClick={() => setIsDiaryModalOpen(true)}
              className="bg-dark-text text-white py-3 px-6 rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-black transition"
            >
              <BookHeart size={16} /> Новая запись
            </button>
          </div>

          <h2 className="text-lg font-bold text-dark-text mt-4 mb-2">Ваши записи</h2>
          {diaryEntries.map((entry, idx) => (
             <div key={idx} className="bg-white rounded-[1.5rem] p-5 shadow-softer border border-white">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-warm-gray">{entry.date}</span>
                  <span className="bg-cream px-3 py-1 rounded-full text-xs font-bold text-dark-text">{entry.mood}</span>
                </div>
                <p className="text-sm text-dark-text leading-relaxed">{entry.text}</p>
             </div>
          ))}
        </section>
      )}

      {activeTab === 'Тесты' && (
        <section className="space-y-4 animate-fade-in mt-2">
          <div className="bg-dark-text rounded-[2rem] p-6 text-white shadow-soft relative overflow-hidden mb-4">
            <Baby className="absolute right-[-10px] bottom-[-10px] text-white/10" size={100} />
            <h3 className="font-bold text-xl mb-2 relative z-10">Развитие малыша</h3>
            <p className="text-sm text-white/70 mb-5 relative z-10">Узнайте, правильно ли развивается ваш ребенок по нормам ВОЗ. Пройдите короткий тест.</p>
            <button 
              onClick={() => setIsTestModalOpen(true)}
              className="bg-white text-dark-text py-2.5 px-6 rounded-xl font-bold text-sm relative z-10 hover:bg-cream transition active:scale-95"
            >
              Пройти тест (6 мес)
            </button>
          </div>

          <h2 className="text-lg font-bold text-dark-text mb-2">Прошлые результаты</h2>
          <div className="bg-white rounded-[1.5rem] p-4 shadow-softer border border-white flex justify-between items-center">
            <div>
              <h4 className="font-bold text-dark-text">Тест 3 месяца</h4>
              <p className="text-xs text-sage font-bold mt-1">Все в норме</p>
            </div>
            <button className="text-accent-pink text-sm font-semibold hover:opacity-80">Смотреть</button>
          </div>
        </section>
      )}

      {activeTab === 'Подписка' && (
        <section className="space-y-4 animate-fade-in mt-2">
          <div className="bg-gradient-to-br from-accent-pink to-accent-purple rounded-[2rem] p-6 text-white shadow-warm text-center">
            <Crown size={40} className="mx-auto mb-3 text-white/90" />
            <h3 className="font-bold text-2xl mb-1">MamaPro PRO</h3>
            <p className="text-white/80 text-sm mb-6">Ваша подписка активна до 15.12.2023</p>
            
            <div className="bg-white/10 rounded-2xl p-4 text-left space-y-3">
               <div className="flex items-center justify-between text-sm">
                 <span>Безлимитные видеокурсы</span>
                 <span className="font-bold">✓</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                 <span>Все марафоны бесплатно</span>
                 <span className="font-bold">✓</span>
               </div>
               <div className="flex items-center justify-between text-sm">
                 <span>Бесплатный маркетплейс</span>
                 <span className="font-bold">✓</span>
               </div>
               <div className="flex items-center justify-between text-sm text-white/60 pt-2 border-t border-white/20">
                 <span>Следующее списание: 25 000 ₸</span>
               </div>
            </div>
            
            <button 
              onClick={() => setIsSubModalOpen(true)}
              className="w-full bg-white text-dark-text py-3 rounded-xl font-bold mt-6 hover:bg-cream transition active:scale-95"
            >
              Управление подпиской
            </button>
          </div>

          <div className="bg-white rounded-[1.5rem] p-5 shadow-softer border border-white">
            <h4 className="font-bold text-dark-text mb-2">Почему PRO стоит своих денег?</h4>
            <p className="text-sm text-warm-gray">Одна сессия с психологом стоит 15 000 ₸. С подпиской вы получаете доступ к сотням часов терапии через курсы и поддержку в чатах, экономя более 100 000 ₸ в месяц.</p>
          </div>
        </section>
      )}

      {/* Modals */}
      <Modal isOpen={isDiaryModalOpen} onClose={() => setIsDiaryModalOpen(false)} title="Новая запись в дневник">
        <textarea 
          value={diaryText}
          onChange={(e) => setDiaryText(e.target.value)}
          placeholder="Опишите ваши эмоции за сегодня..."
          className="w-full h-32 bg-cream p-4 rounded-2xl outline-none border-2 border-transparent focus:border-accent-pink resize-none text-sm text-dark-text placeholder:text-warm-gray mb-4"
        ></textarea>
        <button 
          onClick={handleSaveDiary}
          disabled={!diaryText.trim()}
          className="w-full bg-dark-text text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition"
        >
          Сохранить запись
        </button>
      </Modal>

      <Modal isOpen={isTestModalOpen} onClose={() => setIsTestModalOpen(false)} title="Тест развития (6 мес)">
        <div className="space-y-4">
          <p className="text-sm text-warm-gray font-medium">Вопрос 1 из 3</p>
          <h4 className="text-lg font-bold text-dark-text">Малыш переворачивается со спины на живот?</h4>
          <div className="space-y-2 mt-4">
            <button 
              onClick={() => { setIsTestModalOpen(false); setToastMessage('Тест пройден: Все в норме!'); }}
              className="w-full bg-cream text-dark-text font-bold py-3 rounded-xl hover:bg-sage transition"
            >
              Да, уверенно
            </button>
            <button 
              onClick={() => { setIsTestModalOpen(false); setToastMessage('Тест пройден: Обратите внимание на тонус.'); }}
              className="w-full bg-cream text-dark-text font-bold py-3 rounded-xl hover:bg-accent-pink transition"
            >
              Иногда
            </button>
            <button 
              onClick={() => { setIsTestModalOpen(false); setToastMessage('Тест пройден: Рекомендуется визит к педиатру.'); }}
              className="w-full bg-cream text-dark-text font-bold py-3 rounded-xl hover:bg-accent-pink transition"
            >
              Нет
            </button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} title="Управление подпиской">
        <div className="space-y-4">
          <div className="bg-cream p-4 rounded-2xl">
            <p className="text-sm text-warm-gray mb-1">Привязанная карта</p>
            <p className="font-bold text-dark-text">•••• •••• •••• 4242</p>
          </div>
          <button 
            onClick={() => { setIsSubModalOpen(false); setToastMessage('Подписка отменена (шутка, это демо!)'); }}
            className="w-full text-accent-pink font-bold py-3 rounded-xl hover:bg-accent-pink/10 transition"
          >
            Отменить подписку
          </button>
        </div>
      </Modal>

    </div>
  );
}
