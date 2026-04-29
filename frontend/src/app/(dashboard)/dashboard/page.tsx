'use client';

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/shared/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ProgressBar } from '@/components/daily-tasks/ProgressBar';
import { Calendar, BookOpen, CheckSquare, Users } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const [statsData, setStatsData] = useState({
    upcomingAppointments: 0,
    completedTasks: 5,
    totalTasks: 12,
    coursesInProgress: 2,
  });

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-cream">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-accent-pink border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header />

      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Welcome Section */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-dark-text">Welcome back, {user?.name}! 👋</h1>
            <p className="text-warm-gray">Here's what's happening in your wellness journey</p>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Calendar, label: 'Upcoming', value: statsData.upcomingAppointments, color: 'from-lavender to-soft-pink' },
              { icon: CheckSquare, label: 'Tasks Today', value: `${statsData.completedTasks}/${statsData.totalTasks}`, color: 'from-soft-pink to-accent-pink' },
              { icon: BookOpen, label: 'In Progress', value: statsData.coursesInProgress, color: 'from-accent-purple to-accent-pink' },
              {
                icon: Users,
                label: 'My Specialists',
                value: 3,
                color: 'from-sage to-lavender',
              },
            ].map((stat, idx) => (
              <div key={idx} className={`p-6 rounded-xl bg-gradient-to-br ${stat.color} shadow-soft border border-beige`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium mb-1">{stat.label}</p>
                    <p className="text-white text-3xl font-bold">{stat.value}</p>
                  </div>
                  <div className="p-3 bg-white/20 rounded-lg">
                    <stat.icon size={32} className="text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Daily Progress */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-soft border border-beige p-8 space-y-6">
              <h2 className="text-2xl font-bold text-dark-text">Today's Progress</h2>
              <ProgressBar completed={statsData.completedTasks} total={statsData.totalTasks} label="Daily Tasks" />

              <div className="space-y-4 pt-4 border-t border-beige">
                <h3 className="font-semibold text-dark-text">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/daily-tasks">
                    <Button variant="soft" size="md" className="w-full justify-start">
                      <CheckSquare size={18} />
                      <span>View Tasks</span>
                    </Button>
                  </Link>
                  <Link href="/appointments">
                    <Button variant="soft" size="md" className="w-full justify-start">
                      <Calendar size={18} />
                      <span>My Appointments</span>
                    </Button>
                  </Link>
                  <Link href="/courses">
                    <Button variant="soft" size="md" className="w-full justify-start">
                      <BookOpen size={18} />
                      <span>Continue Learning</span>
                    </Button>
                  </Link>
                  <Link href="/specialists">
                    <Button variant="soft" size="md" className="w-full justify-start">
                      <Users size={18} />
                      <span>Book Specialist</span>
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Subscription Card */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-lavender to-soft-pink rounded-xl shadow-soft border border-beige p-8 text-white space-y-4">
                <h3 className="text-xl font-bold">Your Subscription</h3>
                <div className="space-y-2">
                  <p className="text-white/80 text-sm">Current Plan</p>
                  <p className="text-2xl font-bold capitalize">{user?.subscription}</p>
                </div>

                <div className="pt-4 border-t border-white/20 space-y-2">
                  <p className="text-sm text-white/80">Next billing</p>
                  <p className="font-semibold">March 15, 2024</p>
                </div>

                <Button variant="outline" size="md" className="w-full text-white border-white hover:bg-white/10">
                  Manage Plan
                </Button>
              </div>

              {/* Resources */}
              <div className="bg-white rounded-xl shadow-soft border border-beige p-6 space-y-4">
                <h3 className="font-bold text-dark-text">Resources</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <a href="#" className="text-accent-pink hover:text-accent-purple transition font-medium">
                      Help Center
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-accent-pink hover:text-accent-purple transition font-medium">
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-accent-pink hover:text-accent-purple transition font-medium">
                      Contact Support
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Featured Section */}
          <div className="bg-white rounded-xl shadow-soft border border-beige p-8">
            <h2 className="text-2xl font-bold text-dark-text mb-6">Featured This Week</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((_, idx) => (
                <div key={idx} className="p-6 bg-cream rounded-lg border border-beige hover:border-accent-pink transition">
                  <div className="h-32 bg-gradient-to-br from-lavender to-soft-pink rounded-lg mb-4" />
                  <h4 className="font-semibold text-dark-text mb-2">Featured Course</h4>
                  <p className="text-sm text-warm-gray mb-4">Learn new skills and techniques</p>
                  <Button variant="soft" size="sm" className="w-full">
                    Explore
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
