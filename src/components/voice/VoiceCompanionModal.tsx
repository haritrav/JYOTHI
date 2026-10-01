'use client';

import React, { useState } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Send,
  Keyboard,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Building2,
  Zap,
  Layers,
  HeartPulse,
  Syringe,
  PhoneCall
} from 'lucide-react';
import { SupportedLanguage } from '@/types';
import { UI_TRANSLATIONS } from '@/data/translations';
import { AIResponse } from '@/utils/aiCompanion';
import { playAudioChime } from '@/utils/speech';

interface VoiceCompanionModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  isListening: boolean;
  isSpeaking: boolean;
  isProcessing: boolean;
  transcript: string;
  lastResponse: AIResponse | null;
  speechError: string | null;
  onStartListening: () => void;
  onStopListening: () => void;
  onSpeak: (text: string) => void;
  onStopSpeaking: () => void;
  onProcessQuery: (query: string) => Promise<AIResponse>;
  onNavigateTab: (tab: string, contextId?: string) => void;
}

export const VoiceCompanionModal: React.FC<VoiceCompanionModalProps> = ({
  isOpen,
  onClose,
  language,
  isListening,
  isSpeaking,
  isProcessing,
  transcript,
  lastResponse,
  speechError,
  onStartListening,
  onStopListening,
  onSpeak,
  onStopSpeaking,
  onProcessQuery,
  onNavigateTab
}) => {
  const [typedInput, setTypedInput] = useState('');
  const [showTypeInput, setShowTypeInput] = useState(false);

  const t = UI_TRANSLATIONS[language];

  if (!isOpen) return null;

  const samplePrompts = [
    t.example1,
    t.example2,
    t.example3,
    t.example4,
    t.example5,
    t.example6,
    t.example7
  ];

  const handleSendTyped = () => {
    if (!typedInput.trim()) return;
    onProcessQuery(typedInput);
    setTypedInput('');
    setShowTypeInput(false);
  };

  const handlePromptClick = (promptText: string) => {
    playAudioChime('pop');
    onProcessQuery(promptText);
  };

  const handleActionCardClick = (actionType: string) => {
    onClose();
    if (actionType === 'safety_immediate' || actionType === 'safety_support') {
      onNavigateTab('safety');
    } else if (actionType === 'show_schemes') {
      onNavigateTab('schemes');
    } else if (actionType === 'show_electricity' || actionType === 'show_ration' || actionType === 'show_work') {
      onNavigateTab('updates');
    } else if (actionType === 'show_health' || actionType === 'show_vaccination') {
      onNavigateTab('health');
    } else if (actionType === 'show_counselling') {
      onNavigateTab('counselling');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col justify-end sm:justify-center items-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 text-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl shadow-2xl border-t sm:border border-purple-500/30 max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 border-b border-purple-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400/50 flex items-center justify-center text-amber-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base tracking-tight">
                {t.appName} Voice AI • {language.toUpperCase()}
              </h2>
              <p className="text-[11px] text-purple-200 font-medium">
                {isListening ? t.listeningNow : isProcessing ? t.processingVoice : t.whatHelpNeeded}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white active:scale-95 transition-all"
            aria-label="Close Voice Assistant"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Center Stage */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Central Animated Wave & Mic */}
          <div className="flex flex-col items-center justify-center py-4 space-y-3">
            <div className="relative flex items-center justify-center">
              {/* Pulsing Aura Rings */}
              {isListening && (
                <>
                  <div className="absolute w-36 h-36 rounded-full bg-amber-400/20 animate-ping" />
                  <div className="absolute w-28 h-28 rounded-full bg-rose-500/30 animate-pulse" />
                </>
              )}
              {isSpeaking && (
                <div className="absolute w-32 h-32 rounded-full bg-emerald-400/20 animate-pulse" />
              )}

              {/* Main Glowing Mic Button */}
              <button
                onClick={isListening ? onStopListening : onStartListening}
                className={`relative z-10 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl transition-all active:scale-90 ${
                  isListening
                    ? 'bg-gradient-to-tr from-amber-500 to-rose-500 ring-8 ring-amber-300/40 scale-105'
                    : isProcessing
                    ? 'bg-indigo-600 animate-pulse'
                    : 'bg-gradient-to-tr from-purple-700 via-indigo-600 to-amber-500 hover:scale-105 ring-4 ring-white/20'
                }`}
                aria-label={isListening ? 'Stop listening' : t.tapToSpeak}
              >
                {isListening ? (
                  <MicOff className="w-10 h-10 text-white animate-bounce" />
                ) : (
                  <Mic className="w-10 h-10 text-white" />
                )}
              </button>
            </div>

            {/* Status indicator bar */}
            <div className="text-center">
              <span className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                isListening
                  ? 'bg-amber-400 text-slate-950 animate-pulse'
                  : isSpeaking
                  ? 'bg-emerald-400 text-slate-950'
                  : isProcessing
                  ? 'bg-indigo-400 text-slate-950'
                  : 'bg-white/10 text-purple-200'
              }`}>
                {isListening ? t.listeningNow : isSpeaking ? '🔊 பேசுகிறது / Speaking' : isProcessing ? t.processingVoice : t.tapToSpeak}
              </span>
            </div>

            {/* Live Waveform Bar Simulation */}
            {isListening && (
              <div className="flex items-center justify-center gap-1.5 h-8">
                {[40, 70, 100, 60, 90, 45, 80, 50, 95, 30].map((height, i) => (
                  <div
                    key={i}
                    style={{ height: `${height}%` }}
                    className="w-1 bg-gradient-to-t from-amber-400 to-rose-400 rounded-full animate-pulse"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Real-time transcribed text */}
          {transcript && (
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/20 text-center">
              <p className="text-xs text-amber-300 font-medium">🗣️ நீங்கள் பேசியது (You said):</p>
              <p className="text-base font-bold text-white mt-0.5">“{transcript}”</p>
            </div>
          )}

          {/* Speech Error */}
          {speechError && (
            <div className="bg-rose-950/60 border border-rose-500/40 rounded-xl p-3 text-xs text-rose-200 text-center">
              {speechError}
            </div>
          )}

          {/* AI Answer Card */}
          {lastResponse && (
            <div className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 rounded-3xl p-4 border border-indigo-400/40 shadow-xl space-y-3 animate-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />
                  {t.appName} பதில் (Verified Response):
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (isSpeaking) {
                        onStopSpeaking();
                      } else {
                        onSpeak(lastResponse.audioSpeechText);
                      }
                    }}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95 ${
                      isSpeaking
                        ? 'bg-rose-600 text-white animate-pulse'
                        : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                    <span>{isSpeaking ? t.stopAudio : t.listenAgain}</span>
                  </button>
                </div>
              </div>

              <p className="text-sm font-medium text-white leading-relaxed whitespace-pre-line">
                {lastResponse.responseText}
              </p>

              {/* Action Trigger Button */}
              {lastResponse.actionType !== 'general_guidance' && (
                <button
                  onClick={() => handleActionCardClick(lastResponse.actionType)}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all active:scale-95 mt-2"
                >
                  <span>முழு விவரங்களைப் பார்க்க (View Complete Details)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Sample voice prompt chips */}
          <div className="space-y-2 pt-2">
            <p className="text-xs font-bold text-purple-200 flex items-center gap-1">
              <span>💡 தொட்டுப் பேசலாம் (Sample Questions):</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePromptClick(prompt)}
                  className="text-xs bg-white/10 hover:bg-white/20 text-purple-100 px-3 py-2 rounded-xl text-left border border-white/10 transition-all active:scale-95 flex items-center gap-1.5"
                >
                  <span>🎙️</span>
                  <span>{prompt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: Type Instead fallback toggle & input */}
        <div className="p-3.5 bg-slate-900/90 border-t border-purple-900/60">
          {!showTypeInput ? (
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setShowTypeInput(true)}
                className="text-xs text-purple-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5"
              >
                <Keyboard className="w-3.5 h-3.5" />
                <span>{t.typeInstead}</span>
              </button>

              <button
                onClick={onStartListening}
                className="text-xs text-amber-300 font-bold hover:text-amber-200 flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-400/10 border border-amber-400/30"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{t.speakAgain}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={typedInput}
                onChange={(e) => setTypedInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendTyped()}
                placeholder="இங்கே உங்கள் கேள்வியை தட்டச்சு செய்யவும்..."
                className="flex-1 bg-slate-800 text-white text-xs px-3 py-2.5 rounded-xl border border-purple-700/50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                autoFocus
              />
              <button
                onClick={handleSendTyped}
                className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-bold hover:bg-amber-300"
              >
                <Send className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowTypeInput(false)}
                className="p-2.5 rounded-xl bg-white/10 text-white"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
