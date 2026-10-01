'use client';

import React from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Volume2, Sun, Moon, Type, Eye } from 'lucide-react';

export const AccessibilityBar: React.FC = () => {
  const { textSize, setTextSize, contrastMode, setContrastMode, readScreen, stopReading } =
    useAccessibility();
  const { t, isSpeaking } = useLanguage();

  return (
    <div
      role="toolbar"
      aria-label="Accessibility controls"
      className="bg-warm-100 dark:bg-slate-900 border-b border-warm-200 dark:border-slate-800 px-3 py-1.5 flex items-center justify-between text-xs font-semibold"
    >
      {/* Font Resizing */}
      <div className="flex items-center gap-1">
        <span className="text-slate-600 dark:text-slate-400 mr-1 hidden sm:inline">{t('textSize')}:</span>
        <button
          type="button"
          onClick={() => setTextSize('normal')}
          aria-label="Normal text size"
          className={`px-2 py-1 rounded-md transition ${
            textSize === 'normal'
              ? 'bg-jyothi-700 text-white font-bold shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-warm-300 dark:border-slate-700'
          }`}
        >
          A
        </button>
        <button
          type="button"
          onClick={() => setTextSize('large')}
          aria-label="Large text size"
          className={`px-2.5 py-1 rounded-md text-sm transition ${
            textSize === 'large'
              ? 'bg-jyothi-700 text-white font-bold shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-warm-300 dark:border-slate-700'
          }`}
        >
          A+
        </button>
        <button
          type="button"
          onClick={() => setTextSize('extralarge')}
          aria-label="Extra large text size"
          className={`px-3 py-1 rounded-md text-base font-extrabold transition ${
            textSize === 'extralarge'
              ? 'bg-jyothi-700 text-white shadow-sm'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-warm-300 dark:border-slate-700'
          }`}
        >
          A++
        </button>
      </div>

      {/* Contrast & Screen Reader */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() =>
            setContrastMode(
              contrastMode === 'normal' ? 'high-contrast' : contrastMode === 'high-contrast' ? 'dark' : 'normal'
            )
          }
          className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-white dark:bg-slate-800 border border-warm-300 dark:border-slate-700 text-slate-700 dark:text-slate-200"
          title="உயர் நிற வேறுபாடு / High Contrast"
        >
          <Eye className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span className="hidden sm:inline">
            {contrastMode === 'high-contrast' ? 'கறுப்பு/மஞ்சள்' : contrastMode === 'dark' ? 'இரவுப் பயன்முறை' : 'நிறம்'}
          </span>
        </button>

        <button
          type="button"
          onClick={() => (isSpeaking ? stopReading() : readScreen())}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition shadow-sm ${
            isSpeaking
              ? 'bg-red-600 text-white animate-pulse'
              : 'bg-jyothi-700 text-white hover:bg-jyothi-800'
          }`}
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{isSpeaking ? 'நிறுத்து' : t('readPage')}</span>
        </button>
      </div>
    </div>
  );
};
