'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Menu, X, LogOut, User, ShieldCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout, isAuthenticated, fetchProfile } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Move the early return to the end or use conditional rendering in the return statement
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-softer border-b border-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
              <Image 
                src="/logo.png" 
                alt="MamaPro Logo" 
                width={120} 
                height={40} 
                className="object-contain"
                priority
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {mounted && isAuthenticated && (
                <>
                  <Link href="/dashboard" className="text-warm-gray hover:text-accent-pink transition">
                    Dashboard
                  </Link>
                  <Link href="/care" className="text-warm-gray hover:text-accent-pink transition">
                    Specialists
                  </Link>
                  <Link href="/learn" className="text-warm-gray hover:text-accent-pink transition">
                    Courses
                  </Link>
                  <Link href="/marketplace" className="text-warm-gray hover:text-accent-pink transition">
                    Marketplace
                  </Link>
                  <Link href="/feed" className="text-warm-gray hover:text-accent-pink transition font-bold flex items-center gap-1">
                    MamaLife
                  </Link>
                  <Link href="/chat" className="text-warm-gray hover:text-accent-pink transition">
                    Messages
                  </Link>
                  <Link href="/pricing" className="text-warm-gray hover:text-accent-pink transition">
                    Pricing
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin" className="text-sage font-black hover:text-sage-dark transition flex items-center gap-1">
                      <ShieldCheck size={16} /> Admin
                    </Link>
                  )}
                  {user?.role === 'specialist' && (
                    <Link href="/specialist" className="text-accent-pink font-black hover:text-accent-purple transition flex items-center gap-1">
                      <User size={16} /> Cabinet
                    </Link>
                  )}
                </>
              )}
            </nav>



            {/* Right Side */}
            <div className="hidden md:flex items-center space-x-4">
              {mounted && (isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link
                    href="/profile"
                    className="px-4 py-2 rounded-lg bg-lavender text-dark-text hover:bg-accent-purple hover:text-white transition flex items-center space-x-2"
                  >
                    <User size={18} />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-warm-gray hover:bg-soft-pink rounded-lg transition"
                  >
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    href="/login"
                    className="px-4 py-2 text-accent-pink hover:text-accent-purple transition font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 bg-accent-pink text-white rounded-lg hover:bg-accent-purple transition font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              ))}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-beige rounded-lg transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mounted && mobileMenuOpen && (
          <div className="md:hidden border-t border-beige bg-cream">
            <nav className="px-4 py-4 space-y-3">
              {isAuthenticated && (
                <>
                  <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-beige transition">
                    Dashboard
                  </Link>
                  <Link href="/care" className="block px-3 py-2 rounded-lg hover:bg-beige transition">
                    Specialists
                  </Link>
                  <Link href="/learn" className="block px-3 py-2 rounded-lg hover:bg-beige transition">
                    Courses
                  </Link>
                  <Link href="/marketplace" className="block px-3 py-2 rounded-lg hover:bg-beige transition">
                    Marketplace
                  </Link>
                  <Link href="/feed" className="block px-3 py-2 rounded-lg hover:bg-beige transition font-bold">
                    MamaLife (Feed)
                  </Link>
                  <Link href="/chat" className="block px-3 py-2 rounded-lg hover:bg-beige transition">
                    Messages
                  </Link>
                  <Link href="/pricing" className="block px-3 py-2 rounded-lg hover:bg-beige transition">
                    Pricing
                  </Link>
                  {user?.role === 'admin' && (
                    <Link href="/admin" className="block px-3 py-2 rounded-lg bg-sage-light text-sage-dark font-bold transition">
                      Admin Panel
                    </Link>
                  )}
                  {user?.role === 'specialist' && (
                    <Link href="/specialist" className="block px-3 py-2 rounded-lg bg-[#FCE7F3] text-accent-pink font-bold transition">
                      Specialist Cabinet
                    </Link>
                  )}
                  <button


                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-soft-pink transition flex items-center space-x-2"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </>
              )}
              {!isAuthenticated && (
                <div className="space-y-2 pt-2 border-t border-beige">
                  <Link
                    href="/login"
                    className="block px-3 py-2 rounded-lg hover:bg-beige transition"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block px-3 py-2 bg-accent-pink text-white rounded-lg hover:bg-accent-purple transition text-center"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
