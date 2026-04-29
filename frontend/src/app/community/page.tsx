'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, ShoppingBag, EyeOff, MapPin, Search, Plus, Filter, Heart, CheckCircle2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('Чаты');
  const [toastMessage, setToastMessage] = useState('');
  
  // Modals state
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);

  // Data state
  const [questionText, setQuestionText] = useState('');
  const [sellTitle, setSellTitle] = useState('');
  
  const [questions, setQuestions] = useState([
    { q: 'Как справиться с выгоранием, когда муж постоянно на работе, а помощи нет?', a: 'Это очень частая ситуация. Во-первых, важно признать, что вы не супермен...', tags: ['Выгорание', 'Отношения'] },
    { q: 'Ребенок 2 года бьет маму, что делать?', a: 'В этом возрасте ребенок исследует границы. Важно мягко, но твердо останавливать руку...', tags: ['Воспитание', 'Кризис 2 лет'] }
  ]);

  const [meetings, setMeetings] = useState([
    { id: 1, date: '15 Ноября, 11:00', title: 'Кофе-брейк: Жизнь после родов', expert: 'С психологом Асель Н.', spots: 2 },
    { id: 2, date: '22 Ноября, 15:00', title: 'Мастер-класс: Сон малыша', expert: 'С сомнологом Мариной', spots: 0 }
  ]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const handleAskQuestion = () => {
    if (!questionText.trim()) return;
    setQuestions([{ q: questionText, a: 'Ваш вопрос на модерации и скоро будет отвечен психологом платформы.', tags: ['Новый'] }, ...questions]);
    setQuestionText('');
    setIsQuestionModalOpen(false);
    setToastMessage('Анонимный вопрос успешно отправлен!');
  };

  const handleSell = () => {
    if (!sellTitle.trim()) return;
    setSellTitle('');
    setIsSellModalOpen(false);
    setToastMessage('Объявление добавлено в маркет!');
  };

  const handleBookMeeting = (id: number) => {
    setMeetings(meetings.map(m => m.id === id ? { ...m, spots: m.spots - 1 } : m));
    setToastMessage('Вы успешно записаны на встречу!');
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
        <h1 className="text-3xl font-bold text-dark-text tracking-tight mb-2">Общение</h1>
        <p className="text-warm-gray">Поддержка, обмен опытом и полезные вещи от других мам.</p>
      </header>

      {/* Main Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-2 no-scrollbar border-b border-beige">
        {[
          { name: 'Чаты', icon: MessageCircle },
          { name: 'Анонимно', icon: EyeOff },
          { name: 'Маркет', icon: ShoppingBag },
          { name: 'Встречи', icon: MapPin }
        ].map((tab) => (
          <button 
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={`flex items-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all shadow-sm ${
              activeTab === tab.name 
                ? 'bg-dark-text text-white' 
                : 'bg-white text-warm-gray border border-white'
            }`}
          >
            <tab.icon size={16} />
            {tab.name}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      
      {activeTab === 'Чаты' && (
        <section className="space-y-4 animate-fade-in mt-2">
          <div className="flex justify-between items-center mb-2">
             <h2 className="text-lg font-bold text-dark-text">Мои группы</h2>
             <button 
                onClick={() => setToastMessage('Функция создания чатов скоро появится!')}
                className="text-accent-pink text-sm font-semibold flex items-center gap-1 hover:opacity-80"
             >
                <Plus size={16}/>Создать
             </button>
          </div>
          
          {[
            { title: 'Мамы Астаны (Есиль)', msg: 'Асель: Девочки, посоветуйте хорошего массажиста...', time: '10:42', unread: 3 },
            { title: 'Малыши 0-6 мес', msg: 'Камила: Мы сегодня первый раз спали всю ночь! 🎉', time: 'Вчера', unread: 0 },
            { title: 'ГВ и Прикорм', msg: 'Вы: Спасибо за совет про брокколи!', time: 'Пн', unread: 0 },
          ].map((chat, idx) => (
            <button 
              key={idx} 
              onClick={() => setToastMessage(`Открывается чат: ${chat.title}`)}
              className="w-full text-left bg-white rounded-[1.5rem] p-4 shadow-softer border border-white flex gap-4 cursor-pointer hover:bg-cream/50 transition active:scale-95"
            >
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-lavender to-soft-pink flex items-center justify-center text-white font-bold text-lg shadow-inner">
                {chat.title[0]}
              </div>
              <div className="flex-1 flex flex-col justify-center overflow-hidden">
                <div className="flex justify-between items-center mb-1">
                  <h3 className="font-bold text-dark-text truncate pr-2">{chat.title}</h3>
                  <span className="text-xs text-warm-gray flex-shrink-0">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-warm-gray truncate">{chat.msg}</p>
                  {chat.unread > 0 && (
                    <span className="bg-accent-pink text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center ml-2">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </section>
      )}

      {activeTab === 'Анонимно' && (
        <section className="space-y-4 animate-fade-in mt-2">
          <div className="bg-gradient-to-br from-sage/40 to-white rounded-[2rem] p-5 shadow-softer border border-white relative overflow-hidden mb-6">
            <h3 className="font-bold text-dark-text text-lg mb-2">Задать анонимный вопрос</h3>
            <p className="text-sm text-warm-gray mb-4">Психологи платформы ответят на ваш вопрос. Никто не узнает ваше имя.</p>
            <button 
              onClick={() => setIsQuestionModalOpen(true)}
              className="bg-dark-text text-white py-3 px-6 rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-black transition"
            >
              <EyeOff size={16} /> Спросить безопасно
            </button>
          </div>

          <h2 className="text-lg font-bold text-dark-text mb-2">Лента ответов</h2>
          {questions.map((item, idx) => (
             <div key={idx} className="bg-white rounded-[2rem] p-5 shadow-softer border border-white">
                <div className="flex gap-2 items-center mb-3">
                  <span className="bg-cream px-2 py-1 rounded text-xs font-bold text-warm-gray flex items-center gap-1"><EyeOff size={12}/> Анонимно</span>
                  {item.tags.map(t => <span key={t} className="text-[10px] text-accent-purple font-medium">#{t}</span>)}
                </div>
                <h4 className="font-bold text-dark-text mb-3 leading-tight">В: {item.q}</h4>
                <div className="bg-cream/50 rounded-2xl p-4 border-l-2 border-accent-pink">
                  <p className="text-sm text-warm-gray"><span className="font-bold text-accent-pink">Ответ психолога: </span>{item.a}</p>
                </div>
             </div>
          ))}
        </section>
      )}

      {activeTab === 'Маркет' && (
        <section className="space-y-4 animate-fade-in mt-2">
          <div className="flex gap-2">
            <div className="flex-1 bg-white rounded-2xl shadow-softer border border-white flex items-center px-4 py-2.5">
              <Search size={18} className="text-warm-gray mr-2" />
              <input type="text" placeholder="Коляска, вещи..." className="bg-transparent text-sm w-full outline-none" />
            </div>
            <button 
              onClick={() => setIsSellModalOpen(true)}
              className="bg-dark-text text-white rounded-2xl px-4 flex items-center justify-center font-medium text-sm hover:bg-black transition"
            >
              <Plus size={18} className="mr-1"/> Продать
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { title: 'Коляска Cybex Balios S', price: '120 000 ₸', img: 'https://images.unsplash.com/photo-1512411933096-764f6990d1f1?auto=format&fit=crop&w=400&q=80' },
              { title: 'Пакет вещей на 0-3 мес', price: 'Отдам даром', img: 'https://images.unsplash.com/photo-1522771930-78848d92fa24?auto=format&fit=crop&w=400&q=80' },
              { title: 'Стерилизатор Philips', price: '15 000 ₸', img: 'https://images.unsplash.com/photo-1584992236310-6edddc08acff?auto=format&fit=crop&w=400&q=80' },
              { title: 'Манеж детский', price: '20 000 ₸', img: 'https://images.unsplash.com/photo-1505682631557-0b190a4dfb7c?auto=format&fit=crop&w=400&q=80' }
            ].map((item, idx) => (
              <button 
                key={idx} 
                onClick={() => setToastMessage(`Связаться с продавцом: ${item.title}`)}
                className="text-left bg-white rounded-3xl p-3 shadow-softer border border-white hover:scale-95 transition-transform"
              >
                <div className="w-full aspect-square rounded-2xl overflow-hidden mb-3 bg-cream">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-xs font-bold text-dark-text truncate">{item.title}</h4>
                <p className="text-sm font-black text-accent-pink mt-1">{item.price}</p>
              </button>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'Встречи' && (
        <section className="space-y-4 animate-fade-in mt-2">
          <div className="bg-dark-text rounded-[2rem] p-6 text-white shadow-soft relative overflow-hidden mb-6">
            <MapPin className="absolute right-[-20px] bottom-[-20px] text-white/10" size={120} />
            <h3 className="font-bold text-xl mb-2 relative z-10">Офлайн встречи</h3>
            <p className="text-sm text-white/70 mb-5 relative z-10">Живое общение с мамами и экспертами (психолог, педиатр) за чашечкой кофе.</p>
            <button 
              onClick={() => setToastMessage('Ближайшие встречи показаны ниже!')}
              className="bg-white text-dark-text py-2.5 px-6 rounded-xl font-bold text-sm relative z-10 hover:bg-cream transition"
            >
              Хочу участвовать
            </button>
          </div>

          <h2 className="text-lg font-bold text-dark-text mb-2">Ближайшие в г. Астана</h2>
          {meetings.map((meet) => (
             <div key={meet.id} className="bg-white rounded-[2rem] p-5 shadow-softer border border-white flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-accent-pink bg-accent-pink/10 px-3 py-1 rounded-full">{meet.date}</span>
                  {meet.spots > 0 ? (
                     <span className="text-xs font-bold text-sage">Осталось {meet.spots} места</span>
                  ) : (
                     <span className="text-xs font-bold text-warm-gray">Мест нет</span>
                  )}
                </div>
                <h4 className="font-bold text-dark-text text-lg leading-tight">{meet.title}</h4>
                <p className="text-sm text-warm-gray">{meet.expert}</p>
                <button 
                  onClick={() => handleBookMeeting(meet.id)}
                  disabled={meet.spots === 0}
                  className={`mt-2 py-3 rounded-xl font-bold text-sm transition-colors ${meet.spots > 0 ? 'bg-cream text-dark-text hover:bg-beige active:scale-95' : 'bg-cream/50 text-warm-gray opacity-50 cursor-not-allowed'}`}
                >
                  {meet.spots > 0 ? 'Записаться (20 000 ₸)' : 'Запись закрыта'}
                </button>
             </div>
          ))}
        </section>
      )}

      {/* Modals */}
      <Modal isOpen={isQuestionModalOpen} onClose={() => setIsQuestionModalOpen(false)} title="Задать анонимный вопрос">
        <textarea 
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Опишите вашу ситуацию..."
          className="w-full h-32 bg-cream p-4 rounded-2xl outline-none border-2 border-transparent focus:border-accent-pink resize-none text-sm text-dark-text placeholder:text-warm-gray mb-4"
        ></textarea>
        <button 
          onClick={handleAskQuestion}
          disabled={!questionText.trim()}
          className="w-full bg-dark-text text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-black transition"
        >
          Отправить вопрос
        </button>
      </Modal>

      <Modal isOpen={isSellModalOpen} onClose={() => setIsSellModalOpen(false)} title="Создать объявление">
        <input 
          type="text"
          value={sellTitle}
          onChange={(e) => setSellTitle(e.target.value)}
          placeholder="Что продаете? (например: Коляска)"
          className="w-full bg-cream p-4 rounded-xl outline-none border-2 border-transparent focus:border-accent-pink text-sm text-dark-text mb-4"
        />
        <input 
          type="text"
          placeholder="Цена (₸)"
          className="w-full bg-cream p-4 rounded-xl outline-none border-2 border-transparent focus:border-accent-pink text-sm text-dark-text mb-4"
        />
        <button 
          onClick={handleSell}
          disabled={!sellTitle.trim()}
          className="w-full bg-accent-pink text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-accent-pink/90 transition"
        >
          Опубликовать
        </button>
      </Modal>

    </div>
  );
}
