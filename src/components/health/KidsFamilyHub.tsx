'use client';

import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { VERIFIED_VACCINATIONS } from '@/data/verifiedHealth';
import { Baby, Calendar, Clock, MapPin, Phone, ShieldCheck, AlertCircle, Sparkles, Heart } from 'lucide-react';
import { AudioButton } from '../common/AudioButton';

export const KidsFamilyHub: React.FC = () => {
  const { language, t } = useLanguage();

  return (
    <div className="space-y-4">
      {/* Notice on MCP Card */}
      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs md:text-sm text-amber-950 dark:text-amber-200 flex items-start gap-2.5 leading-relaxed shadow-sm">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">தாய்-சேய் நல அட்டை (MCP Card) முக்கியத்துவம்:</span>
          <span>
            குழந்தைக்கு எந்த மாதத்தில் எந்த தடுப்பூசி செலுத்த வேண்டும் என்பதை உங்கள் தாய்-சேய் நல அட்டையை சரிபார்த்து அங்கன்வாடி அல்லது ஆரம்ப சுகாதார செவிலியரே (ANM/VHN) முடிவு செய்வார்.
          </span>
        </div>
      </div>

      {/* Verified Vaccination Sessions */}
      <div className="space-y-4">
        {VERIFIED_VACCINATIONS.map((vax) => {
          const title = vax.sessionTitle[language] || vax.sessionTitle.ta;
          const target = vax.targetGroup[language] || vax.targetGroup.ta;
          const centre = vax.centreName[language] || vax.centreName.ta;
          const addr = vax.address[language] || vax.address.ta;
          const disclaimer = vax.medicalDisclaimer[language] || vax.medicalDisclaimer.ta;

          const fullAudio = `தடுப்பூசி முகாம்: ${title}. யாருக்கு: ${target}. நாள்: ${vax.date}. இடம்: ${centre}, ${addr}. ஆஷா பணியாளர்: ${vax.ashaWorkerName}. ${disclaimer}`;

          return (
            <div
              key={vax.id}
              className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 md:p-6 border border-warm-200 dark:border-slate-700 shadow-md"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-3 py-1 rounded-full bg-pink-100 text-pink-800 dark:bg-pink-950 dark:text-pink-300 text-xs font-extrabold">
                  வழக்கமான தடுப்பூசி நாள்
                </span>
                <AudioButton textToRead={fullAudio} size="sm" />
              </div>

              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 leading-snug mt-1">
                {title}
              </h3>

              <div className="my-3 text-xs text-slate-600 dark:text-slate-300 bg-warm-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-warm-200 dark:border-slate-800 space-y-1.5">
                <p><span className="font-bold text-slate-800 dark:text-slate-200">யாருக்கானது: </span>{target}</p>
                <p className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-pink-600" /><span>{vax.date}</span></p>
                <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-pink-600" /><span>{vax.timings}</span></p>
                <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-pink-600" /><span>{centre}, {addr}</span></p>
              </div>

              {/* Vaccines Checklist */}
              <div className="my-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  முகாமில் வழங்கப்படும் வழக்கமான தடுப்பூசிகள்:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {vax.vaccinesAvailable.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-medium"
                    >
                      ✓ {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* ASHA worker contact */}
              <div className="flex items-center justify-between pt-3 border-t border-warm-100 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-400">
                <span>கிராம ஆஷா பணியாளர்: <strong className="text-slate-900 dark:text-slate-200">{vax.ashaWorkerName}</strong></span>
                <span className="font-bold text-pink-700 dark:text-pink-400">{vax.ashaWorkerPhone}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Maternal & Child Nutrition Guide */}
      <div className="bg-gradient-to-br from-pink-500/10 to-jyothi-500/10 rounded-3xl p-5 border border-pink-200 dark:border-pink-900/40">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="w-5 h-5 text-pink-600" />
          <h4 className="font-bold text-base text-pink-950 dark:text-pink-200">
            அங்கன்வாடி ஊட்டச்சத்து & இணை உணவு (Nutrition Support)
          </h4>
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          6 மாதம் முதல் 3 வயது வரையிலான குழந்தைகளுக்கு சத்துணவு மாவு, முட்டை மற்றும் ஊட்டச்சத்து உணவு அங்கன்வாடி மையத்தில் இலவசமாக வழங்கப்படுகிறது.
        </p>
      </div>
    </div>
  );
};
