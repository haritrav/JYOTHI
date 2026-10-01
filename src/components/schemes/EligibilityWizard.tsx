'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, X, ShieldAlert } from 'lucide-react';
import { Scheme, SupportedLanguage } from '@/types';
import { UI_TRANSLATIONS } from '@/data/translations';
import { speakText, stopSpeech, playAudioChime } from '@/utils/speech';
import confetti from 'canvas-confetti';

interface EligibilityWizardProps {
  scheme: Scheme;
  language: SupportedLanguage;
  onClose: () => void;
  onProceedToApply: () => void;
}

export const EligibilityWizard: React.FC<EligibilityWizardProps> = ({
  scheme,
  language,
  onClose,
  onProceedToApply
}) => {
  const t = UI_TRANSLATIONS[language];

  const questions = [
    {
      id: 'gender',
      text: t.questionGender,
      options: [
        { label: t.answerYes, isPositive: true },
        { label: t.answerNo, isPositive: false }
      ]
    },
    {
      id: 'age',
      text: t.questionAge,
      options: [
        { label: '21 – 59 வயது (Adult)', isPositive: true },
        { label: '18 – 20 வயது (Young Adult)', isPositive: true },
        { label: '60+ வயது (Senior)', isPositive: true }
      ]
    },
    {
      id: 'income',
      text: t.questionIncome,
      options: [
        { label: t.answerYes, isPositive: true },
        { label: t.answerNo, isPositive: false }
      ]
    },
    {
      id: 'land',
      text: t.questionLand,
      options: [
        { label: t.answerNo, isPositive: true }, // Not owning >5 acres is positive for scheme eligibility
        { label: t.answerYes, isPositive: false }
      ]
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const currentQ = questions[currentIndex];

  const handleSpeakQuestion = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${t.questionGender ? `கேள்வி ${currentIndex + 1}: ` : ''}${currentQ.text}`;
    setIsSpeaking(true);
    speakText(
      textToRead,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const handleSelectOption = (isPositive: boolean) => {
    stopSpeech();
    setIsSpeaking(false);
    playAudioChime('pop');

    const updatedAnswers = { ...answers, [currentQ.id]: isPositive };
    setAnswers(updatedAnswers);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsCompleted(true);
      const isLikelyEligible = Object.values(updatedAnswers).filter(v => v).length >= 3;
      if (isLikelyEligible) {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch {}
        playAudioChime('success');
      }
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setAnswers({});
    setIsCompleted(false);
    stopSpeech();
  };

  const isLikelyEligible = Object.values(answers).filter(v => v).length >= 3;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">
              {t.eligibilityTitle}
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

        {/* Content */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {!isCompleted ? (
            <>
              {/* Question Progress */}
              <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                <span>{t.stepTitle} {currentIndex + 1} of {questions.length}</span>
                <span className="text-purple-700 font-extrabold">{scheme.category.toUpperCase()}</span>
              </div>

              <div className="flex gap-1.5">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded-full ${
                      i <= currentIndex ? 'bg-purple-700' : 'bg-slate-200'
                    }`}
                  />
                ))}
              </div>

              {/* Question Box */}
              <div className="bg-purple-50 rounded-3xl p-5 border border-purple-100 space-y-3 text-center">
                <p className="text-xs font-bold text-purple-700 uppercase tracking-wider">
                  கேள்வி {currentIndex + 1}
                </p>
                <h2 className="text-xl font-black text-slate-900 leading-snug">
                  {currentQ.text}
                </h2>

                <button
                  onClick={handleSpeakQuestion}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-bold shadow-xs active:scale-95"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>கேள்வியை வாசித்துக் காட்டு</span>
                </button>
              </div>

              {/* Option Choice Buttons */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((opt, oIdx) => (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(opt.isPositive)}
                    className="w-full py-4 px-5 rounded-2xl bg-white hover:bg-purple-50 text-slate-800 font-extrabold text-base border-2 border-purple-200 hover:border-purple-600 shadow-sm transition-all active:scale-95 flex items-center justify-between"
                  >
                    <span>{opt.label}</span>
                    <ArrowRight className="w-5 h-5 text-purple-700" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            /* Result Screen */
            <div className="space-y-4 py-2 text-center animate-in zoom-in-95 duration-200">
              <div className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center shadow-lg ${
                isLikelyEligible
                  ? 'bg-emerald-100 text-emerald-700 border-4 border-emerald-400'
                  : 'bg-amber-100 text-amber-700 border-4 border-amber-400'
              }`}>
                {isLikelyEligible ? (
                  <CheckCircle2 className="w-12 h-12" />
                ) : (
                  <AlertCircle className="w-12 h-12" />
                )}
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 bg-slate-100 px-3 py-1 rounded-full">
                  PRELIMINARY ELIGIBILITY CHECK
                </span>
                <h2 className="text-xl font-black text-slate-900 pt-2">
                  {isLikelyEligible ? 'அடிப்படை தகுதி உள்ளது!' : 'கூடுதல் ஆலோசனைகள்'}
                </h2>
                <p className="text-sm font-medium text-slate-600 px-2 leading-relaxed">
                  {isLikelyEligible ? t.checkResultEligible : t.checkResultNotEligible}
                </p>
              </div>

              {/* Official Non-Binding Disclaimer Notice */}
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 text-xs text-amber-950 text-left space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>முக்கிய அரசு அறிவிப்பு (Notice):</span>
                </div>
                <p className="text-amber-800 leading-normal">
                  {t.preliminaryNotice}
                </p>
              </div>

              {/* Next Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={onProceedToApply}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-black text-base shadow-xl flex items-center justify-center gap-2 active:scale-95"
                >
                  <span>{t.schemeApplyNow}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>

                <button
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 w-full py-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{t.tryAgain}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
