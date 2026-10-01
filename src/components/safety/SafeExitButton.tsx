'use client';

import React from 'react';
import { ShieldAlert, Sun, CloudRain, Wind, ArrowLeft, Info } from 'lucide-react';
import { SupportedLanguage } from '@/types';
import { UI_TRANSLATIONS } from '@/data/translations';

interface SafeExitButtonProps {
  language: SupportedLanguage;
  onQuickExit: () => void;
  variant?: 'compact' | 'full';
}

export const SafeExitButton: React.FC<SafeExitButtonProps> = ({
  language,
  onQuickExit,
  variant = 'compact'
}) => {
  const t = UI_TRANSLATIONS[language];

  if (variant === 'full') {
    return (
      <button
        onClick={onQuickExit}
        className="w-full bg-red-700 hover:bg-red-800 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg flex items-center justify-center gap-3 transition-all active:scale-95 border-2 border-red-500"
        aria-label="Quick Exit Safe Button"
      >
        <ShieldAlert className="w-6 h-6 animate-pulse" />
        <div className="text-left">
          <div className="text-base font-bold leading-tight">{t.quickExit}</div>
          <div className="text-xs text-red-100 opacity-90">{t.quickExitSub}</div>
        </div>
      </button>
    );
  }

  return (
    <button
      onClick={onQuickExit}
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-md flex items-center gap-1.5 border border-red-400 active:scale-95 transition-all"
      title={t.quickExitSub}
      aria-label="Quick Exit"
    >
      <ShieldAlert className="w-4 h-4 text-white" />
      <span>{t.quickExit}</span>
    </button>
  );
};

interface NeutralWeatherViewProps {
  language: SupportedLanguage;
  onReturn: () => void;
}

export const NeutralWeatherView: React.FC<NeutralWeatherViewProps> = ({
  language,
  onReturn
}) => {
  const t = UI_TRANSLATIONS[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-amber-50 to-emerald-50 p-4 pb-20 text-slate-800">
      <div className="max-w-md mx-auto space-y-4">
        {/* Top bar */}
        <div className="flex items-center justify-between bg-white/80 backdrop-blur rounded-2xl p-4 shadow-sm border border-slate-200">
          <div className="flex items-center gap-2">
            <Sun className="w-6 h-6 text-amber-500" />
            <h1 className="font-bold text-lg text-slate-800">{t.neutralWeatherTitle}</h1>
          </div>
          <button
            onClick={onReturn}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 bg-slate-100 px-3 py-1.5 rounded-full"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t.backToApp}</span>
          </button>
        </div>

        {/* Weather Card */}
        <div className="bg-gradient-to-r from-blue-600 to-sky-500 text-white p-6 rounded-3xl shadow-md space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-blue-100 font-medium">{t.weatherLoc}</p>
              <h2 className="text-3xl font-extrabold mt-1">32°C</h2>
              <p className="text-sm font-medium text-blue-100">{t.weatherTemp}</p>
            </div>
            <Sun className="w-14 h-14 text-yellow-300 animate-spin-slow" />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-blue-400/40 text-xs">
            <div className="flex items-center gap-2">
              <CloudRain className="w-4 h-4 text-sky-200" />
              <span>மழை வாய்ப்பு: 15%</span>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-sky-200" />
              <span>காற்று: 12 km/h</span>
            </div>
          </div>
        </div>

        {/* Crop Advisory */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-2">
          <div className="flex items-center gap-2 text-emerald-700 font-bold">
            <Info className="w-5 h-5" />
            <h3>{t.cropTipTitle}</h3>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">
            {t.cropTipDesc}
          </p>
          <div className="pt-2 text-xs text-slate-400">
            ஆதாரம்: வேளாண் அறிவியல் மையம் (KVK) & வானிலை மையம்
          </div>
        </div>

        {/* Daily Market Rates */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-3">
          <h3 className="font-bold text-slate-800 text-sm">உள்ளூர் சந்தை விலை நிலவரம் (Mandi Rates)</h3>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">நெல் (Paddy)</span>
              <span className="font-bold text-slate-800">₹2,320 / குவிண்டால்</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">தக்காளி (Tomato)</span>
              <span className="font-bold text-slate-800">₹25 / கிலோ</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-600">தேங்காய் (Coconut)</span>
              <span className="font-bold text-slate-800">₹14 / காய்</span>
            </div>
          </div>
        </div>

        {/* Privacy safety reassurance note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 leading-normal">
          <p className="font-medium">🔒 தனியுரிமை குறிப்பு (Privacy Note):</p>
          <p className="text-[11px] text-amber-800 mt-0.5">
            கூடுதல் பாதுகாப்பிற்கு, உலாவியின் வரலாறு அல்லது தொலைபேசி அழைப்பு பதிவுகளைத் தேவைப்பட்டால் அழிக்கவும்.
          </p>
        </div>
      </div>
    </div>
  );
};
