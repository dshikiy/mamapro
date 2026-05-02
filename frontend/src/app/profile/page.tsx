'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Crown, ChevronRight, LogOut, Settings, Edit3, Heart, ShoppingBag, BookHeart, CreditCard, Users, Calendar, MessageCircle
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Modal from '@/components/ui/Modal';

const PROFILE_MENU = [
  { id: 'diary', icon: BookHeart, label: 'Мой дневник', sub: 'Заметки и трекер' },
  { id: 'appointments', icon: Calendar, label: 'Мои записи', sub: 'Консультации' },
  { id: 'listings', icon: ShoppingBag, label: 'Мои объявления', sub: 'Управление товарами' },
  { id: 'favorites', icon: Heart, label: 'Избранное', sub: 'Сохраненные товары' },
  { id: 'patients', icon: Users, label: 'Мои пациенты', sub: 'Список записей', role: 'specialist' },
  { id: 'settings', icon: Settings, label: 'Настройки', sub: 'Управление аккаунтом' },
];

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState('');
  
  const [isPatientsModalOpen, setIsPatientsModalOpen] = useState(false);
  const [isAppointmentsModalOpen, setIsAppointmentsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  
  const [patients, setPatients] = useState<any[]>([]);
  const [myAppointments, setMyAppointments] = useState<any[]>([]);
  
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const fetchProfile = useAuthStore(state => state.fetchProfile);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  useEffect(() => {
    if (user) {
      setEditName(user.name || '');
      setEditBio(user.bio || '');
    }
  }, [user]);

  if (mounted && !isAuthenticated) {
    router.push('/login');
    return null;
  }

  if (!mounted) return null;

  const handleAvatarUpload = async (file: File) => {
    setToast('Загрузка фото...');
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        await api.put('/profile', { avatar: base64String });
        await fetchProfile();
        setToast('Фото профиля обновлено ✨');
      } catch (err) {
        setToast('Ошибка при загрузке фото');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      setToast('Имя не может быть пустым');
      return;
    }
    setIsSaving(true);
    try {
      await api.put('/profile', { name: editName, bio: editBio });
      await fetchProfile();
      setIsSettingsModalOpen(false);
      setToast('Профиль успешно обновлен ✨');
    } catch (err) {
      setToast('Ошибка при сохранении профиля');
    } finally {
      setIsSaving(false);
    }
  };

  const loadPatients = async () => {
    try {
      const res = await api.get('/appointments/specialist');
      setPatients(res.data.data);
    } catch (e) {
      setToast('Ошибка при загрузке пациентов');
    }
  };

  const loadMyAppointments = async () => {
    try {
      const res = await api.get('/appointments');
      setMyAppointments(res.data.data);
    } catch (e) {
      setToast('Ошибка при загрузке ваших записей');
    }
  };

  const handleProfileItem = (id: string) => {
    if (id === 'diary') router.push('/diary');
    else if (id === 'listings') router.push('/marketplace'); // Ideally a separate page, but marketplace is fine for now
    else if (id === 'settings') setIsSettingsModalOpen(true);
    else if (id === 'favorites') router.push('/marketplace'); // Redirect to market for now
    else if (id === 'patients') {
      loadPatients();
      setIsPatientsModalOpen(true);
    } else if (id === 'appointments') {
      loadMyAppointments();
      setIsAppointmentsModalOpen(true);
    }
  };

  const isPro = user?.subscription === 'pro';

  return (
    <div className="min-h-screen pb-32 bg-[#FDFBF9]">
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] bg-dark-text text-white px-5 py-3 rounded-full shadow-elevated flex items-center gap-2 animate-slide-in whitespace-nowrap text-sm font-semibold">
          {toast}
        </div>
      )}

      <div className="px-6 pt-10">
        <h1 className="text-4xl font-black text-dark-text mb-8 tracking-tighter">Личный кабинет</h1>

        {/* Profile Card */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-card border border-beige mb-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sage/5 -mr-12 -mt-12 rounded-full group-hover:scale-150 transition-transform duration-1000" />
          <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
            <div className="relative group/avatar">
              <div className="w-24 h-24 rounded-[2rem] overflow-hidden shadow-soft border-4 border-white ring-2 ring-beige group-hover/avatar:ring-sage transition-all duration-300">
                <img src={user?.avatar || "https://i.pravatar.cc/150?img=5"} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <label htmlFor="avatar-upload" className="absolute -bottom-2 -right-2 w-10 h-10 bg-dark-text text-white rounded-full flex items-center justify-center shadow-warm cursor-pointer hover:bg-black transition-all active:scale-90">
                <Edit3 size={16} />
                <input type="file" id="avatar-upload" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])} />
              </label>
            </div>
            <div className="text-center sm:text-left space-y-2">
              <h2 className="text-2xl font-black text-dark-text leading-tight">{user?.name || 'Мама'}</h2>
              <p className="text-sm text-warm-gray font-medium line-clamp-1">{user?.bio || 'Заполните био в настройках'}</p>
              <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${isPro ? 'bg-sage-light/30 text-sage-dark' : 'bg-cream text-warm-gray'}`}>
                {isPro ? <Crown size={12} /> : <CreditCard size={12} />}
                {isPro ? 'Pro статус активен' : 'Базовый тариф'}
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Banner */}
        <div 
          onClick={() => isPro ? null : router.push('/pricing')}
          className={`cursor-pointer rounded-[2.5rem] p-8 text-white shadow-warm relative overflow-hidden mb-10 transition-all duration-500 hover:-translate-y-1 ${
            isPro ? 'bg-dark-text' : 'bg-gradient-to-br from-sage to-sage-dark'
          }`}
        >
          <div className="absolute right-0 top-0 w-40 h-40 bg-white/10 -mr-10 -mt-10 rounded-full blur-2xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h3 className="font-black text-2xl mb-2">MamaPro {isPro ? 'PRO' : 'Upgrade'}</h3>
              <p className="text-white/70 text-sm max-w-sm leading-relaxed">
                {isPro 
                  ? 'Вы используете все возможности платформы на максимум. Спасибо, что вы с нами!' 
                  : 'Получите безлимитный доступ к специалистам, курсам и чату 24/7.'}
              </p>
            </div>
            {!isPro && (
              <button className="bg-white text-dark-text font-black py-4 px-8 rounded-2xl text-xs uppercase tracking-[0.2em] shadow-lg hover:bg-beige transition active:scale-95">
                Активировать PRO
              </button>
            )}
          </div>
        </div>

        {/* Action Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {PROFILE_MENU.filter(item => !item.role || item.role === user?.role).map((item) => (
            <button
              key={item.id}
              onClick={() => handleProfileItem(item.id)}
              className="group bg-white rounded-[2rem] p-6 shadow-card border border-beige flex items-center gap-5 hover:border-sage transition-all duration-300"
            >
              <div className="w-14 h-14 rounded-2xl bg-cream flex items-center justify-center text-dark-text group-hover:scale-110 group-hover:bg-sage-light transition-all">
                <item.icon size={24} />
              </div>
              <div className="flex-1 text-left">
                <p className="font-black text-dark-text text-sm tracking-tight">{item.label}</p>
                <p className="text-[11px] text-warm-gray font-medium">{item.sub}</p>
              </div>
              <ChevronRight size={20} className="text-beige group-hover:text-sage transition-colors" />
            </button>
          ))}
        </div>

        <button
          onClick={() => { logout(); router.push('/login'); }}
          className="w-full bg-cream/50 text-rose-dark rounded-[2rem] py-6 flex items-center justify-center gap-3 font-black text-xs uppercase tracking-[0.2em] border border-transparent hover:border-rose/20 transition-all active:scale-95"
        >
          <LogOut size={18} /> Выйти из системы
        </button>
      </div>

      {/* Appointments Modal */}
      <Modal isOpen={isAppointmentsModalOpen} onClose={() => setIsAppointmentsModalOpen(false)} title="Мои консультации">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {myAppointments.length === 0 ? (
            <div className="py-12 text-center space-y-4">
              <Calendar size={48} className="mx-auto text-warm-gray opacity-20" />
              <p className="text-xs font-black text-warm-gray uppercase tracking-widest">Записей пока нет</p>
              <button onClick={() => router.push('/care')} className="text-xs font-black text-sage hover:underline uppercase">Найти специалиста</button>
            </div>
          ) : (
            myAppointments.map((app) => (
              <div key={app.id} className="bg-white rounded-[1.75rem] p-5 border border-beige shadow-sm flex items-center gap-4 hover:shadow-md transition">
                <div className="w-14 h-14 rounded-2xl bg-cream overflow-hidden border border-beige flex-shrink-0">
                  {app.specialist?.avatar ? <img src={app.specialist.avatar} className="w-full h-full object-cover" /> : <Users size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-dark-text text-sm truncate">{app.specialist?.name}</p>
                  <p className="text-[10px] text-warm-gray font-medium mb-2 uppercase tracking-tight">{app.specialist?.specialty}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-sage-dark bg-sage-light/30 px-2 py-0.5 rounded-lg">
                      {new Date(app.date_time).toLocaleDateString('ru')}
                    </span>
                    <span className="text-[10px] font-black text-warm-gray">
                      {new Date(app.date_time).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                   <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${app.status === 'upcoming' ? 'bg-sage text-white' : 'bg-cream text-warm-gray'}`}>
                     {app.status === 'upcoming' ? 'Предстоит' : 'Прошла'}
                   </span>
                </div>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Specialist/Patients Modal */}
      <Modal isOpen={isPatientsModalOpen} onClose={() => setIsPatientsModalOpen(false)} title="Пациенты">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {patients.length === 0 ? (
            <p className="text-center text-warm-gray py-10 font-bold">Записей пока нет</p>
          ) : (
            patients.map((p) => (
              <div key={p.id} className="bg-white rounded-[1.75rem] p-5 border border-beige shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-sage-light flex items-center justify-center text-sage-dark font-black text-sm">
                  {p.client_name?.[0]}
                </div>
                <div className="flex-1">
                  <p className="font-black text-dark-text text-sm">{p.client_name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-black text-sage uppercase">
                      {new Date(p.date_time).toLocaleDateString('ru')}
                    </span>
                    <span className="text-[10px] font-black text-warm-gray">
                      {new Date(p.date_time).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => router.push(`/chat?with=${p.user_id}`)}
                  className="w-10 h-10 bg-cream rounded-full flex items-center justify-center text-dark-text hover:bg-beige transition"
                >
                  <MessageCircle size={18} />
                </button>
              </div>
            ))
          )}
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal isOpen={isSettingsModalOpen} onClose={() => setIsSettingsModalOpen(false)} title="Настройки профиля">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-warm-gray uppercase tracking-widest px-1">Ваше имя</label>
            <input 
              type="text" 
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full bg-cream rounded-2xl p-4 border-2 border-transparent focus:border-sage/20 outline-none transition-all font-bold text-dark-text"
              placeholder="Как вас зовут?"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-[10px] font-black text-warm-gray uppercase tracking-widest px-1">О себе</label>
            <textarea 
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
              className="w-full bg-cream rounded-2xl p-4 border-2 border-transparent focus:border-sage/20 outline-none transition-all font-medium text-dark-text min-h-[120px] resize-none"
              placeholder="Расскажите о себе..."
            />
          </div>

          <div className="pt-4 space-y-3">
            <button 
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="w-full bg-dark-text text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-warm hover:bg-black transition-all active:scale-95 disabled:opacity-50"
            >
              {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
            <button 
              onClick={() => setIsSettingsModalOpen(false)}
              className="w-full bg-cream text-warm-gray py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-beige transition-all"
            >
              Отмена
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
