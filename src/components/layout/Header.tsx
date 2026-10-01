'use client';

import React, { useState } from 'react';
import { Globe, MapPin, Bell, Sparkles, Shield, UserCog } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from '@/contexts/LocationContext';
import { NotificationDrawer } from '../common/NotificationDrawer';
import { AudioButton } from '../common/AudioButton';

interface HeaderProps {
  onOpenVoice: () => void;
  onSelectCategory?: (cat: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenVoice, onSelectCategory }) => {
  const { langInfo, setShowLanguageModal, t } = useLanguage();
  const { location, setShowLocationModal } = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-warm-200 dark:border-slate-800 shadow-sm transition-all">
        <div className="max-w-4xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          {/* Brand Logo & Name */}
          <div
            onClick={() => onSelectCategory?.('home')}
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-jyothi-700 via-pink-600 to-amber-400 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 animate-pulse-subtle" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight text-jyothi-900 dark:text-jyothi-300">
                  {t('appName')}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300">
                  துணைவன்
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 truncate max-w-[140px] sm:max-w-xs font-medium">
                {t('tagline')}
              </p>
            </div>
          </div>

          {/* Action Chips: Language Selector, Location, Notifications & Admin link */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Language Switcher Chip */}
            <button
              type="button"
              onClick={() => setShowLanguageModal(true)}
              className="px-2.5 py-1.5 rounded-full bg-warm-100 dark:bg-slate-800 border border-warm-300 dark:border-slate-700 hover:bg-jyothi-50 dark:hover:bg-slate-700 text-jyothi-800 dark:text-jyothi-300 text-xs font-bold flex items-center gap-1 shadow-sm transition active:scale-95"
              title="மொழி மாற்றுக / Change Language"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{langInfo.nativeName}</span>
            </button>

            {/* Location Chip */}
            <button
              type="button"
              onClick={() => setShowLocationModal(true)}
              className="hidden md:flex px-2.5 py-1.5 rounded-full bg-warm-100 dark:bg-slate-800 border border-warm-300 dark:border-slate-700 hover:bg-warm-200 text-slate-700 dark:text-slate-300 text-xs font-semibold items-center gap-1 transition"
              title="இருப்பிடம் மாற்ற / Change Location"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span className="truncate max-w-[90px]">{location.district || 'Madurai'}</span>
            </button>

            {/* Notifications Button */}
            <button
              type="button"
              onClick={() => setShowNotifications(true)}
              className="relative p-2 rounded-full bg-warm-100 dark:bg-slate-800 border border-warm-300 dark:border-slate-700 hover:bg-warm-200 text-slate-700 dark:text-slate-300 shadow-sm transition active:scale-95"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-500" />
            </button>

            {/* Admin Dashboard shortcut */}
            <button
              type="button"
              onClick={() => onSelectCategory?.('admin')}
              className="p-2 rounded-full bg-warm-100 dark:bg-slate-800 border border-warm-300 dark:border-slate-700 hover:bg-warm-200 text-slate-700 dark:text-slate-300 shadow-sm transition"
              title="அரசு நிர்வாகி / Admin Dashboard"
            >
              <UserCog className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        onSelectCategory={onSelectCategory}
      />
    </>
  );
};
