'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { SupportedLanguage } from '@/types';
import { X, HeartHandshake, Phone, CheckCircle2, ShieldCheck, Sparkles, Clock, Calendar } from 'lucide-react';
import { SpeechService } from '@/lib/speech';

interface CounsellingBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (requestId: string) => void;
}

export const CounsellingBookingModal: React.FC<CounsellingBookingModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { language, setLanguage } = useLanguage();

  const [name, setName] = useState('');
  const [prefLang, setPrefLang] = useState<SupportedLanguage>(language);
  const [ageRange, setAgeRange] = useState('18-35');
  const [contactPref, setContactPref] = useState<'phone' | 'in-person'>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [timeSlot, setTimeSlot] = useState('காலை 10:00 - மதியம் 01:00');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/counselling/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          preferredLanguage: prefLang,
          ageRange,
          contactPreference: contactPref,
          phoneNumber,
          preferredTimeSlot: timeSlot,
          optionalNotes: notes,
        }),
      });

      const data = await res.json();
      if (data.requestId) {
        onSuccess(data.requestId);
        onClose();
        SpeechService.speak(
          'உங்கள் ஆலோசனைக் கோரிக்கை ரகசியமாகப் பதிவு செய்யப்பட்டது. பெண் ஆலோசகர் குறிப்பிட்ட நேரத்தில் தொடர்பு கொள்வார்.',
          language
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-warm-50 dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-warm-200 dark:border-slate-800 animate-slide-up flex flex-col justify-between max-h-[90vh] overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-warm-200 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  இலவச மனநல ஆலோசனை பதிவு
                </h3>
                <p className="text-xs text-slate-500">100% Confidential Support</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-warm-200 dark:hover:bg-slate-800 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Confidentiality Guarantee */}
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40 text-xs text-emerald-950 dark:text-emerald-200 flex items-start gap-2 mb-4 leading-relaxed">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              உங்கள் விவரங்கள் முற்றிலும் ரகசியமாக வைக்கப்படும். நீங்கள் எந்த தனிப்பட்ட பிரச்சனைகளையும் கட்டாயமாக விளக்க வேண்டியதில்லை.
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                உங்கள் பெயர் / புனைப்பெயர்
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="எ.கா: முத்துலட்சுமி (அல்லது விருப்பமான பெயர்)"
                className="w-full p-3 rounded-xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  பேச விரும்பும் மொழி
                </label>
                <select
                  value={prefLang}
                  onChange={(e) => setPrefLang(e.target.value as any)}
                  className="w-full p-3 rounded-xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="ml">മലയാളം (Malayalam)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  வயது வரம்பு
                </label>
                <select
                  value={ageRange}
                  onChange={(e) => setAgeRange(e.target.value)}
                  className="w-full p-3 rounded-xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
                >
                  <option value="18-25">18 - 25 ஆண்டுகள்</option>
                  <option value="26-35">26 - 35 ஆண்டுகள்</option>
                  <option value="36-50">36 - 50 ஆண்டுகள்</option>
                  <option value="50+">50 ஆண்டுகளுக்கு மேல்</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                தொடர்பு எண் (தொலைபேசி ஆலோசனைக் கோரினால்)
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="எ.கா: 9842100000"
                className="w-full p-3 rounded-xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                பேசுவதற்கு வசதியான நேரம்
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full p-3 rounded-xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold"
              >
                <option value="காலை 10:00 - மதியம் 01:00">காலை 10:00 - மதியம் 01:00</option>
                <option value="மதியம் 02:00 - மாலை 05:00">மதியம் 02:00 - மாலை 05:00</option>
                <option value="மாலை 05:00 - இரவு 08:00">மாலை 05:00 - இரவு 08:00</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                கூடுதல் குறிப்பு (விருப்பப்பட்டால் மட்டும்)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="மன அழுத்தம், பயம் அல்லது ஆலோசனை தேவை..."
                className="w-full p-3 rounded-xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !name.trim()}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-95 mt-4"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isSubmitting ? 'பதிவாகிறது...' : 'ஆலோசனைக்கு பதிவு செய்க'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
