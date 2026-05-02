'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash2, Sparkles, Calendar, Search, ArrowLeft, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { NoDiaryEntries } from '@/components/ui/EmptyState';

const MOODS = [
  { label: '😴', value: 'sleepy', title: 'Усталость', color: 'bg-indigo-50 text-indigo-500' },
  { label: '😐', value: 'neutral', title: 'Нейтрально', color: 'bg-warm-gray/10 text-warm-gray' },
  { label: '🙂', value: 'good', title: 'Хорошо', color: 'bg-sage-light/30 text-sage-dark' },
  { label: '😊', value: 'happy', title: 'Отлично', color: 'bg-amber-50 text-amber-500' },
  { label: '✨', value: 'magical', title: 'Вдохновение', color: 'bg-rose-light/20 text-rose-dark' },
];

type DiaryEntry = {
  id: string;
  text: string;
  mood?: string;
  created_at: string;
};

export default function DiaryPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [selectedMood, setSelectedMood] = useState('happy');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadEntries();
  }, [isAuthenticated]);

  const loadEntries = async () => {
    try {
      const response = await api.get('/profile/diary');
      setEntries(response.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!text.trim()) {
      setToast('Напишите что-нибудь...');
      return;
    }
    setSaving(true);
    try {
      const response = await api.post('/profile/diary', {
        text: text.trim(),
        mood: selectedMood,
      });
      setEntries(prev => [response.data.data, ...prev]);
      setText('');
      setSelectedMood('happy');
      setToast('Запись добавлена ✨');
    } catch (err: any) {
      setToast('Ошибка при сохранении');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Удалить эту запись?')) return;
    try {
      await api.delete(`/profile/diary/${id}`);
      setEntries(prev => prev.filter(e => e.id !== id));
      setToast('Запись удалена');
    } catch (e) { setToast('Ошибка удаления'); }
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const sortedEntries = useMemo(
    () => [...entries].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
    [entries]
  );

  return (
    <div className="min-h-screen pb-32 bg-[#FDFBF9]">
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] bg-dark-text text-white px-5 py-3 rounded-full shadow-elevated flex items-center gap-2 animate-slide-in whitespace-nowrap text-sm font-semibold">
          {toast}
        </div>
      )}

      <header className="bg-white border-b border-beige px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <button onClick={() => router.back()} className="w-10 h-10 rounded-2xl bg-cream flex items-center justify-center text-dark-text hover:bg-beige transition md:hidden">
              <ArrowLeft size={20} />
            </button>
            <div className="hidden md:flex items-center gap-2 text-sage-dark font-black text-[10px] uppercase tracking-[0.2em]">
               <Sparkles size={14} /> Твои чувства важны
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-dark-text tracking-tighter">Личный дневник</h1>
              <p className="text-sm text-warm-gray font-medium">Место для твоих мыслей и моментов материнства.</p>
            </div>
            <div className="bg-cream rounded-2xl px-6 py-4 flex items-center gap-4 border border-beige shadow-sm">
               <Calendar size={20} className="text-sage" />
               <div className="text-left">
                  <p className="text-[10px] font-black text-warm-gray uppercase tracking-widest">Сегодня</p>
                  <p className="text-sm font-black text-dark-text">{new Date().toLocaleDateString('ru', { day: 'numeric', month: 'long' })}</p>
               </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pt-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          {/* New Entry Form */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-card border border-beige space-y-8 animate-in fade-in slide-in-from-top-4 duration-500">
             <div className="space-y-4">
                <p className="text-xs font-black text-dark-text uppercase tracking-widest px-1">Как вы себя чувствуете?</p>
                <div className="flex flex-wrap gap-3">
                   {MOODS.map((mood) => (
                     <button
                       key={mood.value}
                       onClick={() => setSelectedMood(mood.value)}
                       className={`group relative flex-1 min-w-[60px] aspect-square rounded-2xl flex items-center justify-center text-3xl transition-all duration-300 ${
                         selectedMood === mood.value 
                           ? 'bg-sage text-white shadow-warm scale-110' 
                           : 'bg-cream text-warm-gray border border-beige hover:bg-white'
                       }`}
                     >
                       {mood.label}
                       <span className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-black uppercase tracking-tighter transition-opacity duration-300 ${selectedMood === mood.value ? 'opacity-100 text-sage-dark' : 'opacity-0'}`}>
                         {mood.title}
                       </span>
                     </button>
                   ))}
                </div>
             </div>

             <div className="space-y-4 pt-4">
                <textarea 
                  value={text}
                  onChange={e => setText(e.target.value)}
                  placeholder="Напишите всё, что на душе..."
                  className="w-full bg-cream rounded-[2rem] p-6 min-h-[200px] border-2 border-transparent focus:border-sage/20 focus:bg-white outline-none transition-all duration-500 text-sm font-semibold leading-relaxed text-dark-text shadow-inner"
                />
                <button 
                  onClick={handleSave}
                  disabled={saving || !text.trim()}
                  className="w-full bg-dark-text text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-warm hover:bg-black transition-all active:scale-95 disabled:opacity-20 flex items-center justify-center gap-3"
                >
                  {saving ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                  {saving ? 'Сохранение...' : 'Добавить в дневник'}
                </button>
             </div>
          </div>

          {/* Entries Feed */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
               <h2 className="text-xl font-black text-dark-text">Прошлые записи</h2>
               <div className="flex items-center gap-2 text-warm-gray">
                  <Search size={18} />
               </div>
            </div>

            {loading ? (
              <div className="py-20 text-center"><Loader2 className="animate-spin mx-auto text-sage" size={32} /></div>
            ) : sortedEntries.length === 0 ? (
              <NoDiaryEntries onAdd={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
            ) : (
              <div className="grid gap-6">
                {sortedEntries.map((entry) => (
                  <div key={entry.id} className="bg-white rounded-[2.5rem] p-8 shadow-card border border-beige group hover:shadow-elevated transition-all duration-500 animate-in fade-in zoom-in-95">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-soft ${MOODS.find(m => m.value === entry.mood)?.color || 'bg-cream'}`}>
                           {MOODS.find(m => m.value === entry.mood)?.label || '🙂'}
                        </div>
                        <div>
                           <p className="text-xs font-black text-dark-text uppercase tracking-widest">{MOODS.find(m => m.value === entry.mood)?.title || 'Запись'}</p>
                           <p className="text-[10px] text-warm-gray font-bold uppercase tracking-tight">
                             {new Date(entry.created_at).toLocaleDateString('ru', { day: 'numeric', month: 'long', year: 'numeric' })}
                           </p>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(entry.id)}
                        className="w-10 h-10 rounded-full flex items-center justify-center text-warm-gray hover:bg-rose-light/10 hover:text-rose-dark transition-all duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-dark-text/80 whitespace-pre-wrap">{entry.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-8">
           <div className="bg-sage text-white p-10 rounded-[3rem] shadow-warm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700" />
              <h3 className="text-2xl font-black mb-4 relative z-10">Сила дневника</h3>
              <p className="text-sm text-white/80 leading-relaxed mb-6 relative z-10">Исследования показывают, что 5 минут фрирайтинга в день снижают уровень стресса у мам на 30%.</p>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center relative z-10">
                 <Sparkles size={24} />
              </div>
           </div>

           <div className="bg-white p-8 rounded-[3rem] border border-beige shadow-card space-y-6">
              <h4 className="text-xs font-black text-warm-gray uppercase tracking-[0.2em]">Ваша статистика</h4>
              <div className="grid grid-cols-2 gap-4">
                 <div className="bg-cream p-4 rounded-2xl text-center">
                    <p className="text-2xl font-black text-dark-text">{entries.length}</p>
                    <p className="text-[9px] font-bold text-warm-gray uppercase">Записей</p>
                 </div>
                 <div className="bg-sage-light/30 p-4 rounded-2xl text-center">
                    <p className="text-2xl font-black text-sage-dark">
                      {Math.round((entries.filter(e => e.mood === 'happy' || e.mood === 'good' || e.mood === 'magical').length / (entries.length || 1)) * 100)}%
                    </p>
                    <p className="text-[9px] font-bold text-sage-dark uppercase">Позитив</p>
                 </div>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}