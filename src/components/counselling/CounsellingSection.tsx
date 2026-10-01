'use client';

import React, { useState } from 'react';
import {
  Heart,
  PhoneCall,
  Video,
  Building2,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Volume2,
  VolumeX,
  Sparkles,
  Lock,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { CounsellingService, CounsellingRequest, SupportedLanguage } from '@/types';
import { VERIFIED_COUNSELLING_SERVICES } from '@/data/verifiedData';
import { UI_TRANSLATIONS } from '@/data/translations';
import { speakText, stopSpeech, playAudioChime } from '@/utils/speech';
import confetti from 'canvas-confetti';

interface CounsellingSectionProps {
  language: SupportedLanguage;
  onRequestSubmitted?: (req: CounsellingRequest) => void;
}

export const CounsellingSection: React.FC<CounsellingSectionProps> = ({
  language,
  onRequestSubmitted
}) => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [ageRange, setAgeRange] = useState('25 – 40');
  const [mode, setMode] = useState<'phone' | 'video' | 'in_person'>('phone');
  const [preferredTime, setPreferredTime] = useState('காலை 10:00 – 12:00 (Morning)');
  const [notes, setNotes] = useState('');
  const [submittedReq, setSubmittedReq] = useState<CounsellingRequest | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const t = UI_TRANSLATIONS[language];

  const handleSpeakTeleManas = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `Tele-MANAS இலவச 24/7 மனநல உதவி எண் 14416 அல்லது 1800-89-14416. உங்கள் தாய்மொழியில் பயிற்சி பெற்ற பெண் ஆலோசகர்கள் 24 மணி நேரமும் இலவச ஆலோசனை வழங்குகிறார்கள். உங்கள் விவரங்கள் முழுமையாக ரகசியமாக வைக்கப்படும்.`;
    setIsSpeaking(true);
    speakText(
      textToRead,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playAudioChime('success');

    const randomId = Math.floor(1000 + Math.random() * 9000);
    const req: CounsellingRequest = {
      id: `CNSL-2026-${randomId}`,
      userName: name || 'சகோதரி (Sister)',
      preferredLanguage: language,
      ageRange,
      preferredMode: mode,
      preferredTime,
      notes,
      status: 'received',
      createdAt: '01-Oct-2026 11:30 AM'
    };

    setSubmittedReq(req);
    if (onRequestSubmitted) onRequestSubmitted(req);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch {}
  };

  return (
    <div className="space-y-4 p-4 pb-28 max-w-md mx-auto">
      {/* Top Banner */}
      <div className="space-y-1">
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <Heart className="w-5 h-5 text-emerald-600" />
          <span>{t.counsellingTitle}</span>
        </h1>
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          {t.counsellingSubtitle}
        </p>
      </div>

      {/* Tele-MANAS Official Card */}
      <div className="bg-gradient-to-br from-emerald-800 via-teal-900 to-slate-950 text-white rounded-3xl p-5 shadow-xl space-y-4 border border-emerald-400/30">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950">
              OFFICIAL 24/7 HELPLINE
            </span>
            <h2 className="text-lg font-black text-white mt-1 leading-snug">
              Tele-MANAS தேசிய மனநல உதவி
            </h2>
            <p className="text-xs text-emerald-200">
              மத்திய சுகாதாரம் மற்றும் குடும்ப நல அமைச்சகம்
            </p>
          </div>

          <button
            onClick={handleSpeakTeleManas}
            className={`p-2.5 rounded-full shadow-xs shrink-0 ${
              isSpeaking ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        <p className="text-xs text-emerald-100 leading-relaxed bg-white/10 p-3 rounded-2xl border border-white/15">
          உங்கள் மனக்கவலை, தூக்கமின்மை, குடும்ப மன அழுத்தம் அல்லது பயம் எதுவாக இருந்தாலும் பெண் ஆலோசகர்களிடம் நேரடியாகப் பேசலாம். இது 100% இலவசம் மற்றும் ரகசியமானது.
        </p>

        {/* Direct Call Button */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            href="tel:14416"
            className="py-3 px-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-md active:scale-95"
          >
            <PhoneCall className="w-4 h-4 text-slate-950" />
            <span>14416 அழைக்க</span>
          </a>

          <a
            href="tel:18008914416"
            className="py-3 px-2 bg-white/15 hover:bg-white/20 text-white font-bold text-[11px] rounded-2xl flex items-center justify-center gap-1 border border-white/20"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
            <span>1800-89-14416</span>
          </a>
        </div>
      </div>

      {/* Free Appointment Registration Section */}
      {!submittedReq ? (
        <div className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-purple-700" />
              <h3 className="font-extrabold text-sm text-slate-900">
                {t.registerFreeCounselling}
              </h3>
            </div>
          </div>

          <p className="text-xs text-slate-500 font-medium">
            உங்கள் வசதியான நேரத்தில் பயிற்சி பெற்ற பெண் உளவியலாளர் உங்களை தொடர்பு கொள்வார்.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            {/* Name */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t.counsellingName}:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="உதாரணம்: மீனாட்சி (அல்லது விருப்பப்பெயர்)"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-purple-600 outline-none"
              />
            </div>

            {/* Age Range */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t.counsellingAge}:
              </label>
              <select
                value={ageRange}
                onChange={(e) => setAgeRange(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              >
                <option value="18 – 24">18 – 24 ஆண்டுகள் (இளம்பெண்)</option>
                <option value="25 – 40">25 – 40 ஆண்டுகள் (நடுத்தர வயது)</option>
                <option value="41 – 60">41 – 60 ஆண்டுகள்</option>
                <option value="60+">60+ ஆண்டுகள் (மூத்த குடிமகள்)</option>
              </select>
            </div>

            {/* Mode: Phone / Video / In-person */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t.counsellingMode}:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMode('phone')}
                  className={`p-2.5 rounded-xl font-bold text-[11px] border flex flex-col items-center gap-1 transition-all ${
                    mode === 'phone'
                      ? 'bg-purple-800 text-white border-purple-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>தொலைபேசி</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('video')}
                  className={`p-2.5 rounded-xl font-bold text-[11px] border flex flex-col items-center gap-1 transition-all ${
                    mode === 'video'
                      ? 'bg-purple-800 text-white border-purple-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>காணொளி</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode('in_person')}
                  className={`p-2.5 rounded-xl font-bold text-[11px] border flex flex-col items-center gap-1 transition-all ${
                    mode === 'in_person'
                      ? 'bg-purple-800 text-white border-purple-900 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>நேரில்</span>
                </button>
              </div>
            </div>

            {/* Convenient Time */}
            <div>
              <label className="font-bold text-slate-700 block mb-1">
                {t.counsellingTime}:
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
              >
                <option value="காலை 10:00 – 12:00">காலை 10:00 – 12:00 மணி</option>
                <option value="மதியம் 02:00 – 04:00">மதியம் 02:00 – 04:00 மணி</option>
                <option value="மாலை 05:00 – 07:00">மாலை 05:00 – 07:00 மணி</option>
              </select>
            </div>

            {/* Confidentiality promise */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-[11px]">
              <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>உங்களின் அனுமதி இல்லாமல் உங்கள் விவரங்கள் யாரிடமும் பகிரப்படாது.</span>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-extrabold text-sm shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <span>{t.submitCounsellingReq}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        /* Confirmation Screen */
        <div className="bg-white rounded-3xl p-6 border border-emerald-200 shadow-lg text-center space-y-4 animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 border-4 border-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              REQUEST RECEIVED
            </span>
            <h3 className="text-lg font-black text-slate-900 pt-2">
              {t.counsellingSuccess}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed px-2">
              {t.counsellingNextSteps}
            </p>
          </div>

          <div className="bg-purple-950 text-white p-4 rounded-2xl space-y-1">
            <span className="text-[10px] text-purple-300 uppercase font-bold block">
              {t.counsellingReqId}
            </span>
            <span className="text-xl font-black text-amber-300">
              {submittedReq.id}
            </span>
          </div>

          <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 text-left space-y-1">
            <div><strong>விருப்ப முறை:</strong> {submittedReq.preferredMode.toUpperCase()}</div>
            <div><strong>தேர்ந்தெடுத்த நேரம்:</strong> {submittedReq.preferredTime}</div>
          </div>

          <button
            onClick={() => setSubmittedReq(null)}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
          >
            புதிய பதிவு செய்ய (Register Another)
          </button>
        </div>
      )}
    </div>
  );
};
