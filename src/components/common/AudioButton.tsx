'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SpeechService } from '@/lib/speech';

interface AudioButtonProps {
  textToRead: string;
  label?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'subtle' | 'floating';
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  textToRead,
  label,
  className = '',
  size = 'md',
  variant = 'secondary',
}) => {
  const { language, t } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const unsub = SpeechService.subscribe((speaking) => {
      if (!speaking) {
        setIsPlaying(false);
      }
    });
    return unsub;
  }, []);

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPlaying) {
      SpeechService.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      SpeechService.speak(textToRead, language, () => {
        setIsPlaying(false);
      });
    }
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1.5 text-xs gap-1.5 min-h-[36px]',
    md: 'px-4 py-2 text-sm md:text-base gap-2 min-h-[44px]',
    lg: 'px-5 py-3 text-base md:text-lg gap-2.5 min-h-[52px]',
  }[size];

  const variantClasses = {
    primary: 'bg-jyothi-700 text-white hover:bg-jyothi-800 shadow-md active:scale-95',
    secondary: 'bg-warm-100 text-jyothi-900 border border-warm-300 hover:bg-warm-200 shadow-sm active:scale-95',
    subtle: 'bg-transparent text-jyothi-800 hover:bg-jyothi-100/60 active:scale-95',
    floating: 'bg-amber-500 text-slate-950 font-bold shadow-lg ring-2 ring-amber-300 active:scale-95',
  }[variant];

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isPlaying ? 'Stop listening' : 'Listen to this content'}
      className={`inline-flex items-center justify-center font-medium rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-jyothi-500 cursor-pointer ${sizeClasses} ${variantClasses} ${className}`}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-5 h-5 text-red-600 animate-pulse" />
          <span>{isPlaying ? 'நிறுத்துக / Stop' : label || t('listen')}</span>
          <span className="flex gap-0.5 items-end h-3 ml-1">
            <span className="w-1 bg-red-600 h-2 animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 bg-red-600 h-3 animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 bg-red-600 h-1.5 animate-bounce" style={{ animationDelay: '300ms' }} />
          </span>
        </>
      ) : (
        <>
          <Volume2 className="w-5 h-5 text-jyothi-700 shrink-0" />
          <span>{label || t('listen')}</span>
        </>
      )}
    </button>
  );
};
