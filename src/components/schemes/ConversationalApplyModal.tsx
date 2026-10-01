'use client';

import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  CheckCircle2,
  Edit3,
  ArrowRight,
  ShieldAlert,
  X,
  FileCheck2
} from 'lucide-react';
import { Scheme, SupportedLanguage, ApplicationRecord } from '@/types';
import { UI_TRANSLATIONS } from '@/data/translations';
import { speakText, stopSpeech, playAudioChime } from '@/utils/speech';
import confetti from 'canvas-confetti';

interface ConversationalApplyModalProps {
  scheme: Scheme;
  language: SupportedLanguage;
  userVillage: string;
  userDistrict: string;
  userState: string;
  onClose: () => void;
  onApplicationCreated: (app: ApplicationRecord) => void;
}

export const ConversationalApplyModal: React.FC<ConversationalApplyModalProps> = ({
  scheme,
  language,
  userVillage,
  userDistrict,
  userState,
  onClose,
  onApplicationCreated
}) => {
  const t = UI_TRANSLATIONS[language];

  const [step, setStep] = useState<'form' | 'review' | 'success'>('form');
  const [name, setName] = useState('');
  const [age, setAge] = useState('32');
  const [village, setVillage] = useState(userVillage || 'Zamin Uthukuli');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [createdApp, setCreatedApp] = useState<ApplicationRecord | null>(null);

  const handleSpeakReview = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${t.applyReviewTitle}. பெயர்: ${name || 'பெயர்'}. வயது: ${age}. ஊர்: ${village}. திட்டம்: ${scheme.title[language]}`;
    setIsSpeaking(true);
    speakText(
      textToRead,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const handleConfirmApplication = () => {
    stopSpeech();
    playAudioChime('success');

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const statePrefix = language === 'ta' ? 'TN' : language === 'hi' ? 'UP' : language === 'te' ? 'TG' : 'KL';
    const trackingNo = `JYO-${statePrefix}-2026-${randomSuffix}`;

    const newApp: ApplicationRecord = {
      id: `app-${Date.now()}`,
      schemeId: scheme.id,
      schemeTitle: scheme.title[language],
      applicantName: name || (language === 'ta' ? 'அ. மீனாட்சி' : language === 'hi' ? 'आरती देवी' : language === 'te' ? 'కె. లక్ష్మి' : 'മേരി കുര്യൻ'),
      applicantAge: age || '32',
      village: village || userVillage || 'கிராமம்',
      block: 'வட்டம்',
      district: userDistrict || 'மாவட்டம்',
      state: userState || 'மாநிலம்',
      submissionDate: '01-Oct-2026',
      status: 'submitted',
      trackingNumber: trackingNo,
      statusSteps: [
        {
          label: {
            ta: 'விண்ணப்ப குறிப்பு பதிவு செய்யப்பட்டது',
            hi: 'आवेदन प्रारूप दर्ज हुआ',
            te: 'దరఖాస్తు నమోదు చేయబడింది',
            ml: 'അപേക്ഷ രേഖപ്പെടുത്തി'
          },
          done: true,
          date: '01-Oct-2026'
        },
        {
          label: {
            ta: 'ஆவணங்கள் சரிபார்ப்பு',
            hi: 'दस्तावेज़ सत्यापन',
            te: 'పత్రాల పరిశీలన',
            ml: 'രേഖകൾ പരിശോധന'
          },
          done: false
        },
        {
          label: {
            ta: 'கள ஆய்வு',
            hi: 'स्थलीय निरीक्षण',
            te: 'ఫీల్డ్ వెరిఫికేషన్',
            ml: 'ഫീൽഡ് പരിശോധന'
          },
          done: false
        },
        {
          label: {
            ta: 'இறுதி ஒப்புதல் & பலன் வரவு',
            hi: 'स्वीकृति व राशि हस्तांतरण',
            te: 'తుది ఆమోదం',
            ml: 'അന്തിമ അനുമതി'
          },
          done: false
        }
      ]
    };

    setCreatedApp(newApp);
    setStep('success');
    onApplicationCreated(newApp);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-full bg-amber-400 text-slate-950">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">
                {t.applyModalTitle}
              </h3>
              <p className="text-[11px] text-amber-200 truncate max-w-[240px]">
                {scheme.title[language]}
              </p>
            </div>
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

        {/* Dynamic Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          
          {step === 'form' && (
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 text-xs text-purple-900 font-medium">
                💡 நீங்கள் சொல்லும் தகவல்கள் படிவத்தில் நிரப்பப்பட்டு பின்னர் உங்கள் ஒப்புதலுடன் சேமிக்கப்படும்.
              </div>

              {/* Name Prompt */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  1. {t.applyNamePrompt}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="உதாரணம்: க. லதா (Latha)"
                  className="w-full text-sm font-bold p-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              {/* Age Prompt */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  2. {t.applyAgePrompt}
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="வயது (Age)"
                  className="w-full text-sm font-bold p-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              {/* Village Prompt */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700 block">
                  3. {t.applyVillagePrompt}
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="கிராமம் / ஊர் பெயர்"
                  className="w-full text-sm font-bold p-3.5 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-600 outline-none"
                />
              </div>

              <button
                onClick={() => setStep('review')}
                className="w-full mt-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95"
              >
                <span>விவரங்களை சரிபார்க்க (Review Details)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 'review' && (
            <div className="space-y-4 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-slate-900">
                  {t.applyReviewTitle}
                </h2>
                <button
                  onClick={handleSpeakReview}
                  className={`p-2 rounded-full text-xs font-bold flex items-center gap-1 ${
                    isSpeaking ? 'bg-rose-600 text-white' : 'bg-amber-400 text-slate-950'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{isSpeaking ? t.stopAudio : 'கேளுங்கள்'}</span>
                </button>
              </div>

              {/* Review Card */}
              <div className="bg-gradient-to-br from-slate-50 to-purple-50/40 p-4 rounded-3xl border border-purple-200 space-y-3 text-xs">
                <div className="flex justify-between py-1.5 border-b border-purple-100">
                  <span className="text-slate-500 font-bold">விண்ணப்பிக்கும் திட்டம்:</span>
                  <span className="font-extrabold text-purple-900 text-right max-w-[180px]">{scheme.title[language]}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-purple-100">
                  <span className="text-slate-500 font-bold">விண்ணப்பதாரர் பெயர்:</span>
                  <span className="font-extrabold text-slate-900">{name || 'பெயர் குறிப்பிடப்படவில்லை'}</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-purple-100">
                  <span className="text-slate-500 font-bold">வயது:</span>
                  <span className="font-extrabold text-slate-900">{age} ஆண்டுகள்</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-purple-100">
                  <span className="text-slate-500 font-bold">கிராமம் & பகுதி:</span>
                  <span className="font-extrabold text-slate-900">{village}</span>
                </div>
              </div>

              {/* Safe submission disclaimer */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 text-xs text-amber-900">
                <p className="font-bold flex items-center gap-1.5 text-amber-950">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>பாதுகாப்பு & வெளிப்படைத்தன்மை:</span>
                </p>
                <p className="text-[11px] text-amber-800 mt-1 leading-normal">
                  {t.neverAutoSubmitNotice}
                </p>
              </div>

              {/* Two explicit confirmation buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleConfirmApplication}
                  className="w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm shadow-lg flex items-center justify-center gap-2 active:scale-95"
                >
                  <CheckCircle2 className="w-5 h-5 font-black" />
                  <span>{t.applyEverythingCorrect}</span>
                </button>

                <button
                  onClick={() => setStep('form')}
                  className="w-full py-3 px-6 rounded-2xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{t.applyChangeSomething}</span>
                </button>
              </div>
            </div>
          )}

          {step === 'success' && createdApp && (
            <div className="text-center space-y-4 py-4 animate-in zoom-in-95 duration-200">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-700 border-4 border-emerald-400 mx-auto flex items-center justify-center shadow-lg">
                <CheckCircle2 className="w-12 h-12" />
              </div>

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-3 py-1 rounded-full uppercase">
                  APPLICATION DRAFT CREATED
                </span>
                <h2 className="text-xl font-black text-slate-900 pt-2">
                  {t.applySuccessMessage}
                </h2>
                <p className="text-xs text-slate-600">
                  {t.applyTrackNote}
                </p>
              </div>

              <div className="bg-purple-950 text-white p-4 rounded-2xl space-y-1 shadow-md">
                <span className="text-[10px] text-purple-300 uppercase tracking-widest block font-bold">
                  விண்ணப்ப கண்காணிப்பு எண் (Tracking ID)
                </span>
                <span className="text-xl font-black text-amber-300 tracking-wider">
                  {createdApp.trackingNumber}
                </span>
              </div>

              <button
                onClick={onClose}
                className="w-full py-3.5 px-6 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-extrabold text-sm shadow-md active:scale-95"
              >
                முகப்பிற்குச் செல் (Done)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
