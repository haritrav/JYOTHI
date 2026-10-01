import { SupportedLanguage } from '@/types';

// Speech synthesis helper
export class SpeechService {
  private static isSpeaking = false;
  private static currentUtterance: SpeechSynthesisUtterance | null = null;
  private static listeners: Set<(speaking: boolean) => void> = new Set();

  public static subscribe(listener: (speaking: boolean) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private static notify(speaking: boolean) {
    this.isSpeaking = speaking;
    this.listeners.forEach((l) => l(speaking));
  }

  public static speak(
    text: string,
    lang: SupportedLanguage,
    onEnd?: () => void,
    rate: number = 0.9,
    pitch: number = 1.05
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      console.warn('SpeechSynthesis is not supported in this browser.');
      onEnd?.();
      return;
    }

    this.stop();

    // Clean text of markdown / symbols for clean reading
    const cleanText = text
      .replace(/[#*_`~[\]()]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) {
      onEnd?.();
      return;
    }

    const langCodeMap: Record<SupportedLanguage, string> = {
      ta: 'ta-IN',
      hi: 'hi-IN',
      te: 'te-IN',
      ml: 'ml-IN',
    };

    const targetLangCode = langCodeMap[lang] || 'hi-IN';
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = targetLangCode;
    utterance.rate = rate; // slightly slower for high clarity to rural women
    utterance.pitch = pitch; // gentle, reassuring tone

    const voices = window.speechSynthesis.getVoices();
    // Try to find a female or matching regional voice
    const matchedVoice = voices.find(
      (v) => v.lang.toLowerCase().startsWith(targetLangCode.toLowerCase()) || v.lang.includes(lang)
    );
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    utterance.onstart = () => {
      this.notify(true);
    };

    utterance.onend = () => {
      this.notify(false);
      this.currentUtterance = null;
      onEnd?.();
    };

    utterance.onerror = (e) => {
      console.warn('Speech synthesis error:', e);
      this.notify(false);
      this.currentUtterance = null;
      onEnd?.();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public static stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.notify(false);
    this.currentUtterance = null;
  }

  public static getSpeaking(): boolean {
    return this.isSpeaking;
  }
}

// Browser Web Speech Recognition Interface
export interface SpeechRecognitionResultItem {
  transcript: string;
  confidence: number;
}

export interface SpeechRecognitionHookOptions {
  lang: SupportedLanguage;
  onResult: (transcript: string, isFinal: boolean) => void;
  onError?: (error: string) => void;
  onEnd?: () => void;
}

export function createSpeechRecognizer(options: SpeechRecognitionHookOptions) {
  if (typeof window === 'undefined') return null;

  const SpeechRecognition =
    (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).SpeechRecognition ||
    (window as unknown as { SpeechRecognition?: any; webkitSpeechRecognition?: any }).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    options.onError?.('Speech recognition is not supported in this browser.');
    return null;
  }

  const langCodeMap: Record<SupportedLanguage, string> = {
    ta: 'ta-IN',
    hi: 'hi-IN',
    te: 'te-IN',
    ml: 'ml-IN',
  };

  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = langCodeMap[options.lang] || 'hi-IN';

  recognition.onresult = (event: any) => {
    let interim = '';
    let final = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript;
      } else {
        interim += event.results[i][0].transcript;
      }
    }

    if (final) {
      options.onResult(final, true);
    } else if (interim) {
      options.onResult(interim, false);
    }
  };

  recognition.onerror = (event: any) => {
    options.onError?.(event.error || 'Microphone recognition error');
  };

  recognition.onend = () => {
    options.onEnd?.();
  };

  return recognition;
}
