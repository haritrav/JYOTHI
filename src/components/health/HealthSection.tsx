'use client';

import React, { useState } from 'react';
import {
  HeartPulse,
  Syringe,
  Eye,
  Calendar,
  Clock,
  MapPin,
  PhoneCall,
  Volume2,
  VolumeX,
  Navigation,
  Bell,
  CheckCircle2,
  ShieldAlert,
  Baby,
  Stethoscope,
  Sparkles
} from 'lucide-react';
import {
  HealthCamp,
  VaccinationSession,
  SupportedLanguage
} from '@/types';
import {
  VERIFIED_HEALTH_CAMPS,
  VERIFIED_VACCINATION_SESSIONS
} from '@/data/verifiedData';
import { UI_TRANSLATIONS } from '@/data/translations';
import { speakText, stopSpeech, playAudioChime } from '@/utils/speech';
import confetti from 'canvas-confetti';

interface HealthSectionProps {
  language: SupportedLanguage;
  userVillage: string;
  userDistrict: string;
}

export const HealthSection: React.FC<HealthSectionProps> = ({
  language,
  userVillage,
  userDistrict
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'women' | 'eye' | 'vaccine'>('all');
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const [reminderSet, setReminderSet] = useState<Record<string, boolean>>({});

  const t = UI_TRANSLATIONS[language];

  const handleSpeak = (id: string, text: string) => {
    if (speakingId === id) {
      stopSpeech();
      setSpeakingId(null);
      return;
    }

    setSpeakingId(id);
    speakText(
      text,
      language,
      () => setSpeakingId(id),
      () => setSpeakingId(null),
      () => setSpeakingId(null)
    );
  };

  const handleToggleReminder = (id: string) => {
    playAudioChime('success');
    const newState = !reminderSet[id];
    setReminderSet({ ...reminderSet, [id]: newState });

    if (newState) {
      try {
        confetti({
          particleCount: 35,
          spread: 50,
          origin: { y: 0.7 }
        });
      } catch {}
    }
  };

  return (
    <div className="space-y-4 p-4 pb-24 max-w-md mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-rose-600" />
          <span>{t.healthTitle}</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          இலவச மருத்துவ முகாம்கள், மகளிர் பரிசோதனை & குழந்தை தடுப்பூசி நாட்கள்
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => {
            playAudioChime('pop');
            setActiveTab('all');
          }}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 border transition-all ${
            activeTab === 'all' ? 'bg-rose-700 text-white border-rose-800 shadow-xs' : 'bg-white text-slate-700 border-slate-200'
          }`}
        >
          {t.filterAll}
        </button>

        <button
          onClick={() => {
            playAudioChime('pop');
            setActiveTab('women');
          }}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 border transition-all flex items-center gap-1.5 ${
            activeTab === 'women' ? 'bg-purple-800 text-white border-purple-900 shadow-xs' : 'bg-white text-slate-700 border-slate-200'
          }`}
        >
          <Stethoscope className="w-3.5 h-3.5 text-rose-300" />
          <span>{t.womenHealthCamps}</span>
        </button>

        <button
          onClick={() => {
            playAudioChime('pop');
            setActiveTab('vaccine');
          }}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 border transition-all flex items-center gap-1.5 ${
            activeTab === 'vaccine' ? 'bg-indigo-800 text-white border-indigo-900 shadow-xs' : 'bg-white text-slate-700 border-slate-200'
          }`}
        >
          <Syringe className="w-3.5 h-3.5 text-amber-300" />
          <span>{t.childVaccination}</span>
        </button>

        <button
          onClick={() => {
            playAudioChime('pop');
            setActiveTab('eye');
          }}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 border transition-all flex items-center gap-1.5 ${
            activeTab === 'eye' ? 'bg-amber-600 text-white border-amber-700 shadow-xs' : 'bg-white text-slate-700 border-slate-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>{t.eyeCamps}</span>
        </button>
      </div>

      {/* Child Vaccination Sessions Special Spotlight */}
      {(activeTab === 'all' || activeTab === 'vaccine') && (
        <div className="space-y-3 pt-1">
          <div className="flex items-center gap-2">
            <Baby className="w-4 h-4 text-indigo-700" />
            <h3 className="font-extrabold text-sm text-slate-900">
              {t.childVaccination} (Immunization Sessions)
            </h3>
          </div>

          {VERIFIED_VACCINATION_SESSIONS.map((vax) => {
            const isSpeaking = speakingId === vax.id;
            const hasReminder = reminderSet[vax.id];
            const speechText = `${vax.title[language]}. நாள்: ${vax.sessionDate}. நேரம்: ${vax.timings}. இடம்: ${vax.venue[language]}. தடுப்பூசிகள்: ${vax.vaccinesAvailable.join(', ')}. ஆஷா பணியாளர் சுமதி: ${vax.ashaContact}.`;

            return (
              <div
                key={vax.id}
                className="bg-gradient-to-br from-indigo-900 to-purple-950 text-white rounded-3xl p-5 shadow-md space-y-3.5 border border-indigo-400/30"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-2xl bg-amber-400 text-slate-950">
                      <Syringe className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        {vax.targetAge}
                      </span>
                      <h4 className="font-extrabold text-sm text-white mt-0.5 leading-snug">
                        {vax.title[language]}
                      </h4>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSpeak(vax.id, speechText)}
                    className={`p-2.5 rounded-full shadow-xs shrink-0 ${
                      isSpeaking ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Session Timings */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-white/10 p-2.5 rounded-2xl border border-white/15 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="font-bold">{vax.sessionDate}</span>
                  </div>
                  <div className="bg-white/10 p-2.5 rounded-2xl border border-white/15 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-300 shrink-0" />
                    <span className="font-bold">{vax.timings}</span>
                  </div>
                </div>

                {/* Venue */}
                <div className="flex items-center gap-2 text-xs text-purple-200">
                  <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{vax.venue[language]}, {vax.location.village}</span>
                </div>

                {/* Vaccines List */}
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-amber-300 text-[11px] block">
                    இலவச தடுப்பூசிகள் (Available Vaccines):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {vax.vaccinesAvailable.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-white/15 text-white px-2.5 py-1 rounded-xl font-medium border border-white/10"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* ASHA contact & Reminder button */}
                <div className="pt-2 border-t border-white/15 flex items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-purple-300 block">ஆஷா ஒருங்கிணைப்பாளர்:</span>
                    <span className="text-xs font-bold text-white">{vax.ashaWorkerName}</span>
                  </div>

                  <button
                    onClick={() => handleToggleReminder(vax.id)}
                    className={`py-2 px-3 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95 ${
                      hasReminder
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    }`}
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{hasReminder ? t.reminderSaved : t.setVaccineReminder}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Adult & Women Health Camps */}
      {(activeTab === 'all' || activeTab === 'women' || activeTab === 'eye') && (
        <div className="space-y-3.5 pt-1">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-purple-700" />
            <h3 className="font-extrabold text-sm text-slate-900">
              அருகிலுள்ள மருத்துவ முகாம்கள் (Health Camps)
            </h3>
          </div>

          {VERIFIED_HEALTH_CAMPS.map((camp) => {
            const isSpeaking = speakingId === camp.id;
            const speechText = `${camp.title[language]}. நாள்: ${camp.date}. நேரம்: ${camp.startTime} முதல் ${camp.endTime}. இடம்: ${camp.venue[language]}. சேவைகள்: ${camp.servicesOffered[language].join(', ')}. மருத்துவ நிபுணர்: ${camp.doctorSpecialists}.`;

            return (
              <div
                key={camp.id}
                className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm space-y-3.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                      {camp.category === 'women' ? 'WOMEN SPECIALTY' : 'EYE & SURGERY'}
                    </span>
                    <h4 className="font-extrabold text-base text-slate-900 mt-1 leading-snug">
                      {camp.title[language]}
                    </h4>
                  </div>

                  <button
                    onClick={() => handleSpeak(camp.id, speechText)}
                    className={`p-2.5 rounded-full shadow-xs shrink-0 ${
                      isSpeaking ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-purple-50 p-2.5 rounded-2xl border border-purple-100 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-purple-700 shrink-0" />
                    <span className="font-bold text-slate-900">{camp.date}</span>
                  </div>
                  <div className="bg-purple-50 p-2.5 rounded-2xl border border-purple-100 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-purple-700 shrink-0" />
                    <span className="font-bold text-slate-900">{camp.startTime} – {camp.endTime}</span>
                  </div>
                </div>

                {/* Venue */}
                <div className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                  <span className="font-bold">{camp.venue[language]}</span>
                </div>

                {/* Services list */}
                <div className="space-y-1.5 text-xs">
                  <span className="font-bold text-slate-500 block text-[11px]">
                    {t.healthServices}:
                  </span>
                  <div className="space-y-1">
                    {camp.servicesOffered[language].map((srv, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Doctor info & Action */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">மருத்துவர்கள்:</span>
                    <span className="font-bold text-slate-800">{camp.doctorSpecialists}</span>
                  </div>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(camp.venue[language])}`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-2 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95"
                  >
                    <Navigation className="w-3.5 h-3.5 text-amber-300" />
                    <span>{t.getDirections}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Medical non-diagnostic disclaimer */}
      <div className="bg-slate-100 p-3 rounded-2xl text-[11px] text-slate-500 flex items-start gap-2 border border-slate-200">
        <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <p>{t.healthDisclaimer}</p>
      </div>
    </div>
  );
};
