'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, Send, Sparkles, AlertTriangle, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from '@/contexts/LocationContext';
import { createSpeechRecognizer, SpeechService } from '@/lib/speech';
import { AudioButton } from './AudioButton';

interface VoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToCategory?: (categoryKey: string) => void;
}

export const VoiceModal: React.FC<VoiceModalProps> = ({ isOpen, onClose, onNavigateToCategory }) => {
  const { language, langInfo, t, speak, isSpeaking } = useLanguage();
  const { location } = useLocation();

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [typedInput, setTypedInput] = useState('');
  const [isTextMode, setIsTextMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [responseExplanation, setResponseExplanation] = useState<string | null>(null);
  const [responseCards, setResponseCards] = useState<any[]>([]);
  const [detectedIntent, setDetectedIntent] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen) {
      // Greet user on open if nothing has been asked yet
      if (!responseExplanation) {
        speak(langInfo.welcomeGreeting);
      }
      startListening();
    } else {
      stopListening();
    }
    return () => {
      stopListening();
    };
  }, [isOpen, language]);

  const startListening = () => {
    setIsListening(true);
    setTranscript('');

    const recognizer = createSpeechRecognizer({
      lang: language,
      onResult: (text, isFinal) => {
        setTranscript(text);
        if (isFinal && text.trim().length > 1) {
          handleQuerySubmit(text);
        }
      },
      onError: (err) => {
        console.warn('Speech error:', err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });

    if (recognizer) {
      try {
        recognizer.start();
        recognitionRef.current = recognizer;
      } catch (e) {
        console.warn('Recognition start exception', e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const handleQuerySubmit = async (queryText: string) => {
    if (!queryText.trim()) return;
    stopListening();
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          language,
          userLocation: location,
        }),
      });

      const data = await res.json();
      setResponseExplanation(data.explanation);
      setResponseCards(data.cards || []);
      setDetectedIntent(data.intent);

      // Auto-read response aloud for accessibility
      if (data.explanation) {
        SpeechService.speak(data.explanation, language);
      }
    } catch (e) {
      const fallbackText = 'மன்னிக்கவும், தகவலைப் பெற முடியவில்லை. மீண்டும் முயற்சிக்கவும்.';
      setResponseExplanation(fallbackText);
      SpeechService.speak(fallbackText, language);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleVoicePrompts: Record<string, string[]> = {
    ta: [
      'பெண்கள் அரசு நலத்திட்டங்கள்',
      'மின்சாரம் எப்போது போகும்?',
      'ரேஷன் கடை திறக்கப்பட்டுள்ளதா?',
      '100 நாள் வேலை வாய்ப்பு',
      'குழந்தைகள் தடுப்பூசி முகாம்',
      '🚨 எனக்கு அவசர உதவி தேவை',
    ],
    hi: [
      'महिला सरकारी योजनाएं',
      'बिजली कब कटेगी?',
      'राशन दुकान खुली है क्या?',
      'मनरेगा 100 दिन का काम',
      'शिशु टीकाकरण शिविर',
      '🚨 मुझे आपातकालीन सहायता चाहिए',
    ],
    te: [
      'మహిళల ప్రభుత్వ పథకాలు',
      'కరెంట్ ఎప్పుడు పోతుంది?',
      'రేషన్ సరుకులు అందుబాటులో ఉన్నాయా?',
      '100 రోజుల ఉపాధి హామీ పని',
      'పిల్లల వ్యాక్సినేషన్ క్యాంప్',
      '🚨 నాకు అత్యవసర సహాయం కావాలి',
    ],
    ml: [
      'വനിതാ സർക്കാർ പദ്ധതികൾ',
      'വൈദ്യുതി എപ്പോൾ മുടങ്ങും?',
      'റേഷൻ സാധനങ്ങൾ ലഭ്യമാണോ?',
      '100 ദിന തൊഴിലുറപ്പ് ജോലി',
      'കുട്ടികളുടെ പ്രതിരോധ കുത്തിവയ്പ്പ്',
      '🚨 എനിക്ക് അടിയന്തര സഹായം വേണം',
    ],
  };

  const currentPrompts = sampleVoicePrompts[language] || sampleVoicePrompts.ta;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950/90 backdrop-blur-md text-slate-100 p-4 animate-fade-in overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between py-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-jyothi-600 to-amber-400 flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-amber-300">{t('appName')} - {t('askJyothi')}</h2>
            <p className="text-xs text-slate-300">{langInfo.nativeName} ({langInfo.name})</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-400"
          aria-label="Close"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Interactive Stage */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-xl mx-auto w-full py-6">
        {/* Large Microphone Button */}
        <div className="relative my-4 flex items-center justify-center">
          {isListening && (
            <div className="absolute w-44 h-44 rounded-full bg-jyothi-500/30 animate-ping pointer-events-none" />
          )}
          {isListening && (
            <div className="absolute w-36 h-36 rounded-full bg-amber-400/30 animate-pulse pointer-events-none" />
          )}
          <button
            onClick={() => (isListening ? stopListening() : startListening())}
            aria-label={isListening ? 'Stop listening' : 'Start speaking'}
            className={`relative z-10 w-28 h-28 md:w-32 md:h-32 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all transform active:scale-90 ${
              isListening
                ? 'bg-gradient-to-br from-red-500 to-jyothi-600 ring-8 ring-red-400/40 text-white animate-pulse'
                : 'bg-gradient-to-br from-jyothi-600 to-indigo-700 ring-4 ring-amber-400/60 text-white hover:brightness-110'
            }`}
          >
            {isListening ? (
              <>
                <Mic className="w-12 h-12 text-white animate-bounce" />
                <span className="text-xs font-semibold mt-1">கேட்கிறது...</span>
              </>
            ) : (
              <>
                <Mic className="w-12 h-12 text-amber-300" />
                <span className="text-xs font-bold mt-1 text-white">பேச அழுத்தவும்</span>
              </>
            )}
          </button>
        </div>

        {/* Live speech transcription or prompt */}
        <div className="text-center my-2 min-h-[60px] px-4">
          {isListening ? (
            <div className="animate-fade-in">
              <p className="text-lg font-medium text-amber-200">
                {transcript || langInfo.voicePrompt}
              </p>
              <div className="flex justify-center gap-1.5 mt-3">
                <span className="w-2 h-4 bg-amber-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-7 bg-jyothi-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-9 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="w-2 h-5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '450ms' }} />
              </div>
            </div>
          ) : isLoading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <p className="text-slate-300 text-sm">தகவல் சரிபார்க்கப்படுகிறது... / Retrieving verified answer</p>
            </div>
          ) : (
            <p className="text-base text-slate-300">
              {responseExplanation ? 'அடுத்த கேள்வியைக் கேளுங்கள் அல்லது கீழே பார்க்கவும்:' : langInfo.welcomeGreeting}
            </p>
          )}
        </div>

        {/* AI Answer Display Area */}
        {responseExplanation && (
          <div className="w-full bg-slate-900 border-2 border-jyothi-500/60 rounded-2xl p-5 my-3 shadow-xl animate-slide-up">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="font-bold text-amber-300 text-base">ஜோதியின் பதில் / Jyothi's Guidance:</h3>
              </div>
              <AudioButton textToRead={responseExplanation} size="sm" variant="primary" />
            </div>
            <p className="text-base md:text-lg text-slate-100 leading-relaxed whitespace-pre-line font-medium">
              {responseExplanation}
            </p>

            {/* Quick Cards matching the intent */}
            {responseCards.length > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
                <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
                  சரிபார்க்கப்பட்ட விபரங்கள் (Verified Information):
                </p>
                <div className="grid grid-cols-1 gap-2">
                  {responseCards.slice(0, 3).map((card: any, idx: number) => {
                    const titleText = card.title?.[language] || card.title || card.sessionTitle?.[language] || card.name?.[language] || card.shopName?.[language] || 'விவரம்';
                    const amountText = card.amountOrBenefit?.[language] || card.dailyWageOrStipend || card.timings || card.phone || '';
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between hover:bg-slate-800"
                      >
                        <div className="flex-1 pr-2">
                          <h4 className="font-semibold text-sm text-slate-200">{titleText}</h4>
                          {amountText && <p className="text-xs text-amber-300 font-medium">{amountText}</p>}
                        </div>
                        <AudioButton textToRead={`${titleText}. ${amountText}`} size="sm" />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Sample Voice Prompts for First-Time / Low-Literacy Users */}
        {!responseExplanation && (
          <div className="w-full mt-4">
            <p className="text-xs text-center text-slate-400 uppercase tracking-wider font-semibold mb-2">
              👇 தொட்டு உடனடியாக கேட்கலாம் (Tap to Ask):
            </p>
            <div className="grid grid-cols-2 gap-2">
              {currentPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTranscript(prompt);
                    handleQuerySubmit(prompt);
                  }}
                  className="p-3 text-left rounded-xl bg-slate-800/90 border border-slate-700 hover:border-amber-400 hover:bg-slate-800 text-xs md:text-sm text-slate-200 transition-all active:scale-95 flex items-center justify-between"
                >
                  <span>{prompt}</span>
                  <ArrowRight className="w-4 h-4 text-amber-400 shrink-0 ml-1" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Controls: Speak Again / Listen Again / Type Instead */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 pt-3 border-t border-slate-800 w-full">
          <button
            onClick={() => startListening()}
            className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-medium flex items-center gap-1.5"
          >
            <Mic className="w-4 h-4 text-amber-400" />
            <span>{t('speakAgain')}</span>
          </button>

          {responseExplanation && (
            <button
              onClick={() => SpeechService.speak(responseExplanation, language)}
              className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-medium flex items-center gap-1.5"
            >
              <Volume2 className="w-4 h-4 text-green-400" />
              <span>{t('listenAgain')}</span>
            </button>
          )}

          <button
            onClick={() => setIsTextMode(!isTextMode)}
            className="px-4 py-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs md:text-sm font-medium flex items-center gap-1.5"
          >
            <span>{t('typeInstead')}</span>
          </button>
        </div>

        {/* Optional Typed Text Input fallback */}
        {isTextMode && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleQuerySubmit(typedInput);
              setTypedInput('');
            }}
            className="w-full mt-3 flex items-center gap-2"
          >
            <input
              type="text"
              value={typedInput}
              onChange={(e) => setTypedInput(e.target.value)}
              placeholder="உங்கள் கேள்வியை இங்கு தட்டச்சு செய்யவும்..."
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400 text-sm"
            />
            <button
              type="submit"
              disabled={!typedInput.trim()}
              className="p-3 rounded-xl bg-jyothi-600 hover:bg-jyothi-700 disabled:opacity-40 text-white font-semibold"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
