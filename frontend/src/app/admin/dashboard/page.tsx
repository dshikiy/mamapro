'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  ShoppingBag,
  Stethoscope,
  BarChart3,
  Trash2,
  ShieldCheck,
  Search,
  LayoutDashboard,
  Calendar,
  BookOpen,
  Plus,
  Video,
  CheckCircle2,
  Clock,
  ChevronRight,
  Home,
  Edit,
  Sparkles,
  ArrowLeft,
  X
} from 'lucide-react';

import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Modal from '@/components/ui/Modal';

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: 'mother' | 'specialist' | 'admin';
  subscription: string;
  created_at: string;
};

type AdminListing = {
  id: string;
  title: string;
  price: number;
  category: string;
  seller_name: string;
  seller_email: string;
  created_at: string;
};

type AdminSpecialist = {
  id: string;
  user_id: string;
  name: string;
  title: string;
  specialty: string;
  verified: boolean;
  user_email: string;
  created_at: string;
};

type AdminAppointment = {
  id: string;
  user_name: string;
  specialist_name: string;
  specialist_title: string;
  date_time: string;
  status: string;
  notes: string;
};

type AdminCourse = {
  id: string;
  title: string;
  description: string;
  category: string;
  instructor: string;
  image: string;
  duration: number;
  is_pro: boolean;
  created_at: string;
};

type AdminStats = {
  users: number;
  specialists: number;
  listings: number;
  appointments: number;
};

