'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage, LanguageInfo } from '@/types';
import { LANGUAGES, UI_TRANSLATIONS } from '@/data/translations';
import { SpeechService } from '@/lib/speech';

interface LanguageContextType {
  language: SupportedLanguage;
  langInfo: LanguageInfo;
  t: (key: string) => string;
  setLanguage: (lang: SupportedLanguage) => void;
  showLanguageModal: boolean;
  setShowLanguageModal: (show: boolean) => void;
  speak: (text: string, onEnd?: () => void) => void;
  stopSpeech: () => void;
  isSpeaking: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<SupportedLanguage>('ta');
  const [showLanguageModal, setShowLanguageModal] = useState<boolean>(false);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('jyothi_language') as SupportedLanguage;
    if (saved && LANGUAGES[saved]) {
      setLanguageState(saved);
    } else {
      // First time user: show language selector
      setShowLanguageModal(true);
    }

    const unsub = SpeechService.subscribe((speaking) => {
      setIsSpeaking(speaking);
    });
    return unsub;
  }, []);

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('jyothi_language', lang);
    }
    SpeechService.stop();
  };

  const t = (key: string): string => {
    const langDict = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.ta;
    return langDict[key] || UI_TRANSLATIONS.ta[key] || key;
  };

  const speak = (text: string, onEnd?: () => void) => {
    SpeechService.speak(text, language, onEnd);
  };

  const stopSpeech = () => {
    SpeechService.stop();
  };

  const langInfo = LANGUAGES[language] || LANGUAGES.ta;

  return (
    <LanguageContext.Provider
      value={{
        language,
        langInfo,
        t,
        setLanguage,
        showLanguageModal,
        setShowLanguageModal,
        speak,
        stopSpeech,
        isSpeaking,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
