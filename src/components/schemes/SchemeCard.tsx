'use client';

import React, { useState } from 'react';
import { Scheme } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { Landmark, ArrowRight, FileCheck, CheckCircle2, Info, Sparkles, ExternalLink } from 'lucide-react';
import { AudioButton } from '../common/AudioButton';
import { EligibilityCheckerModal } from './EligibilityCheckerModal';
import { StepByStepGuideModal } from './StepByStepGuideModal';

interface SchemeCardProps {
  scheme: Scheme;
  onStartApplication?: (scheme: Scheme) => void;
}

export const SchemeCard: React.FC<SchemeCardProps> = ({ scheme, onStartApplication }) => {
  const { language, t } = useLanguage();
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  const title = scheme.title[language] || scheme.title.ta;
  const benefit = scheme.benefitSummary[language] || scheme.benefitSummary.ta;
  const amount = scheme.amountOrBenefit[language] || scheme.amountOrBenefit.ta;
  const target = scheme.targetAudience[language] || scheme.targetAudience.ta;
  const where = scheme.whereToApply[language] || scheme.whereToApply.ta;

  const fullAudioText = `${title}. பயன்: ${amount}. விவரம்: ${benefit}. விண்ணப்பிக்க: ${where}`;

  return (
    <>
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 md:p-6 border border-warm-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all">
        {/* Category & Audio bar */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wide bg-jyothi-100 text-jyothi-800 dark:bg-jyothi-950/70 dark:text-jyothi-300">
            {scheme.category === 'maternity' ? 'மகப்பேறு உதவி' : scheme.category === 'women' ? 'மகளிர் திட்டம்' : scheme.category === 'education' ? 'பெண் கல்வி' : 'வேலைவாய்ப்பு'}
          </span>
          <AudioButton textToRead={fullAudioText} size="sm" />
        </div>

        {/* Scheme Title */}
        <h3 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-snug mb-2">
          {title}
        </h3>

        {/* Amount / Benefit Highlight Banner */}
        <div className="my-3 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500/15 via-teal-500/10 to-transparent border border-emerald-500/30 flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm shrink-0">
            ₹
          </div>
          <div>
            <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold block">அரசு உதவித் தொகை / Benefit:</span>
            <span className="text-sm md:text-base font-extrabold text-emerald-950 dark:text-emerald-200">{amount}</span>
          </div>
        </div>

        {/* Benefit Summary Description */}
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
          {benefit}
        </p>

        {/* Who is this for */}
        <div className="mb-4 text-xs text-slate-600 dark:text-slate-400 bg-warm-50 dark:bg-slate-900/60 p-3 rounded-xl border border-warm-200 dark:border-slate-800">
          <span className="font-bold text-slate-800 dark:text-slate-200">யாருக்கானது: </span>
          <span>{target}</span>
        </div>

        {/* Action Buttons: Check Eligibility / How to Apply */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-warm-100 dark:border-slate-700/60">
          <button
            type="button"
            onClick={() => setShowEligibilityModal(true)}
            className="w-full py-3 px-4 rounded-xl bg-jyothi-700 hover:bg-jyothi-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4 text-amber-300" />
            <span>{t('checkEligibility')}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowGuideModal(true)}
            className="w-full py-3 px-4 rounded-xl bg-warm-100 dark:bg-slate-700/80 hover:bg-warm-200 text-jyothi-900 dark:text-slate-100 font-bold text-xs sm:text-sm border border-warm-300 dark:border-slate-600 flex items-center justify-center gap-1.5 transition active:scale-95"
          >
            <Info className="w-4 h-4 text-jyothi-600 dark:text-jyothi-300" />
            <span>{t('stepsToApply')}</span>
          </button>
        </div>

        {/* Provenance & Official Source */}
        <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400">
          <span className="truncate max-w-[200px]">மூலம்: {scheme.officialSource}</span>
          <a
            href={scheme.officialUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-jyothi-600 dark:text-jyothi-400 font-medium inline-flex items-center gap-0.5 hover:underline"
          >
            <span>இணையதளம்</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Interactive 1-Question-at-a-time Eligibility Modal */}
      <EligibilityCheckerModal
        isOpen={showEligibilityModal}
        scheme={scheme}
        onClose={() => setShowEligibilityModal(false)}
        onProceedToApply={() => {
          setShowEligibilityModal(false);
          onStartApplication?.(scheme);
        }}
      />

      {/* Step-by-Step Guidance Modal */}
      <StepByStepGuideModal
        isOpen={showGuideModal}
        scheme={scheme}
        onClose={() => setShowGuideModal(false)}
        onStartForm={() => {
          setShowGuideModal(false);
          onStartApplication?.(scheme);
        }}
      />
    </>
  );
};
