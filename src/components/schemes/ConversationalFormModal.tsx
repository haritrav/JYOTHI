'use client';

import React, { useState, useEffect } from 'react';
import { Scheme } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from '@/contexts/LocationContext';
import { X, Mic, Send, CheckCircle2, ArrowRight, ArrowLeft, ShieldCheck, AlertCircle, Sparkles } from 'lucide-react';
import { AudioButton } from '../common/AudioButton';
import { createSpeechRecognizer, SpeechService } from '@/lib/speech';

interface ConversationalFormModalProps {
  isOpen: boolean;
  scheme: Scheme;
  onClose: () => void;
  onSuccessSubmission: (appId: string) => void;
}

export const ConversationalFormModal: React.FC<ConversationalFormModalProps> = ({
  isOpen,
  scheme,
  onClose,
  onSuccessSubmission,
}) => {
  const { language, t } = useLanguage();
  const { location } = useLocation();

  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({
    applicantName: '',
    applicantAge: '',
    applicantPhone: '',
    village: location.village || 'Vadipatti',
    district: location.district || 'Madurai',
    bankAccountReady: 'ஆம் / Yes',
  });

  const [currentInput, setCurrentInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isReviewStep, setIsReviewStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedConsent, setConfirmedConsent] = useState(false);

  const formQuestions = [
    {
      key: 'applicantName',
      title: {
        ta: 'உங்கள் முழுப் பெயர் என்ன?',
        hi: 'आपका पूरा नाम क्या है?',
        te: 'మీ పూర్తి పేరు ఏమిటి?',
        ml: 'നിങ്ങളുടെ പൂർണ്ണ പേര് എന്താണ്?',
      },
      placeholder: 'எ.கா: முத்துலட்சுமி',
    },
    {
      key: 'applicantAge',
      title: {
        ta: 'உங்கள் வயது என்ன?',
        hi: 'आपकी आयु (उम्र) क्या है?',
        te: 'మీ వయస్సు ఎంత?',
        ml: 'നിങ്ങളുടെ പ്രായം എത്രയാണ്?',
      },
      placeholder: 'எ.கா: 26',
    },
    {
      key: 'applicantPhone',
      title: {
        ta: 'தொடர்பு கொள்ள வேண்டிய மொபைல் எண் என்ன?',
        hi: 'सत्यापन के लिए आपका मोबाइल नंबर क्या है?',
        te: 'మీ మొబైల్ నంబర్ ఏమిటి?',
        ml: 'നിങ്ങളുടെ മൊബൈൽ നമ്പർ നൽകുക?',
      },
      placeholder: 'எ.கா: 9842100000',
    },
  ];

  const currentQ = formQuestions[stepIndex];
  const totalFormSteps = formQuestions.length;

  useEffect(() => {
    if (isOpen && currentQ && !isReviewStep) {
      const qText = currentQ.title[language] || currentQ.title.ta;
      SpeechService.speak(qText, language);
    }
  }, [isOpen, stepIndex, isReviewStep, language]);

  if (!isOpen) return null;

  const handleStartVoice = () => {
    setIsListening(true);
    const recognizer = createSpeechRecognizer({
      lang: language,
      onResult: (text, isFinal) => {
        setCurrentInput(text);
        if (isFinal) {
          handleNextField(text);
        }
      },
      onError: () => setIsListening(false),
      onEnd: () => setIsListening(false),
    });
    recognizer?.start();
  };

  const handleNextField = (val: string) => {
    if (!val.trim()) return;
    const key = currentQ.key;
    const updated = { ...formData, [key]: val.trim() };
    setFormData(updated);
    setCurrentInput('');
    setIsListening(false);

    if (stepIndex + 1 < totalFormSteps) {
      setStepIndex(stepIndex + 1);
    } else {
      setIsReviewStep(true);
      SpeechService.speak(
        'விவரங்கள் பதிவு செய்யப்பட்டன. தயவுசெய்து உங்கள் விவரங்களை சரிபார்த்து சமர்ப்பிக்கவும்.',
        language
      );
    }
  };

  const handleFinalSubmit = async () => {
    if (!confirmedConsent) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schemeId: scheme.id,
          schemeName: scheme.title[language] || scheme.title.ta,
          applicantName: formData.applicantName,
          applicantPhone: formData.applicantPhone,
          village: formData.village,
          district: formData.district,
        }),
      });

      const data = await res.json();
      if (data.applicationId) {
        onSuccessSubmission(data.applicationId);
        onClose();
      }
    } catch (e) {
      console.error('Submission failed', e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-warm-50 dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-warm-200 dark:border-slate-800 animate-slide-up flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        <div>
          {/* Top Header */}
          <div className="flex items-center justify-between pb-3 border-b border-warm-200 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-jyothi-100 dark:bg-jyothi-950/60 text-jyothi-700 dark:text-jyothi-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  விண்ணப்ப உதவி (Form Guide)
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

          {!isReviewStep ? (
            /* Conversational Step-by-Step Question */
            <div>
              <div className="mb-4">
                <span className="text-xs font-bold text-jyothi-700 dark:text-jyothi-400">
                  கேள்வி {stepIndex + 1} / {totalFormSteps}
                </span>
                <div className="w-full h-2 rounded-full bg-warm-200 dark:bg-slate-800 mt-1">
                  <div
                    className="h-full bg-jyothi-600 rounded-full transition-all"
                    style={{ width: `${((stepIndex + 1) / totalFormSteps) * 100}%` }}
                  />
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-warm-200 dark:border-slate-700 shadow-sm text-center my-4">
                <AudioButton
                  textToRead={currentQ.title[language] || currentQ.title.ta}
                  size="md"
                  variant="subtle"
                  className="mb-2 mx-auto"
                />
                <h4 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
                  {currentQ.title[language] || currentQ.title.ta}
                </h4>
              </div>

              {/* Speech & Text Input */}
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentInput}
                    onChange={(e) => setCurrentInput(e.target.value)}
                    placeholder={currentQ.placeholder}
                    className="flex-1 p-3.5 rounded-xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium text-base focus:ring-2 focus:ring-jyothi-500"
                  />
                  <button
                    type="button"
                    onClick={handleStartVoice}
                    className={`p-3.5 rounded-xl flex items-center justify-center text-white ${
                      isListening ? 'bg-red-600 animate-pulse' : 'bg-jyothi-600 hover:bg-jyothi-700'
                    }`}
                    title="குரல் மூலம் பேச / Speak answer"
                  >
                    <Mic className="w-5 h-5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleNextField(currentInput)}
                  disabled={!currentInput.trim()}
                  className="w-full py-3.5 px-4 rounded-xl bg-jyothi-700 hover:bg-jyothi-800 disabled:opacity-40 text-white font-bold text-base flex items-center justify-center gap-2 shadow-md transition active:scale-95"
                >
                  <span>{t('next')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* MANDATORY REVIEW SCREEN — Requirement #13 */
            <div className="space-y-4 animate-fade-in">
              <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 text-xs text-amber-950 dark:text-amber-200 flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">{t('reviewTitle')}</span>
                  <span>{t('reviewNotice')}</span>
                </div>
              </div>

              {/* Review Summary Table */}
              <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-4 border border-warm-200 dark:border-slate-700 space-y-2.5 text-sm">
                <div className="flex justify-between border-b border-warm-100 dark:border-slate-700/60 pb-1.5">
                  <span className="text-slate-500">திட்டம்:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[200px]">
                    {scheme.title[language] || scheme.title.ta}
                  </span>
                </div>
                <div className="flex justify-between border-b border-warm-100 dark:border-slate-700/60 pb-1.5">
                  <span className="text-slate-500">பெயர்:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formData.applicantName}</span>
                </div>
                <div className="flex justify-between border-b border-warm-100 dark:border-slate-700/60 pb-1.5">
                  <span className="text-slate-500">வயது:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formData.applicantAge}</span>
                </div>
                <div className="flex justify-between border-b border-warm-100 dark:border-slate-700/60 pb-1.5">
                  <span className="text-slate-500">மொபைல்:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formData.applicantPhone}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">கிராமம் & மாவட்டம்:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{formData.village}, {formData.district}</span>
                </div>
              </div>

              {/* Explicit User Consent Checkbox */}
              <label className="flex items-start gap-3 p-3 rounded-xl bg-warm-100 dark:bg-slate-800/60 border border-warm-300 dark:border-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={confirmedConsent}
                  onChange={(e) => setConfirmedConsent(e.target.checked)}
                  className="w-5 h-5 rounded text-jyothi-600 focus:ring-jyothi-500 mt-0.5 shrink-0"
                />
                <span className="text-xs text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
                  மேற்கண்ட விவரங்கள் சரியானவை என உறுதிசெய்கிறேன். என் ஒப்புதலுடன் இத்தகவலைப் பதிவு செய்ய விரும்புகிறேன்.
                </span>
              </label>

              {/* Final Explicit Submit */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsReviewStep(false)}
                  className="py-3 px-4 rounded-xl border border-warm-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold"
                >
                  திருத்துக / Edit
                </button>
                <button
                  type="button"
                  onClick={handleFinalSubmit}
                  disabled={!confirmedConsent || isSubmitting}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>{isSubmitting ? 'பதிவாகிறது...' : t('submit')}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
