'use client';

import React, { useState } from 'react';
import {
  BellRing,
  Zap,
  Layers,
  Pickaxe,
  Building,
  Volume2,
  VolumeX,
  Clock,
  MapPin,
  PhoneCall,
  CheckCircle2,
  AlertTriangle,
  Info,
  Calendar
} from 'lucide-react';
import {
  ElectricityUpdate,
  RationUpdate,
  WorkOpportunity,
  SupportedLanguage
} from '@/types';
import {
  VERIFIED_ELECTRICITY_UPDATES,
  VERIFIED_RATION_UPDATES,
  VERIFIED_WORK_OPPORTUNITIES
} from '@/data/verifiedData';
import { UI_TRANSLATIONS } from '@/data/translations';
import { speakText, stopSpeech, playAudioChime } from '@/utils/speech';

interface LocalUpdatesHubProps {
  language: SupportedLanguage;
  userVillage: string;
  userDistrict: string;
}

export const LocalUpdatesHub: React.FC<LocalUpdatesHubProps> = ({
  language,
  userVillage,
  userDistrict
}) => {
  const [activeTab, setActiveTab] = useState<'electricity' | 'ration' | 'work' | 'announcements'>('electricity');
  const [speakingItemId, setSpeakingItemId] = useState<string | null>(null);

  const t = UI_TRANSLATIONS[language];

  const handleSpeak = (id: string, text: string) => {
    if (speakingItemId === id) {
      stopSpeech();
      setSpeakingItemId(null);
      return;
    }

    setSpeakingItemId(id);
    speakText(
      text,
      language,
      () => setSpeakingItemId(id),
      () => setSpeakingItemId(null),
      () => setSpeakingItemId(null)
    );
  };

  return (
    <div className="space-y-4 p-4 pb-24 max-w-md mx-auto">
      {/* Top Title */}
      <div>
        <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <BellRing className="w-5 h-5 text-purple-700" />
          <span>{t.localUpdatesTitle}</span>
        </h1>
        <p className="text-xs text-slate-500 font-medium mt-0.5">
          {userDistrict} • {userVillage} பகுதிக்கான சரிபார்க்கப்பட்ட அரசு அறிக்கைகள்
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl">
        <button
          onClick={() => {
            playAudioChime('pop');
            setActiveTab('electricity');
          }}
          className={`py-2 px-1 text-[11px] font-bold rounded-xl flex flex-col items-center gap-1 transition-all ${
            activeTab === 'electricity' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>{t.tabElectricity}</span>
        </button>

        <button
          onClick={() => {
            playAudioChime('pop');
            setActiveTab('ration');
          }}
          className={`py-2 px-1 text-[11px] font-bold rounded-xl flex flex-col items-center gap-1 transition-all ${
            activeTab === 'ration' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t.tabRation}</span>
        </button>

        <button
          onClick={() => {
            playAudioChime('pop');
            setActiveTab('work');
          }}
          className={`py-2 px-1 text-[11px] font-bold rounded-xl flex flex-col items-center gap-1 transition-all ${
            activeTab === 'work' ? 'bg-purple-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Pickaxe className="w-4 h-4" />
          <span>{t.tabWork}</span>
        </button>

        <button
          onClick={() => {
            playAudioChime('pop');
            setActiveTab('announcements');
          }}
          className={`py-2 px-1 text-[11px] font-bold rounded-xl flex flex-col items-center gap-1 transition-all ${
            activeTab === 'announcements' ? 'bg-indigo-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>{t.tabAnnouncements}</span>
        </button>
      </div>

      {/* Electricity Section */}
      {activeTab === 'electricity' && (
        <div className="space-y-3.5 animate-in fade-in duration-150">
          {VERIFIED_ELECTRICITY_UPDATES.map((item) => {
            const isSpeaking = speakingItemId === item.id;
            const speechText = `${item.title[language]}. தேதி: ${item.scheduleDate}. நேரம்: காலை ${item.startTime} முதல் மாலை ${item.endTime}. பகுதிகள்: ${item.affectedVillages.join(', ')}. காரணம்: ${item.reason[language]}. உதவி எண்: 1912.`;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-amber-200 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-950">
                        {item.location.area}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900 mt-0.5 leading-snug">
                        {item.title[language]}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSpeak(item.id, speechText)}
                    className={`p-2.5 rounded-full shadow-xs shrink-0 ${
                      isSpeaking ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Date & Time Badges */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="font-extrabold text-slate-900">{item.scheduleDate}</span>
                  </div>
                  <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                    <span className="font-extrabold text-slate-900">{item.startTime} – {item.endTime}</span>
                  </div>
                </div>

                {/* Affected Villages */}
                <div className="text-xs space-y-1">
                  <span className="font-bold text-slate-500 block text-[11px]">
                    {t.affectedAreas}:
                  </span>
                  <p className="text-slate-800 font-bold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {item.affectedVillages.join(' • ')}
                  </p>
                </div>

                {/* Reason */}
                <div className="text-xs text-slate-600">
                  <span className="font-bold text-slate-500">காரணம்: </span>
                  {item.reason[language]}
                </div>

                {/* Source & Direct Call Helpline */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 truncate max-w-[170px]">
                    ஆதாரம்: {item.officialSource}
                  </span>
                  <a
                    href="tel:1912"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-bold text-[11px] flex items-center gap-1.5 hover:bg-slate-800"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                    <span>1912 மின் புகார்</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Ration PDS Section */}
      {activeTab === 'ration' && (
        <div className="space-y-3.5 animate-in fade-in duration-150">
          {VERIFIED_RATION_UPDATES.map((item) => {
            const isSpeaking = speakingItemId === item.id;
            const speechText = `ரேஷன் கடை எண் ${item.shopNumber}. பொருட்கள் இருப்பு நிலை: இலவச அரிசி 20 கிலோ, துவரம் பருப்பு, சர்க்கரை மற்றும் பாமாயில் கடையில் இருப்பு உள்ளன. கடை திறக்கும் நேரம் காலை 8:30 முதல் 12:30 மற்றும் மாலை 3:00 முதல் 7:00 வரை.`;

            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-5 border border-emerald-200 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                        {item.shopNumber}
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900 mt-0.5">
                        {item.location.village} நியாயவிலைக் கடை
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSpeak(item.id, speechText)}
                    className={`p-2.5 rounded-full shadow-xs shrink-0 ${
                      isSpeaking ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-700">
                  <span className="font-bold block text-slate-400 text-[10px]">விற்பனையாளர்:</span>
                  {item.dealerName} | <span className="font-bold text-emerald-800">{item.openTimings}</span>
                </div>

                {/* Stock Table */}
                <div className="space-y-1.5 pt-1">
                  <span className="font-bold text-slate-500 text-xs block">
                    பொருட்கள் இருப்பு & ஒதுக்கீடு (Current Stock):
                  </span>
                  <div className="space-y-1.5">
                    {item.itemsAvailable.map((stock, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span className="font-bold text-slate-900">{stock.item[language]}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-extrabold text-slate-900 block">{stock.quantityPerCard}</span>
                          <span className="text-[10px] text-emerald-800 font-bold">{stock.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 text-xs text-amber-900">
                  <p className="font-bold text-amber-950 mb-0.5">முக்கிய குறிப்பு:</p>
                  <p className="leading-relaxed">{item.officialInstructions[language]}</p>
                </div>

                {/* Helpline */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">உணவு வழங்கல் துறை</span>
                  <a
                    href="tel:1967"
                    className="px-3 py-1.5 rounded-xl bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>1967 ரேஷன் புகார்</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MGNREGA 100-Day Work Section */}
      {activeTab === 'work' && (
        <div className="space-y-3.5 animate-in fade-in duration-150">
          {VERIFIED_WORK_OPPORTUNITIES.map((work) => {
            const isSpeaking = speakingItemId === work.id;
            const speechText = `மகாத்மா காந்தி 100 நாள் வேலை அறிவிப்பு: ${work.title[language]}. தொடங்கும் நாள்: ${work.startDate}. தினசரி கூலி: ${work.dailyWage}. தகுதி: ${work.eligibility[language]}. தொடர்பு நபர்: ${work.contactPerson}, எண் ${work.contactNumber}.`;

            return (
              <div
                key={work.id}
                className="bg-white rounded-3xl p-5 border border-purple-200 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="p-2 rounded-xl bg-purple-100 text-purple-900">
                      <Pickaxe className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
                        MGNREGA 100-DAY WORK
                      </span>
                      <h3 className="font-extrabold text-sm text-slate-900 mt-0.5 leading-snug">
                        {work.title[language]}
                      </h3>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSpeak(work.id, speechText)}
                    className={`p-2.5 rounded-full shadow-xs shrink-0 ${
                      isSpeaking ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Wage Highlight */}
                <div className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white p-3 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-purple-200 uppercase font-bold block">{t.dailyWage}</span>
                    <span className="text-base font-extrabold text-amber-300">{work.dailyWage}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-purple-200 uppercase font-bold block">தொடங்கும் நாள்</span>
                    <span className="text-xs font-bold text-white">{work.startDate}</span>
                  </div>
                </div>

                {/* Description */}
                <div className="text-xs space-y-1">
                  <span className="font-bold text-slate-500 block text-[11px]">வேலை விவரம்:</span>
                  <p className="text-slate-700 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {work.workDescription[language]}
                  </p>
                </div>

                {/* How to apply */}
                <div className="text-xs space-y-1">
                  <span className="font-bold text-slate-500 block text-[11px]">விண்ணப்பிக்கும் முறை:</span>
                  <p className="text-slate-800 font-medium">
                    {work.howToApply[language]}
                  </p>
                </div>

                {/* Contact */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] block">பஞ்சாயத்து தொடர்பு:</span>
                    <span className="font-bold text-slate-800">{work.contactPerson}</span>
                  </div>
                  <a
                    href={`tel:${work.contactNumber}`}
                    className="px-3 py-1.5 rounded-xl bg-purple-700 text-white font-bold text-[11px] flex items-center gap-1.5"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                    <span>{work.contactNumber}</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Announcements */}
      {activeTab === 'announcements' && (
        <div className="space-y-3.5 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-5 border border-indigo-200 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-indigo-700" />
              <h3 className="font-extrabold text-sm text-slate-900">
                கிராம சபை சிறப்புக் கூட்டம் & நலத்திட்ட மனுக்கள் பெறுதல்
              </h3>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              அக்டோபர் 2 காந்தி ஜெயந்தியை முன்னிட்டு ஊராட்சி மன்ற அலுவலகத்தில் காலை 10 மணிக்கு கிராம சபைக் கூட்டம் நடைபெறும். பொதுமக்கள் குடிநீர், சாலை மற்றும் நலத்திட்ட விண்ணப்பங்களை நேரில் சமர்ப்பிக்கலாம்.
            </p>
            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400">
              ஊராட்சி மன்ற தலைவர் • ஜமீன் உத்துகுளி
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
