'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  MessageCircle, 
  UserPlus, 
  CheckCircle2, 
  MapPin, 
  Calendar,
  Grid,
  Heart,
  ArrowLeft,
  Sparkles
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function PublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params?.id) {
      loadProfile();
    }
  }, [params?.id]);

  const loadProfile = async () => {
    try {
      const userRes = await api.get(`/profile/${params.id}`);
      setUser(userRes.data.data);
      
      // Load user posts (we might need an endpoint for this or filter global)
      const postsRes = await api.get('/posts');
      setPosts(postsRes.data.data.filter((p: any) => p.user_id === params.id));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStartChat = async () => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    try {
      const res = await api.post('/chat/start', { targetUserId: params.id, type: 'direct' });
      router.push('/chat');
    } catch (e) { console.error(e); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-sage border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return <div className="p-20 text-center font-black">Пользователь не найден</div>;

  return (
    <div className="min-h-screen bg-[#FDFBF9] pb-32">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-beige px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 hover:bg-cream rounded-full transition"><ArrowLeft size={24} /></button>
        <h1 className="font-black text-lg text-dark-text">{user.name}</h1>
      </header>

      <main className="max-w-4xl mx-auto pt-10 px-6">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-10 mb-12">
          <div className="w-32 h-32 md:w-44 md:h-44 rounded-[3.5rem] bg-sage-light border-4 border-white shadow-card flex items-center justify-center text-4xl font-black text-sage-dark overflow-hidden">
            {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user.name[0]}
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <h2 className="text-3xl font-black text-dark-text flex items-center justify-center md:justify-start gap-2">
                {user.name}
                {user.role === 'specialist' && <CheckCircle2 size={24} className="text-sage" />}
              </h2>
              <div className="flex items-center justify-center md:justify-start gap-2">
                <button 
                  onClick={handleStartChat}
                  className="bg-dark-text text-white px-8 py-3 rounded-2xl font-black text-xs shadow-warm hover:bg-black transition active:scale-95"
                >
                  Написать
                </button>
                <button className="p-3 bg-white border border-beige rounded-2xl hover:bg-cream transition"><UserPlus size={20} /></button>
              </div>
            </div>

            <div className="flex items-center justify-center md:justify-start gap-8">
              <div className="text-center md:text-left">
                <p className="font-black text-dark-text">{posts.length}</p>
                <p className="text-[10px] font-bold text-warm-gray uppercase tracking-widest">Публикаций</p>
              </div>
              <div className="text-center md:text-left">
                <p className="font-black text-dark-text">1.2k</p>
                <p className="text-[10px] font-bold text-warm-gray uppercase tracking-widest">Подписчиков</p>
              </div>
              <div className="text-center md:text-left">
                <p className="font-black text-dark-text">450</p>
                <p className="text-[10px] font-bold text-warm-gray uppercase tracking-widest">Подписок</p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-sm text-dark-text uppercase tracking-tighter">{user.role}</p>
              <p className="text-sm text-warm-gray leading-relaxed max-w-lg">{user.bio || 'Этот пользователь пока ничего не рассказал о себе. 🌸'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t border-beige">
          <div className="flex justify-center gap-12">
            <button className="py-4 border-t-2 border-dark-text flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-dark-text">
              <Grid size={14} /> Публикации
            </button>
            <button className="py-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-warm-gray hover:text-dark-text transition">
              <Heart size={14} /> Нравится
            </button>
          </div>

          <div className="grid grid-cols-3 gap-1 md:gap-6 pt-6">
            {posts.map(p => (
              <div key={p.id} className="aspect-square bg-white border border-beige rounded-xl md:rounded-3xl overflow-hidden group cursor-pointer relative shadow-sm hover:shadow-md transition-all">
                {p.images?.[0] ? (
                  <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                ) : (
                  <div className="w-full h-full p-4 flex flex-col justify-center bg-cream/30">
                    <p className="text-[10px] md:text-sm font-medium text-dark-text line-clamp-4 italic">"{p.content}"</p>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white">
                  <div className="flex items-center gap-1"><Heart size={20} className="fill-current" /> <span className="font-bold">{p.likes_count}</span></div>
                  <div className="flex items-center gap-1"><MessageCircle size={20} className="fill-current" /> <span className="font-bold">{p.comments_count}</span></div>
                </div>
              </div>
            ))}
            {posts.length === 0 && (
              <div className="col-span-3 py-20 text-center">
                <p className="text-warm-gray font-black">Нет публикаций</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
