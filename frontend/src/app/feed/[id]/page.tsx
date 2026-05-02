'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  MoreVertical
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function PostDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuthStore();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    if (params?.id) {
      loadPost();
      loadComments();
    }
  }, [params?.id]);

  const loadPost = async () => {
    try {
      const res = await api.get(`/posts/${params.id}`);
      setPost(res.data.data);
    } catch (e) { console.error(e); }
  };

  const loadComments = async () => {
    try {
      const res = await api.get(`/posts/${params.id}/comments`);
      setComments(res.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const toggleLike = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    try {
      const res = await api.post(`/posts/${post.id}/like`);
      setPost({
        ...post,
        is_liked: res.data.liked,
        likes_count: res.data.liked ? parseInt(post.likes_count) + 1 : parseInt(post.likes_count) - 1
      });
    } catch (e) { console.error(e); }
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !isAuthenticated) return;
    setIsPosting(true);
    try {
      const res = await api.post(`/posts/${post.id}/comments`, { content: newComment });
      setComments(prev => [...prev, res.data.data]);
      setNewComment('');
      setPost({ ...post, comments_count: parseInt(post.comments_count) + 1 });
    } catch (e) { console.error(e); }
    finally { setIsPosting(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFBF9]">
      <div className="w-12 h-12 border-4 border-sage border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!post) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-10 text-center space-y-4">
      <p className="text-warm-gray font-black uppercase tracking-widest">Пост не найден</p>
      <button onClick={() => router.push('/feed')} className="text-sage font-black uppercase text-xs">Вернуться в ленту</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFBF9] pb-32">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-beige px-6 py-5 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 -ml-2 rounded-full hover:bg-beige transition">
          <ArrowLeft size={24} className="text-dark-text" />
        </button>
        <h1 className="text-lg font-black text-dark-text tracking-tight">Комментарии</h1>
      </header>

      <main className="max-w-xl mx-auto pt-6 space-y-6">
        {/* The Main Post */}
        <div className="bg-white md:rounded-[2.5rem] overflow-hidden shadow-card border border-beige">
          <div className="px-8 py-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-[1.25rem] bg-cream border border-beige flex items-center justify-center font-black text-dark-text overflow-hidden shadow-soft">
                {post.author_avatar ? <img src={post.author_avatar} className="w-full h-full object-cover" /> : post.author_name?.[0]}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-black text-sm text-dark-text">{post.author_name}</p>
                  {post.author_role === 'specialist' && <CheckCircle2 size={14} className="text-sage" />}
                </div>
                <p className="text-[10px] text-warm-gray font-bold uppercase tracking-widest">
                  {new Date(post.created_at).toLocaleDateString('ru', { month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <button className="text-warm-gray p-2"><MoreVertical size={20} /></button>
          </div>

          <div className="px-8 pb-6">
            <p className="text-base text-dark-text leading-relaxed whitespace-pre-wrap font-medium">{post.content}</p>
          </div>

          {post.images && post.images.length > 0 && (
            <div className="px-4 pb-4">
               <img src={post.images[0]} className="w-full rounded-[2rem] border border-beige" alt="" />
            </div>
          )}

          <div className="px-8 py-6 border-t border-beige flex items-center gap-8">
             <button 
               onClick={toggleLike}
               className={`flex items-center gap-2 transition-all active:scale-125 ${post.is_liked ? 'text-rose-dark' : 'text-dark-text'}`}
             >
               <Heart size={28} className={post.is_liked ? 'fill-current' : ''} />
               <span className="text-sm font-black">{post.likes_count}</span>
             </button>
             <div className="flex items-center gap-2 text-dark-text opacity-50">
               <MessageCircle size={28} />
               <span className="text-sm font-black">{post.comments_count}</span>
             </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="px-6 space-y-6">
          <h2 className="text-xs font-black text-warm-gray uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            Обсуждение <Sparkles size={14} className="text-amber-400" />
          </h2>
          
          <div className="space-y-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
                <div className="w-10 h-10 rounded-2xl bg-cream border border-beige flex-shrink-0 flex items-center justify-center font-black text-xs text-dark-text overflow-hidden shadow-sm">
                   {comment.author_avatar ? <img src={comment.author_avatar} className="w-full h-full object-cover" /> : comment.author_name?.[0]}
                </div>
                <div className="flex-1 space-y-1">
                   <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-beige shadow-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-black text-xs text-dark-text">{comment.author_name}</p>
                        {comment.author_role === 'specialist' && <CheckCircle2 size={10} className="text-sage" />}
                      </div>
                      <p className="text-xs text-dark-text leading-relaxed font-medium">{comment.content}</p>
                   </div>
                   <p className="text-[9px] font-black text-warm-gray uppercase tracking-widest px-1">
                     {new Date(comment.created_at).toLocaleDateString('ru')} • {new Date(comment.created_at).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                   </p>
                </div>
              </div>
            ))}
            
            {comments.length === 0 && (
              <div className="text-center py-10 space-y-3">
                 <MessageCircle size={32} className="mx-auto text-warm-gray opacity-20" />
                 <p className="text-[10px] font-black text-warm-gray uppercase tracking-widest">Будьте первой, кто оставит комментарий</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Comment Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-beige px-6 py-4 pb-8 md:pb-4 z-50">
        <form onSubmit={handleCreateComment} className="max-w-xl mx-auto flex items-center gap-3 bg-cream rounded-2xl p-2 pl-5 border-2 border-transparent focus-within:border-sage/30 transition-all">
          <input 
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder={isAuthenticated ? "Напишите ваш комментарий..." : "Войдите, чтобы комментировать"}
            disabled={!isAuthenticated || isPosting}
            className="flex-1 bg-transparent border-none outline-none py-3 text-sm font-semibold text-dark-text placeholder:text-warm-gray/50"
          />
          <button 
            type="submit"
            disabled={!newComment.trim() || isPosting}
            className="w-12 h-12 bg-dark-text text-white rounded-xl flex items-center justify-center shadow-warm hover:bg-black disabled:opacity-20 transition-all active:scale-90"
          >
            <Send size={20} className="ml-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
