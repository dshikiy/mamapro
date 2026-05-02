'use client';

import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, subtitle, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-14 px-6 text-center animate-fade-in">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-beige to-cream flex items-center justify-center mb-4 shadow-inner-soft">
        <span className="text-4xl">{icon}</span>
      </div>
      <h3 className="text-base font-bold text-dark-text mb-2">{title}</h3>
      {subtitle && <p className="text-sm text-warm-gray max-w-xs">{subtitle}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="mt-6 bg-sage text-white font-semibold px-6 py-3 rounded-2xl hover:bg-sage-dark transition shadow-warm active:scale-95"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

// Preset empty states
export const NoAppointments: React.FC<{ onBook: () => void }> = ({ onBook }) => (
  <EmptyState
    icon="📅"
    title="Жазылымдар жоқ"
    subtitle="Мамандарға жазылу үшін 'Мамандар' бөліміне өтіңіз"
    action={{ label: "Маманды іздеу", onClick: onBook }}
  />
);

export const NoMarathons: React.FC<{ onExplore: () => void }> = ({ onExplore }) => (
  <EmptyState
    icon="🏃‍♀️"
    title="Марафондар жоқ"
    subtitle="Сіз әлі бірде-бір марафонға жазылмадыңыз. Бастаңыз!"
    action={{ label: "Марафондарды қарау", onClick: onExplore }}
  />
);

export const NoListings: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
  <EmptyState
    icon="🛍️"
    title="Маркетте ештеңе жоқ"
    subtitle="Керек-жарақтарыңызды сатыңыз немесе тегін беріңіз"
    action={{ label: "Хабарландыру жариялау", onClick: onAdd }}
  />
);

export const NoDiaryEntries: React.FC<{ onAdd: () => void }> = ({ onAdd }) => (
  <EmptyState
    icon="📔"
    title="Күнделік бос"
    subtitle="Алғашқы жазбаңызды жасаңыз — эмоцияларыңызды бөлісіңіз"
    action={{ label: "Жазба жасау", onClick: onAdd }}
  />
);
