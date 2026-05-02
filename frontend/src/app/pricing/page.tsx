'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, ShieldCheck, CheckCircle2, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/api';

export default function PricingPage() {
  const router = useRouter();
  const { user, fetchProfile } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const isPro = user?.subscription === 'pro';

  const handleUpgrade = async () => {
    if (isPro) return;
    setLoading(true);
    try {
      await api.post('/subscription/upgrade', { plan: 'pro' });
      await fetchProfile();
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (e) {
      console.error(e);
      alert('Ошибка при оформлении подписки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-32 bg-[#FDFBF9]">
      {/* Header Section */}
      <div className="px-6 pt-16 pb-12 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-sage-light/30 rounded-full text-sage-dark font-black text-[10px] uppercase tracking-[0.2em] animate-in fade-in slide-in-from-top-4 duration-700">
           <Sparkles size={14} /> Твоё материнство — наше вдохновение
        </div>
        <h1 className="text-5xl font-black text-dark-text tracking-tighter max-w-2xl mx-auto leading-none">
          Раскройте потенциал <br /> <span className="text-sage">MamaPro PRO</span>
        </h1>
        <p className="text-warm-gray font-medium max-w-md mx-auto text-sm leading-relaxed">
          Получите полный доступ ко всем экспертам, курсам и сообществу без ограничений.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 grid gap-10 md:grid-cols-2 items-start">
        {/* Main Card */}
        <div className="bg-white rounded-[3rem] p-10 shadow-elevated border border-beige relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-sage/5 -mr-32 -mt-32 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
           
           <div className="relative z-10 space-y-8">
              <div className="flex items-center justify-between">
                 <div className="w-16 h-16 bg-sage text-white rounded-[1.75rem] flex items-center justify-center shadow-warm">
                    <Crown size={32} />
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-warm-gray uppercase tracking-widest mb-1">Тариф</p>
                    <p className="text-2xl font-black text-dark-text leading-none">PRO</p>
                 </div>
              </div>

              <div className="space-y-2">
                 <p className="text-5xl font-black text-dark-text tracking-tighter">25 000 ₸</p>
                 <p className="text-xs font-black text-warm-gray uppercase tracking-widest">Ежемесячная подписка</p>
              </div>

              <div className="space-y-5">
                 <p className="text-xs font-black text-dark-text uppercase tracking-widest">Включено в тариф:</p>
                 <ul className="space-y-4">
                    {[
                      'Все курсы и марафоны специалистов',
                      'Безлимитная запись на консультации',
                      'Чат с педиатром и психологом 24/7',
                      'Полная история в личном дневнике',
                      'Приоритетный доступ к новым фичам',
                      'Отсутствие рекламы в маркете'
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm font-semibold text-dark-text">
                        <div className="w-5 h-5 rounded-full bg-sage-light/30 flex items-center justify-center text-sage-dark flex-shrink-0">
                          <CheckCircle2 size={12} />
                        </div>
                        {feature}
                      </li>
                    ))}
                 </ul>
              </div>

              <button
                disabled={isPro || loading || success}
                onClick={handleUpgrade}
                className={`w-full py-6 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-warm transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 ${
                  isPro 
                    ? 'bg-cream text-sage-dark cursor-default' 
                    : success 
                      ? 'bg-sage text-white' 
                      : 'bg-dark-text text-white hover:bg-black'
                }`}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                {isPro ? 'Ваш тариф: PRO' : success ? 'Успешно активировано!' : 'Активировать PRO'}
                {!loading && !success && !isPro && <ArrowRight size={18} />}
              </button>
              
              {success && (
                <p className="text-[10px] font-black text-sage-dark text-center animate-pulse uppercase tracking-widest">
                  Перенаправляем в личный кабинет...
                </p>
              )}
           </div>
        </div>

        {/* Benefits Sidebar */}
        <div className="space-y-8 py-4">
           <div className="space-y-6">
              <h3 className="text-xl font-black text-dark-text tracking-tight">Почему выбирают PRO?</h3>
              <div className="grid gap-6">
                 {[
                   { 
                     title: 'Безопасность', 
                     desc: 'Все специалисты проходят верификацию по документам и образованию.',
                     icon: ShieldCheck,
                     color: 'bg-sage-light/20 text-sage-dark'
                   },
                   { 
                     title: 'Экономия', 
                     desc: 'Пакет PRO дешевле, чем 2 отдельные консультации у топ-экспертов.',
                     icon: Crown,
                     color: 'bg-cream text-dark-text'
                   }
                 ].map((item, idx) => (
                   <div key={idx} className="flex gap-4 p-6 rounded-3xl bg-white border border-beige shadow-sm">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                         <item.icon size={24} />
                      </div>
                      <div className="space-y-1">
                         <h4 className="font-black text-dark-text text-sm">{item.title}</h4>
                         <p className="text-xs text-warm-gray font-medium leading-relaxed">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           <div className="p-8 rounded-[2.5rem] bg-sage-light/20 border border-sage/20 space-y-4">
              <h4 className="text-sm font-black text-sage-dark uppercase tracking-widest">Поддержка</h4>
              <p className="text-xs text-dark-text/70 font-medium leading-relaxed">
                Если у вас возникли вопросы по оплате или доступу, наша команда всегда готова помочь в WhatsApp или по телефону.
              </p>
              <button className="text-xs font-black text-sage-dark hover:underline flex items-center gap-2">
                Связаться с менеджером <ArrowRight size={14} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
