'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { HelpCircle, Mic, Volume2, Globe, Shield, Phone, Sparkles } from 'lucide-react';
import { AudioButton } from '../common/AudioButton';

export const HelpScreen: React.FC = () => {
  const { t } = useLanguage();

  const fullHelpAudio =
    'ஜோதி உதவி வழிகாட்டி. 1. மைக்கை அழுத்தி உங்கள் சொந்த மொழியில் பேசலாம். 2. எந்த தகவலுக்கும் பக்கத்தில் உள்ள கேட்கும் பட்டனைத் தொடலாம். 3. அவசர காலத்தில் மேலே உள்ள சிவப்பு வெளியேறு பட்டன் மூலம் உடனடியாக திரையை மறைக்கலாம்.';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {t('catHelp')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ஜோதியை எளிதாகப் பயன்படுத்துவதற்கான எளிய கையேடு
            </p>
          </div>
        </div>
        <AudioButton textToRead={fullHelpAudio} size="sm" />
      </div>

      <div className="space-y-3">
        {/* Tip 1: Voice first */}
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-warm-200 dark:border-slate-700 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-jyothi-100 text-jyothi-700 flex items-center justify-center shrink-0">
            <Mic className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs md:text-sm">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">1. குரல் மூலம் பேசுங்கள் (Speak with Voice)</h4>
            <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              திரையின் நடுவே உள்ள பெரிய மைக் பட்டனைத் தொட்டு, "எனக்கு ரேஷன் விபரம் வேண்டும்" அல்லது "அரசு உதவி வேண்டும்" என பேசலாம்.
            </p>
          </div>
        </div>

        {/* Tip 2: Listen */}
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-warm-200 dark:border-slate-700 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0">
            <Volume2 className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs md:text-sm">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">2. தகவல்களைக் கேளுங்கள் (Audio Read-Aloud)</h4>
            <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              படிக்க சிரமமாக இருந்தால், ஒவ்வொரு அட்டையின் அருகிலும் உள்ள 🔊 (கேளுங்கள்) பட்டனைத் தொட்டால் ஜோதி அதை தெளிவாக வாசித்துக் காட்டும்.
            </p>
          </div>
        </div>

        {/* Tip 3: Emergency & Quick Exit */}
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-warm-200 dark:border-slate-700 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs md:text-sm">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">3. அவசர வெளியேறுதல் (Quick Exit)</h4>
            <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              பாதுகாப்பு அச்சுறுத்தல் இருக்கும் சூழலில் திரையின் மேலே உள்ள சிவப்பு பட்டனை அழுத்தினால் உடனடியாக கால்குலேட்டர் திரைக்கு மாறிவிடும்.
            </p>
          </div>
        </div>

        {/* Tip 4: Change Language */}
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-warm-200 dark:border-slate-700 shadow-sm flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5" />
          </div>
          <div className="flex-1 text-xs md:text-sm">
            <h4 className="font-bold text-slate-900 dark:text-slate-100">4. மொழி மாற்றம் (4 Languages)</h4>
            <p className="text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
              தமிழ், இந்தி, தெலுங்கு, மலையாளம் ஆகிய 4 மொழிகளில் எந்த நேரத்திலும் மொழியை மாற்றிக் கொள்ளலாம்.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
