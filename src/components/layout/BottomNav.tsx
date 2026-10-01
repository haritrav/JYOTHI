'use client';

import React from 'react';
import { Home, Landmark, Radio, HeartPulse, ShieldAlert, Mic } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export type NavTab = 'home' | 'schemes' | 'updates' | 'health' | 'safety' | 'counselling' | 'applications' | 'help' | 'admin';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenVoice: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onOpenVoice }) => {
  const { t } = useLanguage();

  const navItems: { id: NavTab; label: string; icon: React.ElementType; color: string }[] = [
    { id: 'home', label: t('navHome'), icon: Home, color: 'text-jyothi-600' },
    { id: 'schemes', label: t('navSchemes'), icon: Landmark, color: 'text-indigo-600' },
    { id: 'updates', label: t('navUpdates'), icon: Radio, color: 'text-amber-600' },
    { id: 'health', label: t('navHealth'), icon: HeartPulse, color: 'text-pink-600' },
    { id: 'safety', label: t('navSafety'), icon: ShieldAlert, color: 'text-red-600' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-warm-200 dark:border-slate-800 shadow-2xl safe-bottom">
      <div className="max-w-lg mx-auto px-2 py-1.5 flex items-center justify-around relative">
        {navItems.map((item, index) => {
          const IconComp = item.icon;
          const isActive = activeTab === item.id;

          // Place the floating voice button in the middle between index 2 and 3 if desired, or let each tab breathe
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              aria-label={item.label}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-2xl min-w-[62px] transition-all active:scale-90 ${
                isActive
                  ? 'text-jyothi-700 dark:text-jyothi-300 font-extrabold scale-105'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 font-medium'
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition ${
                  isActive ? 'bg-jyothi-100 dark:bg-jyothi-950/60 shadow-sm' : ''
                }`}
              >
                <IconComp className={`w-5 h-5 ${isActive ? item.color : ''}`} />
              </div>
              <span className="text-[11px] leading-tight mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
