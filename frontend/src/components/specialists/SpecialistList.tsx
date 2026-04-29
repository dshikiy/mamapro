'use client';

import React, { useState, useEffect } from 'react';
import { Specialist } from '@/types';
import { SpecialistCard } from './SpecialistCard';
import { BookingModal } from '../appointments/BookingModal';
import api from '@/lib/api';

export const SpecialistList: React.FC = () => {
  const [specialists, setSpecialists] = useState<Specialist[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpecialist, setSelectedSpecialist] = useState<Specialist | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    const fetchSpecialists = async () => {
      try {
        const response = await api.get('/specialists');
        setSpecialists(response.data.data || []);
      } catch (error) {
        console.error('Error fetching specialists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSpecialists();
  }, []);

  const handleBook = (specialist: Specialist) => {
    setSelectedSpecialist(specialist);
    setShowBooking(true);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="bg-white rounded-xl h-96 animate-pulse shadow-soft" />
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {specialists.map((specialist) => (
          <SpecialistCard
            key={specialist.id}
            specialist={specialist}
            onBook={() => handleBook(specialist)}
          />
        ))}
      </div>

      {showBooking && selectedSpecialist && (
        <BookingModal
          specialist={selectedSpecialist}
          onClose={() => setShowBooking(false)}
          onSuccess={() => {
            setShowBooking(false);
            setSelectedSpecialist(null);
          }}
        />
      )}
    </>
  );
};
