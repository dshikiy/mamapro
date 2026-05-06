'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Search, 
  Send, 
  ArrowLeft, 
  MoreVertical, 
  Image as ImageIcon, 
  Users as UsersIcon,
  Sparkles,
  Info,
  X,
  Plus,
  MessageCircle
} from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Modal from '@/components/ui/Modal';

type Conversation = {
  id: string;
  type: 'direct' | 'group';
  title?: string;
  avatar?: string;
  updated_at: string;
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

function ChatContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isAuthenticated } = useAuthStore();
  
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeChat, setActiveChat] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'chats' | 'requests'>('chats');
  
  // Group Create States
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [groupTitle, setGroupTitle] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadConversations();
  }, [isAuthenticated]);

  // Handle ?with=USER_ID
  useEffect(() => {
    const withUserId = searchParams.get('with');
    if (withUserId && conversations.length > 0) {
      const existing = conversations.find(c => c.other_user?.id === withUserId);
      if (existing) {
        setActiveChat(existing);
        // Clear param without reload
        window.history.replaceState({}, '', '/chat');
      } else {
        startDirectChat(withUserId);
        window.history.replaceState({}, '', '/chat');
      }
    }
  }, [searchParams, conversations]);

  useEffect(() => {
    // Poll both conversations and messages to receive new chats/messages
    const interval = setInterval(() => {
      loadConversations();
      if (activeChat) {
        loadMessages(activeChat.id);
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [activeChat]);

  useEffect(() => {
    if (activeChat) {
      loadMessages(activeChat.id);
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

  const handleSearch = async (q: string) => {
    setSearchQuery(q);
    if (q.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const res = await api.get(`/chat/users/search?q=${q}`);
      setSearchResults(res.data.data);
    } catch (e) { console.error(e); }
  };

  const startDirectChat = async (targetUserId: string) => {
    try {
      const res = await api.post('/chat/start', { targetUserId, type: 'direct' });
      const convId = res.data.data.id;
      await loadConversations();
      // Wait for state to update then set active
      const fresh = await api.get('/chat/conversations');
      const found = fresh.data.data.find((c: any) => c.id === convId);
      if (found) setActiveChat(found);
      setSearchQuery('');
      setSearchResults([]);
    } catch (e) { console.error(e); }
  };

  const handleCreateGroup = async () => {
    if (!groupTitle.trim() || selectedUsers.length === 0) return;
    try {
      await api.post('/chat/start', {
        type: 'group',
        title: groupTitle,
        participantIds: selectedUsers.map(u => u.id)
      });
      setIsGroupModalOpen(false);
      setGroupTitle('');
      setSelectedUsers([]);
      loadConversations();
    } catch (e) { console.error(e); }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !activeChat) return;
    const text = newMessage;
    setNewMessage('');
    try {
      const res = await api.post('/chat/message', { conversationId: activeChat.id, text });
      setMessages(prev => [...prev, { ...res.data.data, sender_name: user?.name, sender_avatar: user?.avatar }]);
      loadConversations();
    } catch (e) { console.error(e); }
  };

  const handleRequest = async (convId: string, action: 'accept' | 'decline') => {
    try {
      await api.patch(`/chat/request/${convId}`, { action });
      loadConversations();
      if (action === 'accept') {
        const fresh = await api.get('/chat/conversations');
        const found = fresh.data.data.find((c: any) => c.id === convId);
        if (found) setActiveChat(found);
      } else {
        if (activeChat?.id === convId) setActiveChat(null);
      }
    } catch (e) { console.error(e); }
  };

  const toggleUserSelection = (u: any) => {
    setSelectedUsers(prev => prev.find(x => x.id === u.id) ? prev.filter(x => x.id !== u.id) : [...prev, u]);
  };

  const chatList = conversations.filter(c => 
    activeTab === 'requests' ? c.participant_status === 'request' : c.participant_status === 'active'
  );

  const requestCount = conversations.filter(c => c.participant_status === 'request').length;

  return (
    <div className="flex h-screen bg-[#FDFBF9] overflow-hidden">
      {/* Sidebar - Chat List */}
      <div className={`w-full md:w-[380px] flex-shrink-0 flex flex-col bg-white border-r border-beige transition-all duration-500 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-6 border-b border-beige">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-dark-text tracking-tight flex items-center gap-2">
              MamaChat
              {requestCount > 0 && <span className="bg-rose-dark text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">{requestCount}</span>}
            </h1>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsGroupModalOpen(true)}
                className="p-2.5 bg-cream rounded-2xl hover:bg-beige transition text-dark-text group"
                title="Создать группу"
              >
                <UsersIcon size={20} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
            <input 
              type="text"
              placeholder="Поиск людей..."
              className="w-full bg-cream rounded-2xl py-3 pl-12 pr-4 outline-none border-2 border-transparent focus:border-sage-light focus:bg-white transition text-sm font-medium"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
            
            {searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-3xl shadow-elevated border border-beige z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {searchResults.map(u => (
                  <button 
                    key={u.id}
                    onClick={() => startDirectChat(u.id)}
                    className="w-full px-5 py-4 flex items-center gap-4 hover:bg-cream transition text-left group"
                  >
                    <div className="w-11 h-11 rounded-[1.25rem] bg-sage-light flex items-center justify-center font-black text-sage-dark shadow-sm group-hover:scale-105 transition-transform duration-300">
                      {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : u.name[0]}
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-sm text-dark-text">{u.name}</p>
                      <p className="text-[10px] text-warm-gray font-bold uppercase tracking-widest">{u.role}</p>
                    </div>
                    <Plus size={18} className="text-warm-gray opacity-0 group-hover:opacity-100" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex px-4 py-2 gap-2 bg-white">
          <button 
            onClick={() => setActiveTab('chats')}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${activeTab === 'chats' ? 'bg-dark-text text-white shadow-warm' : 'text-warm-gray hover:bg-cream'}`}
          >
            ДИАЛОГИ
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 relative ${activeTab === 'requests' ? 'bg-dark-text text-white shadow-warm' : 'text-warm-gray hover:bg-cream'}`}
          >
            ЗАПРОСЫ
            {requestCount > 0 && <span className="absolute top-0 right-3 w-2 h-2 bg-rose-dark rounded-full" />}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
          {loading ? (
            <div className="p-20 text-center"><div className="w-8 h-8 border-3 border-sage border-t-transparent rounded-full animate-spin mx-auto opacity-50" /></div>
          ) : chatList.length > 0 ? (
            chatList.map((chat) => {
              const isSelected = activeChat?.id === chat.id;
              return (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`w-full px-6 py-5 flex items-center gap-4 transition-all relative group border-b border-beige/30 ${
                    isSelected ? 'bg-sage/5' : 'hover:bg-cream/30'
                  }`}
                >
                  {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sage" />}
                  <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-[1.5rem] bg-sage-light flex items-center justify-center font-black text-sage-dark overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-500">
                      {chat.type === 'direct' ? (
                        chat.other_user?.avatar ? <img src={chat.other_user.avatar} className="w-full h-full object-cover" /> : chat.other_user?.name[0]
                      ) : (
                        <div className="bg-dark-text w-full h-full flex items-center justify-center text-white"><UsersIcon size={24} /></div>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between mb-1">
                      <p className={`font-black text-sm truncate ${isSelected ? 'text-sage-dark' : 'text-dark-text'}`}>
                        {chat.type === 'direct' ? chat.other_user?.name : (chat.title || 'Группа')}
                      </p>
                      <p className="text-[9px] font-black text-warm-gray uppercase tracking-tighter">
                        {chat.last_message ? new Date(chat.last_message.created_at).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }) : ''}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs truncate text-warm-gray font-medium flex-1">
                        {chat.last_message?.sender_id === user?.id ? <span className="font-black text-sage mr-1">Вы:</span> : ''}
                        {chat.last_message?.text || (chat.participant_status === 'request' ? 'Новый запрос на переписку' : 'Напишите первое сообщение...')}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="p-20 text-center flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-cream rounded-[1.5rem] flex items-center justify-center text-warm-gray opacity-30"><MessageCircle size={32} /></div>
              <p className="text-[10px] font-black text-warm-gray uppercase tracking-[0.2em] leading-loose">
                {activeTab === 'requests' ? 'Новых запросов нет' : 'Список пуст'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`flex-1 flex flex-col bg-white transition-all duration-500 shadow-inner ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
        {activeChat ? (
          <>
            {/* Header */}
            <header className="px-6 py-4 border-b border-beige flex items-center justify-between bg-white/95 backdrop-blur-md z-10 sticky top-0">
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveChat(null)} className="md:hidden p-2.5 hover:bg-cream rounded-2xl transition">
                  <ArrowLeft size={24} className="text-dark-text" />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[1.25rem] bg-sage-light flex items-center justify-center font-black text-sage-dark overflow-hidden shadow-soft">
                    {activeChat.type === 'direct' ? (
                      activeChat.other_user?.avatar ? <img src={activeChat.other_user.avatar} className="w-full h-full object-cover" /> : activeChat.other_user?.name[0]
                    ) : <UsersIcon size={24} />}
                  </div>
                  <div>
                    <p className="font-black text-dark-text leading-tight">
                      {activeChat.type === 'direct' ? activeChat.other_user?.name : (activeChat.title || 'Групповой чат')}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div className="w-1.5 h-1.5 bg-sage rounded-full animate-pulse" />
                      <p className="text-[9px] font-black text-sage-dark uppercase tracking-widest">
                        {activeChat.participant_status === 'request' ? 'Запрос' : 'В сети'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-3 text-warm-gray hover:text-dark-text hover:bg-cream rounded-2xl transition"><Info size={20} /></button>
                <button className="p-3 text-warm-gray hover:text-dark-text hover:bg-cream rounded-2xl transition"><MoreVertical size={20} /></button>
              </div>
            </header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-[#FDFBF9] custom-scrollbar" ref={scrollRef}>
              {activeChat.participant_status === 'request' ? (
                <div className="max-w-md mx-auto py-20 text-center space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-700">
                  <div className="w-24 h-24 bg-white rounded-[2.5rem] shadow-card border border-beige flex items-center justify-center mx-auto mb-4 relative">
                    <Sparkles size={40} className="text-amber-400" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-sage rounded-full flex items-center justify-center text-white border-4 border-[#FDFBF9]"><Send size={14} /></div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-dark-text tracking-tight">Запрос на общение</h3>
                    <p className="text-xs text-warm-gray leading-relaxed px-10 font-medium">
                      <span className="font-black text-dark-text">{activeChat.other_user?.name}</span> хочет познакомиться и пообщаться. Примите запрос, чтобы начать переписку.
                    </p>
                  </div>
                  <div className="flex gap-4 px-10">
                    <button 
                      onClick={() => handleRequest(activeChat.id, 'decline')}
                      className="flex-1 py-4 rounded-[1.5rem] bg-white border-2 border-beige text-[10px] font-black uppercase tracking-widest hover:bg-cream transition-all active:scale-95"
                    >
                      Отклонить
                    </button>
                    <button 
                      onClick={() => handleRequest(activeChat.id, 'accept')}
                      className="flex-1 py-4 rounded-[1.5rem] bg-dark-text text-white text-[10px] font-black uppercase tracking-widest shadow-warm hover:bg-black transition-all active:scale-95"
                    >
                      Принять
                    </button>
                  </div>
                </div>
              ) : (
                messages.map((m, idx) => {
                  const isMine = m.sender_id === user?.id;
                  const showAvatar = !isMine && (idx === 0 || messages[idx-1].sender_id !== m.sender_id);
                  return (
                    <div key={m.id} className={`flex items-end gap-3 ${isMine ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                      {!isMine && (
                        <div className={`w-9 h-9 rounded-xl bg-cream border border-beige flex items-center justify-center text-xs font-black shadow-sm transition-all duration-500 ${showAvatar ? 'opacity-100 scale-100' : 'opacity-0 scale-90 h-0 overflow-hidden'}`}>
                          {m.sender_avatar ? <img src={m.sender_avatar} className="w-full h-full object-cover" /> : m.sender_name?.[0]}
                        </div>
                      )}
                      <div className={`max-w-[70%] space-y-1.5 group`}>
                        {activeChat.type === 'group' && !isMine && showAvatar && (
                           <p className="text-[8px] font-black text-sage-dark uppercase tracking-widest ml-1">{m.sender_name}</p>
                        )}
                        <div className={`px-5 py-4 rounded-[1.75rem] text-sm font-medium shadow-sm transition-all duration-300 group-hover:shadow-md ${
                          isMine 
                            ? 'bg-dark-text text-white rounded-br-none' 
                            : 'bg-white text-dark-text border border-beige rounded-bl-none'
                        }`}>
                          {m.text}
                        </div>
                        <p className={`text-[8px] font-black text-warm-gray opacity-0 group-hover:opacity-100 transition-opacity px-2 ${isMine ? 'text-right' : 'text-left'}`}>
                          {new Date(m.created_at).toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Input */}
            {activeChat.participant_status === 'active' && (
              <form onSubmit={handleSendMessage} className="p-6 border-t border-beige bg-white">
                <div className="flex items-center gap-3 bg-cream rounded-[2rem] p-2 pl-6 border-2 border-transparent focus-within:border-sage-light focus-within:bg-white transition-all duration-300 shadow-inner">
                  <button type="button" className="text-warm-gray hover:text-dark-text transition hover:scale-110"><ImageIcon size={22} /></button>
                  <input 
                    type="text"
                    placeholder="Напишите сообщение..."
                    className="flex-1 bg-transparent border-none outline-none py-3 text-sm font-semibold text-dark-text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                  />
                  <button 
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="w-12 h-12 bg-dark-text text-white rounded-[1.25rem] flex items-center justify-center shadow-warm hover:bg-black disabled:opacity-20 transition-all active:scale-90"
                  >
                    <Send size={22} className="ml-1" />
                  </button>
                </div>
              </form>
            )}
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-1000">
            <div className="w-40 h-40 bg-cream rounded-[3.5rem] border border-beige flex items-center justify-center mb-10 shadow-inner relative group">
              <div className="absolute inset-0 bg-sage/5 rounded-[3.5rem] animate-ping opacity-20" />
              <Send size={56} className="text-sage-dark -rotate-12 translate-x-1 -translate-y-1 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <h2 className="text-3xl font-black text-dark-text mb-4 tracking-tighter">Ваше личное пространство</h2>
            <p className="text-warm-gray max-w-sm font-medium leading-relaxed mb-12 text-sm">
              Общайтесь с экспертами, находите поддержку среди других мам и делитесь важными моментами жизни.
            </p>
            <button 
              onClick={() => setActiveTab('requests')}
              className="bg-white border-2 border-beige text-dark-text px-10 py-4 rounded-2xl font-black shadow-sm hover:border-sage transition-all scale-105 active:scale-100 hover:shadow-warm flex items-center gap-3"
            >
              Проверить запросы <Sparkles size={18} className="text-amber-400" />
            </button>
          </div>
        )}
      </div>

      {/* Group Create Modal */}
      <Modal isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)} title="Создать групповой чат">
        <div className="space-y-6">
          <input 
            placeholder="Название группы"
            className="w-full bg-cream border border-beige rounded-2xl px-5 py-4 outline-none focus:border-sage font-bold"
            value={groupTitle}
            onChange={e => setGroupTitle(e.target.value)}
          />
          
          <div className="space-y-3">
            <p className="text-[10px] font-black text-warm-gray uppercase tracking-widest px-1">Выберите участников ({selectedUsers.length})</p>
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={16} />
              <input 
                placeholder="Поиск..."
                className="w-full bg-cream border border-beige rounded-xl py-3 pl-10 pr-4 outline-none text-xs"
                onChange={e => handleSearch(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-beige rounded-2xl shadow-elevated z-[60] max-h-40 overflow-y-auto">
                  {searchResults.map(u => (
                    <button 
                      key={u.id}
                      onClick={() => toggleUserSelection(u)}
                      className="w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-cream transition"
                    >
                      <div className="w-8 h-8 rounded-lg bg-sage-light flex items-center justify-center font-black text-xs">{u.name[0]}</div>
                      <span className="text-xs font-bold">{u.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
              {selectedUsers.map(u => (
                <div key={u.id} className="flex items-center gap-2 bg-sage-light text-sage-dark px-3 py-1.5 rounded-xl text-[10px] font-black border border-sage/20 animate-in zoom-in-90 duration-200">
                  {u.name}
                  <button onClick={() => toggleUserSelection(u)}><X size={14} /></button>
                </div>
              ))}
              {selectedUsers.length === 0 && <p className="text-[10px] text-warm-gray italic p-4 text-center w-full">Участники не выбраны</p>}
            </div>
          </div>

          <button 
            disabled={!groupTitle.trim() || selectedUsers.length === 0}
            onClick={handleCreateGroup}
            className="w-full bg-dark-text text-white py-5 rounded-[1.75rem] font-black shadow-warm hover:bg-black transition-all active:scale-95 disabled:opacity-20"
          >
            Создать группу
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-[#FDFBF9]">
        <div className="w-8 h-8 border-3 border-sage border-t-transparent rounded-full animate-spin opacity-50" />
      </div>
    }>
      <ChatContent />
    </Suspense>
  );
}
