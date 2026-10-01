'use client';

import React, { useState } from 'react';
import { useSafety } from '@/contexts/SafetyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { TrustedContact } from '@/types';
import { UserCheck, Phone, HeartHandshake, Trash2, CheckCircle2, MessageSquare } from 'lucide-react';
import { AudioButton } from '../common/AudioButton';

export const TrustedContactManager: React.FC = () => {
  const { trustedContact, setTrustedContact } = useSafety();
  const { t } = useLanguage();

  const [isEditing, setIsEditing] = useState(!trustedContact);
  const [name, setName] = useState(trustedContact?.name || '');
  const [phone, setPhone] = useState(trustedContact?.phone || '');
  const [relationship, setRelationship] = useState(trustedContact?.relationship || 'தாய் / சகோதரி / தோழி');

  const handleSave = () => {
    if (!name.trim() || !phone.trim()) return;
    const contact: TrustedContact = {
      name,
      phone,
      relationship,
    };
    setTrustedContact(contact);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setTrustedContact(null);
    setName('');
    setPhone('');
    setIsEditing(true);
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 md:p-6 border border-warm-200 dark:border-slate-700 shadow-md">
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-pink-600" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            {t('trustedContact')} (Trusted Contact)
          </h3>
        </div>
        <AudioButton
          textToRead="நம்பிக்கையான நபர். அவசர காலத்தில் நீங்கள் தொடர்பு கொள்ள வேண்டிய ஒருவரின் எண்ணை இங்கு சேமித்து வைக்கலாம்."
          size="sm"
        />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
        அவசர காலத்தில் நீங்கள் நம்பி அழைக்கக்கூடிய தாய், சகோதரி அல்லது தோழியின் எண்ணை இங்கு சேமிக்கலாம்.
      </p>

      {trustedContact && !isEditing ? (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs text-emerald-800 dark:text-emerald-300 font-semibold">
                உறவின் முறை: {trustedContact.relationship}
              </span>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {trustedContact.name}
              </h4>
              <p className="text-sm font-mono font-bold text-emerald-700 dark:text-emerald-400 mt-1">
                {trustedContact.phone}
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-warm-200 text-xs font-bold text-slate-700 dark:text-slate-200"
              >
                மாற்றுக
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-xl bg-red-100 dark:bg-red-950 text-red-600"
                title="நீக்க"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-emerald-200 dark:border-emerald-800/60">
            <a
              href={`tel:${trustedContact.phone}`}
              className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>உடனே அழைக்க</span>
            </a>
            <a
              href={`sms:${trustedContact.phone}?body=அவசரம்! எனக்கு உதவி தேவைப்படுகிறது. தயவுசெய்து என்னை உடனே அழைக்கவும்.`}
              className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-800 border border-emerald-300 text-emerald-800 dark:text-emerald-300 font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>அவசர எஸ்.எம்.எஸ்</span>
            </a>
          </div>
        </div>
      ) : (
        /* Add / Edit Form */
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              நம்பிக்கையான நபரின் பெயர்
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="எ.கா: அக்கா / தோழி ரேவதி"
              className="w-full p-3 rounded-xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              மொபைல் எண்
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="எ.கா: 9842100000"
              className="w-full p-3 rounded-xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              உறவின் முறை
            </label>
            <input
              type="text"
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              placeholder="எ.கா: தாய் / சகோதரி / தோழி"
              className="w-full p-3 rounded-xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm font-medium"
            />
          </div>

          <div className="flex gap-2 pt-2">
            {trustedContact && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="py-3 px-4 rounded-xl border border-warm-300 dark:border-slate-700 text-xs font-bold text-slate-600"
              >
                ரத்து
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              disabled={!name.trim() || !phone.trim()}
              className="flex-1 py-3 px-4 rounded-xl bg-jyothi-700 hover:bg-jyothi-800 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-md transition active:scale-95"
            >
              சேமிக்கவும் / Save Contact
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
