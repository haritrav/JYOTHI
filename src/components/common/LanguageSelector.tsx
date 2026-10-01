'use client';

import React from 'react';
import Image from 'next/image';
import { Volume2, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { SupportedLanguage } from '@/types';
import { SUPPORTED_LANGUAGES, UI_TRANSLATIONS } from '@/data/translations';
import { speakText, playAudioChime } from '@/utils/speech';

interface LanguageSelectorProps {
  selectedLanguage: SupportedLanguage;
  onSelectLanguage: (lang: SupportedLanguage) => void;
  onProceed: () => void;
  isInitialOnboarding?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  selectedLanguage,
  onSelectLanguage,
  onProceed,
  isInitialOnboarding = true
}) => {
  const currentTranslations = UI_TRANSLATIONS[selectedLanguage];

  const handleLanguageCardTap = (langCode: SupportedLanguage) => {
    playAudioChime('pop');
    onSelectLanguage(langCode);
    const langObj = SUPPORTED_LANGUAGES.find(l => l.code === langCode);
    if (langObj) {
      speakText(langObj.sampleGreeting, langCode);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-950 to-slate-950 text-white flex flex-col justify-between p-4 py-8 relative overflow-hidden">
      {/* Decorative ambient background glows */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md mx-auto w-full space-y-6 z-10">
        {/* App Branding & Welcome Banner */}
        <div className="text-center space-y-3 pt-2">
          <div className="relative w-20 h-20 mx-auto rounded-full overflow-hidden border-4 border-amber-400 shadow-2xl bg-amber-50 animate-pulse">
            <Image
              src="/jyothi-logo.jpg"
              alt="Jyothi App Logo"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-amber-300 via-rose-200 to-amber-100 bg-clip-text text-transparent">
                JYOTHI • ஜோதி
              </h1>
            </div>
            <p className="text-sm font-semibold text-amber-200/90 mt-1">
              “Her Voice. Her Language. Her Access.”
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-center shadow-lg space-y-1">
            <h2 className="text-lg font-bold text-white flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>{currentTranslations.chooseLanguageTitle}</span>
            </h2>
            <p className="text-xs text-purple-200">
              {currentTranslations.chooseLanguageSub}
            </p>
          </div>
        </div>

        {/* 4 Large Touch Cards for Languages */}
        <div className="grid grid-cols-1 gap-3.5 pt-1">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.code;

            return (
              <button
                key={lang.code}
                onClick={() => handleLanguageCardTap(lang.code)}
                className={`w-full p-4 rounded-3xl transition-all text-left flex items-center justify-between border-2 active:scale-98 shadow-md ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-300 ring-4 ring-amber-400/40 font-bold scale-[1.02]'
                    : 'bg-white/10 hover:bg-white/15 text-white border-white/20'
                }`}
                aria-label={`Select ${lang.name} - ${lang.nativeName}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl filter drop-shadow-md">{lang.flag}</span>
                  <div>
                    <div className="text-2xl font-black tracking-tight leading-none">
                      {lang.nativeName}
                    </div>
                    <div className={`text-xs mt-1 ${isSelected ? 'text-amber-950 font-semibold' : 'text-purple-200'}`}>
                      {lang.name} • {lang.description}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      speakText(lang.sampleGreeting, lang.code);
                    }}
                    className={`p-2.5 rounded-full ${
                      isSelected ? 'bg-amber-700/20 text-slate-950 hover:bg-amber-700/30' : 'bg-white/10 text-white hover:bg-white/20'
                    }`}
                    title="Audio Sample"
                    aria-label={`Hear ${lang.nativeName} audio sample`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>

                  {isSelected && (
                    <CheckCircle2 className="w-7 h-7 text-slate-950" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Confirm Action */}
      <div className="max-w-md mx-auto w-full pt-6 z-10">
        <button
          onClick={onProceed}
          className="w-full bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-lg py-4 px-6 rounded-2xl shadow-xl flex items-center justify-center gap-3 transition-transform active:scale-95"
        >
          <span>{isInitialOnboarding ? 'தொடரவும் / आगे बढ़ें / Continue' : 'சேமிக்கவும் / Save'}</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};
