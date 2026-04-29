'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, HeartPulse, MessageCircle, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Главная', path: '/', icon: Home },
    { name: 'Обучение', path: '/learn', icon: BookOpen },
    { name: 'Забота', path: '/care', icon: HeartPulse },
    { name: 'Общение', path: '/community', icon: MessageCircle },
    { name: 'Профиль', path: '/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-cream/80 backdrop-blur-md border-t border-warm-gray/20 pb-safe z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] rounded-t-2xl">
      <div className="flex justify-around items-center h-20 px-2 sm:px-6">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.path}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300 ${
                isActive ? 'text-accent-pink' : 'text-warm-gray hover:text-dark-text'
              }`}
            >
              <div
                className={`p-2 rounded-xl transition-all duration-300 ${
                  isActive ? 'bg-accent-pink/10 shadow-warm' : 'bg-transparent'
                }`}
              >
                <Icon
                  size={isActive ? 24 : 22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className="transition-all duration-300"
                />
              </div>
              <span
                className={`text-[10px] sm:text-xs font-medium transition-all duration-300 ${
                  isActive ? 'text-accent-pink' : 'text-warm-gray'
                }`}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
