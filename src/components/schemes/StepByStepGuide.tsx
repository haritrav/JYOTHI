'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, ArrowRight, ArrowLeft, CheckCircle, ShieldCheck, X } from 'lucide-react';
import { Scheme, SupportedLanguage } from '@/types';
import { UI_TRANSLATIONS } from '@/data/translations';
import { speakText, stopSpeech, playAudioChime } from '@/utils/speech';

interface StepByStepGuideProps {
  scheme: Scheme;
  language: SupportedLanguage;
  onClose: () => void;
  onApplyDirect: () => void;
}

export const StepByStepGuide: React.FC<StepByStepGuideProps> = ({
  scheme,
  language,
  onClose,
  onApplyDirect
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const t = UI_TRANSLATIONS[language];
  const totalSteps = scheme.applicationSteps.length;
  const currentStep = scheme.applicationSteps[currentStepIndex];

  const handleSpeakCurrentStep = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${t.stepTitle} ${currentStep.stepNumber} ${t.ofTotal} ${totalSteps}: ${currentStep.title[language]}. ${currentStep.instruction[language]}`;
    setIsSpeaking(true);
    speakText(
      textToRead,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const handleNext = () => {
    stopSpeech();
    setIsSpeaking(false);
    playAudioChime('pop');
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onApplyDirect();
    }
  };

  const handlePrev = () => {
    stopSpeech();
    setIsSpeaking(false);
    playAudioChime('pop');
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              {t.schemeStepByStep}
            </span>
            <h3 className="font-extrabold text-base leading-tight truncate max-w-[260px]">
              {scheme.title[language]}
            </h3>
          </div>
          <button
            onClick={() => {
              stopSpeech();
              onClose();
            }}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar with Dots */}
        <div className="px-6 pt-5 pb-2 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-purple-900">
              {t.stepTitle} {currentStepIndex + 1} {t.ofTotal} {totalSteps}
            </span>
            <span className="text-xs font-medium text-slate-500">
              {Math.round(((currentStepIndex + 1) / totalSteps) * 100)}% முடிந்தது
            </span>
          </div>

          <div className="flex items-center gap-2">
            {scheme.applicationSteps.map((_, idx) => (
              <div
                key={idx}
                className={`h-2.5 flex-1 rounded-full transition-all duration-300 ${
                  idx <= currentStepIndex ? 'bg-gradient-to-r from-purple-700 to-indigo-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step Card Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-800 font-extrabold text-2xl flex items-center justify-center mx-auto shadow-inner border border-purple-200">
            {currentStep.stepNumber}
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-xl font-black text-slate-900 leading-snug">
              {currentStep.title[language]}
            </h2>
            <p className="text-sm font-medium text-slate-700 leading-relaxed bg-purple-50/70 p-4 rounded-2xl border border-purple-100 text-left">
              {currentStep.instruction[language]}
            </p>
          </div>

          {/* Audio read button */}
          <button
            onClick={handleSpeakCurrentStep}
            className={`w-full py-3 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm ${
              isSpeaking
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-700" />}
            <span>{isSpeaking ? t.stopAudio : 'இந்த படியை வாசித்துக் காட்டு (Listen Aloud)'}</span>
          </button>

          {/* Helpful tips */}
          <div className="flex items-start gap-2.5 bg-emerald-50 text-emerald-900 p-3 rounded-xl border border-emerald-200 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p>
              எந்தவொரு அரசு ஊழியருக்கும் அல்லது இடைத்தரகருக்கும் கட்டணம் செலுத்த வேண்டிய அவசியமில்லை. இந்த சேவை இலவசம்.
            </p>
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center gap-3">
          {currentStepIndex > 0 && (
            <button
              onClick={handlePrev}
              className="px-4 py-3 rounded-2xl bg-white border border-slate-300 text-slate-700 font-bold text-xs flex items-center gap-1 hover:bg-slate-100 active:scale-95"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{t.stepPrev}</span>
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95"
          >
            <span>{currentStepIndex === totalSteps - 1 ? t.schemeApplyNow : t.stepNext}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
