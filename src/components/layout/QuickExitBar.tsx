'use client';

import React from 'react';
import { LogOut, ShieldAlert } from 'lucide-react';
import { useSafety } from '@/contexts/SafetyContext';
import { useLanguage } from '@/contexts/LanguageContext';

export const QuickExitBar: React.FC = () => {
  const { triggerQuickExit } = useSafety();
  const { t } = useLanguage();

  return (
    <div className="bg-red-700 text-white px-3 py-1.5 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-1.5 text-xs font-semibold">
        <ShieldAlert className="w-4 h-4 text-amber-300 shrink-0" />
        <span className="hidden sm:inline">உங்கள் பாதுகாப்பே முதன்மையானது:</span>
        <span className="text-[11px] sm:text-xs opacity-95">உடனடி மறைப்பு வசதி</span>
      </div>

      <button
        type="button"
        onClick={triggerQuickExit}
        className="px-3 py-1 rounded-full bg-red-950/80 hover:bg-black text-amber-300 font-extrabold text-xs flex items-center gap-1 border border-amber-400/40 shadow transition active:scale-95 cursor-pointer"
        aria-label="Quick Exit"
        title="உடனடியாக திரையை மறைக்க / Quick Exit"
      >
        <LogOut className="w-3.5 h-3.5" />
        <span>{t('quickExit')}</span>
      </button>
    </div>
  );
};
