'use client';

import React from 'react';
import Image from 'next/image';
import {
  Mic,
  Sparkles,
  Building2,
  BellRing,
  HeartPulse,
  Baby,
  Shield,
  Heart,
  FileCheck2,
  HelpCircle,
  Volume2,
  VolumeX,
  ArrowRight,
  ShieldAlert,
  MapPin,
  Flame
} from 'lucide-react';
import { SupportedLanguage, UserLocation } from '@/types';
import { UI_TRANSLATIONS } from '@/data/translations';
import { speakText, stopSpeech, playAudioChime } from '@/utils/speech';

interface HomeDashboardProps {
  language: SupportedLanguage;
  location: UserLocation;
  onOpenVoiceModal: () => void;
  onNavigateTab: (tab: string) => void;
  onChangeLocation: () => void;
  onQuickExit: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  language,
  location,
  onOpenVoiceModal,
  onNavigateTab,
  onChangeLocation,
  onQuickExit
}) => {
  const t = UI_TRANSLATIONS[language];

  const quickPrompts = [
    { label: t.example1, icon: '🏛️' },
    { label: t.example2, icon: '⚡' },
    { label: t.example3, icon: '🍚' },
    { label: t.example4, icon: '👷' },
    { label: t.example5, icon: '🏥' },
    { label: t.example6, icon: '💉' },
    { label: t.example7, icon: '🛡️' }
  ];

  const actionCards = [
    {
      id: 'schemes',
      title: t.cardGovt,
      sub: t.cardGovtSub,
      icon: <Building2 className="w-7 h-7 text-purple-700" />,
      bg: 'bg-purple-50 hover:bg-purple-100 border-purple-200 text-purple-950',
      badge: '₹1,000 / மாதம்'
    },
    {
      id: 'updates',
      title: t.cardUpdates,
      sub: t.cardUpdatesSub,
      icon: <BellRing className="w-7 h-7 text-amber-600" />,
      bg: 'bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-950',
      badge: 'நேரலை (Live)'
    },
    {
      id: 'health',
      title: t.cardHealth,
      sub: t.cardHealthSub,
      icon: <HeartPulse className="w-7 h-7 text-rose-600" />,
      bg: 'bg-rose-50 hover:bg-rose-100 border-rose-200 text-rose-950',
      badge: 'இலவசம் (Free)'
    },
    {
      id: 'health-vax',
      title: t.cardKids,
      sub: t.cardKidsSub,
      icon: <Baby className="w-7 h-7 text-indigo-600" />,
      bg: 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-950',
      badge: 'தடுப்பூசி'
    },
    {
      id: 'safety',
      title: t.cardSafety,
      sub: t.cardSafetySub,
      icon: <Shield className="w-7 h-7 text-red-600" />,
      bg: 'bg-red-50 hover:bg-red-100 border-red-300 text-red-950',
      badge: '112 / 181',
      isUrgent: true
    },
    {
      id: 'counselling',
      title: t.cardCounselling,
      sub: t.cardCounsellingSub,
      icon: <Heart className="w-7 h-7 text-emerald-600" />,
      bg: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-200 text-emerald-950',
      badge: 'Tele-MANAS'
    },
    {
      id: 'applications',
      title: t.cardApplications,
      sub: t.cardApplicationsSub,
      icon: <FileCheck2 className="w-7 h-7 text-slate-700" />,
      bg: 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900',
      badge: 'கண்காணிப்பு'
    },
    {
      id: 'help',
      title: t.cardHelp,
      sub: t.cardHelpSub,
      icon: <HelpCircle className="w-7 h-7 text-blue-600" />,
      bg: 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-950',
      badge: 'வழிகாட்டி'
    }
  ];

  const handleCardClick = (id: string) => {
    playAudioChime('pop');
    if (id === 'health-vax') {
      onNavigateTab('health');
    } else if (id === 'help') {
      onOpenVoiceModal();
    } else {
      onNavigateTab(id);
    }
  };

  return (
    <div className="space-y-4 p-4 pb-28 max-w-md mx-auto">
      {/* Location Bar with quick change */}
      <div className="flex items-center justify-between bg-purple-50/80 px-3.5 py-2 rounded-2xl border border-purple-100 text-xs">
        <div className="flex items-center gap-1.5 text-purple-900 font-bold truncate">
          <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
          <span className="truncate">
            {location.village}, {location.block}, {location.district}
          </span>
        </div>
        <button
          onClick={onChangeLocation}
          className="text-purple-700 font-extrabold text-[11px] underline shrink-0 hover:text-purple-900 ml-2"
        >
          மாற்று (Change)
        </button>
      </div>

      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-purple-200/60 bg-gradient-to-br from-purple-900 via-indigo-900 to-purple-950 text-white p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-extrabold tracking-wider uppercase text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
              {t.helloGreeting}
            </span>
            <h1 className="text-xl font-black text-white leading-tight">
              {t.welcomeMessage}
            </h1>
          </div>

          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400 shadow-md shrink-0">
            <Image
              src="/jyothi-logo.jpg"
              alt="Jyothi Companion"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <p className="text-xs text-purple-100 font-medium leading-relaxed">
          {t.welcomeSubtext}
        </p>

        {/* Large Central Microphone Tap Area */}
        <button
          onClick={onOpenVoiceModal}
          className="w-full bg-gradient-to-r from-amber-400 via-rose-400 to-amber-300 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-sm py-4 px-5 rounded-2xl shadow-xl flex items-center justify-between active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-950 text-amber-300 flex items-center justify-center animate-pulse">
              <Mic className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="block text-sm font-black leading-tight">{t.tapToSpeak}</span>
              <span className="text-[11px] text-slate-800 font-semibold">{t.whatHelpNeeded}</span>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-slate-950" />
        </button>
      </div>

      {/* Immediate Safety Quick Action Banner */}
      <button
        onClick={() => {
          playAudioChime('alert');
          onNavigateTab('safety');
        }}
        className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white p-3.5 rounded-2xl shadow-md flex items-center justify-between active:scale-98 transition-all border border-red-400"
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center font-black animate-bounce text-sm">
            🚨
          </div>
          <div className="text-left">
            <span className="font-extrabold text-xs block leading-tight">{t.iAmInDanger}</span>
            <span className="text-[10px] text-red-100 font-medium">112 அவசர உதவி & 181 மகளிர் உதவி எண்</span>
          </div>
        </div>
        <span className="text-xs font-black bg-white text-red-600 px-2.5 py-1 rounded-full uppercase shadow-2xs">
          CALL 112
        </span>
      </button>

      {/* Sample Voice Prompts (Horizontally Scrollable) */}
      <div className="space-y-1.5 pt-1">
        <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>குரல் மூலம் உடனடியாகக் கேட்க:</span>
        </span>

        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={onOpenVoiceModal}
              className="px-3 py-2 rounded-xl bg-white hover:bg-purple-50 text-slate-800 text-xs font-bold border border-slate-200 shadow-2xs shrink-0 flex items-center gap-1.5 active:scale-95 transition-all"
            >
              <span>{qp.icon}</span>
              <span>{qp.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 8 Primary Action Cards Grid */}
      <div className="space-y-2 pt-1">
        <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider">
          முக்கிய அரசு மற்றும் பாதுகாப்பு சேவைகள்
        </h2>

        <div className="grid grid-cols-2 gap-3">
          {actionCards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`p-4 rounded-3xl border text-left flex flex-col justify-between transition-all active:scale-95 shadow-xs hover:shadow-md ${card.bg}`}
            >
              <div className="flex items-start justify-between">
                <div className="p-2 rounded-2xl bg-white shadow-2xs">
                  {card.icon}
                </div>
                {card.badge && (
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                    card.isUrgent ? 'bg-red-600 text-white animate-pulse' : 'bg-white/80 text-slate-800 border border-slate-200'
                  }`}>
                    {card.badge}
                  </span>
                )}
              </div>

              <div className="mt-3">
                <h3 className="font-extrabold text-sm leading-snug">
                  {card.title}
                </h3>
                <p className="text-[11px] opacity-80 mt-0.5 leading-tight line-clamp-2">
                  {card.sub}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Confidentiality Footer Banner */}
      <div className="bg-slate-100 p-4 rounded-3xl border border-slate-200 text-center space-y-1 text-xs text-slate-600">
        <p className="font-bold text-slate-800">
          “தொழில்நுட்பத்திற்கு நீங்கள் பழகத் தேவையில்லை; உங்களுக்கு ஏற்ப தொழில்நுட்பம் உதவும்.”
        </p>
        <p className="text-[11px] text-slate-500">
          {t.allRightsReserved}
        </p>
      </div>
    </div>
  );
};
