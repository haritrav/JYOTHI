'use client';

import React from 'react';
import { EMERGENCY_NUMBERS } from '@/data/verifiedSafety';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSafety } from '@/contexts/SafetyContext';
import { PhoneCall, AlertOctagon, X, Phone, Shield, HeartHandshake } from 'lucide-react';
import { AudioButton } from '../common/AudioButton';

interface ImmediateDangerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ImmediateDangerModal: React.FC<ImmediateDangerModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const { trustedContact } = useSafety();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-red-950/90 backdrop-blur-md p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border-4 border-red-600 animate-slide-up flex flex-col justify-between max-h-[92vh] overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-red-200 dark:border-red-900/60 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md animate-pulse">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-red-600 dark:text-red-400">
                  {t('emergencyHelp')}
                </h3>
                <p className="text-xs text-slate-500">24/7 உடனடி பாதுகாப்பு எண்கள்</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Calming reassurance */}
          <div className="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-950 dark:text-red-200 mb-4 font-semibold leading-relaxed">
            பயப்பட வேண்டாம். நீங்கள் தனியாக இல்லை. கீழே உள்ள எண்களை தொட்டு உடனே இலவசமாக பேசலாம்.
          </div>

          {/* Primary 112 National Emergency Call Button */}
          <a
            href="tel:112"
            className="w-full py-4 px-5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-lg flex items-center justify-between shadow-xl transition active:scale-95 mb-3"
          >
            <div className="flex items-center gap-3">
              <PhoneCall className="w-7 h-7 animate-bounce" />
              <div className="text-left">
                <span className="block text-xl">112 அழைக்கவும்</span>
                <span className="text-xs text-red-100 font-normal">காவல்துறை & ஆம்புலன்ஸ் (அனைத்து அவசர உதவி)</span>
              </div>
            </div>
            <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-full">இலவசம்</span>
          </a>

          {/* 181 Women Helpline */}
          <a
            href="tel:181"
            className="w-full py-3.5 px-5 rounded-2xl bg-jyothi-700 hover:bg-jyothi-800 text-white font-bold text-base flex items-center justify-between shadow-lg transition active:scale-95 mb-3"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-6 h-6 text-amber-300" />
              <div className="text-left">
                <span className="block text-base">181 மகளிர் உதவி எண்</span>
                <span className="text-xs text-pink-100 font-normal">பாதுகாப்பு, ஆலோசனை & தங்குமிடம்</span>
              </div>
            </div>
            <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full">24x7</span>
          </a>

          {/* Trusted Person Contact If Available */}
          {trustedContact?.phone && (
            <a
              href={`tel:${trustedContact.phone}`}
              className="w-full py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base flex items-center justify-between shadow-lg transition active:scale-95 mb-3"
            >
              <div className="flex items-center gap-3">
                <HeartHandshake className="w-6 h-6 text-emerald-200" />
                <div className="text-left">
                  <span className="block text-base">{trustedContact.name} ({trustedContact.relationship})</span>
                  <span className="text-xs text-emerald-100 font-normal">உங்கள் நம்பிக்கையான நபர்</span>
                </div>
              </div>
              <span className="text-xs font-bold bg-white/20 px-2.5 py-1 rounded-full">{trustedContact.phone}</span>
            </a>
          )}

          {/* Other Official Helplines */}
          <div className="space-y-2 mt-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              கூடுதல் அவசர உதவி எண்கள்:
            </span>
            {EMERGENCY_NUMBERS.slice(2).map((item) => (
              <a
                key={item.number}
                href={`tel:${item.number}`}
                className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 flex items-center justify-between transition text-xs"
              >
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">
                    {item.name[language] || item.name.ta}
                  </span>
                  <span className="text-slate-500 text-[11px]">{item.number}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-red-600">{t('callNow')}</span>
                  <Phone className="w-4 h-4 text-red-600" />
                </div>
              </a>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-bold text-sm"
        >
          மூடுக / Close
        </button>
      </div>
    </div>
  );
};
