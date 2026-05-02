'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Home, Users, PlayCircle, ShoppingBag, Calendar, User, MessageCircle, Sparkles } from 'lucide-react';

type NavItem = {
  name: string;
  path: string;
  icon: any;
};

export default function BottomNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const defaultItems: NavItem[] = [
    { name: 'Главная', path: '/', icon: Home },
    { name: 'MamaLife', path: '/feed', icon: Sparkles },
    { name: 'Чат', path: '/chat', icon: MessageCircle },
    { name: 'Магазин', path: '/marketplace', icon: ShoppingBag },
    { name: 'Профиль', path: '/profile', icon: User },
  ];

  const specialistItems: NavItem[] = [
    { name: 'Главная', path: '/', icon: Home },
    { name: 'MamaLife', path: '/feed', icon: Sparkles },
    { name: 'Чат', path: '/chat', icon: MessageCircle },
    { name: 'Кабинет', path: '/specialist', icon: Calendar },
    { name: 'Профиль', path: '/profile', icon: User },
  ];

  const adminItems: NavItem[] = [
    { name: 'Главная', path: '/', icon: Home },
    { name: 'Лента', path: '/feed', icon: Sparkles },
    { name: 'Админ', path: '/admin/dashboard', icon: Calendar },
    { name: 'Чат', path: '/chat', icon: MessageCircle },
    { name: 'Профиль', path: '/profile', icon: User },
  ];

  const navItems =
    user?.role === 'admin'
      ? adminItems
      : user?.role === 'specialist'
      ? specialistItems
      : defaultItems;

  if (pathname === '/login' || pathname === '/register' || pathname?.startsWith('/admin')) {
    // We want admin dashboard to have its own nav usually, but here we hide bottom nav for admin routes
    if (pathname === '/admin') return null;
  }

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 pb-safe md:hidden">
      <div className="max-w-md mx-auto">
        <div
          className="mx-3 mb-3 rounded-[2rem] overflow-hidden"
          style={{
            background: 'rgba(253, 251, 247, 0.92)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow: '0 -4px 30px rgba(61, 53, 48, 0.08), 0 0 0 1px rgba(243, 238, 231, 0.8)',
          }}
        >
          <div className="flex justify-around items-center h-[68px] px-2">
            {navItems.map((item) => {
              const isActive = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.path}
                  className="flex flex-col items-center justify-center gap-1 w-full h-full relative"
                >
                  <div
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      isActive ? 'bg-sage/20' : 'bg-transparent'
                    }`}
                  >
                    <Icon
                      size={isActive ? 22 : 20}
                      strokeWidth={isActive ? 2.5 : 1.8}
                      className={`transition-all duration-300 ${
                        isActive ? 'text-sage-dark' : 'text-warm-gray'
                      }`}
                    />
                  </div>
                  <span
                    className={`text-[9px] font-semibold tracking-tight transition-all duration-300 leading-none ${
                      isActive ? 'text-sage-dark' : 'text-warm-gray'
                    }`}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <div className="absolute top-1 right-1/2 translate-x-1/2 w-1 h-1 rounded-full bg-sage-dark opacity-60" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
