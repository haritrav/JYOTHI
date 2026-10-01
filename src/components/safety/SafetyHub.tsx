'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSafety } from '@/contexts/SafetyContext';
import { VERIFIED_SUPPORT_CENTRES, EMERGENCY_NUMBERS } from '@/data/verifiedSafety';
import { ShieldAlert, AlertOctagon, Phone, HeartHandshake, Scale, Home, Heart, Shield, ArrowRight, ExternalLink, MapPin } from 'lucide-react';
import { AudioButton } from '../common/AudioButton';
import { ImmediateDangerModal } from './ImmediateDangerModal';
import { TrustedContactManager } from './TrustedContactManager';
import { SafetyPlanBuilder } from './SafetyPlanBuilder';

export const SafetyHub: React.FC = () => {
  const { language, t } = useLanguage();
  const { showEmergencyModal, setShowEmergencyModal } = useSafety();

  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  const issueOptions = [
    { id: 'physical', label: t('physicalAbuse'), advice: 'உடல் ரீதியான வன்முறைக்கு எதிராக சட்டம் மற்றும் காவல்துறை உடனடி பாதுகாப்பு வழங்குகிறது. 181 அல்லது சகி மையத்தை அணுகலாம்.' },
    { id: 'emotional', label: t('emotionalAbuse'), advice: 'மனரீதியான துன்புறுத்தலும் சட்டப்படி குற்றமாகும். இலவச கவுன்சிலிங் மற்றும் பாதுகாப்பு உத்தரவு பெறலாம்.' },
    { id: 'dowry', label: t('dowryAbuse'), advice: 'வரதட்சணை கேட்பது சட்டப்படி தடை செய்யப்பட்டுள்ளது. பெண்கள் காவல் பிரிவு (1091) மற்றும் இலவச அரசு வழக்கறிஞர் உங்களுக்கு உதவுவர்.' },
    { id: 'threats', label: t('threats'), advice: 'குடும்பத்தில் இருந்து அச்சுறுத்தல் இருந்தால் உடனடியாக 112 அல்லது நம்பிக்கையான நபரை அழைக்கவும்.' },
    { id: 'no_explain', label: 'விளக்க விரும்பவில்லை / Skip', advice: 'எந்த விபரமும் கூறாமல் நேரடியாக 181 மகளிர் உதவி எண்ணில் ரகசியமாகப் பேசலாம்.' },
  ];

  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {t('catSafety')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t('safetyIntro')}
            </p>
          </div>
        </div>
      </div>

      {/* 🚨 PROMINENT IMMEDIATE DANGER BUTTON — Requirement #22 */}
      <button
        type="button"
        onClick={() => setShowEmergencyModal(true)}
        className="w-full p-5 rounded-3xl bg-gradient-to-r from-red-600 via-red-700 to-rose-700 text-white font-extrabold text-lg flex items-center justify-between shadow-xl ring-4 ring-red-400/30 hover:brightness-110 transition active:scale-95 animate-pulse-subtle"
      >
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <AlertOctagon className="w-7 h-7 text-amber-300" />
          </div>
          <div className="text-left">
            <span className="block text-lg md:text-xl font-black">{t('emergencyHelp')}</span>
            <span className="text-xs text-red-100 font-normal">
              112 காவல்துறை • 181 பெண்கள் உதவி • 1-தட்டு அவசர அழைப்பு
            </span>
          </div>
        </div>
        <ArrowRight className="w-6 h-6 stroke-[3] text-amber-300" />
      </button>

      {/* Quick Helplines Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {EMERGENCY_NUMBERS.slice(0, 2).map((item) => {
          const name = item.name[language] || item.name.ta;
          const desc = item.description[language] || item.description.ta;
          return (
            <div
              key={item.number}
              className="p-4 rounded-2xl bg-white dark:bg-slate-800/90 border border-warm-200 dark:border-slate-700 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-extrabold text-red-600 dark:text-red-400">24 மணி நேரமும் இலவசம்</span>
                  <AudioButton textToRead={`${name}. எண்: ${item.number}. ${desc}`} size="sm" variant="subtle" />
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100">{name}</h4>
                <p className="text-xs text-slate-500 mt-1">{desc}</p>
              </div>

              <a
                href={`tel:${item.number}`}
                className="mt-3 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow transition active:scale-95"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>அழைக்க {item.number}</span>
              </a>
            </div>
          );
        })}
      </div>

      {/* Respectful Guided Domestic Violence & Dowry Harassment Inquiries — Requirement #23 */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 md:p-6 border border-warm-200 dark:border-slate-700 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-600" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              {t('facingViolence')}
            </h3>
          </div>
          <AudioButton
            textToRead="வீட்டில் அல்லது குடும்பத்தில் அச்சுறுத்தலா? கீழே உள்ள வாய்ப்புகளில் ஏதேனும் ஒன்றைத் தொட்டு தகுந்த ஆலோசனையைப் பெறலாம்."
            size="sm"
          />
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          நீங்கள் எந்த விவரத்தையும் கட்டாயமாக பகிர வேண்டியதில்லை. உங்களுக்கு எவ்வகையான ஆதரவு தேவை என்பதை அறிய கீழேயுள்ள ஒன்றைத் தேர்ந்தெடுக்கலாம்:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {issueOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelectedIssue(opt.id)}
              className={`p-3 rounded-2xl text-left text-xs font-bold transition flex items-center justify-between border ${
                selectedIssue === opt.id
                  ? 'bg-jyothi-50 dark:bg-jyothi-950/40 border-jyothi-600 text-jyothi-900 dark:text-jyothi-200 ring-2 ring-jyothi-400/20'
                  : 'bg-warm-50 dark:bg-slate-900/60 border-warm-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-jyothi-400'
              }`}
            >
              <span>{opt.label}</span>
              <ArrowRight className="w-3.5 h-3.5 text-jyothi-600 shrink-0 ml-1" />
            </button>
          ))}
        </div>

        {selectedIssue && (
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-xs text-indigo-950 dark:text-indigo-200 animate-slide-up space-y-2">
            <span className="font-bold block">ஜோதியின் வழிகாட்டுதல்:</span>
            <p>{issueOptions.find((o) => o.id === selectedIssue)?.advice}</p>
            <div className="flex gap-2 pt-2">
              <a
                href="tel:181"
                className="py-2 px-3 rounded-xl bg-jyothi-700 text-white font-bold flex items-center gap-1 text-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>181 அழைக்க</span>
              </a>
            </div>
          </div>
        )}
      </div>

      {/* One Stop Centres (Sakhi) Directory — Requirement #26 */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 md:p-6 border border-warm-200 dark:border-slate-700 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Home className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              {t('oneStopCentres')} (One Stop Centres)
            </h3>
          </div>
          <AudioButton
            textToRead="ஒன் ஸ்டாப் சேவை மையங்கள். ஒரே கூரையின் கீழ் தங்குமிடம், இலவச சட்ட உதவி, மருத்துவ சிகிச்சை மற்றும் போலீஸ் உதவி கிடைக்கும் அரசு மையம்."
            size="sm"
          />
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          ஒரே கூரையின் கீழ் பெண்களுக்கு தற்காலிக பாதுகாப்பான தங்குமிடம், மருத்துவ உதவி, இலவச சட்ட ஆலோசனை மற்றும் காவல்துறை உதவி வழங்கும் அரசு மையம்.
        </p>

        <div className="space-y-3">
          {VERIFIED_SUPPORT_CENTRES.map((centre) => {
            const name = centre.name[language] || centre.name.ta;
            const addr = centre.address[language] || centre.address.ta;
            const dir = centre.directionsHelp[language] || centre.directionsHelp.ta;

            return (
              <div
                key={centre.id}
                className="p-4 rounded-2xl bg-warm-50 dark:bg-slate-900/60 border border-warm-200 dark:border-slate-800 space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      24/7 அரசு மையம்
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{name}</h4>
                  </div>
                  <span className="text-xs text-emerald-600 font-bold">{centre.distanceApprox}</span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{addr}</span>
                </p>

                <p className="text-[11px] text-slate-500 italic">வழித்தடம்: {dir}</p>

                <div className="flex gap-2 pt-2">
                  <a
                    href={`tel:${centre.phone}`}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t('callNow')}: {centre.phone}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legal Rights Simplified Guide — Requirement #27 */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-jyothi-500/10 rounded-3xl p-5 border border-indigo-200 dark:border-indigo-900/40 space-y-3">
        <div className="flex items-center gap-2">
          <Scale className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            ⚖️ உங்கள் சட்டப்பூர்வ உரிமைகள் (Know Your Rights)
          </h3>
        </div>
        <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-4 leading-relaxed">
          <li><strong>குடும்ப வன்முறை பாதுகாப்பு சட்டம் 2005:</strong> வீட்டில் இருந்து வெளியேற்றப்படாமல் வாழும் உரிமை (Residence Order) மற்றும் பாதுகாப்பு உத்தரவு பெறும் உரிமை உண்டு.</li>
          <li><strong>இலவச சட்ட உதவி (NALSA):</strong> பெண்களுக்கு எந்த நீதிமன்றத்திலும் வாதாட 100% இலவச அரசு வழக்கறிஞர் வசதி உண்டு.</li>
          <li><strong>வரதட்சணை தடுப்பு சட்டம்:</strong> வரதட்சணை கேட்பதும் வாங்குவதும் சட்டப்படி 5 ஆண்டுகள் வரை சிறை தண்டனைக்குரிய குற்றமாகும்.</li>
        </ul>
      </div>

      {/* Trusted Contact Manager */}
      <TrustedContactManager />

      {/* Safety Plan Builder */}
      <SafetyPlanBuilder />

      {/* Immediate Danger Modal */}
      <ImmediateDangerModal
        isOpen={showEmergencyModal}
        onClose={() => setShowEmergencyModal(false)}
      />
    </div>
  );
};
