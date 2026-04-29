'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, LogOut, Home, Users, Calendar, BookOpen, CheckSquare, ShoppingBag, User } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
  const router = useRouter();
  const { user, logout, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-softer border-b border-beige">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <span className="font-semibold text-dark-text hidden sm:inline">MamPro</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {isAuthenticated && (
                <>
                  <Link href="/dashboard" className="text-warm-gray hover:text-accent-pink transition">
                    Dashboard
                  </Link>
                  <Link href="/specialists" className="text-warm-gray hover:text-accent-pink transition">
                    Specialists
                  </Link>
                  <Link href="/courses" className="text-warm-gray hover:text-accent-pink transition">
                    Courses
                  </Link>
                  <Link href="/marketplace" className="text-warm-gray hover:text-accent-pink transition">
                    Marketplace
                  </Link>
                </>
              )}
            </nav>

            {/* Right Side */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
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
              )}
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
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-beige bg-cream">
            <nav className="px-4 py-4 space-y-3">
              {isAuthenticated && (
                <>
                  <Link href="/dashboard" className="block px-3 py-2 rounded-lg hover:bg-beige transition">
                    Dashboard
                  </Link>
                  <Link href="/specialists" className="block px-3 py-2 rounded-lg hover:bg-beige transition">
                    Specialists
                  </Link>
                  <Link href="/courses" className="block px-3 py-2 rounded-lg hover:bg-beige transition">
                    Courses
                  </Link>
                  <Link href="/marketplace" className="block px-3 py-2 rounded-lg hover:bg-beige transition">
                    Marketplace
                  </Link>
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
};
