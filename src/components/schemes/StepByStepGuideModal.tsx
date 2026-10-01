'use client';

import React, { useState, useEffect } from 'react';
import { Scheme } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, CheckCircle2, ArrowRight, ArrowLeft, FileText, MapPin, Sparkles } from 'lucide-react';
import { AudioButton } from '../common/AudioButton';
import { SpeechService } from '@/lib/speech';

interface StepByStepGuideModalProps {
  isOpen: boolean;
  scheme: Scheme;
  onClose: () => void;
  onStartForm?: () => void;
}

export const StepByStepGuideModal: React.FC<StepByStepGuideModalProps> = ({
  isOpen,
  scheme,
  onClose,
  onStartForm,
}) => {
  const { language, t } = useLanguage();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const steps = scheme.stepsToApply || [];
  const totalSteps = steps.length;
  const currentStep = steps[currentStepIndex];

  useEffect(() => {
    if (isOpen && currentStep) {
      const inst = currentStep.instruction[language] || currentStep.instruction.ta;
      const det = currentStep.details[language] || currentStep.details.ta;
      SpeechService.speak(`படி ${currentStepIndex + 1}: ${inst}. ${det}`, language);
    }
  }, [isOpen, currentStepIndex, language]);

  if (!isOpen || !currentStep) return null;

  const instText = currentStep.instruction[language] || currentStep.instruction.ta;
  const detText = currentStep.details[language] || currentStep.details.ta;
  const whereText = scheme.whereToApply[language] || scheme.whereToApply.ta;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-warm-50 dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-warm-200 dark:border-slate-800 animate-slide-up flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-warm-200 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  விண்ணப்பிக்கும் வழிகாட்டி
                </h3>
                <p className="text-xs text-slate-500 truncate max-w-[200px]">
                  {scheme.title[language] || scheme.title.ta}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-warm-200 dark:hover:bg-slate-800 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step Counter & Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs font-bold text-jyothi-800 dark:text-jyothi-300 mb-1.5">
              <span>{t('stepOf').replace('{current}', String(currentStepIndex + 1)).replace('{total}', String(totalSteps))}</span>
              <span>{Math.round(((currentStepIndex + 1) / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-warm-200 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Step Content */}
          <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-5 border border-warm-200 dark:border-slate-700 shadow-sm my-3">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/70 text-indigo-800 dark:text-indigo-300 text-xs font-extrabold">
                படி {currentStepIndex + 1}
              </span>
              <AudioButton textToRead={`${instText}. ${detText}`} size="sm" />
            </div>

            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug mt-2">
              {instText}
            </h4>

            <p className="text-sm text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed bg-warm-50 dark:bg-slate-900/60 p-3 rounded-xl border border-warm-100 dark:border-slate-800">
              {detText}
            </p>
          </div>

          {/* Required Documents Checklist for this scheme */}
          {scheme.requiredDocuments && scheme.requiredDocuments.length > 0 && (
            <div className="my-4">
              <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
                📋 தேவையான ஆவணங்கள் (Documents):
              </h5>
              <div className="space-y-2">
                {scheme.requiredDocuments.map((doc) => {
                  const docName = doc.name[language] || doc.name.ta;
                  const why = doc.whyNeeded[language] || doc.whyNeeded.ta;
                  const how = doc.howToGet[language] || doc.howToGet.ta;
                  return (
                    <div
                      key={doc.id}
                      className="p-3 rounded-xl bg-white dark:bg-slate-800/60 border border-warm-200 dark:border-slate-700 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{docName}</span>
                        <AudioButton textToRead={`${docName}. எதற்காக: ${why}. எங்கு பெறலாம்: ${how}`} size="sm" variant="subtle" />
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 mt-1">
                        <span className="font-semibold text-jyothi-700 dark:text-jyothi-400">எங்கு பெறலாம்: </span>
                        {how}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Where to apply box */}
          <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/40 text-xs text-indigo-950 dark:text-indigo-200 mb-4 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">எங்கு விண்ணப்பிக்க வேண்டும்:</span>
              <span>{whereText}</span>
            </div>
          </div>
        </div>

        {/* Step Navigation Buttons */}
        <div className="pt-3 border-t border-warm-200 dark:border-slate-800 flex items-center gap-2">
          {currentStepIndex > 0 ? (
            <button
              type="button"
              onClick={() => setCurrentStepIndex(currentStepIndex - 1)}
              className="py-3 px-4 rounded-xl border border-warm-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t('back')}</span>
            </button>
          ) : null}

          {currentStepIndex + 1 < totalSteps ? (
            <button
              type="button"
              onClick={() => setCurrentStepIndex(currentStepIndex + 1)}
              className="flex-1 py-3.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-md transition active:scale-95"
            >
              <span>{t('next')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onStartForm}
              className="flex-1 py-3.5 px-4 rounded-xl bg-jyothi-700 hover:bg-jyothi-800 text-white font-bold text-sm flex items-center justify-center gap-1.5 shadow-xl transition active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>விண்ணப்பத்தில் உதவவும் / Assist Application</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
