'use client';

import React, { useState, useEffect } from 'react';
import { Scheme } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { X, Check, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, Volume2, ShieldCheck } from 'lucide-react';
import { AudioButton } from '../common/AudioButton';
import { SpeechService } from '@/lib/speech';

interface EligibilityCheckerModalProps {
  isOpen: boolean;
  scheme: Scheme;
  onClose: () => void;
  onProceedToApply?: () => void;
}

export const EligibilityCheckerModal: React.FC<EligibilityCheckerModalProps> = ({
  isOpen,
  scheme,
  onClose,
  onProceedToApply,
}) => {
  const { language, t } = useLanguage();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [isEligible, setIsEligible] = useState(false);

  const questions = scheme.eligibilityQuestions || [];
  const currentQuestion = questions[currentIndex];
  const totalSteps = questions.length;

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setAnswers({});
      setIsCompleted(false);
      // Read the first question aloud
      if (questions[0]) {
        const qText = questions[0].question[language] || questions[0].question.ta;
        SpeechService.speak(`படி 1: ${qText}`, language);
      }
    }
  }, [isOpen, scheme, language]);

  if (!isOpen) return null;

  const handleAnswer = (val: boolean) => {
    const updated = { ...answers, [currentQuestion.id]: val };
    setAnswers(updated);

    if (currentIndex + 1 < totalSteps) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      const nextQText = questions[nextIdx].question[language] || questions[nextIdx].question.ta;
      SpeechService.speak(`படி ${nextIdx + 1}: ${nextQText}`, language);
    } else {
      // Evaluate results
      evaluateEligibility(updated);
    }
  };

  const evaluateEligibility = (finalAnswers: Record<string, boolean>) => {
    let eligible = true;
    for (const q of questions) {
      if (finalAnswers[q.id] !== true) {
        eligible = false;
        break;
      }
    }
    setIsEligible(eligible);
    setIsCompleted(true);

    const resultSpeech = eligible
      ? 'வாழ்த்துகள்! நீங்கள் இந்த திட்டத்திற்கு முதற்கட்டமாக தகுதி பெற்றுள்ளீர்கள்.'
      : 'தற்போதைய விதிகளின்படி நீங்கள் சில நிபந்தனைகளை சரிபார்க்க வேண்டியிருக்கலாம்.';
    SpeechService.speak(resultSpeech, language);
  };

  const schemeTitle = scheme.title[language] || scheme.title.ta;
  const questionText = currentQuestion?.question[language] || currentQuestion?.question.ta;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-warm-50 dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-warm-200 dark:border-slate-800 animate-slide-up flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-warm-200 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-jyothi-100 dark:bg-jyothi-950/60 text-jyothi-700 dark:text-jyothi-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  தகுதி சரிபார்ப்பு / Eligibility
                </h3>
                <p className="text-xs text-slate-500 truncate max-w-[220px]">{schemeTitle}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-warm-200 dark:hover:bg-slate-800 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Preliminary Disclaimer - Mandatory Requirement #10 */}
          <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200 mb-4 flex items-start gap-2 leading-relaxed">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{t('preliminaryNotice')}</span>
          </div>

          {!isCompleted ? (
            <div>
              {/* Progress Indicator: Step X of Y */}
              <div className="mb-4">
                <div className="flex justify-between text-xs font-bold text-jyothi-800 dark:text-jyothi-300 mb-1.5">
                  <span>{t('stepOf').replace('{current}', String(currentIndex + 1)).replace('{total}', String(totalSteps))}</span>
                  <span>{Math.round(((currentIndex + 1) / totalSteps) * 100)}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-warm-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-jyothi-600 rounded-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }}
                  />
                </div>
              </div>

              {/* 1 Question at a time */}
              <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-warm-200 dark:border-slate-700 shadow-sm my-4 text-center">
                <div className="flex justify-center mb-3">
                  <AudioButton textToRead={questionText} size="md" variant="subtle" />
                </div>
                <h4 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-slate-100 leading-snug">
                  {questionText}
                </h4>
              </div>

              {/* Big Yes / No Choice Buttons */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => handleAnswer(true)}
                  className="py-4 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-lg flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
                >
                  <Check className="w-6 h-6 stroke-[3]" />
                  <span>ஆம் / Yes</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleAnswer(false)}
                  className="py-4 px-5 rounded-2xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 text-slate-800 dark:text-slate-200 font-extrabold text-lg flex items-center justify-center gap-2 shadow transition active:scale-95"
                >
                  <X className="w-6 h-6 stroke-[3]" />
                  <span>இல்லை / No</span>
                </button>
              </div>

              {/* Back navigation */}
              {currentIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setCurrentIndex(currentIndex - 1)}
                  className="mt-4 text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 mx-auto"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t('back')}</span>
                </button>
              )}
            </div>
          ) : (
            /* Result Screen */
            <div className="text-center py-4 animate-fade-in">
              {isEligible ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-xl font-extrabold text-emerald-800 dark:text-emerald-300">
                    {t('eligibleSuccess')}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    அடுத்த கட்டமாக தேவையான ஆவணங்களை சரிபார்த்து எளிதாக விண்ணப்பிக்கலாம்.
                  </p>
                  <button
                    type="button"
                    onClick={onProceedToApply}
                    className="w-full py-4 px-5 rounded-2xl bg-jyothi-700 hover:bg-jyothi-800 text-white font-extrabold text-base flex items-center justify-center gap-2 shadow-xl transition active:scale-95"
                  >
                    <span>{t('applyNow')}</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
                    <AlertCircle className="w-10 h-10" />
                  </div>
                  <h4 className="text-lg font-bold text-amber-800 dark:text-amber-300">
                    {t('notEligible')}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    அருகிலுள்ள அரசு இ-சேவை மையம் அல்லது கிராம சேவை மையத்தில் கூடுதல் ஆலோசனையைப் பெறலாம்.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentIndex(0);
                      setIsCompleted(false);
                    }}
                    className="w-full py-3.5 px-4 rounded-2xl bg-warm-200 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-bold text-sm"
                  >
                    மீண்டும் சரிபார்க்கவும் / Check Again
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
