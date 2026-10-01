'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Globe,
  Bell,
  Volume2,
  VolumeX,
  Type,
  Eye,
  Settings2,
  ShieldAlert,
  Lock,
  ChevronDown
} from 'lucide-react';
import { SupportedLanguage, TextSize } from '@/types';
import { UI_TRANSLATIONS, SUPPORTED_LANGUAGES } from '@/data/translations';
import { SafeExitButton } from '@/components/safety/SafeExitButton';

interface HeaderProps {
  language: SupportedLanguage;
  onLanguageChange: (lang: SupportedLanguage) => void;
  textSize: TextSize;
  onTextSizeChange: (size: TextSize) => void;
  isHighContrast: boolean;
  onHighContrastToggle: () => void;
  isSpeaking: boolean;
  onReadPage: () => void;
  onStopSpeech: () => void;
  unreadCount: number;
  onOpenNotifications: () => void;
  onQuickExit: () => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  textSize,
  onTextSizeChange,
  isHighContrast,
  onHighContrastToggle,
  isSpeaking,
  onReadPage,
  onStopSpeech,
  unreadCount,
  onOpenNotifications,
  onQuickExit,
  onOpenAdmin
}) => {
  const [showAccessibilityMenu, setShowAccessibilityMenu] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);

  const t = UI_TRANSLATIONS[language];
  const currentLangObj = SUPPORTED_LANGUAGES.find(l => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className={`sticky top-0 z-40 w-full backdrop-blur-md transition-colors ${
      isHighContrast
        ? 'bg-black border-b-2 border-yellow-400 text-yellow-300'
        : 'bg-white/95 border-b border-indigo-100 text-slate-900 shadow-xs'
    }`}>
      <div className="max-w-md mx-auto px-3.5 py-2.5 flex items-center justify-between gap-2">
        {/* Brand Title & Logo */}
        <div className="flex items-center gap-2">
          <div className="relative w-9 h-9 rounded-full overflow-hidden border-2 border-amber-500 shadow-xs bg-amber-50 shrink-0">
            <Image
              src="/jyothi-logo.jpg"
              alt="Jyothi Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-purple-800 to-indigo-700 bg-clip-text text-transparent">
                {t.appName}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                JYOTHI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium leading-none truncate max-w-[130px]">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Quick Safe Exit Button */}
          <SafeExitButton
            language={language}
            onQuickExit={onQuickExit}
            variant="compact"
          />

          {/* Language Switcher Button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowLanguageDropdown(!showLanguageDropdown);
                setShowAccessibilityMenu(false);
              }}
              className="flex items-center gap-1 px-2 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 text-xs font-bold transition-all active:scale-95"
              aria-label={t.changeLanguage}
            >
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span>{currentLangObj.nativeName}</span>
              <ChevronDown className="w-3 h-3 text-indigo-400" />
            </button>

            {/* Language Dropdown */}
            {showLanguageDropdown && (
              <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-indigo-100 py-1 z-50 animate-in fade-in zoom-in-95 duration-100">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase">
                  {t.chooseLanguageTitle}
                </div>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setShowLanguageDropdown(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-indigo-50 transition-colors ${
                      language === lang.code ? 'font-extrabold text-indigo-700 bg-indigo-50/60' : 'text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{lang.flag}</span>
                      <span>{lang.nativeName}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Accessibility Settings Toggle */}
          <button
            onClick={() => {
              setShowAccessibilityMenu(!showAccessibilityMenu);
              setShowLanguageDropdown(false);
            }}
            className={`p-1.5 rounded-full border transition-all active:scale-95 ${
              isHighContrast
                ? 'bg-yellow-400 text-black border-yellow-300'
                : showAccessibilityMenu
                ? 'bg-purple-100 text-purple-800 border-purple-300'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
            title="Accessibility Controls"
            aria-label="Accessibility settings"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-full bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-all active:scale-95"
            aria-label={t.notifications}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Accessibility Controls Drawer/Popover */}
      {showAccessibilityMenu && (
        <div className="border-t border-slate-200 bg-purple-50/90 p-3 max-w-md mx-auto animate-in slide-in-from-top-2 duration-150 text-xs space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-purple-700" />
              {t.fontSize}:
            </span>
            <div className="flex items-center gap-1 bg-white rounded-lg p-0.5 border border-purple-200">
              <button
                onClick={() => onTextSizeChange('normal')}
                className={`px-2 py-1 rounded text-xs ${
                  textSize === 'normal' ? 'bg-purple-700 text-white font-bold' : 'text-slate-600'
                }`}
              >
                A
              </button>
              <button
                onClick={() => onTextSizeChange('large')}
                className={`px-2 py-1 rounded text-sm ${
                  textSize === 'large' ? 'bg-purple-700 text-white font-bold' : 'text-slate-600'
                }`}
              >
                A+
              </button>
              <button
                onClick={() => onTextSizeChange('xlarge')}
                className={`px-2 py-1 rounded text-base font-bold ${
                  textSize === 'xlarge' ? 'bg-purple-700 text-white' : 'text-slate-600'
                }`}
              >
                A++
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-purple-700" />
              {t.highContrast}:
            </span>
            <button
              onClick={onHighContrastToggle}
              className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${
                isHighContrast
                  ? 'bg-yellow-400 text-black border-yellow-500'
                  : 'bg-white text-slate-700 border-slate-300'
              }`}
            >
              {isHighContrast ? 'ON' : 'OFF'}
            </button>
          </div>

          <div className="flex items-center justify-between pt-1 border-t border-purple-200/60">
            <button
              onClick={isSpeaking ? onStopSpeech : onReadPage}
              className={`w-full py-1.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-xs transition-all ${
                isSpeaking
                  ? 'bg-red-600 text-white hover:bg-red-700 animate-pulse'
                  : 'bg-purple-700 text-white hover:bg-purple-800'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>{t.stopAudio}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  <span>{t.readPage}</span>
                </>
              )}
            </button>
          </div>

          <div className="text-right pt-1">
            <button
              onClick={onOpenAdmin}
              className="text-[10px] text-purple-600 hover:text-purple-900 underline flex items-center gap-1 ml-auto"
            >
              <Lock className="w-2.5 h-2.5" />
              {t.adminDashboard}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
