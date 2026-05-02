'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  Clock, 
  Users, 
  User, 
  Settings, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  ChevronRight, 
  Home,
  LayoutDashboard,
  Video,
  MessageCircle,
  BookOpen,
  Edit,
  Sparkles,
  ArrowLeft,
  X
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Modal from '@/components/ui/Modal';

type TabType = 'dashboard' | 'appointments' | 'schedule' | 'courses' | 'chat' | 'profile';

export default function SpecialistDashboard() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Data states
  const [profile, setProfile] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [slots, setSlots] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // UI States for Courses
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any | null>(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);

  // Modal states for Slots
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [newSlot, setNewSlot] = useState({ date: '', time: '' });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role !== 'specialist' && user?.role !== 'admin') {
      router.push('/');
    }
  }, [isAuthenticated, user, router, mounted]);

  useEffect(() => {
    if (mounted && (user?.role === 'specialist' || user?.role === 'admin')) {
      loadData();
    }
  }, [mounted, user, activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [profileRes, appointmentsRes, slotsRes] = await Promise.all([
        api.get('/specialists/me'),
        api.get('/appointments/specialist'),
        api.get('/specialists/me/slots')
      ]);
      setProfile(profileRes.data.data);
      setAppointments(appointmentsRes.data.data);
      setSlots(slotsRes.data.data);

      if (activeTab === 'courses') {
        const coursesRes = await api.get('/courses'); // For now show all, ideally filter by specialist
        setCourses(coursesRes.data.data);
      }
    } catch (error) {
      console.error('Error loading specialist data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLessons = async (courseId: string) => {
    try {
      const res = await api.get(`/courses/${courseId}`);
      setLessons(res.data.data.lessons || []);
    } catch (e) { console.error(e); }
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/specialists/me/slots', {
        slot_date: newSlot.date,
        slot_time: newSlot.time
      });
      showToast('Слот добавлен');
      setIsSlotModalOpen(false);
      const res = await api.get('/specialists/me/slots');
      setSlots(res.data.data);
    } catch (error) {
      showToast('Ошибка при добавлении', 'error');
    }
  };

  const handleDeleteSlot = async (id: string) => {
    try {
      await api.delete(`/specialists/me/slots/${id}`);
      showToast('Слот удален');
      setSlots(prev => prev.filter(s => s.id !== id));
    } catch (error: any) {
      showToast(error.response?.data?.error || 'Ошибка удаления', 'error');
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/specialists/me', profile);
      showToast('Профиль обновлен');
    } catch (error) {
      showToast('Ошибка сохранения', 'error');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Удалить ваш курс?')) return;
    try {
      await api.delete(`/content/courses/${id}`);
      showToast('Курс удален');
      loadData();
    } catch (e) { showToast('Ошибка удаления', 'error'); }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('Удалить этот урок?')) return;
    try {
      await api.delete(`/content/lessons/${id}`);
      showToast('Урок удален');
      if (selectedCourseId) loadLessons(selectedCourseId);
    } catch (e) { showToast('Ошибка удаления', 'error'); }
  };

  if (!mounted || (user?.role !== 'specialist' && user?.role !== 'admin')) return null;

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex flex-col md:flex-row">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl shadow-elevated animate-slide-in font-bold text-sm ${
          toast.type === 'success' ? 'bg-sage text-white' : 'bg-rose-dark text-white'
        }`}>
          {toast.message}
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-b md:border-r border-beige p-6 space-y-8 flex-shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white shadow-soft">
            <User size={24} />
          </div>
          <div>
            <h2 className="font-black text-dark-text tracking-tight uppercase">Specialist</h2>
            <p className="text-[10px] font-bold text-accent-pink uppercase tracking-widest">Dashboard</p>
          </div>
        </div>

        <nav className="space-y-1">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18} />} label="Обзор" />
          <NavItem active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} icon={<Users size={18} />} label="Мои клиенты" />
          <NavItem active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} icon={<Calendar size={18} />} label="Расписание" />
          <NavItem active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} icon={<BookOpen size={18} />} label="Мои курсы" />
          <NavItem active={activeTab === 'chat'} onClick={() => router.push('/chat')} icon={<MessageCircle size={18} />} label="Чат с клиентами" />
          <NavItem active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} icon={<Settings size={18} />} label="Профиль" />
        </nav>

        <div className="pt-10 border-t border-beige">
          <button onClick={() => router.push('/')} className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-warm-gray hover:bg-cream hover:text-dark-text transition-all font-bold text-sm">
            <Home size={18} /> На главную
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        {loading && activeTab !== 'courses' ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-10 h-10 border-4 border-accent-pink border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="mb-10 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-black text-dark-text">
                  {activeTab === 'dashboard' && `Здравствуйте, ${profile?.name || user?.name}!`}
                  {activeTab === 'appointments' && 'Записи на консультации'}
                  {activeTab === 'schedule' && 'Управление временем'}
                  {activeTab === 'courses' && 'Мои обучающие курсы'}
                  {activeTab === 'profile' && 'Мой профиль'}
                </h1>
                <p className="text-warm-gray text-sm mt-1">
                  {profile?.verified ? '✨ Ваш профиль верифицирован' : '⏳ Ожидайте верификации администратором'}
                </p>
              </div>
              {activeTab === 'courses' && !selectedCourseId && (
                <button 
                  onClick={() => { setEditingCourse(null); setIsCourseModalOpen(true); }}
                  className="bg-accent-purple text-white px-6 py-3 rounded-2xl font-black text-sm shadow-warm flex items-center gap-2 hover:opacity-90 transition"
                >
                  <Plus size={20} /> Создать курс
                </button>
              )}
            </header>

            {activeTab === 'dashboard' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard label="Всего записей" value={appointments.length} icon={<Users className="text-accent-purple" />} />
                <StatCard label="Доступно слотов" value={slots.filter(s => !s.is_booked).length} icon={<Clock className="text-sage" />} />
                <StatCard label="Ваш рейтинг" value={profile?.rating || '5.0'} icon={<CheckCircle2 className="text-amber-500" />} />
                
                <div className="md:col-span-3 bg-white rounded-[2rem] p-8 border border-beige shadow-card">
                  <h3 className="font-black text-dark-text mb-6">Ближайшие записи</h3>
                  <div className="space-y-4">
                    {appointments.filter(a => a.status === 'scheduled').slice(0, 3).map(a => (
                      <div key={a.id} className="flex items-center justify-between p-4 bg-cream/30 rounded-2xl border border-beige">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-white border border-beige flex items-center justify-center font-bold text-accent-purple">
                            {a.client_name?.[0]}
                          </div>
                          <div>
                            <p className="font-bold text-dark-text">{a.client_name}</p>
                            <p className="text-xs text-warm-gray">{new Date(a.date_time).toLocaleString('ru')}</p>
                          </div>
                        </div>
                        <a href={a.meeting_link} target="_blank" className="bg-sage text-white px-4 py-2 rounded-xl text-xs font-bold shadow-warm hover:bg-sage-dark transition flex items-center gap-2">
                          <Video size={14} /> Войти в Zoom
                        </a>
                      </div>
                    ))}
                    {appointments.length === 0 && <p className="text-center text-warm-gray py-4">У вас пока нет активных записей</p>}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appointments' && (
              <div className="bg-white rounded-[2rem] border border-beige overflow-hidden shadow-card">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-cream border-b border-beige">
                      <th className="px-6 py-4 text-[10px] font-black text-warm-gray uppercase tracking-widest">Клиент</th>
                      <th className="px-6 py-4 text-[10px] font-black text-warm-gray uppercase tracking-widest">Дата и время</th>
                      <th className="px-6 py-4 text-[10px] font-black text-warm-gray uppercase tracking-widest">Статус</th>
                      <th className="px-6 py-4 text-[10px] font-black text-warm-gray uppercase tracking-widest">Ссылка</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-beige">
                    {appointments.map(a => (
                      <tr key={a.id} className="hover:bg-cream/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-cream flex items-center justify-center font-bold text-xs">{a.client_name?.[0]}</div>
                            <div>
                              <p className="font-bold text-sm text-dark-text">{a.client_name}</p>
                              <p className="text-[10px] text-warm-gray">{a.client_email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium">{new Date(a.date_time).toLocaleString('ru')}</td>
                        <td className="px-6 py-4">
                          <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${
                            a.status === 'scheduled' ? 'bg-sage-light text-sage-dark' : 'bg-beige text-warm-gray'
                          }`}>{a.status}</span>
                        </td>
                        <td className="px-6 py-4">
                          <a href={a.meeting_link} target="_blank" className="text-accent-purple hover:underline text-xs font-bold">Zoom Link</a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'schedule' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="font-black text-dark-text">Мои временные слоты</h3>
                  <button onClick={() => setIsSlotModalOpen(true)} className="bg-accent-pink text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-warm flex items-center gap-2 hover:bg-accent-purple transition">
                    <Plus size={18} /> Добавить слот
                  </button>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {slots.map(s => (
                    <div key={s.id} className={`p-5 rounded-3xl border transition-all flex justify-between items-center ${
                      s.is_booked ? 'bg-beige/30 border-beige opacity-70' : 'bg-white border-beige hover:border-sage shadow-sm'
                    }`}>
                      <div>
                        <p className="font-black text-dark-text">{new Date(s.slot_date).toLocaleDateString('ru')}</p>
                        <p className="text-sm font-bold text-warm-gray">{s.slot_time.slice(0, 5)}</p>
                        {s.is_booked && <span className="text-[10px] font-bold text-rose-dark uppercase mt-1 block">Забронировано</span>}
                      </div>
                      {!s.is_booked && (
                        <button onClick={() => handleDeleteSlot(s.id)} className="p-2 text-warm-gray hover:text-rose-dark transition-colors">
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-8">
                {!selectedCourseId ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {courses.map(c => (
                      <div key={c.id} className="bg-white rounded-[2.5rem] p-6 border border-beige shadow-card group cursor-pointer hover:border-accent-purple transition-all" onClick={() => { setSelectedCourseId(c.id); loadLessons(c.id); }}>
                        <div className="flex justify-between items-start mb-4">
                          <div className="p-3 bg-cream rounded-2xl group-hover:bg-accent-purple/10 transition-colors flex items-center gap-2">
                            <BookOpen size={24} className="text-accent-purple" />
                            {c.is_pro && <Sparkles size={16} className="text-amber-500" />}
                          </div>
                          <div className="flex gap-1">
                            <button onClick={(e) => { e.stopPropagation(); setEditingCourse(c); setIsCourseModalOpen(true); }} className="p-2 text-warm-gray hover:text-accent-purple transition"><Edit size={20} /></button>
                            <button onClick={(e) => { e.stopPropagation(); handleDeleteCourse(c.id); }} className="p-2 text-warm-gray hover:text-rose-dark transition"><Trash2 size={20} /></button>
                          </div>
                        </div>
                        <h4 className="text-xl font-black text-dark-text mb-2">{c.title}</h4>
                        <p className="text-sm text-warm-gray mb-6 line-clamp-2">{c.description}</p>
                        <div className="flex items-center justify-between pt-4 border-t border-beige">
                          <span className="text-[10px] font-black text-warm-gray uppercase tracking-widest">{c.duration} мин • {c.is_pro ? 'PRO' : 'FREE'}</span>
                          <button className="text-accent-purple hover:translate-x-1 transition"><ChevronRight size={24} /></button>
                        </div>
                      </div>
                    ))}
                    {courses.length === 0 && (
                      <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-beige">
                        <p className="text-warm-gray font-black">Вы еще не создали ни одного курса 🌸</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                    <button 
                      onClick={() => setSelectedCourseId(null)}
                      className="mb-8 flex items-center gap-2 text-sm font-black text-warm-gray hover:text-dark-text transition"
                    >
                      <ArrowLeft size={18} /> Назад к списку курсов
                    </button>
                    
                    <div className="bg-white rounded-[3rem] p-10 border border-beige shadow-card">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                        <div>
                          <h2 className="text-3xl font-black text-dark-text mb-2">
                            {courses.find(c => c.id === selectedCourseId)?.title}
                          </h2>
                          <p className="text-sm font-medium text-warm-gray uppercase tracking-widest">Управление программой обучения</p>
                        </div>
                        <button 
                          onClick={() => { setEditingLesson(null); setIsLessonModalOpen(true); }}
                          className="bg-dark-text text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-warm flex items-center gap-2 hover:bg-black transition"
                        >
                          <Plus size={20} /> Добавить урок
                        </button>
                      </div>

                      <div className="space-y-4">
                        {lessons.length === 0 ? (
                          <div className="text-center py-20 bg-cream/30 rounded-[2.5rem] border border-dashed border-beige">
                            <Video size={48} className="mx-auto text-warm-gray mb-4 opacity-50" />
                            <p className="text-warm-gray font-bold">В этом курсе пока нет уроков</p>
                          </div>
                        ) : (
                          lessons.map((lesson, index) => (
                            <div key={lesson.id} className="flex items-center justify-between p-6 bg-white rounded-[2rem] border border-beige group hover:border-accent-purple transition-all shadow-sm">
                              <div className="flex items-center gap-6">
                                <div className="w-12 h-12 rounded-2xl bg-cream border border-beige flex items-center justify-center font-black text-accent-purple">
                                  {index + 1}
                                </div>
                                <div>
                                  <h5 className="font-black text-dark-text mb-1">{lesson.title}</h5>
                                  <div className="flex items-center gap-4">
                                    <span className="text-[10px] font-bold text-warm-gray uppercase flex items-center gap-1.5"><Clock size={12} /> {lesson.duration} мин</span>
                                    <span className="text-[10px] font-black text-accent-purple uppercase truncate max-w-[300px]">{lesson.youtubeUrl}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => { setEditingLesson(lesson); setIsLessonModalOpen(true); }} className="p-3 text-warm-gray hover:text-accent-purple transition-colors">
                                  <Edit size={20} />
                                </button>
                                <button onClick={() => handleDeleteLesson(lesson.id)} className="p-3 text-warm-gray hover:text-rose-dark transition-colors">
                                  <Trash2 size={20} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="bg-white rounded-[2.5rem] p-10 border border-beige shadow-card max-w-3xl">
                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <label className="block space-y-3">
                      <span className="text-xs font-black text-warm-gray uppercase tracking-widest px-1">Ваша роль</span>
                      <input 
                        value={profile?.title || ''} 
                        onChange={e => setProfile({...profile, title: e.target.value})}
                        className="w-full bg-cream border border-beige rounded-2xl px-5 py-4 outline-none focus:border-accent-pink transition font-bold"
                        placeholder="Напр. Доула / Психолог"
                      />
                    </label>
                    <label className="block space-y-3">
                      <span className="text-xs font-black text-warm-gray uppercase tracking-widest px-1">Специализация</span>
                      <input 
                        value={profile?.specialty || ''} 
                        onChange={e => setProfile({...profile, specialty: e.target.value})}
                        className="w-full bg-cream border border-beige rounded-2xl px-5 py-4 outline-none focus:border-accent-pink transition font-bold"
                        placeholder="Напр. Подготовка к родам"
                      />
                    </label>
                  </div>
                  
                  <label className="block space-y-3">
                    <span className="text-xs font-black text-warm-gray uppercase tracking-widest px-1">Стоимость консультации (₸)</span>
                    <input 
                      type="number"
                      value={profile?.price || 0} 
                      onChange={e => setProfile({...profile, price: parseFloat(e.target.value)})}
                      className="w-full bg-cream border border-beige rounded-2xl px-5 py-4 outline-none focus:border-accent-pink transition font-bold"
                    />
                  </label>

                  <label className="block space-y-3">
                    <span className="text-xs font-black text-warm-gray uppercase tracking-widest px-1">Биография и опыт</span>
                    <textarea 
                      value={profile?.bio || ''} 
                      onChange={e => setProfile({...profile, bio: e.target.value})}
                      className="w-full bg-cream border border-beige rounded-2xl px-5 py-4 outline-none focus:border-accent-pink transition min-h-[200px] resize-none font-medium leading-relaxed"
                    />
                  </label>

                  <button type="submit" className="w-full bg-dark-text text-white py-5 rounded-[2rem] font-black shadow-warm hover:bg-black transition-all active:scale-[0.98]">
                    Сохранить изменения профиля
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      <CourseModal 
        isOpen={isCourseModalOpen} 
        onClose={() => setIsCourseModalOpen(false)} 
        course={editingCourse} 
        instructorName={profile?.name || user?.name || ''}
        onSuccess={() => { loadData(); setIsCourseModalOpen(false); showToast(editingCourse ? 'Курс обновлен' : 'Курс создан'); }} 
      />
      
      <LessonModal 
        isOpen={isLessonModalOpen} 
        onClose={() => setIsLessonModalOpen(false)} 
        courseId={selectedCourseId || ''} 
        lesson={editingLesson}
        onSuccess={() => { if (selectedCourseId) loadLessons(selectedCourseId); setIsLessonModalOpen(false); showToast(editingLesson ? 'Урок обновлен' : 'Урок добавлен'); }} 
      />

      <Modal isOpen={isSlotModalOpen} onClose={() => setIsSlotModalOpen(false)} title="Добавить время приема">
        <form onSubmit={handleAddSlot} className="space-y-4">
          <label className="block space-y-1">
            <span className="text-xs font-bold text-warm-gray px-1">Дата</span>
            <input 
              type="date" required
              value={newSlot.date} onChange={e => setNewSlot({...newSlot, date: e.target.value})}
              className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-accent-pink" 
            />
          </label>
          <label className="block space-y-1">
            <span className="text-xs font-bold text-warm-gray px-1">Время (HH:MM)</span>
            <input 
              type="time" required
              value={newSlot.time} onChange={e => setNewSlot({...newSlot, time: e.target.value})}
              className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-accent-pink" 
            />
          </label>
          <button type="submit" className="w-full bg-accent-pink text-white py-4 rounded-2xl font-black shadow-warm hover:bg-accent-purple transition">
            Добавить слот
          </button>
        </form>
      </Modal>
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${
      active ? 'bg-accent-pink text-white shadow-warm translate-x-1' : 'text-warm-gray hover:bg-cream hover:text-dark-text'
    }`}>
      {icon} {label}
    </button>
  );
}

function StatCard({ label, value, icon }: { label: string, value: any, icon: any }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-beige shadow-card hover:shadow-elevated transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-2xl bg-cream group-hover:bg-white transition-colors border border-transparent group-hover:border-beige">
          {icon}
        </div>
      </div>
      <h3 className="text-2xl font-black text-dark-text">{value}</h3>
      <p className="text-xs font-bold text-warm-gray uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}

// Reuse Modals from Admin with slight adaptations if needed
function CourseModal({ isOpen, onClose, course, instructorName, onSuccess }: { isOpen: boolean, onClose: () => void, course: any | null, instructorName: string, onSuccess: () => void }) {
  const [form, setForm] = useState({ 
    title: '', description: '', category: 'Ментальное здоровье', instructor: instructorName, image: '', duration: '', is_pro: false 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setForm({
        title: course.title,
        description: course.description,
        category: course.category,
        instructor: course.instructor,
        image: course.image || '',
        duration: course.duration.toString(),
        is_pro: course.is_pro
      });
    } else {
      setForm({ title: '', description: '', category: 'Ментальное здоровье', instructor: instructorName, image: '', duration: '', is_pro: false });
    }
  }, [course, isOpen, instructorName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form, duration: parseInt(form.duration) || 0 };
      if (course) {
        await api.put(`/content/courses/${course.id}`, data);
      } else {
        await api.post('/content/courses', data);
      }
      onSuccess();
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={course ? 'Редактировать курс' : 'Новый курс'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Название курса" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-accent-purple" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input required placeholder="Автор/Инструктор" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-accent-purple" value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} />
        <input required placeholder="Категория" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-accent-purple" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <input required type="number" placeholder="Общая длительность (мин)" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-accent-purple" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
        <input placeholder="Ссылка на обложку (URL)" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-accent-purple" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
        <textarea required placeholder="О чем этот курс?" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-accent-purple min-h-[120px]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <label className="flex items-center gap-3 p-4 bg-cream rounded-2xl cursor-pointer hover:bg-beige transition">
          <input type="checkbox" checked={form.is_pro} onChange={e => setForm({ ...form, is_pro: e.target.checked })} className="w-5 h-5 rounded-lg text-accent-purple focus:ring-accent-purple" />
          <span className="text-sm font-bold text-dark-text flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            Курс только для PRO
          </span>
        </label>
        <button disabled={loading} type="submit" className="w-full bg-accent-purple text-white py-4 rounded-2xl font-black shadow-warm hover:opacity-90 transition">
          {loading ? 'Сохранение...' : course ? 'Сохранить изменения' : 'Опубликовать курс'}
        </button>
      </form>
    </Modal>
  );
}

function LessonModal({ isOpen, onClose, courseId, lesson, onSuccess }: { isOpen: boolean, onClose: () => void, courseId: string, lesson: any | null, onSuccess: () => void }) {
  const [form, setForm] = useState({ title: '', description: '', youtubeUrl: '', duration: '', order: '0' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lesson) {
      setForm({
        title: lesson.title,
        description: lesson.description || '',
        youtubeUrl: lesson.youtubeUrl || '',
        duration: lesson.duration.toString(),
        order: lesson.order.toString()
      });
    } else {
      setForm({ title: '', description: '', youtubeUrl: '', duration: '', order: '0' });
    }
  }, [lesson, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { 
        ...form, 
        duration: parseInt(form.duration) || 0,
        order: parseInt(form.order) || 0
      };
      if (lesson) {
        await api.put(`/content/lessons/${lesson.id}`, data);
      } else {
        await api.post(`/content/courses/${courseId}/lessons`, data);
      }
      onSuccess();
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={lesson ? 'Редактировать урок' : 'Добавить урок'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Название урока" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-accent-purple" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input required placeholder="YouTube Embed URL (напр. https://www.youtube.com/embed/...)" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-accent-purple" value={form.youtubeUrl} onChange={e => setForm({ ...form, youtubeUrl: e.target.value })} />
        <div className="grid grid-cols-2 gap-4">
          <input required type="number" placeholder="Длительность (мин)" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-accent-purple" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
          <input required type="number" placeholder="Порядок" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-accent-purple" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} />
        </div>
        <textarea placeholder="Описание урока и дополнительные материалы" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-accent-purple min-h-[120px]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <button disabled={loading} type="submit" className="w-full bg-dark-text text-white py-4 rounded-2xl font-black shadow-warm hover:bg-black transition">
          {loading ? 'Сохранение...' : lesson ? 'Сохранить изменения' : 'Добавить урок в программу'}
        </button>
      </form>
    </Modal>
  );
}
