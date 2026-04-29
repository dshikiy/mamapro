'use client';

import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden relative animate-slide-in">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 h-8 w-8 bg-cream rounded-full flex items-center justify-center text-warm-gray hover:text-dark-text hover:bg-beige transition z-10"
        >
          <X size={18} />
        </button>
        <div className="p-6 border-b border-cream">
          <h2 className="text-xl font-bold text-dark-text pr-8">{title}</h2>
        </div>
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
