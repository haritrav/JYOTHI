'use client';

import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Volume2,
  VolumeX,
  Building2,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import { ApplicationRecord, SupportedLanguage } from '@/types';
import { UI_TRANSLATIONS } from '@/data/translations';
import { speakText, stopSpeech } from '@/utils/speech';

interface MyApplicationsProps {
  applications: ApplicationRecord[];
  language: SupportedLanguage;
  onExploreMore: () => void;
}

export const MyApplications: React.FC<MyApplicationsProps> = ({
  applications,
  language,
  onExploreMore
}) => {
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const t = UI_TRANSLATIONS[language];
  const activeApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const handleSpeakStatus = () => {
    if (!activeApp) return;

    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `உங்கள் விண்ணப்பம்: ${activeApp.schemeTitle}. விண்ணப்ப எண்: ${activeApp.trackingNumber}. தற்போதைய நிலை: கள ஆய்வு மற்றும் குடும்ப அட்டை சரிபார்ப்பு நடைபெற்று வருகிறது. அடுத்த கட்டமாக கள அலுவலர் சரிபார்த்தவுடன் உங்கள் கணக்கில் தொகை வரவு வைக்கப்படும்.`;
    setIsSpeaking(true);
    speakText(
      textToRead,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  if (!activeApp) {
    return (
      <div className="text-center py-12 space-y-4 p-4">
        <div className="w-16 h-16 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center mx-auto">
          <FileText className="w-8 h-8" />
        </div>
        <h3 className="font-extrabold text-base text-slate-800">
          விண்ணப்பங்கள் எதுவும் இல்லை (No Applications Yet)
        </h3>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">
          நீங்கள் அரசு நலத்திட்டங்களை ஆய்வு செய்து எளிய வழிகாட்டல் மூலம் பதிவு செய்யலாம்.
        </p>
        <button
          onClick={onExploreMore}
          className="px-6 py-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md"
        >
          திட்டங்களைக் காண்க (Explore Schemes)
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900">
            {t.cardApplications}
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            உங்கள் பதிவுகளின் நிலை மற்றும் அடுத்த கட்ட விவரங்கள்
          </p>
        </div>

        <button
          onClick={handleSpeakStatus}
          className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm active:scale-95 transition-all ${
            isSpeaking ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
          }`}
        >
          {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          <span>{isSpeaking ? t.stopAudio : 'விளக்கம் கேள்'}</span>
        </button>
      </div>

      {/* Multiple Applications Switcher if more than 1 */}
      {applications.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {applications.map((app) => (
            <button
              key={app.id}
              onClick={() => {
                stopSpeech();
                setIsSpeaking(false);
                setSelectedAppId(app.id);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 border transition-all ${
                selectedAppId === app.id
                  ? 'bg-purple-900 text-white border-purple-950 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200'
              }`}
            >
              {app.trackingNumber}
            </button>
          ))}
        </div>
      )}

      {/* Main Application Details Card */}
      <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-md space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-widest text-purple-700 bg-purple-100 px-2.5 py-0.5 rounded-full">
              TRACKING NUMBER
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1">
              {activeApp.trackingNumber}
            </h3>
            <p className="text-xs font-bold text-slate-600">
              {activeApp.schemeTitle}
            </p>
          </div>

          <div className="text-right text-[11px] text-slate-400">
            <div>பதிவு தேதி:</div>
            <div className="font-bold text-slate-700">{activeApp.submissionDate}</div>
          </div>
        </div>

        {/* Applicant details */}
        <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
          <div>
            <span className="text-slate-400 text-[10px] block">விண்ணப்பதாரர்:</span>
            <span className="font-bold text-slate-800">{activeApp.applicantName}</span>
          </div>
          <div>
            <span className="text-slate-400 text-[10px] block">பகுதி / ஊர்:</span>
            <span className="font-bold text-slate-800">{activeApp.village}, {activeApp.district}</span>
          </div>
        </div>

        {/* Visual Timeline Tracking */}
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
            செயல்முறை காலவரிசை (Process Timeline):
          </h4>

          <div className="space-y-3 relative pl-6 border-l-2 border-purple-200 ml-3">
            {activeApp.statusSteps.map((st, sIdx) => (
              <div key={sIdx} className="relative">
                {/* Dot */}
                <div className={`absolute -left-[31px] top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  st.done
                    ? 'bg-emerald-500 border-white text-white shadow-xs'
                    : 'bg-white border-slate-300 text-slate-300'
                }`}>
                  {st.done && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>

                <div>
                  <p className={`text-xs font-bold ${st.done ? 'text-slate-900' : 'text-slate-400'}`}>
                    {st.label[language]}
                  </p>
                  {st.date && (
                    <span className="text-[10px] text-emerald-700 font-semibold">
                      ✓ நிறைவு: {st.date}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* "What happens next?" Callout */}
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 border border-purple-100 space-y-1.5 text-xs">
          <div className="flex items-center gap-1.5 font-extrabold text-purple-900">
            <HelpCircle className="w-4 h-4 text-purple-700" />
            <span>அடுத்து என்ன நடக்கும்? (What happens next?)</span>
          </div>
          <p className="text-slate-600 leading-relaxed">
            உங்கள் கிராம நிர்வாக அலுவலர் அல்லது பஞ்சாயத்து ஊழியர் உங்கள் குடும்ப அட்டை விவரங்களை சரிபார்ப்பார். ஒப்புதல் கிடைத்ததும் உங்கள் வங்கிக் கணக்கில் உதவித் தொகை நேரடியாக விடுவிக்கப்படும்.
          </p>
        </div>
      </div>
    </div>
  );
};
