'use client';

import React, { useEffect, useState } from 'react';
import { Search, Plus, Phone, Heart } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import { SkeletonMarketplaceGrid } from '@/components/ui/SkeletonCard';
import { NoListings } from '@/components/ui/EmptyState';
import api from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

const CATEGORIES = ['Все', 'Одежда', 'Игрушки', 'Коляски', 'Мебель', 'Электроника'];

type ListingItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  contactInfo: string;
  img: string;
  seller?: string;
  city?: string;
  isNew?: boolean;
  is_liked?: boolean;
};

export default function MarketplacePage() {
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState<ListingItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('Все');

  const [search, setSearch] = useState('');
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => {
    loadListings();
  }, []);

  const loadListings = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/marketplace');
      if (response.data.success) {
        setListings(
          response.data.data.map((listing: any) => ({
            id: listing.id,
            title: listing.title,
            description: listing.description,
            category: listing.category,
            price: listing.price ?? 0,
            contactInfo: listing.contact_info || '',
            img: listing.image || '',
            seller: listing.seller_name || 'Частное лицо',
            city: listing.city || '',
            isNew: listing.isNew || false,
            is_liked: listing.is_liked || false,
          }))
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleLike = async (id: string) => {
    if (!isAuthenticated) {
      setToast('Войдите, чтобы сохранять товары');
      return;
    }
    try {
      const res = await api.post(`/marketplace/${id}/like`);
      setListings(prev => prev.map(item => {
        if (item.id === id) return { ...item, is_liked: res.data.liked };
        return item;
      }));
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(''), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = listings.filter(item => {
    const matchCat = activeCategory === 'Все' || item.category === activeCategory;
    const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="min-h-screen pb-32 bg-[#FDFBF9]">
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[200] bg-dark-text text-white px-5 py-3 rounded-full shadow-elevated flex items-center gap-2 animate-slide-in whitespace-nowrap text-sm font-semibold">
          {toast}
        </div>
      )}

      <div className="px-6 pt-10 pb-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-dark-text tracking-tighter">Магазин</h1>
            <p className="text-sm text-warm-gray font-medium leading-relaxed">Покупайте и продавайте вещи в кругу других мам.</p>
          </div>
          <button
            onClick={() => {
              if (!isAuthenticated) {
                setToast('Войдите, чтобы разместить объявление');
                return;
              }
              setIsSellModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 bg-sage text-white font-black px-8 py-4 rounded-[1.5rem] shadow-warm hover:bg-sage-dark transition active:scale-95"
          >
            <Plus size={20} /> Продать вещь
          </button>
        </div>

        <div className="mt-8 flex flex-col gap-4">
          <div className="bg-white rounded-[1.5rem] shadow-sm border border-beige flex items-center px-5 py-4 focus-within:ring-2 ring-sage/20 transition-all">
            <Search size={20} className="text-warm-gray mr-4 flex-shrink-0" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Найти коляску, одежду или игрушки..."
              className="bg-transparent border-none outline-none w-full text-sm font-semibold text-dark-text placeholder:text-warm-gray/50"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-300 ${activeCategory === cat
                  ? 'bg-dark-text text-white shadow-warm scale-105'
                  : 'bg-white text-warm-gray border border-beige hover:bg-beige'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="px-6 pt-4">
        {isLoading ? (
          <SkeletonMarketplaceGrid />
        ) : filtered.length === 0 ? (
          <NoListings onAdd={() => setIsSellModalOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(item => (
              <div key={item.id} className="group bg-white rounded-[2.5rem] overflow-hidden shadow-card border border-beige transition-all duration-500 hover:-translate-y-2 hover:shadow-elevated">
                <div className="relative bg-cream aspect-[5/4] overflow-hidden">
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleLike(item.id); }}
                    className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 active:scale-125 ${item.is_liked ? 'bg-rose text-white shadow-warm' : 'bg-white/80 backdrop-blur-md text-dark-text hover:bg-white'}`}
                  >
                    <Heart size={20} className={item.is_liked ? 'fill-current' : ''} />
                  </button>
                  {item.isNew && (
                    <div className="absolute bottom-4 left-4 rounded-full bg-sage text-white px-3 py-1 text-[9px] font-black tracking-widest uppercase shadow-sm">
                      Новое
                    </div>
                  )}
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-black text-sage-dark uppercase tracking-widest">{item.category}</span>
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-lg font-black text-dark-text leading-tight group-hover:text-sage-dark transition-colors">{item.title}</h2>
                    <p className="text-xs text-warm-gray font-medium line-clamp-2 leading-relaxed">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between gap-4 pt-2 border-t border-beige/50">
                    <span className={`font-black text-base ${item.price === 0 ? 'text-sage-dark' : 'text-dark-text'}`}>
                      {item.price === 0 ? 'Даром' : `${item.price.toLocaleString('ru')} ₸`}
                    </span>
                    <button
                      onClick={() => {
                        const phone = (item.contactInfo || '').trim().replace(/\D/g, '');
                        if (!phone) {
                          setToast('Номер не указан');
                          return;
                        }
                        const formatted = phone.startsWith('7') ? phone : `7${phone.slice(-10)}`;
                        window.open(`https://wa.me/${formatted}`, '_blank');
                      }}
                      className="inline-flex items-center gap-2 rounded-2xl bg-dark-text text-white px-5 py-3 text-xs font-black hover:bg-black transition shadow-soft active:scale-95"
                    >
                      <Phone size={14} /> Написать
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-warm-gray uppercase tracking-widest pt-1">
                    <div className="w-4 h-4 rounded-full bg-cream border border-beige flex items-center justify-center text-[8px]">{item.seller?.[0]}</div>
                    {item.seller}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SellListingModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onCreated={() => {
          loadListings();
          setToast('Объявление добавлено!');
        }}
      />
    </div>
  );
}

interface SellListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (listing: any) => void;
}

function SellListingModal({ isOpen, onClose, onCreated }: SellListingModalProps) {
  const [formState, setFormState] = useState({
    title: '',
    description: '',
    category: 'Одежда',
    price: '',
    contactInfo: '',
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/marketplace', {
        title: formState.title,
        description: formState.description,
        category: formState.category,
        price: formState.price ? Number(formState.price) : 0,
        contactInfo: formState.contactInfo,
        image: formState.image,
      });
      onCreated(response.data.data);
      setFormState({ title: '', description: '', category: 'Одежда', price: '', contactInfo: '', image: '' });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Не удалось создать объявление');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Новое объявление">
      <form onSubmit={handleSubmit} className="space-y-6 pt-2">
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-warm-gray uppercase tracking-widest px-1">Название</label>
              <input
                value={formState.title}
                onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                className="w-full rounded-2xl border border-beige bg-cream px-5 py-4 outline-none focus:border-sage transition font-bold text-sm"
                placeholder="Коляска 3 в 1..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-warm-gray uppercase tracking-widest px-1">Категория</label>
              <select
                value={formState.category}
                onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                className="w-full rounded-2xl border border-beige bg-cream px-5 py-4 outline-none focus:border-sage transition font-bold text-sm"
              >
                {CATEGORIES.filter(c => c !== 'Все').map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-warm-gray uppercase tracking-widest px-1">Цена (₸)</label>
              <input
                type="number"
                value={formState.price}
                onChange={(e) => setFormState({ ...formState, price: e.target.value })}
                className="w-full rounded-2xl border border-beige bg-cream px-5 py-4 outline-none focus:border-sage transition font-bold text-sm"
                placeholder="0 = Даром"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-warm-gray uppercase tracking-widest px-1">WhatsApp телефон</label>
              <input
                value={formState.contactInfo}
                onChange={(e) => setFormState({ ...formState, contactInfo: e.target.value })}
                className="w-full rounded-2xl border border-beige bg-cream px-5 py-4 outline-none focus:border-sage transition font-bold text-sm"
                placeholder="+7..."
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-warm-gray uppercase tracking-widest px-1">Ссылка на фото</label>
            <input
              value={formState.image}
              onChange={(e) => setFormState({ ...formState, image: e.target.value })}
              className="w-full rounded-2xl border border-beige bg-cream px-5 py-4 outline-none focus:border-sage transition font-bold text-sm"
              placeholder="https://images.unsplash.com/..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-warm-gray uppercase tracking-widest px-1">Описание</label>
            <textarea
              value={formState.description}
              onChange={(e) => setFormState({ ...formState, description: e.target.value })}
              className="w-full min-h-[120px] rounded-[1.5rem] border border-beige bg-cream px-5 py-4 outline-none focus:border-sage transition resize-none font-medium text-sm"
              placeholder="Расскажите о состоянии товара..."
              required
            />
          </div>
        </div>

        {error && <p className="text-xs text-rose-dark font-bold text-center">{error}</p>}

        <button
          type="submit"
          className="w-full rounded-2xl bg-dark-text text-white py-5 font-black text-xs uppercase tracking-[0.2em] shadow-warm hover:bg-black transition-all active:scale-95 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Публикация...' : 'Разместить объявление'}
        </button>
      </form>
    </Modal>
  );
}