'use client';

import React from 'react';
import { Header } from '@/components/shared/Header';
import { Footer } from '@/components/shared/Footer';
import { Button } from '@/components/shared/Button';
import Link from 'next/link';
import { ArrowRight, Heart, Brain, Zap, Users } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-cream">
      <Header />

      {/* Hero Section */}
      <section className="flex-1 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-12">
          {/* Main Hero */}
          <div className="text-center space-y-8 pt-8 animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-dark-text leading-tight">
              Support for Moms,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-pink to-accent-purple">
                By the Community
              </span>
            </h1>

            <p className="text-xl text-warm-gray max-w-2xl mx-auto">
              Connect with specialists, learn from experts, and find support from a community that understands.
              Your mental health and wellbeing matter.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Link href="/register">
                <Button variant="primary" size="lg">
                  Get Started
                  <ArrowRight size={20} />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </a>
            </div>
          </div>

          {/* Hero Image */}
          <div className="grid md:grid-cols-2 gap-8 items-center pt-8">
            <div className="space-y-6">
              <div className="p-6 bg-white rounded-xl shadow-soft border border-beige space-y-3 hover:shadow-warm transition">
                <div className="p-3 w-fit bg-lavender rounded-lg">
                  <Brain size={24} className="text-accent-purple" />
                </div>
                <h3 className="text-lg font-semibold text-dark-text">Talk to Specialists</h3>
                <p className="text-warm-gray text-sm">Connect with licensed psychologists and therapists.</p>
              </div>

              <div className="p-6 bg-white rounded-xl shadow-soft border border-beige space-y-3 hover:shadow-warm transition">
                <div className="p-3 w-fit bg-soft-pink rounded-lg">
                  <Zap size={24} className="text-accent-pink" />
                </div>
                <h3 className="text-lg font-semibold text-dark-text">Learn & Grow</h3>
                <p className="text-warm-gray text-sm">Curated courses on parenting, psychology, and wellness.</p>
              </div>
            </div>

            <div className="p-8 bg-gradient-to-br from-lavender to-soft-pink rounded-2xl min-h-80 flex items-center justify-center">
              <div className="text-center">
                <Heart className="mx-auto mb-4 text-accent-pink fill-accent-pink" size={48} />
                <p className="text-dark-text font-semibold">Wellness Platform</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-beige">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-dark-text mb-16">Everything You Need</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: 'Expert Guidance',
                desc: 'Get personalized advice from licensed professionals',
              },
              {
                icon: Zap,
                title: 'Flexible Learning',
                desc: 'Learn at your own pace with video courses and materials',
              },
              {
                icon: Users,
                title: 'Community Support',
                desc: 'Share experiences and support with moms like you',
              },
              {
                icon: Heart,
                title: 'Mental Health Focus',
                desc: 'Resources specifically designed for mental wellness',
              },
              {
                icon: ArrowRight,
                title: 'Easy Booking',
                desc: 'Schedule appointments with just a few clicks',
              },
              {
                icon: Brain,
                title: 'Daily Practice',
                desc: 'Maintain wellness with daily exercises and tasks',
              },
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-xl bg-cream border-2 border-beige hover:border-accent-pink hover:shadow-soft transition">
                <feature.icon className="text-accent-pink mb-4" size={32} />
                <h3 className="text-lg font-semibold text-dark-text mb-3">{feature.title}</h3>
                <p className="text-warm-gray text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-lavender to-soft-pink">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-dark-text">Ready to Start Your Wellness Journey?</h2>
          <p className="text-xl text-warm-gray max-w-2xl mx-auto">
            Join thousands of moms who are taking control of their mental health and wellbeing.
          </p>
          <Link href="/register">
            <Button variant="primary" size="lg">
              Sign Up Free
              <ArrowRight size={20} />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