const roleOptions = [
  { value: 'mother', label: 'Мама' },
  { value: 'specialist', label: 'Специалист' },
  { value: 'admin', label: 'Админ' },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users' | 'marketplace' | 'specialists' | 'appointments' | 'content'>('dashboard');

  // Data states
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [listings, setListings] = useState<AdminListing[]>([]);
  const [specialists, setSpecialists] = useState<AdminSpecialist[]>([]);
  const [appointments, setAppointments] = useState<AdminAppointment[]>([]);
  const [courses, setCourses] = useState<AdminCourse[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [stats, setStats] = useState<AdminStats | null>(null);
  
  // UI states
  const [loading, setLoading] = useState(true);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [roleMap, setRoleMap] = useState<Record<string, string>>({});
  const [specialtyMap, setSpecialtyMap] = useState<Record<string, string>>({});
  const [subMap, setSubMap] = useState<Record<string, string>>({});
  const [saveStatus, setSaveStatus] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<AdminCourse | null>(null);
  
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<any | null>(null);

  const [isSpecialistModalOpen, setIsSpecialistModalOpen] = useState(false);
  const [isMarathonModalOpen, setIsMarathonModalOpen] = useState(false);
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [marathons, setMarathons] = useState<any[]>([]);
  const [newMarathon, setNewMarathon] = useState({ title: '', description: '', duration_days: 7, price: 5000, image: '', instructor_id: '' });
  const [contentType, setContentType] = useState<'courses' | 'marathons'>('courses');

  useEffect(() => {
    if (mounted && user?.role === 'admin') {
      loadAll();
    }
  }, [mounted, user]);

  const loadAll = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadStats(),
        loadUsers(),
        loadListings(),
        loadSpecialists(),
        loadAppointments(),
        loadCourses(),
        loadMarathons()
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const loadMarathons = async () => {
    try {
      const res = await api.get('/admin/marathons');
      setMarathons(res.data.data);
    } catch (e) { console.error(e); }
  };

  const handleCreateMarathon = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/admin/marathons', newMarathon);
      showToast('Марафон создан');
      setIsMarathonModalOpen(false);
      loadMarathons();
    } catch (e) {
      showToast('Ошибка при создании', 'error');
    }
  };

  const handleDeleteMarathon = async (id: string) => {
    if (!confirm('Удалить марафон?')) return;
    try {
      await api.delete(`/admin/marathons/${id}`);
      showToast('Марафон удален');
      loadMarathons();
    } catch (e) {
      showToast('Ошибка при удалении', 'error');
    }
  };

  const loadStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.data);
    } catch (e) { console.error(e); }
  };

  const loadUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data.data);
      const roles: Record<string, string> = {};
      const subs: Record<string, string> = {};
      response.data.data.forEach((item: AdminUser) => {
        roles[item.id] = item.role;
        subs[item.id] = item.subscription || 'free';
      });
      setRoleMap(roles);
      setSubMap(subs);
    } catch (error) { console.error(error); }
  };

  const loadListings = async () => {
    try {
      const response = await api.get('/admin/listings');
      setListings(response.data.data);
    } catch (e) { console.error(e); }
  };

  const loadSpecialists = async () => {
    try {
      const res = await api.get('/admin/specialists');
      setSpecialists(res.data.data);
    } catch (e) { console.error(e); }
  };

  const loadAppointments = async () => {
    try {
      const res = await api.get('/admin/appointments');
      setAppointments(res.data.data);
    } catch (e) { console.error(e); }
  };

  const loadCourses = async () => {
    try {
      const res = await api.get('/courses');
      setCourses(res.data.data);
    } catch (e) { console.error(e); }
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

  const handleRoleChange = (id: string, role: string) => {
    setRoleMap((prev) => ({ ...prev, [id]: role }));
  };

  const handleSubChange = (id: string, sub: string) => {
    setSubMap((prev) => ({ ...prev, [id]: sub }));
  };

  const handleSpecialtyChange = (id: string, value: string) => {
    setSpecialtyMap((prev) => ({ ...prev, [id]: value }));
  };

  const handleSaveUser = async (id: string) => {
    const role = roleMap[id];
    const specialty = specialtyMap[id];
    const subscription = subMap[id];
    setSaveStatus((prev) => ({ ...prev, [id]: 'saving' }));
    try {
      await api.put(`/admin/users/${id}/role`, { role, specialty: specialty || undefined, subscription });
      setSaveStatus((prev) => ({ ...prev, [id]: 'saved' }));
      showToast('Пользователь обновлен');
      loadUsers();
      loadStats();
      loadSpecialists();
    } catch (error) {
      console.error(error);
      setSaveStatus((prev) => ({ ...prev, [id]: 'error' }));
      showToast('Ошибка при сохранении', 'error');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить пользователя? Это удалит все связанные данные.')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      showToast('Пользователь удален');
      loadUsers();
      loadStats();
    } catch (e) {
      showToast('Ошибка при удалении', 'error');
    }
  };

  const handleDeleteListing = async (id: string) => {
    if (!confirm('Удалить объявление?')) return;
    try {
      await api.delete(`/admin/listings/${id}`);
      showToast('Объявление удалено');
      loadListings();
      loadStats();
    } catch (e) {
      showToast('Ошибка при удалении', 'error');
    }
  };

  const handleToggleVerify = async (id: string, current: boolean) => {
    try {
      await api.patch(`/admin/specialists/${id}/verify`, { verified: !current });
      showToast(current ? 'Верификация снята' : 'Специалист верифицирован');
      loadSpecialists();
    } catch (e) {
      showToast('Ошибка верификации', 'error');
    }
  };

  const handleDeleteCourse = async (id: string) => {
    if (!confirm('Удалить курс и все его уроки?')) return;
    try {
      await api.delete(`/admin/courses/${id}`);
      showToast('Курс удален');
      loadCourses();
    } catch (e) {
      showToast('Ошибка при удалении', 'error');
    }
  };

  const handleDeleteLesson = async (id: string) => {
    if (!confirm('Удалить этот урок?')) return;
    try {
      await api.delete(`/admin/lessons/${id}`);
      showToast('Урок удален');
      if (selectedCourseId) loadLessons(selectedCourseId);
    } catch (e) {
      showToast('Ошибка при удалении урока', 'error');
    }
  };

  if (!mounted || user?.role !== 'admin') return null;

  return (
    <div className="min-h-screen bg-[#FDFBF9] flex flex-col md:flex-row">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-5 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-2xl shadow-elevated animate-slide-in font-bold text-sm ${toast.type === 'success' ? 'bg-sage text-white' : 'bg-rose-dark text-white'
          }`}>
          {toast.message}
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-b md:border-r border-beige p-6 space-y-8 flex-shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-2xl bg-sage flex items-center justify-center text-white shadow-soft">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="font-black text-dark-text tracking-tight">MAMAPRO</h2>
            <p className="text-[10px] font-bold text-sage-dark uppercase tracking-widest">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-1">
          <NavItem active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} icon={<LayoutDashboard size={18} />} label="Дашборд" />
          <NavItem active={activeTab === 'users'} onClick={() => setActiveTab('users')} icon={<Users size={18} />} label="Пользователи" />
          <NavItem active={activeTab === 'specialists'} onClick={() => setActiveTab('specialists')} icon={<Stethoscope size={18} />} label="Специалисты" />
          <NavItem active={activeTab === 'marketplace'} onClick={() => setActiveTab('marketplace')} icon={<ShoppingBag size={18} />} label="Маркетплейс" />
          <NavItem active={activeTab === 'appointments'} onClick={() => setActiveTab('appointments')} icon={<Calendar size={18} />} label="Записи" />
          <NavItem active={activeTab === 'content'} onClick={() => setActiveTab('content')} icon={<BookOpen size={18} />} label="Курсы" />
        </nav>

        <div className="pt-10 border-t border-beige">
          <button 
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-warm-gray hover:bg-cream hover:text-dark-text transition-all font-bold text-sm"
          >
            <Home size={18} /> Вернуться на сайт
          </button>
        </div>
      </aside>


      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-10 overflow-y-auto">
        <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-dark-text capitalize">
              {activeTab === 'dashboard' && 'Обзор системы'}
              {activeTab === 'users' && 'Управление пользователями'}
              {activeTab === 'marketplace' && 'Модерация товаров'}
              {activeTab === 'specialists' && 'Верификация специалистов'}
              {activeTab === 'appointments' && 'Все записи'}
              {activeTab === 'content' && 'Управление контентом'}
            </h1>
            <p className="text-warm-gray text-sm mt-1 font-medium">Панель управления <span className="text-sage-dark font-bold">MamaPro Admin</span>.</p>
          </div>


          <div className="flex items-center gap-3">
            {activeTab === 'content' && (
              contentType === 'courses' ? (
                <button
                  onClick={() => { setEditingCourse(null); setIsCourseModalOpen(true); }}
                  className="bg-sage text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-warm flex items-center gap-2 hover:bg-sage-dark transition"
                >
                  <Plus size={18} /> Создать курс
                </button>
              ) : (
                <button
                  onClick={() => setIsMarathonModalOpen(true)}
                  className="bg-accent-pink text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-warm flex items-center gap-2 hover:bg-accent-purple transition"
                >
                  <Plus size={18} /> Создать марафон
                </button>
              )
            )}
            <div className="bg-white rounded-2xl border border-beige px-4 py-2.5 flex items-center gap-2 shadow-sm focus-within:border-sage transition">
              <Search size={18} className="text-warm-gray" />
              <input type="text" placeholder="Поиск..." className="bg-transparent outline-none text-sm w-32 md:w-48" />
            </div>
            {activeTab === 'specialists' && (
              <button
                onClick={() => setIsSpecialistModalOpen(true)}
                className="bg-sage text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-warm flex items-center gap-2 hover:bg-sage-dark transition"
              >
                <Plus size={18} /> Добавить специалиста
              </button>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-sage border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {activeTab === 'dashboard' && stats && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Всего мам" value={stats.users} icon={<Users className="text-blue-500" />} trend="+12%" />
                <StatCard label="Специалистов" value={stats.specialists} icon={<Stethoscope className="text-sage-dark" />} trend="+3" />
                <StatCard label="Объявлений" value={stats.listings} icon={<ShoppingBag className="text-amber-500" />} trend="+45" />
                <StatCard label="Записей к врачу" value={stats.appointments} icon={<BarChart3 className="text-rose-dark" />} trend="+18%" />
              </div>
            )}

            {activeTab === 'users' && (
              <AdminTable
                headers={['Пользователь', 'Роль', 'Подписка', 'Специализация', 'Действия']}
                rows={users.map(u => ({
                  id: u.id,
                  cells: [
                    <div key={1} className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center text-sage-dark font-black">{u.name[0]}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-dark-text text-sm">{u.name}</p>
                          {subMap[u.id] === 'pro' && <span className="bg-amber-100 text-amber-600 text-[10px] px-1.5 py-0.5 rounded-lg font-black uppercase tracking-tighter border border-amber-200">PRO</span>}
                        </div>
                        <p className="text-xs text-warm-gray">{u.email}</p>
                      </div>
                    </div>,
                    <select
                      key={2}
                      className="bg-cream border border-beige rounded-xl px-3 py-1.5 text-xs font-bold outline-none focus:border-sage"
                      value={roleMap[u.id] || u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      {roleOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>,
                    <select 
                      key={3}
                      className={`border rounded-xl px-3 py-1.5 text-xs font-bold outline-none transition ${subMap[u.id] === 'pro' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-cream border-beige text-warm-gray'}`}
                      value={subMap[u.id] || 'free'}
                      onChange={(e) => handleSubChange(u.id, e.target.value)}
                    >
                      <option value="free">FREE</option>
                      <option value="pro">PRO ✨</option>
                    </select>,
                    <input
                      key={4}
                      type="text"
                      className="bg-transparent border-b border-transparent hover:border-beige focus:border-sage outline-none text-xs w-full py-1"
                      value={specialtyMap[u.id] || ''}
                      onChange={(e) => handleSpecialtyChange(u.id, e.target.value)}
                      placeholder="Напр. ГВ"
                    />,
                    <div key={5} className="flex items-center justify-end gap-2">
                      <button onClick={() => handleSaveUser(u.id)} className="p-2 rounded-xl bg-sage-light text-sage-dark hover:bg-sage hover:text-white transition">{saveStatus[u.id] === 'saving' ? '...' : 'OK'}</button>
                      <button onClick={() => handleDeleteUser(u.id)} className="p-2 rounded-xl bg-rose-light text-rose-dark hover:bg-rose-dark hover:text-white transition"><Trash2 size={16} /></button>
                    </div>
                  ]
                }))}
              />
            )}


            {activeTab === 'marketplace' && (
              <AdminTable
                headers={['Товар', 'Цена', 'Продавец', 'Действия']}
                rows={listings.map(l => ({
                  id: l.id,
                  cells: [
                    <div key={1}><p className="font-bold text-dark-text text-sm">{l.title}</p><p className="text-xs text-warm-gray">{l.category}</p></div>,
                    <span key={2} className="font-bold text-sm">{l.price.toLocaleString('ru')} ₸</span>,
                    <div key={3}><p className="text-sm font-medium">{l.seller_name}</p><p className="text-xs text-warm-gray">{l.seller_email}</p></div>,
                    <div key={4} className="text-right"><button onClick={() => handleDeleteListing(l.id)} className="p-2 rounded-xl bg-rose-light text-rose-dark hover:bg-rose-dark hover:text-white transition"><Trash2 size={16} /></button></div>
                  ]
                }))}
              />
            )}

            {activeTab === 'specialists' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialists.map(s => (
                  <div key={s.id} className="bg-white rounded-[2rem] p-6 border border-beige shadow-card flex items-start gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-sage-light flex items-center justify-center text-sage-dark text-xl font-black">{s.name[0]}</div>
                      {s.verified && <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5"><CheckCircle2 size={18} className="text-sage" /></div>}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-dark-text">{s.name}</h4>
                      <p className="text-xs font-bold text-sage-dark uppercase tracking-wider mb-2">{s.title || s.specialty}</p>
                      <p className="text-xs text-warm-gray truncate mb-4">{s.user_email}</p>
                      <button
                        onClick={() => handleToggleVerify(s.id, s.verified)}
                        className={`w-full py-2 rounded-xl text-[10px] font-black transition uppercase tracking-widest ${s.verified ? 'bg-rose-light text-rose-dark hover:bg-rose-dark hover:text-white' : 'bg-sage-light text-sage-dark hover:bg-sage hover:text-white'
                          }`}
                      >
                        {s.verified ? 'Снять верификацию' : 'Верифицировать'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'appointments' && (
              <AdminTable
                headers={['Дата', 'Пациент', 'Специалист', 'Статус']}
                rows={appointments.map(a => ({
                  id: a.id,
                  cells: [
                    <div key={1} className="flex items-center gap-2 text-sm font-bold"><Clock size={14} className="text-warm-gray" /> {new Date(a.date_time).toLocaleString('ru', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>,
                    <span key={2} className="text-sm font-medium">{a.user_name}</span>,
                    <div key={3}><p className="text-sm font-bold">{a.specialist_name}</p><p className="text-[10px] text-warm-gray">{a.specialist_title}</p></div>,
                    <span key={4} className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${a.status === 'scheduled' ? 'bg-sage-light text-sage-dark' : 'bg-cream text-warm-gray'
                      }`}>{a.status}</span>
                  ]
                }))}
              />
            )}

            {activeTab === 'content' && (
              <div className="flex bg-cream p-1 rounded-2xl w-fit mb-6">
                <button
                  onClick={() => setContentType('courses')}
                  className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${contentType === 'courses' ? 'bg-white shadow-sm text-dark-text' : 'text-warm-gray'}`}
                >
                  КУРСЫ
                </button>
                <button
                  onClick={() => setContentType('marathons')}
                  className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${contentType === 'marathons' ? 'bg-white shadow-sm text-dark-text' : 'text-warm-gray'}`}
                >
                  МАРАФОНЫ
                </button>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-6">
                {contentType === 'courses' ? (
                  !selectedCourseId ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {courses.map(c => (
                        <div key={c.id} className="bg-white rounded-[2rem] p-5 border border-beige shadow-card group cursor-pointer hover:border-sage transition-all" onClick={() => { setSelectedCourseId(c.id); loadLessons(c.id); }}>
                          <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-cream rounded-2xl group-hover:bg-sage-light transition-colors flex items-center gap-2">
                              <BookOpen size={20} className="text-sage-dark" />
                              {c.is_pro && <Sparkles size={14} className="text-amber-500" />}
                            </div>
                            <div className="flex gap-1">
                              <button onClick={(e) => { e.stopPropagation(); setEditingCourse(c); setIsCourseModalOpen(true); }} className="p-2 text-warm-gray hover:text-sage transition"><Edit size={18} /></button>
                              <button onClick={(e) => { e.stopPropagation(); handleDeleteCourse(c.id); }} className="p-2 text-warm-gray hover:text-rose-dark transition"><Trash2 size={18} /></button>
                            </div>
                          </div>
                          <h4 className="font-black text-dark-text mb-1">{c.title}</h4>
                          <p className="text-xs text-warm-gray mb-4">{c.category} • {c.instructor}</p>
                          <div className="flex items-center justify-between pt-4 border-t border-beige">
                            <span className="text-[10px] font-bold text-warm-gray uppercase">{c.duration} мин • {c.is_pro ? 'PRO' : 'FREE'}</span>
                            <button className="text-sage-dark hover:translate-x-1 transition"><ChevronRight size={20} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-left-4 duration-300">
                      <button 
                        onClick={() => setSelectedCourseId(null)}
                        className="mb-6 flex items-center gap-2 text-sm font-bold text-warm-gray hover:text-dark-text transition"
                      >
                        <ArrowLeft size={16} /> Назад к курсам
                      </button>
                      
                      <div className="bg-white rounded-[2rem] p-8 border border-beige shadow-card mb-8">
                        <div className="flex justify-between items-center mb-8">
                          <div>
                            <h2 className="text-2xl font-black text-dark-text">
                              {courses.find(c => c.id === selectedCourseId)?.title}
                            </h2>
                            <p className="text-sm text-warm-gray">Управление уроками курса</p>
                          </div>
                          <button 
                            onClick={() => { setEditingLesson(null); setIsLessonModalOpen(true); }}
                            className="bg-dark-text text-white px-5 py-2.5 rounded-2xl font-bold text-sm shadow-warm flex items-center gap-2 hover:bg-black transition"
                          >
                            <Plus size={18} /> Добавить урок
                          </button>
                        </div>

                        <div className="space-y-4">
                          {lessons.length === 0 ? (
                            <div className="text-center py-12 bg-cream/30 rounded-3xl border border-dashed border-beige">
                              <Video size={40} className="mx-auto text-warm-gray mb-3 opacity-50" />
                              <p className="text-warm-gray text-sm font-medium">В этом курсе пока нет уроков</p>
                            </div>
                          ) : (
                            lessons.map((lesson, index) => (
                              <div key={lesson.id} className="flex items-center justify-between p-4 bg-cream/30 rounded-2xl border border-beige group hover:border-sage transition-colors">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 rounded-xl bg-white border border-beige flex items-center justify-center text-xs font-black text-sage-dark">
                                    {index + 1}
                                  </div>
                                  <div>
                                    <h5 className="font-bold text-dark-text text-sm">{lesson.title}</h5>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className="text-[10px] text-warm-gray uppercase flex items-center gap-1"><Clock size={10} /> {lesson.duration} мин</span>
                                      <span className="text-[10px] text-sage-dark font-bold uppercase truncate max-w-[200px]">{lesson.youtubeUrl}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button onClick={() => { setEditingLesson(lesson); setIsLessonModalOpen(true); }} className="p-2 text-warm-gray hover:text-sage transition">
                                    <Edit size={16} />
                                  </button>
                                  <button onClick={() => handleDeleteLesson(lesson.id)} className="p-2 text-warm-gray hover:text-rose-dark transition">
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {marathons.map(m => (
                      <div key={m.id} className="bg-white rounded-[2.5rem] p-6 border border-beige shadow-card relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-accent-pink/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                        <div className="flex justify-between items-start mb-6">
                          <div className="p-4 bg-accent-pink/10 rounded-2xl text-accent-pink"><Video size={24} /></div>
                          <button onClick={() => handleDeleteMarathon(m.id)} className="p-2 text-warm-gray hover:text-rose-dark transition"><Trash2 size={20} /></button>
                        </div>
                        <h3 className="text-xl font-black text-dark-text mb-2">{m.title}</h3>
                        <p className="text-sm text-warm-gray line-clamp-2 mb-6">{m.description}</p>
                        <div className="flex items-center gap-4 py-4 border-t border-beige">
                          <div className="flex-1">
                            <p className="text-[10px] font-black text-warm-gray uppercase tracking-widest">Длительность</p>
                            <p className="text-sm font-bold text-dark-text">{m.duration_days} дней</p>
                          </div>
                          <div className="flex-1">
                            <p className="text-[10px] font-black text-warm-gray uppercase tracking-widest">Стоимость</p>
                            <p className="text-sm font-bold text-accent-pink">{m.price.toLocaleString('ru')} ₸</p>
                          </div>
                        </div>
                        {m.instructor_name && (
                          <div className="mt-4 flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-sage-light flex items-center justify-center text-[10px] font-black text-sage-dark">{m.instructor_name[0]}</div>
                            <p className="text-xs font-bold text-dark-text">{m.instructor_name}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
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
        onSuccess={() => { loadCourses(); setIsCourseModalOpen(false); showToast(editingCourse ? 'Курс обновлен' : 'Курс создан'); }} 
      />
      
      <LessonModal 
        isOpen={isLessonModalOpen} 
        onClose={() => setIsLessonModalOpen(false)} 
        courseId={selectedCourseId || ''} 
        lesson={editingLesson}
        onSuccess={() => { if (selectedCourseId) loadLessons(selectedCourseId); setIsLessonModalOpen(false); showToast(editingLesson ? 'Урок обновлен' : 'Урок добавлен'); }} 
      />

      <CreateSpecialistModal
        isOpen={isSpecialistModalOpen}
        onClose={() => setIsSpecialistModalOpen(false)}
        onCreated={() => { loadSpecialists(); setIsSpecialistModalOpen(false); showToast('Специалист добавлен!'); }}
      />

      <Modal isOpen={isMarathonModalOpen} onClose={() => setIsMarathonModalOpen(false)} title="Новый марафон">
        <form onSubmit={handleCreateMarathon} className="space-y-4">
          <input required placeholder="Название марафона" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage" value={newMarathon.title} onChange={e => setNewMarathon({ ...newMarathon, title: e.target.value })} />
          <textarea required placeholder="Описание" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage min-h-[100px]" value={newMarathon.description} onChange={e => setNewMarathon({ ...newMarathon, description: e.target.value })} />
          <div className="grid grid-cols-2 gap-4">
            <input required type="number" placeholder="Дни" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage" value={newMarathon.duration_days} onChange={e => setNewMarathon({ ...newMarathon, duration_days: parseInt(e.target.value) })} />
            <input required type="number" placeholder="Цена (₸)" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage" value={newMarathon.price} onChange={e => setNewMarathon({ ...newMarathon, price: parseInt(e.target.value) })} />
          </div>
          <select 
            className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage"
            value={newMarathon.instructor_id}
            onChange={e => setNewMarathon({ ...newMarathon, instructor_id: e.target.value })}
          >
            <option value="">Без инструктора</option>
            {specialists.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <button type="submit" className="w-full bg-accent-pink text-white py-4 rounded-2xl font-black shadow-warm hover:bg-accent-purple transition">Создать марафон</button>
        </form>
      </Modal>
    </div>
  );
}


function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-sm ${active
        ? 'bg-sage text-white shadow-warm translate-x-1'
        : 'text-warm-gray hover:bg-cream hover:text-dark-text'
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

function StatCard({ label, value, icon, trend }: { label: string, value: number, icon: any, trend: string }) {
  return (
    <div className="bg-white p-6 rounded-[2rem] border border-beige shadow-card hover:shadow-elevated transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-2xl bg-cream group-hover:bg-white transition-colors border border-transparent group-hover:border-beige">
          {icon}
        </div>
        <span className="text-[10px] font-black text-sage-dark bg-sage-light px-2 py-1 rounded-lg">
          {trend}
        </span>
      </div>
      <h3 className="text-2xl font-black text-dark-text">{value}</h3>
      <p className="text-xs font-bold text-warm-gray uppercase tracking-widest mt-1">{label}</p>
    </div>
  );
}

function AdminTable({ headers, rows }: { headers: string[], rows: { id: string, cells: React.ReactNode[] }[] }) {
  return (
    <div className="bg-white rounded-[2rem] border border-beige overflow-hidden shadow-card">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-cream border-b border-beige">
            {headers.map(h => <th key={h} className="px-6 py-4 text-[10px] font-black text-warm-gray uppercase tracking-widest">{h}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-beige">
          {rows.map(r => (
            <tr key={r.id} className="hover:bg-cream/30 transition-colors">
              {r.cells.map((c, i) => <td key={i} className="px-6 py-4">{c}</td>)}
            </tr>
          ))}
          {rows.length === 0 && <tr><td colSpan={headers.length} className="px-6 py-10 text-center text-sm text-warm-gray">Нет данных для отображения</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

function CourseModal({ isOpen, onClose, course, onSuccess }: { isOpen: boolean, onClose: () => void, course: AdminCourse | null, onSuccess: () => void }) {
  const [form, setForm] = useState({ 
    title: '', description: '', category: 'Ментальное здоровье', instructor: '', image: '', duration: '', is_pro: false 
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (course) {
      setForm({
        title: course.title,
        description: course.description,
        category: course.category,
        instructor: course.instructor,
        image: course.image,
        duration: course.duration.toString(),
        is_pro: course.is_pro
      });
    } else {
      setForm({ title: '', description: '', category: 'Ментальное здоровье', instructor: '', image: '', duration: '', is_pro: false });
    }
  }, [course, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = { ...form, duration: parseInt(form.duration) || 0 };
      if (course) {
        await api.put(`/api/content/courses/${course.id}`, data);
      } else {
        await api.post('/api/content/courses', data);
      }
      onSuccess();
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={course ? 'Редактировать курс' : 'Новый курс'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Название курса" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input required placeholder="Инструктор" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage" value={form.instructor} onChange={e => setForm({ ...form, instructor: e.target.value })} />
        <input required placeholder="Категория" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
        <input required type="number" placeholder="Длительность (мин)" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
        <input placeholder="Ссылка на изображение" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
        <textarea required placeholder="Описание" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage min-h-[100px]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <label className="flex items-center gap-3 p-4 bg-cream rounded-2xl cursor-pointer hover:bg-beige transition">
          <input type="checkbox" checked={form.is_pro} onChange={e => setForm({ ...form, is_pro: e.target.checked })} className="w-5 h-5 rounded-lg text-sage focus:ring-sage" />
          <span className="text-sm font-bold text-dark-text flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            Только для PRO подписчиков
          </span>
        </label>
        <button disabled={loading} type="submit" className="w-full bg-sage text-white py-4 rounded-2xl font-black shadow-warm hover:bg-sage-dark transition">
          {loading ? 'Сохранение...' : course ? 'Сохранить изменения' : 'Создать курс'}
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
        await api.put(`/api/content/lessons/${lesson.id}`, data);
      } else {
        await api.post(`/api/content/courses/${courseId}/lessons`, data);
      }
      onSuccess();
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={lesson ? 'Редактировать урок' : 'Новый урок'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="Название урока" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
        <input required placeholder="YouTube Embed URL" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage" value={form.youtubeUrl} onChange={e => setForm({ ...form, youtubeUrl: e.target.value })} />
        <div className="grid grid-cols-2 gap-4">
          <input required type="number" placeholder="Длительность (мин)" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} />
          <input required type="number" placeholder="Порядок (0, 1, 2...)" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage" value={form.order} onChange={e => setForm({ ...form, order: e.target.value })} />
        </div>
        <textarea placeholder="Краткое описание урока" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage min-h-[100px]" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <button disabled={loading} type="submit" className="w-full bg-dark-text text-white py-4 rounded-2xl font-black shadow-warm hover:bg-black transition">
          {loading ? 'Сохранение...' : lesson ? 'Сохранить изменения' : 'Добавить урок'}
        </button>
      </form>
    </Modal>
  );
}

function CreateSpecialistModal({ isOpen, onClose, onCreated }: { isOpen: boolean, onClose: () => void, onCreated: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', title: '', specialty: '', price: '', bio: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/admin/specialists', { ...form, price: parseFloat(form.price) || 0 });
      onCreated();
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Новый специалист">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input required placeholder="ФИО специалиста" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input required type="email" placeholder="Email (для входа)" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <div className="grid grid-cols-2 gap-4">
          <input required placeholder="Должность" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <input required placeholder="Специализация" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage" value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} />
        </div>
        <input required type="number" placeholder="Цена за прием (₸)" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
        <textarea required placeholder="Биография" className="w-full bg-cream border border-beige rounded-2xl px-4 py-3 outline-none focus:border-sage min-h-[100px]" value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} />
        <p className="text-[10px] text-warm-gray px-1">Пароль будет создан автоматически: defaultPass123</p>
        <button disabled={loading} type="submit" className="w-full bg-sage text-white py-4 rounded-2xl font-black shadow-warm hover:bg-sage-dark transition">
          {loading ? 'Создание...' : 'Добавить специалиста'}
        </button>
      </form>
    </Modal>
  );
}