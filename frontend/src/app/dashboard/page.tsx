'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Calendar, 
  BookOpen, 
  Sparkles, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  ShoppingBag,
  Plus,
  MessageCircle,
  TrendingUp
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [stats, setStats] = useState({
    courses: 0,
    appointments: 0,
    tasks: 0
  });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (user?.role === 'admin') {
      router.push('/admin');
      return;
    }
    if (user?.role === 'specialist') {
      router.push('/specialist');
      return;
    }

    loadDashboardData();
  }, [isAuthenticated, user]);

  const loadDashboardData = async () => {
    try {
      // Mock stats for now, replace with real API if needed
      setStats({
        courses: 2,
        appointments: 1,
        tasks: 3
      });

      const postsRes = await api.get('/posts');
      setRecentPosts(postsRes.data.data.slice(0, 3));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF9]">
      <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF9] pb-32">
      {/* Welcome Header */}
      <div className="bg-white border-b border-beige px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sage-dark font-black text-xs uppercase tracking-widest">
              <Sparkles size={14} /> Твой день с MamaPro
            </div>
            <h1 className="text-3xl font-black text-dark-text tracking-tight">Привет, {user?.name}! ✨</h1>
            <p className="text-sm text-warm-gray font-medium">Сегодня отличный день, чтобы позаботиться о себе и малыше.</p>
          </div>
          <div className="flex items-center gap-3">
             <button 
               onClick={() => router.push('/feed')}
               className="bg-dark-text text-white px-6 py-3 rounded-2xl font-black text-xs shadow-warm hover:bg-black transition flex items-center gap-2"
             >
               Поделиться моментом <Plus size={16} />
             </button>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 pt-10 grid gap-8 md:grid-cols-3">
        {/* Stats Section */}
        <div className="md:col-span-2 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-[2rem] border border-beige shadow-card hover:shadow-lg transition group cursor-pointer" onClick={() => router.push('/learn')}>
              <div className="w-10 h-10 rounded-xl bg-sage-light flex items-center justify-center text-sage-dark mb-4 group-hover:scale-110 transition">
                <BookOpen size={20} />
              </div>
              <p className="text-2xl font-black text-dark-text">{stats.courses}</p>
              <p className="text-[10px] font-bold text-warm-gray uppercase tracking-widest">Мои курсы</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-beige shadow-card hover:shadow-lg transition group cursor-pointer" onClick={() => router.push('/profile')}>
              <div className="w-10 h-10 rounded-xl bg-lavender flex items-center justify-center text-dark-text mb-4 group-hover:scale-110 transition">
                <Calendar size={20} />
              </div>
              <p className="text-2xl font-black text-dark-text">{stats.appointments}</p>
              <p className="text-[10px] font-bold text-warm-gray uppercase tracking-widest">Записи</p>
            </div>
            <div className="bg-white p-6 rounded-[2rem] border border-beige shadow-card hover:shadow-lg transition group cursor-pointer" onClick={() => router.push('/diary')}>
              <div className="w-10 h-10 rounded-xl bg-cream flex items-center justify-center text-dark-text mb-4 group-hover:scale-110 transition">
                <Clock size={20} />
              </div>
              <p className="text-2xl font-black text-dark-text">{stats.tasks}</p>
              <p className="text-[10px] font-bold text-warm-gray uppercase tracking-widest">Задачи</p>
            </div>
          </div>

          {/* Activity Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-dark-text flex items-center gap-2">
                Свежее в MamaLife <TrendingUp size={18} className="text-rose-dark" />
              </h2>
              <button onClick={() => router.push('/feed')} className="text-xs font-black text-sage hover:text-sage-dark flex items-center gap-1 transition">
                Смотреть все <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="grid gap-4">
              {recentPosts.map(post => (
                <div key={post.id} className="bg-white p-5 rounded-[2rem] border border-beige shadow-card flex gap-4 hover:shadow-lg transition">
                   <div className="w-12 h-12 rounded-2xl bg-cream flex-shrink-0 overflow-hidden shadow-soft">
                      {post.author_avatar ? <img src={post.author_avatar} className="w-full h-full object-cover" /> : post.author_name[0]}
                   </div>
                   <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-black text-sm text-dark-text">{post.author_name}</p>
                        {post.author_role === 'specialist' && <CheckCircle2 size={12} className="text-sage" />}
                        <p className="text-[10px] text-warm-gray ml-auto">{new Date(post.created_at).toLocaleDateString()}</p>
                      </div>
                      <p className="text-xs text-warm-gray line-clamp-2 leading-relaxed">{post.content}</p>
                      <div className="flex items-center gap-4 mt-3">
                         <div className="flex items-center gap-1 text-[10px] font-bold text-rose-dark uppercase">
                            <Sparkles size={12} /> {post.likes_count}
                         </div>
                         <div className="flex items-center gap-1 text-[10px] font-bold text-warm-gray uppercase">
                            <MessageCircle size={12} /> {post.comments_count}
                         </div>
                      </div>
                   </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-dark-text text-white p-8 rounded-[2.5rem] shadow-warm relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700" />
             <h3 className="text-xl font-black mb-4 relative z-10">PRO Возможности</h3>
             <p className="text-sm text-white/70 mb-6 leading-relaxed relative z-10">Получи безлимитный доступ ко всем специалистам и курсам.</p>
             <button 
               onClick={() => router.push('/pricing')}
               className="w-full bg-white text-dark-text py-3 rounded-2xl font-black text-xs hover:bg-beige transition relative z-10"
             >
               Узнать больше
             </button>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-beige shadow-card">
             <h3 className="text-sm font-black text-dark-text mb-6 flex items-center gap-2 uppercase tracking-widest">
               <ShoppingBag size={16} /> Находки недели
             </h3>
             <div className="space-y-4">
                <div className="flex items-center gap-3">
                   <div className="w-14 h-14 bg-cream rounded-2xl overflow-hidden border border-beige shadow-soft">
                      <img src="https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80" className="w-full h-full object-cover" />
                   </div>
                   <div>
                      <p className="text-xs font-black text-dark-text">Детская кроватка</p>
                      <p className="text-[10px] text-sage-dark font-bold">15 000 ₸</p>
                   </div>
                </div>
                <button onClick={() => router.push('/marketplace')} className="w-full py-3 rounded-xl bg-cream text-dark-text text-[10px] font-black uppercase tracking-widest hover:bg-beige transition">В магазин</button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
