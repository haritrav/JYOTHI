'use client';

import React from 'react';
import { Home, Sparkles, BellRing, HeartPulse, Shield, Mic } from 'lucide-react';
import { SupportedLanguage } from '@/types';
import { UI_TRANSLATIONS } from '@/data/translations';

export type TabType = 'home' | 'schemes' | 'updates' | 'health' | 'safety' | 'counselling' | 'applications';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onOpenVoiceModal: () => void;
  language: SupportedLanguage;
  isHighContrast?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  onOpenVoiceModal,
  language,
  isHighContrast
}) => {
  const t = UI_TRANSLATIONS[language];

  const tabs: Array<{ id: TabType; label: string; icon: React.ReactNode }> = [
    { id: 'home', label: t.navHome, icon: <Home className="w-5 h-5" /> },
    { id: 'schemes', label: t.navExplore, icon: <Sparkles className="w-5 h-5" /> },
    { id: 'updates', label: t.navUpdates, icon: <BellRing className="w-5 h-5" /> },
    { id: 'health', label: t.navHealth, icon: <HeartPulse className="w-5 h-5" /> },
    { id: 'safety', label: t.navSafety, icon: <Shield className="w-5 h-5" /> }
  ];

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-30 transition-colors border-t pb-safe ${
        isHighContrast
          ? 'bg-black border-yellow-400 text-yellow-300'
          : 'bg-white/95 backdrop-blur-md border-indigo-100 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]'
      }`}
      aria-label="Bottom navigation bar"
    >
      <div className="max-w-md mx-auto px-2 py-1.5 flex items-center justify-around relative">
        {/* Left 2 Tabs */}
        {tabs.slice(0, 2).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
                isActive
                  ? 'text-purple-800 font-extrabold'
                  : 'text-slate-500 hover:text-purple-700'
              }`}
              aria-label={tab.label}
            >
              <div className={`p-1 rounded-xl transition-all ${
                isActive ? 'bg-purple-100 scale-110 text-purple-900' : ''
              }`}>
                {tab.icon}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 max-w-[64px] truncate">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* Central Prominent Voice Assistant Floating Button */}
        <div className="flex flex-col items-center justify-center -mt-6 px-1">
          <button
            onClick={onOpenVoiceModal}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-purple-700 via-indigo-600 to-amber-500 text-white shadow-xl flex items-center justify-center active:scale-90 hover:scale-105 transition-transform border-4 border-white ring-4 ring-purple-200/60 animate-bounce-gentle"
            aria-label={t.tapToSpeak}
          >
            <Mic className="w-7 h-7 animate-pulse" />
          </button>
          <span className="text-[9px] font-bold text-purple-900 mt-1 uppercase tracking-wider">
            {t.appName} AI
          </span>
        </div>

        {/* Right 3 Tabs */}
        {tabs.slice(2).map((tab) => {
          const isActive = activeTab === tab.id;
          const isSafety = tab.id === 'safety';

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 transition-all active:scale-95 ${
                isActive
                  ? isSafety
                    ? 'text-red-700 font-extrabold'
                    : 'text-purple-800 font-extrabold'
                  : isSafety
                  ? 'text-red-600/80 hover:text-red-700'
                  : 'text-slate-500 hover:text-purple-700'
              }`}
              aria-label={tab.label}
            >
              <div className={`p-1 rounded-xl transition-all ${
                isActive
                  ? isSafety
                    ? 'bg-red-100 scale-110 text-red-700'
                    : 'bg-purple-100 scale-110 text-purple-900'
                  : ''
              }`}>
                {tab.icon}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 max-w-[64px] truncate">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
