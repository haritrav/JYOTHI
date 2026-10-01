'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SpeechService } from '@/lib/speech';
import { useLanguage } from './LanguageContext';

export type TextSize = 'normal' | 'large' | 'extralarge';
export type ContrastMode = 'normal' | 'high-contrast' | 'dark';

interface AccessibilityContextType {
  textSize: TextSize;
  setTextSize: (size: TextSize) => void;
  contrastMode: ContrastMode;
  setContrastMode: (mode: ContrastMode) => void;
  increaseTextSize: () => void;
  decreaseTextSize: () => void;
  readScreen: () => void;
  stopReading: () => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  const [textSize, setTextSizeState] = useState<TextSize>('large'); // Default to large for rural accessibility
  const [contrastMode, setContrastModeState] = useState<ContrastMode>('normal');
  const { language } = useLanguage();

  useEffect(() => {
    const savedSize = localStorage.getItem('jyothi_text_size') as TextSize;
    if (savedSize) setTextSizeState(savedSize);

    const savedContrast = localStorage.getItem('jyothi_contrast') as ContrastMode;
    if (savedContrast) setContrastModeState(savedContrast);
  }, []);

  const setTextSize = (size: TextSize) => {
    setTextSizeState(size);
    localStorage.setItem('jyothi_text_size', size);
  };

  const setContrastMode = (mode: ContrastMode) => {
    setContrastModeState(mode);
    localStorage.setItem('jyothi_contrast', mode);
  };

  const increaseTextSize = () => {
    if (textSize === 'normal') setTextSize('large');
    else if (textSize === 'large') setTextSize('extralarge');
  };

  const decreaseTextSize = () => {
    if (textSize === 'extralarge') setTextSize('large');
    else if (textSize === 'large') setTextSize('normal');
  };

  const readScreen = () => {
    if (typeof document === 'undefined') return;
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      const text = mainContent.innerText || mainContent.textContent || '';
      SpeechService.speak(text.slice(0, 800), language);
    }
  };

  const stopReading = () => {
    SpeechService.stop();
  };

  const textSizeClass =
    textSize === 'extralarge' ? 'text-xl md:text-2xl' : textSize === 'large' ? 'text-lg md:text-xl' : 'text-base md:text-lg';

  const contrastClass =
    contrastMode === 'high-contrast'
      ? 'bg-black text-yellow-300 font-semibold selection:bg-yellow-400 selection:text-black'
      : contrastMode === 'dark'
      ? 'bg-slate-950 text-slate-100'
      : 'bg-warm-50 text-slate-900';

  return (
    <AccessibilityContext.Provider
      value={{
        textSize,
        setTextSize,
        contrastMode,
        setContrastMode,
        increaseTextSize,
        decreaseTextSize,
        readScreen,
        stopReading,
      }}
    >
      <div className={`min-h-screen transition-all duration-200 ${textSizeClass} ${contrastClass}`}>
        {children}
      </div>
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
