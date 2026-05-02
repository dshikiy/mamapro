'use client';

import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      style={{ maxWidth: '448px', margin: '0 auto', left: 0, right: 0 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-dark-text/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        className="relative w-full rounded-t-[2rem] bg-white shadow-elevated animate-slide-up overflow-hidden"
        style={{ maxHeight: '90vh' }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-beige" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-beige">
          <h2 className="text-base font-black text-dark-text">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-cream flex items-center justify-center hover:bg-beige transition"
          >
            <X size={16} className="text-dark-text" />
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-5 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
