'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, X, MessageCircle, ArrowLeft, Users, Sparkles } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  text: string;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
};

type Conversation = {
  id: string;
  type: 'direct' | 'group';
  title?: string;
  avatar?: string;
  participant_status: 'active' | 'request';
  other_user?: {
    id: string;
    name: string;
    avatar: string;
    role: string;
  };
  last_message?: {
    text: string;
    sender_id: string;
    created_at: string;
  };
};

export const ChatRoom = ({ onClose }: { onClose?: () => void }) => {
  const { user } = useAuthStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat.id);
      const interval = setInterval(() => loadMessages(activeChat.id), 5000);
      return () => clearInterval(interval);
    }
  }, [activeChat]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const loadConversations = async () => {
    try {
      const res = await api.get('/chat/conversations');
      setConversations(res.data.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadMessages = async (id: string) => {
    try {
      const res = await api.get(`/chat/messages/${id}`);
      setMessages(res.data.data);
    } catch (e) { console.error(e); }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    const text = newMessage.trim();
    setNewMessage('');
    try {
      const res = await api.post('/chat/message', { conversationId: activeChat.id, text });
      setMessages(prev => [...prev, { ...res.data.data, sender_name: user?.name, sender_avatar: user?.avatar }]);
    } catch (e) { console.error(e); }
  };

  const handleRequest = async (convId: string, action: 'accept' | 'decline') => {
    try {
      await api.patch(`/chat/request/${convId}`, { action });
      loadConversations();
      if (action === 'decline' && activeChat?.id === convId) setActiveChat(null);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl shadow-elevated border border-beige overflow-hidden">
      <header className="p-4 border-b border-beige bg-cream flex items-center justify-between">
        <div className="flex items-center gap-3">
          {activeChat && (
            <button onClick={() => setActiveChat(null)} className="md:hidden p-1.5 hover:bg-beige rounded-lg transition">
              <ArrowLeft size={18} />
            </button>
          )}
          <div className="w-10 h-10 rounded-2xl bg-sage flex items-center justify-center text-white shadow-soft">
            <MessageCircle size={20} />
          </div>
          <div>
            <h3 className="font-black text-dark-text text-sm">MamaPro Chat</h3>
            <p className="text-[9px] text-sage-dark font-black uppercase tracking-widest">
              {activeChat ? (activeChat.type === 'direct' ? activeChat.other_user?.name : activeChat.title) : 'Ваши сообщения'}
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-2 hover:bg-beige rounded-xl transition">
            <X size={20} className="text-warm-gray" />
          </button>
        )}
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Conversations Sidebar */}
        <div className={`${activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-72 flex-col border-r border-beige bg-cream/20 overflow-y-auto`}>
          {loading ? (
            <div className="p-10 text-center"><div className="w-5 h-5 border-2 border-sage border-t-transparent rounded-full animate-spin mx-auto" /></div>
          ) : conversations.length === 0 ? (
            <div className="p-10 text-center font-bold text-xs text-warm-gray">Нет активных чатов</div>
          ) : (
            conversations.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveChat(c)}
                className={`p-4 flex items-center gap-3 hover:bg-white transition text-left border-b border-beige/30 ${activeChat?.id === c.id ? 'bg-white shadow-sm' : ''}`}
              >
                <div className="w-11 h-11 rounded-xl bg-sage-light flex items-center justify-center font-black text-sage-dark text-xs overflow-hidden shadow-sm">
                  {c.type === 'direct' ? (c.other_user?.avatar ? <img src={c.other_user.avatar} className="w-full h-full object-cover" /> : c.other_user?.name[0]) : <Users size={20} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="font-black text-dark-text text-xs truncate">{c.type === 'direct' ? c.other_user?.name : c.title}</p>
                    {c.participant_status === 'request' && <span className="w-2 h-2 bg-rose-dark rounded-full" />}
                  </div>
                  <p className="text-[10px] text-warm-gray truncate font-medium">{c.last_message?.text || (c.participant_status === 'request' ? 'Новый запрос' : 'Нет сообщений')}</p>
                </div>
              </button>
            ))
          )}
        </div>

        {/* Message Area */}
        <div className={`${!activeChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white overflow-hidden`}>
          {activeChat ? (
            <>
              {activeChat.participant_status === 'request' ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-cream rounded-2xl flex items-center justify-center text-amber-500 shadow-inner">
                    <Sparkles size={32} />
                  </div>
                  <h4 className="font-black text-dark-text">Запрос на переписку</h4>
                  <p className="text-xs text-warm-gray max-w-xs leading-relaxed">
                    {activeChat.other_user?.name} хочет отправить вам сообщение. Примите запрос, чтобы начать общение.
                  </p>
                  <div className="flex gap-3 w-full max-w-[200px]">
                    <button onClick={() => handleRequest(activeChat.id, 'decline')} className="flex-1 py-2.5 rounded-xl border border-beige text-[10px] font-black uppercase hover:bg-cream transition">Откл</button>
                    <button onClick={() => handleRequest(activeChat.id, 'accept')} className="flex-1 py-2.5 rounded-xl bg-dark-text text-white text-[10px] font-black uppercase shadow-warm hover:bg-black transition">Принять</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={scrollRef}>
                    {messages.map((m) => {
                      const isMine = m.sender_id === user?.id;
                      return (
                        <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs font-medium shadow-sm ${isMine ? 'bg-dark-text text-white rounded-tr-none' : 'bg-cream text-dark-text rounded-tl-none border border-beige'}`}>
                            {activeChat.type === 'group' && !isMine && <p className="text-[8px] font-black text-sage-dark uppercase mb-1">{m.sender_name}</p>}
                            {m.text}
                            <p className={`text-[8px] mt-1 opacity-50 text-right ${isMine ? 'text-white' : 'text-warm-gray'}`}>
                              {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <form onSubmit={handleSendMessage} className="p-4 border-t border-beige bg-cream/10">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Сообщение..."
                        className="flex-1 bg-white border border-beige rounded-2xl px-4 py-3 text-xs outline-none focus:border-sage transition-all shadow-sm"
                      />
                      <button type="submit" disabled={!newMessage.trim()} className="w-11 h-11 bg-dark-text text-white rounded-2xl flex items-center justify-center shadow-warm hover:bg-black disabled:opacity-30 transition-all">
                        <Send size={18} />
                      </button>
                    </div>
                  </form>
                </>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
              <div className="w-20 h-20 rounded-[2.5rem] bg-cream flex items-center justify-center text-warm-gray mb-4 shadow-inner">
                <MessageCircle size={36} className="opacity-40" />
              </div>
              <h4 className="font-black text-dark-text text-sm">Выберите чат</h4>
              <p className="text-[10px] text-warm-gray max-w-[180px] font-medium leading-relaxed">Начните общение со специалистами и другими мамами.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
