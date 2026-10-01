'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from '@/contexts/LocationContext';
import { VERIFIED_HEALTH_CAMPS, VERIFIED_VACCINATIONS } from '@/data/verifiedHealth';
import { HeartPulse, Eye, Baby, Calendar, Clock, MapPin, Phone, AlertCircle, Sparkles, Stethoscope } from 'lucide-react';
import { AudioButton } from '../common/AudioButton';
import { KidsFamilyHub } from './KidsFamilyHub';

export const HealthHub: React.FC = () => {
  const { language, t } = useLanguage();
  const { location } = useLocation();
  const [activeTab, setActiveTab] = useState<'camps' | 'kids'>('camps');

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-400 flex items-center justify-center">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {t('catHealth')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              அரசு ஆரம்ப சுகாதார நிலைய இலவச மருத்துவ முகாம்கள்
            </p>
          </div>
        </div>
      </div>

      {/* Strict Medical Disclaimer — Requirements #19, #20 */}
      <div className="p-3.5 rounded-2xl bg-pink-50 dark:bg-pink-950/30 border border-pink-200 dark:border-pink-800/40 text-xs text-pink-950 dark:text-pink-200 flex items-start gap-2 leading-relaxed">
        <AlertCircle className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
        <span>
          கவனத்திற்கு: ஜோதி செயலி மருத்துவர் ஆலோசனை அல்லது நேரடி சிகிச்சைக்கு மாற்றாகாது. உடல்நலக் கோளாறுகளுக்கு உடனடியாக அரசு மருத்துவரை அணுகவும்.
        </span>
      </div>

      {/* Tabs: Health Camps vs Kids & Family */}
      <div className="flex items-center gap-2 border-b border-warm-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('camps')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition active:scale-95 ${
            activeTab === 'camps'
              ? 'bg-pink-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-warm-200 dark:border-slate-700'
          }`}
        >
          <Stethoscope className="w-4 h-4" />
          <span>இலவச மருத்துவ முகாம்கள்</span>
        </button>

        <button
          onClick={() => setActiveTab('kids')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2 transition active:scale-95 ${
            activeTab === 'kids'
              ? 'bg-jyothi-700 text-white shadow-md'
              : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-warm-200 dark:border-slate-700'
          }`}
        >
          <Baby className="w-4 h-4" />
          <span>குழந்தைகள் தடுப்பூசி & ஊட்டச்சத்து</span>
        </button>
      </div>

      {activeTab === 'camps' ? (
        /* Health Camps List */
        <div className="space-y-4">
          {VERIFIED_HEALTH_CAMPS.map((camp) => {
            const title = camp.title[language] || camp.title.ta;
            const venue = camp.venue[language] || camp.venue.ta;
            const fullAudio = `இலவச மருத்துவ முகாம்: ${title}. இடம்: ${venue}. தேதி: ${camp.date}. நேரம்: ${camp.timings}. மருத்துவர்: ${camp.doctorsAvailable}. தொடர்புக்கு: ${camp.contactNumber}`;

            return (
              <div
                key={camp.id}
                className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 md:p-6 border border-warm-200 dark:border-slate-700 shadow-md"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 text-xs font-extrabold">
                      100% இலவசம் (Free)
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{camp.villageOrTown}</span>
                  </div>
                  <AudioButton textToRead={fullAudio} size="sm" />
                </div>

                <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-snug mt-1">
                  {title}
                </h3>

                {/* Date & Time */}
                <div className="my-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-warm-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-warm-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                    <Calendar className="w-4 h-4 text-pink-600" />
                    <span>முகாம் தேதி: {camp.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                    <Clock className="w-4 h-4 text-pink-600" />
                    <span>நேரம்: {camp.timings}</span>
                  </div>
                </div>

                {/* Venue Address */}
                <div className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5 mb-3">
                  <MapPin className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                  <span>{venue}</span>
                </div>

                {/* Services Provided */}
                <div className="my-3 space-y-1">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    வழங்கப்படும் இலவச சேவைகள்:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {camp.servicesProvided.map((s, idx) => (
                      <div
                        key={idx}
                        className="p-2 rounded-xl bg-pink-50/60 dark:bg-pink-950/20 border border-pink-100 dark:border-pink-900/40 text-[11px] text-pink-950 dark:text-pink-200 font-medium"
                      >
                        ✓ {s[language] || s.ta}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Doctors & Contact Footer */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-warm-100 dark:border-slate-700/60 text-[11px] text-slate-500">
                  <span>பங்கேற்கும் மருத்துவர்கள்: {camp.doctorsAvailable}</span>
                  <a
                    href={`tel:${camp.contactNumber}`}
                    className="font-bold text-pink-700 dark:text-pink-400 hover:underline flex items-center gap-1"
                  >
                    <Phone className="w-3 h-3" />
                    <span>அழைக்க: {camp.contactNumber}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Kids & Family Hub */
        <KidsFamilyHub />
      )}
    </div>
  );
};
