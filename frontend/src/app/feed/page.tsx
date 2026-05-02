'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  MoreHorizontal, 
  Image as ImageIcon,
  Smile,
  Sparkles,
  CheckCircle2,
  Share2
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function FeedPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    setIsPosting(true);
    try {
      await api.post('/posts', { content: newPostContent });
      setNewPostContent('');
      loadPosts();
    } catch (e) {
      console.error(e);
    } finally {
      setIsPosting(false);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    try {
      const res = await api.post(`/posts/${postId}/like`);
      setPosts(prev => prev.map(p => {
        if (p.id === postId) {
          const currentCount = parseInt(p.likes_count || '0');
          return {
            ...p,
            is_liked: res.data.liked,
            likes_count: res.data.liked ? currentCount + 1 : currentCount - 1
          };
        }
        return p;
      }));
    } catch (e) { console.error(e); }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF9] pb-32">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-beige px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-sage flex items-center justify-center text-white shadow-soft">
            <Sparkles size={20} />
          </div>
          <h1 className="text-2xl font-black text-dark-text tracking-tighter italic">MamaLife</h1>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => router.push('/chat')} className="w-11 h-11 rounded-2xl bg-cream flex items-center justify-center text-dark-text hover:bg-beige transition shadow-sm relative">
            <Send size={20} />
            <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-rose-dark rounded-full border-2 border-white" />
          </button>
        </div>
      </header>

      <main className="max-w-xl mx-auto pt-8 space-y-8">
        {/* Post Creation */}
        {isAuthenticated && (
          <div className="mx-4 bg-white rounded-[2.5rem] p-8 shadow-card border border-beige space-y-6">
            <div className="flex gap-5">
              <div className="w-12 h-12 rounded-[1.25rem] bg-sage-light flex items-center justify-center font-black text-sage-dark overflow-hidden shadow-soft">
                {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : user?.name?.[0]}
              </div>
              <textarea 
                value={newPostContent}
                onChange={e => setNewPostContent(e.target.value)}
                placeholder="Что у вас нового? Поделитесь с сообществом..."
                className="flex-1 bg-transparent border-none outline-none resize-none text-sm font-semibold pt-2 min-h-[80px] placeholder:text-warm-gray/40"
              />
            </div>
            <div className="flex items-center justify-between pt-6 border-t border-beige">
              <div className="flex items-center gap-4 text-warm-gray">
                <button className="w-10 h-10 rounded-xl hover:bg-cream transition flex items-center justify-center"><ImageIcon size={20} /></button>
                <button className="w-10 h-10 rounded-xl hover:bg-cream transition flex items-center justify-center"><Smile size={20} /></button>
              </div>
              <button 
                disabled={isPosting || !newPostContent.trim()}
                onClick={handleCreatePost}
                className="bg-dark-text text-white px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-warm hover:bg-black disabled:opacity-30 transition-all active:scale-95"
              >
                {isPosting ? 'Публикация...' : 'Опубликовать'}
              </button>
            </div>
          </div>
        )}

        {/* Posts List */}
        <div className="space-y-10">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-black text-warm-gray uppercase tracking-widest">Загружаем ленту</p>
            </div>
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.id} className="bg-white md:rounded-[3rem] overflow-hidden shadow-card border border-beige group animate-in fade-in slide-in-from-bottom-6 duration-700">
                <div className="px-8 py-6 flex items-center justify-between">
                  <button 
                    onClick={() => router.push(`/profile/${post.author_id}`)}
                    className="flex items-center gap-4 text-left group/author"
                  >
                    <div className="w-12 h-12 rounded-[1.25rem] bg-cream border border-beige flex items-center justify-center font-black text-dark-text overflow-hidden shadow-soft group-hover/author:scale-105 transition-transform duration-300">
                      {post.author_avatar ? <img src={post.author_avatar} alt="" className="w-full h-full object-cover" /> : post.author_name?.[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-black text-sm text-dark-text group-hover/author:text-sage-dark transition-colors">{post.author_name}</p>
                        {post.author_role === 'specialist' && (
                          <div className="bg-sage/10 p-0.5 rounded-full" title="Верифицированный специалист">
                            <CheckCircle2 size={14} className="text-sage" />
                          </div>
                        )}
                      </div>
                      <p className="text-[10px] text-warm-gray font-bold uppercase tracking-widest">
                        {new Date(post.created_at).toLocaleDateString('ru', { month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </button>
                  <button className="w-10 h-10 rounded-full flex items-center justify-center text-warm-gray hover:bg-cream transition"><MoreHorizontal size={20} /></button>
                </div>

                <div className="px-8 pb-4">
                  <p className="text-base text-dark-text leading-relaxed whitespace-pre-wrap font-medium">{post.content}</p>
                </div>

                {post.images && post.images.length > 0 && (
                  <div className="px-4 pb-2">
                    <div className="aspect-square rounded-[2rem] overflow-hidden bg-beige border border-beige">
                      <img src={post.images[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                <div className="px-8 py-6">
                  <div className="flex items-center gap-8">
                    <button 
                      onClick={() => toggleLike(post.id)}
                      className={`flex items-center gap-2 transition-all active:scale-125 ${post.is_liked ? 'text-rose-dark' : 'text-dark-text hover:text-rose'}`}
                    >
                      <Heart size={28} className={post.is_liked ? 'fill-current' : ''} />
                      <span className="text-sm font-black">{post.likes_count}</span>
                    </button>
                    <button 
                      onClick={() => router.push(`/feed/${post.id}`)}
                      className="flex items-center gap-2 text-dark-text hover:text-sage transition"
                    >
                      <MessageCircle size={28} />
                      <span className="text-sm font-black">{post.comments_count}</span>
                    </button>
                    <button className="flex items-center gap-2 text-dark-text hover:text-sage transition ml-auto">
                      <Share2 size={24} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="py-32 text-center space-y-6">
              <div className="w-24 h-24 bg-white rounded-[2.5rem] border border-beige flex items-center justify-center mx-auto shadow-soft">
                <Sparkles size={40} className="text-sage opacity-20" />
              </div>
              <p className="text-xs font-black text-warm-gray uppercase tracking-[0.2em]">Лента пока пуста</p>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-xs font-black text-sage uppercase">Будьте первой! ✨</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
