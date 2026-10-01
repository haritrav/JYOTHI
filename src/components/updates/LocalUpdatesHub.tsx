'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from '@/contexts/LocationContext';
import { VERIFIED_ELECTRICITY_UPDATES, VERIFIED_RATION_UPDATES, VERIFIED_EMPLOYMENT_UPDATES } from '@/data/verifiedUpdates';
import { Radio, Zap, ShoppingBag, Pickaxe, MapPin, Clock, Phone, AlertCircle, ShieldCheck } from 'lucide-react';
import { AudioButton } from '../common/AudioButton';

export const LocalUpdatesHub: React.FC = () => {
  const { language, t } = useLanguage();
  const { location } = useLocation();
  const [activeTab, setActiveTab] = useState<'all' | 'electricity' | 'ration' | 'employment'>('all');

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
            <Radio className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {t('catUpdates')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {location.district} பகுதிக்கான சரிபார்க்கப்பட்ட தகவல்கள்
            </p>
          </div>
        </div>
      </div>

      {/* Provenance Guarantee Banner */}
      <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2 leading-relaxed">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <span>
          அனைத்து தகவல்களும் அரசு மின்வாரியம், நுகர்வோர் வழங்கல் துறை மற்றும் ஊரக வளர்ச்சி முகமையால் நேரடியாக சரிபார்க்கப்பட்டவை.
        </span>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'all', label: 'அனைத்து தகவல்கள்' },
          { id: 'electricity', label: '⚡ மின்சார வெட்டு' },
          { id: 'ration', label: '🌾 ரேஷன் கடை' },
          { id: 'employment', label: '⛏️ 100 நாள் வேலை' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition active:scale-95 ${
              activeTab === tab.id
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-warm-200 dark:border-slate-700 hover:bg-warm-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. Electricity Updates */}
      {(activeTab === 'all' || activeTab === 'electricity') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>{t('electricityTitle')}</span>
            </h3>
          </div>

          {VERIFIED_ELECTRICITY_UPDATES.map((item) => {
            const area = item.area[language] || item.area.ta;
            const reason = item.reason[language] || item.reason.ta;
            const fullAudio = `மின்சார பராமரிப்பு அறிவிப்பு. பகுதி: ${area}. தேதி: ${item.date}. நேரம்: காலை ${item.startTime} முதல் மாலை ${item.endTime} வரை. காரணம்: ${reason}. உதவி எண்: ${item.contactHelpline}`;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-warm-200 dark:border-slate-700 shadow-md"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/70 text-amber-800 dark:text-amber-300 text-xs font-extrabold">
                      திட்டமிடப்பட்ட பராமரிப்பு
                    </span>
                    <span className="text-xs text-slate-400 font-medium">தேதி: {item.date}</span>
                  </div>
                  <AudioButton textToRead={fullAudio} size="sm" />
                </div>

                <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  {area}
                </h4>

                <div className="my-3 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-amber-950 dark:text-amber-200 space-y-1">
                  <div className="flex items-center gap-2 font-bold">
                    <Clock className="w-4 h-4 text-amber-600" />
                    <span>நேரம்: {item.startTime} முதல் {item.endTime} வரை</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 pt-1">
                    <span className="font-semibold">காரணம்: </span> {reason}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 pt-2 border-t border-warm-100 dark:border-slate-700/60">
                  <span>துணை மின்நிலையம்: {item.subStation}</span>
                  <a
                    href={`tel:${item.contactHelpline}`}
                    className="inline-flex items-center gap-1 font-bold text-amber-700 dark:text-amber-400 hover:underline"
                  >
                    <Phone className="w-3 h-3" />
                    <span>மின் உதவி எண்: {item.contactHelpline}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 2. Ration Shop Updates */}
      {(activeTab === 'all' || activeTab === 'ration') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <ShoppingBag className="w-4 h-4 text-teal-600" />
              <span>{t('rationTitle')}</span>
            </h3>
          </div>

          {VERIFIED_RATION_UPDATES.map((shop) => {
            const name = shop.shopName[language] || shop.shopName.ta;
            const loc = shop.location[language] || shop.location.ta;
            const instr = shop.specialInstructions[language] || shop.specialInstructions.ta;
            const fullAudio = `ரேஷன் கடை: ${name}. இருப்பிடம்: ${loc}. வேலை நேரம்: ${shop.timings}. அரிசி, பருப்பு, சமையல் எண்ணெய் இருப்பு உள்ளது. விரல்ரேகை வரவில்லை என்றால் OTP மூலம் பெறலாம்.`;

            return (
              <div
                key={shop.id}
                className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-warm-200 dark:border-slate-700 shadow-md"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-950/70 text-teal-800 dark:text-teal-300">
                      கடை எண்: {shop.shopNumber}
                    </span>
                    <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                      {name}
                    </h4>
                  </div>
                  <AudioButton textToRead={fullAudio} size="sm" />
                </div>

                <p className="text-xs text-slate-500 mb-3 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-teal-600" />
                  <span>{loc}</span>
                </p>

                {/* Available Commodities Table */}
                <div className="my-3 space-y-1.5 bg-warm-50 dark:bg-slate-900/60 p-3 rounded-2xl border border-warm-200 dark:border-slate-800 text-xs">
                  <span className="font-extrabold text-slate-700 dark:text-slate-300 block mb-1">
                    பொருட்கள் இருப்பு விவரம் (Live Stocks):
                  </span>
                  {shop.commodities.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-warm-100 dark:border-slate-800/80 last:border-none">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {item.item[language] || item.item.ta}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500">{item.quantityPerCard}</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                          {item.stockStatus === 'available' ? 'இருப்பு உள்ளது' : 'குறைவான இருப்பு'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* OTP / Biometric Instruction */}
                <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800/40 text-xs text-teal-950 dark:text-teal-200 leading-relaxed">
                  💡 <span className="font-bold">முக்கிய குறிப்பு: </span> {instr}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. 100-Day Work / Employment */}
      {(activeTab === 'all' || activeTab === 'employment') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Pickaxe className="w-4 h-4 text-indigo-600" />
              <span>{t('mgnregsTitle')}</span>
            </h3>
          </div>

          {VERIFIED_EMPLOYMENT_UPDATES.map((emp) => {
            const title = emp.title[language] || emp.title.ta;
            const loc = emp.location[language] || emp.location.ta;
            const elig = emp.eligibility[language] || emp.eligibility.ta;
            const how = emp.howToApply[language] || emp.howToApply.ta;
            const fullAudio = `100 நாள் வேலை. பணி: ${title}. ஊதியம்: ${emp.dailyWageOrStipend}. பகுதி: ${loc}. விண்ணப்பிக்க: ${how}`;

            return (
              <div
                key={emp.id}
                className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 border border-warm-200 dark:border-slate-700 shadow-md"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 text-xs font-extrabold">
                    {emp.schemeName}
                  </span>
                  <AudioButton textToRead={fullAudio} size="sm" />
                </div>

                <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mt-1">
                  {title}
                </h4>

                {/* Wage highlight */}
                <div className="my-3 p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 text-xs text-indigo-950 dark:text-indigo-200">
                  <span className="font-bold text-sm block text-indigo-900 dark:text-indigo-300">
                    தினசரி ஊதியம்: {emp.dailyWageOrStipend}
                  </span>
                  <span className="text-slate-500">கால அளவு: {emp.duration}</span>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 mb-3">
                  <p><span className="font-bold text-slate-800 dark:text-slate-200">யார் விண்ணப்பிக்கலாம்: </span>{elig}</p>
                  <p><span className="font-bold text-slate-800 dark:text-slate-200">எப்படி விண்ணப்பிப்பது: </span>{how}</p>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-warm-100 dark:border-slate-700/60">
                  <span>தொடர்புக்கு: {emp.contactPerson}</span>
                  <span className="font-bold text-indigo-700">{emp.contactNumber}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
