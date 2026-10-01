'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { VERIFIED_COUNSELLING_SERVICES } from '@/data/verifiedCounselling';
import { HeartHandshake, Phone, Sparkles, CheckCircle2, ShieldCheck, Heart, UserPlus, Clock } from 'lucide-react';
import { AudioButton } from '../common/AudioButton';
import { CounsellingBookingModal } from './CounsellingBookingModal';

export const CounsellingHub: React.FC = () => {
  const { language, t } = useLanguage();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [registeredRequestId, setRegisteredRequestId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {t('catCounselling')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              அரசு Tele-MANAS மற்றும் இலவச மனநல ஆற்றுப்படுத்துதல்
            </p>
          </div>
        </div>
      </div>

      {/* Success banner if registered */}
      {registeredRequestId && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 flex items-start gap-3 shadow-sm animate-slide-up">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs md:text-sm space-y-1">
            <span className="font-bold block">
              ஆலோசனை பதிவு செய்யப்பட்டது! (கோரிக்கை எண்: {registeredRequestId})
            </span>
            <p className="text-slate-600 dark:text-slate-300">
              அரசு அங்கீகரிக்கப்பட்ட பெண் ஆலோசகர் விரைவில் நீங்கள் குறிப்பிட்ட நேரத்தில் ரகசியமாகத் தொடர்புகொள்வார்.
            </p>
          </div>
        </div>
      )}

      {/* Tele-MANAS Highlight Hero Card */}
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-5 md:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-white/20 text-emerald-100 text-xs font-bold">
              மத்திய அரசு திட்டம் • 24x7 இலவசம்
            </span>
            <AudioButton
              textToRead="Tele-MANAS தேசிய மனநல உதவி எண் 14416. மன அழுத்தம், பயம், கவலை இருக்கும்போது 24 மணி நேரமும் ரகசியமாகப் பேசலாம்."
              size="sm"
              variant="floating"
            />
          </div>

          <h3 className="text-xl font-extrabold leading-snug">
            Tele-MANAS (தேசிய மனநல உதவி மையம்)
          </h3>

          <p className="text-xs md:text-sm text-emerald-100 mt-2 leading-relaxed">
            மன அழுத்தம், குடும்பக் கவலை அல்லது பயம் இருக்கும்போது எந்தவித தயக்கமும் இன்றி எப்போது வேண்டுமானாலும் உங்கள் சொந்த மொழியிலேயே அமைதியாகப் பேசலாம்.
          </p>

          <div className="mt-4 pt-4 border-t border-emerald-500/50 flex flex-wrap items-center justify-between gap-3">
            <a
              href="tel:14416"
              className="py-3 px-5 rounded-2xl bg-white text-emerald-900 hover:bg-emerald-50 font-extrabold text-sm flex items-center gap-2 shadow-md transition active:scale-95"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>உடனே அழைக்க: 14416 (இலவசம்)</span>
            </a>

            <button
              onClick={() => setShowBookingModal(true)}
              className="py-3 px-4 rounded-2xl bg-emerald-800/80 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 border border-emerald-400/40"
            >
              <UserPlus className="w-4 h-4" />
              <span>ஆலோசகரிடம் பேச முன்பதிவு</span>
            </button>
          </div>
        </div>
      </div>

      {/* Verified Counselling Providers Directory */}
      <div className="space-y-3">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
          அங்கீகரிக்கப்பட்ட பிற ஆலோசனை மையங்கள்:
        </h3>

        {VERIFIED_COUNSELLING_SERVICES.map((srv) => {
          const name = srv.providerName[language] || srv.providerName.ta;
          const desc = srv.description[language] || srv.description.ta;
          const services = srv.servicesOffered[language] || srv.servicesOffered.ta;
          const fullAudio = `${name}. தொடர்பு எண்: ${srv.phoneNumber}. சேவைகள்: ${services}. ${desc}`;

          return (
            <div
              key={srv.id}
              className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-warm-200 dark:border-slate-700 shadow-md space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 dark:bg-teal-950 dark:text-teal-300">
                    {srv.cost}
                  </span>
                  <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {name}
                  </h4>
                </div>
                <AudioButton textToRead={fullAudio} size="sm" />
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {services}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-warm-100 dark:border-slate-700/60 text-xs">
                <span className="text-slate-400">நேரம்: {srv.operatingHours}</span>
                <a
                  href={`tel:${srv.phoneNumber}`}
                  className="py-2 px-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{srv.phoneNumber}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Booking Modal */}
      <CounsellingBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onSuccess={(id) => setRegisteredRequestId(id)}
      />
    </div>
  );
};
