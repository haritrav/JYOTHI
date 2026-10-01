'use client';

import React, { useState } from 'react';
import {
  CreditCard,
  Building2,
  Phone,
  Camera,
  Layers,
  HelpCircle,
  Volume2,
  VolumeX,
  CheckCircle2,
  X
} from 'lucide-react';
import { SupportedLanguage } from '@/types';
import { UI_TRANSLATIONS } from '@/data/translations';
import { speakText, stopSpeech } from '@/utils/speech';

interface DocumentAssistanceProps {
  language: SupportedLanguage;
  onClose?: () => void;
  isModal?: boolean;
}

export const DocumentAssistance: React.FC<DocumentAssistanceProps> = ({
  language,
  onClose,
  isModal = false
}) => {
  const [activeDocId, setActiveDocId] = useState<string>('aadhaar');
  const [isSpeaking, setIsSpeaking] = useState(false);

  const t = UI_TRANSLATIONS[language];

  const documents = [
    {
      id: 'aadhaar',
      name: t.docAadhaar,
      icon: <CreditCard className="w-6 h-6 text-purple-700" />,
      what: 'இந்திய அரசின் 12 இலக்க தனித்துவ அடையாள அட்டை (Aadhaar).',
      why: 'உங்கள் பெயர், பிறந்த தேதி, முகவரி மற்றும் பயோமெட்ரிக் சரிபார்ப்பிற்கு.',
      where: 'உங்கள் வீட்டில் உள்ள அசல் அட்டை அல்லது அருகில் உள்ள இ-சேவை மையம் / தபால் நிலையம்.',
      tips: 'ஆதாருடன் உங்கள் தற்போதைய மொபைல் எண் இணைக்கப்பட்டுள்ளதா என சரிபார்க்கவும்.'
    },
    {
      id: 'bank',
      name: t.docBank,
      icon: <Building2 className="w-6 h-6 text-emerald-700" />,
      what: 'பெண்ணின் பெயரில் உள்ள தேசிய மயமாக்கப்பட்ட அல்லது கூட்டுறவு வங்கி கணக்குப் புத்தகம்.',
      why: 'அரசு மாதாந்திர நிதி உதவித்தொகை அல்லது மகப்பேறு நலத்தொகை நேரடியாக உங்கள் கணக்கில் வரவு வைக்கப்பட.',
      where: 'உங்கள் வங்கிக் கிளை அல்லது தபால் நிலைய சேமிப்புக் கணக்கு (IPPB).',
      tips: 'கணக்கு அட்டை ஆதார் மற்றும் NPCI உடன் இணைக்கப்பட்டிருக்க (Aadhaar Seeding) வேண்டும்.'
    },
    {
      id: 'ration',
      name: t.docRation,
      icon: <Layers className="w-6 h-6 text-amber-700" />,
      what: 'மின்னணு ஸ்மார்ட் குடும்ப அட்டை (Smart Ration Card).',
      why: 'குடும்ப உறுப்பினர்களின் எண்ணிக்கை மற்றும் குடும்பத் தலைவி என்பதை உறுதி செய்ய.',
      where: 'உங்கள் வீட்டில் உள்ள அசல் குடும்ப அட்டை அல்லது TNePDS செயலி.',
      tips: 'குடும்பத் தலைவியாக பெண்ணின் பெயர் மற்றும் புகைப்படம் உள்ளதை உறுதி செய்யவும்.'
    },
    {
      id: 'photo',
      name: t.docPhoto,
      icon: <Camera className="w-6 h-6 text-indigo-700" />,
      what: 'சமீபத்தில் எடுக்கப்பட்ட பாஸ்போர்ட் அளவு வண்ணப் புகைப்படம் (Passport Photo).',
      why: 'விண்ணப்ப படிவம் மற்றும் நலத்திட்ட அடையாள அட்டையில் ஒட்டுவதற்காக.',
      where: 'கிராமத்து போட்டோ ஸ்டுடியோ அல்லது இ-சேவை மையத்தில் உடனடியாக எடுக்கலாம்.',
      tips: 'வெள்ளை அல்லது வெளிர் பின்னணியில் தெளிவான புகைப்படம் நல்லது.'
    },
    {
      id: 'phone',
      name: t.docPhone,
      icon: <Phone className="w-6 h-6 text-rose-700" />,
      what: 'தற்போது செயல்பாட்டில் உள்ள உங்கள் குடும்பத்து செல்போன் எண்.',
      why: 'விண்ணப்ப பதிவு எண், ஒப்புதல் நிலை மற்றும் பணம் வரவு வைக்கப்பட்ட விவரங்களை SMS மூலம் பெற.',
      where: 'நீங்கள் எப்போதும் வைத்திருக்கும் மொபைல் சிம் கார்டு எண்.',
      tips: 'முக்கிய OTP செய்திகளைப் பெற மொபைலில் ரீசார்ஜ் இருப்பதை உறுதி செய்யவும்.'
    }
  ];

  const currentDoc = documents.find(d => d.id === activeDocId) || documents[0];

  const handleSpeakDoc = () => {
    if (isSpeaking) {
      stopSpeech();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${currentDoc.name}. ${t.whatIsThis}: ${currentDoc.what}. ${t.whyDoINeedIt}: ${currentDoc.why}. ${t.whereCanIFind}: ${currentDoc.where}`;
    setIsSpeaking(true);
    speakText(
      textToRead,
      language,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  return (
    <div className={`space-y-4 ${isModal ? 'p-4 max-h-[85vh] overflow-y-auto' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-700" />
            <span>தேவையான ஆவணங்கள் வழிகாட்டி</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            ஒவ்வொரு ஆவணத்தின் விளக்கம் மற்றும் எங்கு பெறுவது என்பதைக் கேளுங்கள்
          </p>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        )}
      </div>

      {/* Document Selector Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {documents.map((doc) => {
          const isSelected = activeDocId === doc.id;
          return (
            <button
              key={doc.id}
              onClick={() => {
                stopSpeech();
                setIsSpeaking(false);
                setActiveDocId(doc.id);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 flex items-center gap-2 border transition-all active:scale-95 ${
                isSelected
                  ? 'bg-purple-800 text-white border-purple-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{doc.icon}</span>
              <span>{doc.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Document Details Card */}
      <div className="bg-gradient-to-br from-purple-50 via-indigo-50/50 to-white rounded-3xl p-5 border border-purple-100 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-xs border border-purple-100">
              {currentDoc.icon}
            </div>
            <div>
              <h3 className="font-extrabold text-base text-slate-900">
                {currentDoc.name}
              </h3>
              <span className="text-[11px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                அவசிய ஆவணம் (Essential Document)
              </span>
            </div>
          </div>

          <button
            onClick={handleSpeakDoc}
            className={`p-2.5 rounded-full shadow-sm active:scale-95 transition-all ${
              isSpeaking
                ? 'bg-rose-600 text-white animate-pulse'
                : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
            }`}
            title="Read Document Info"
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* 3 Clear Sections */}
        <div className="space-y-3 pt-2 text-xs">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-2xs">
            <span className="font-extrabold text-purple-900 block">
              1. {t.whatIsThis}
            </span>
            <p className="text-slate-700 leading-relaxed">{currentDoc.what}</p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-2xs">
            <span className="font-extrabold text-emerald-900 block">
              2. {t.whyDoINeedIt}
            </span>
            <p className="text-slate-700 leading-relaxed">{currentDoc.why}</p>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-100 space-y-1 shadow-2xs">
            <span className="font-extrabold text-indigo-900 block">
              3. {t.whereCanIFind}
            </span>
            <p className="text-slate-700 leading-relaxed">{currentDoc.where}</p>
          </div>
        </div>

        {/* Helpful Tip */}
        <div className="flex items-start gap-2 bg-amber-50 text-amber-900 p-3 rounded-2xl border border-amber-200 text-xs">
          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <p className="leading-tight font-medium">{currentDoc.tips}</p>
        </div>
      </div>
    </div>
  );
};
