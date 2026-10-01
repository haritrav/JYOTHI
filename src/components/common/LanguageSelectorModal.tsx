'use client';

import React from 'react';
import { SupportedLanguage } from '@/types';
import { LANGUAGES } from '@/data/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import { Check, Globe, Volume2 } from 'lucide-react';
import { SpeechService } from '@/lib/speech';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t } = useLanguage();

  if (!isOpen) return null;

  const handleSelectLanguage = (langCode: SupportedLanguage) => {
    setLanguage(langCode);
    const greeting = LANGUAGES[langCode].welcomeGreeting;
    SpeechService.speak(greeting, langCode);
    onClose();
  };

  const previewVoice = (e: React.MouseEvent, langCode: SupportedLanguage) => {
    e.stopPropagation();
    const greeting = LANGUAGES[langCode].welcomeGreeting;
    SpeechService.speak(greeting, langCode);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-warm-50 dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-warm-200 dark:border-slate-800 animate-slide-up">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-jyothi-100 dark:bg-jyothi-950/60 text-jyothi-700 dark:text-jyothi-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Globe className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Choose your preferred language • अपनी भाषा चुनें
          </p>
        </div>

        {/* 4 Large Language Selection Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {(Object.keys(LANGUAGES) as SupportedLanguage[]).map((langKey) => {
            const info = LANGUAGES[langKey];
            const isSelected = language === langKey;

            return (
              <div
                key={langKey}
                onClick={() => handleSelectLanguage(langKey)}
                className={`relative p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between shadow-sm active:scale-95 ${
                  isSelected
                    ? 'border-jyothi-600 bg-jyothi-50 dark:bg-jyothi-950/40 ring-4 ring-jyothi-400/20'
                    : 'border-warm-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 hover:border-jyothi-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-jyothi-800 dark:text-jyothi-300">
                    {info.nativeName}
                  </span>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-jyothi-600 text-white flex items-center justify-center shadow">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-warm-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400">
                  <span className="font-semibold">{info.name}</span>
                  <button
                    type="button"
                    onClick={(e) => previewVoice(e, langKey)}
                    className="p-1.5 rounded-full hover:bg-jyothi-200 dark:hover:bg-slate-700 text-jyothi-700 dark:text-jyothi-400 transition"
                    title="குரல் மாதிரியைக் கேட்க / Preview voice"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3.5 px-4 rounded-2xl bg-jyothi-700 hover:bg-jyothi-800 text-white font-bold text-base shadow-lg transition active:scale-95"
        >
          உறுதி செய்க / Confirm & Continue
        </button>
      </div>
    </div>
  );
};
