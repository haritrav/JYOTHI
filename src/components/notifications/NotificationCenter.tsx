'use client';

import React, { useState } from 'react';
import {
  Bell,
  CheckCircle2,
  Volume2,
  VolumeX,
  Lock,
  Eye,
  EyeOff,
  Zap,
  Syringe,
  Layers,
  Heart,
  Shield,
  X
} from 'lucide-react';
import { AppNotification, SupportedLanguage } from '@/types';
import { UI_TRANSLATIONS } from '@/data/translations';
import { speakText, stopSpeech, playAudioChime } from '@/utils/speech';

interface NotificationCenterProps {
  notifications: AppNotification[];
  language: SupportedLanguage;
  onClose: () => void;
  onMarkRead: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  notifications,
  language,
  onClose,
  onMarkRead
}) => {
  const [revealedSensitiveIds, setRevealedSensitiveIds] = useState<Record<string, boolean>>({});
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const t = UI_TRANSLATIONS[language];

  const handleToggleReveal = (id: string) => {
    playAudioChime('pop');
    setRevealedSensitiveIds({
      ...revealedSensitiveIds,
      [id]: !revealedSensitiveIds[id]
    });
    onMarkRead(id);
  };

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

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white text-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-300" />
            <h2 className="font-extrabold text-base">{t.notifications}</h2>
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
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {notifications.map((notif) => {
            const isSensitive = notif.isSensitive;
            const isRevealed = revealedSensitiveIds[notif.id];
            const isSpeaking = speakingId === notif.id;

            const displayTitle = isSensitive && !isRevealed
              ? notif.safePreviewTitle[language]
              : notif.title[language];

            const speechContent = isSensitive && !isRevealed
              ? notif.safePreviewTitle[language]
              : `${notif.title[language]}. ${notif.message[language]}`;

            return (
              <div
                key={notif.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isSensitive
                    ? 'bg-purple-50/60 border-purple-200'
                    : notif.type === 'electricity'
                    ? 'bg-amber-50/60 border-amber-200'
                    : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-xl bg-white shadow-2xs mt-0.5">
                      {notif.type === 'electricity' && <Zap className="w-4 h-4 text-amber-600" />}
                      {notif.type === 'vaccination' && <Syringe className="w-4 h-4 text-indigo-600" />}
                      {notif.type === 'safety_support' && <Heart className="w-4 h-4 text-rose-600" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-tight">
                        {displayTitle}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {notif.date}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleSpeak(notif.id, speechContent)}
                    className={`p-2 rounded-full shadow-2xs shrink-0 ${
                      isSpeaking ? 'bg-rose-600 text-white' : 'bg-amber-400 text-slate-950'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Message Body or Sensitive Mask */}
                {isSensitive ? (
                  <div className="mt-2.5 pt-2 border-t border-purple-200/60">
                    {!isRevealed ? (
                      <button
                        onClick={() => handleToggleReveal(notif.id)}
                        className="w-full py-2 px-3 bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>விவரங்களைக் காண தொடவும் (Tap to View)</span>
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs text-purple-950 font-medium bg-white p-3 rounded-xl border border-purple-200">
                          {notif.message[language]}
                        </p>
                        <button
                          onClick={() => handleToggleReveal(notif.id)}
                          className="text-[11px] text-purple-700 hover:underline flex items-center gap-1"
                        >
                          <EyeOff className="w-3 h-3" />
                          <span>மறைக்கவும் (Hide again)</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-slate-700 mt-2 leading-relaxed bg-white/80 p-2.5 rounded-xl border border-slate-100">
                    {notif.message[language]}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
