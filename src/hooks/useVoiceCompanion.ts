import { useState, useEffect, useCallback, useRef } from 'react';
import { SupportedLanguage } from '@/types';
import { speakText, stopSpeech, playAudioChime } from '@/utils/speech';
import { AIResponse, processAIQuery } from '@/utils/aiCompanion';

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
      isFinal: boolean;
    };
    length: number;
  };
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
  }
}

export function useVoiceCompanion(language: SupportedLanguage, village?: string) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastAIResponse, setLastAIResponse] = useState<AIResponse | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const langCodeMap: Record<SupportedLanguage, string> = {
    ta: 'ta-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    ml: 'ml-IN'
  };

  // Speak helper
  const speak = useCallback(
    (text: string, customLang?: SupportedLanguage) => {
      const activeLang = customLang || language;
      stopSpeech();
      setIsSpeaking(true);
      speakText(
        text,
        activeLang,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false),
        () => setIsSpeaking(false)
      );
    },
    [language]
  );

  const stopSpeaking = useCallback(() => {
    stopSpeech();
    setIsSpeaking(false);
  }, []);

  // Process a text or speech query
  const processQuery = useCallback(
    async (queryText: string): Promise<AIResponse> => {
      if (!queryText.trim()) {
        const fallback = processAIQuery('help', language, village);
        setLastAIResponse(fallback);
        return fallback;
      }

      setIsProcessing(true);
      setSpeechError(null);

      try {
        const res = await fetch('/api/ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query: queryText,
            language,
            village
          })
        });

        if (res.ok) {
          const data: AIResponse = await res.json();
          setLastAIResponse(data);
          setIsProcessing(false);
          playAudioChime('success');
          // Speak AI response automatically
          speak(data.audioSpeechText);
          return data;
        }
      } catch (err) {
        console.warn('API route error, using local verified logic:', err);
      }

      // Local fallback
      const localData = processAIQuery(queryText, language, village);
      setLastAIResponse(localData);
      setIsProcessing(false);
      playAudioChime('success');
      speak(localData.audioSpeechText);
      return localData;
    },
    [language, village, speak]
  );

  // Start Voice Recognition
  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRec) {
      setSpeechError('Speech recognition is not supported in this browser. Please type your question.');
      return;
    }

    try {
      stopSpeech();
      setIsSpeaking(false);
      setTranscript('');
      setSpeechError(null);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }

      const recognition = new SpeechRec();
      recognition.lang = langCodeMap[language] || 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);

        if (event.results[event.results.length - 1].isFinal) {
          playAudioChime('mic_stop');
          setIsListening(false);
          processQuery(currentTranscript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setSpeechError('Microphone permission denied. Please allow microphone access.');
        } else if (event.error !== 'no-speech') {
          setSpeechError('Could not hear clearly. Tap mic and try again.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
      setIsListening(true);
      playAudioChime('mic_start');
    } catch (err) {
      console.warn('Failed to start speech recognition:', err);
      setIsListening(false);
    }
  }, [language, processQuery]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }
    setIsListening(false);
    playAudioChime('mic_stop');
  }, []);

  useEffect(() => {
    return () => {
      stopSpeech();
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  return {
    isListening,
    isSpeaking,
    isProcessing,
    transcript,
    lastAIResponse,
    speechError,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
    processQuery,
    setTranscript
  };
}
