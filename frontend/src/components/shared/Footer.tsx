'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-beige text-warm-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent-pink to-accent-purple flex items-center justify-center">
                <span className="text-white font-bold text-xl">M</span>
              </div>
              <span className="font-semibold">MamPro</span>
            </div>
            <p className="text-sm">Supporting moms. Empowering families.</p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-dark-text">Company</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-accent-pink transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-accent-pink transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-accent-pink transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4 text-dark-text">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="hover:text-accent-pink transition">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-accent-pink transition">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-accent-pink transition">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="font-semibold text-dark-text">Get in Touch</h4>
            <a href="mailto:hello@mampro.app" className="flex items-center space-x-2 text-sm hover:text-accent-pink transition">
              <Mail size={16} />
              <span>hello@mampro.app</span>
            </a>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-beige pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm">
            <p>© 2024 MamPro. All rights reserved.</p>
            <p className="flex items-center space-x-1 mt-4 md:mt-0">
              <span>Made with</span>
              <Heart size={16} className="text-accent-pink fill-accent-pink" />
              <span>for moms</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
