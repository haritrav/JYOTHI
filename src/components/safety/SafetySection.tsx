'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  PhoneCall,
  MapPin,
  HeartHandshake,
  Scale,
  Users,
  AlertTriangle,
  Volume2,
  VolumeX,
  Navigation,
  CheckSquare,
  Square,
  Trash2,
  Plus,
  ArrowRight,
  ShieldCheck,
  Lock,
  Heart,
  Phone
} from 'lucide-react';
import {
  SupportCentre,
  TrustedContact,
  SafetyPlan,
  SupportedLanguage
} from '@/types';
import {
  VERIFIED_SUPPORT_CENTRES,
  VERIFIED_COUNSELLING_SERVICES
} from '@/data/verifiedData';
import { UI_TRANSLATIONS } from '@/data/translations';
import { speakText, stopSpeech, playAudioChime } from '@/utils/speech';
import { SafeExitButton } from './SafeExitButton';

interface SafetySectionProps {
  language: SupportedLanguage;
  onQuickExit: () => void;
  onNavigateCounselling: () => void;
}

export const SafetySection: React.FC<SafetySectionProps> = ({
  language,
  onQuickExit,
  onNavigateCounselling
}) => {
  const [safetyMode, setSafetyMode] = useState<'hub' | 'immediate' | 'domestic' | 'dowry' | 'legal' | 'centres' | 'plan'>('hub');
  const [speakingId, setSpeakingId] = useState<string | null>(null);

  const t = UI_TRANSLATIONS[language];

  // Safety Plan Local State
  const [trustedContacts, setTrustedContacts] = useState<TrustedContact[]>([
    { id: '1', name: 'அக்கா கவிதா (Sister)', relationship: 'சகோதரி (Sister)', phoneNumber: '9842100000', notifyOnEmergency: true }
  ]);
  const [newContactName, setNewContactName] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [safePlace, setSafePlace] = useState('பெற்றோர் வீடு அல்லது தோழி வீடு (Parents house)');
  const [checklist, setChecklist] = useState([
    { item: 'ஆதார் மற்றும் குடும்ப அட்டை (Aadhaar & Ration card)', packed: true },
    { item: 'வங்கி கணக்குப் புத்தகம் (Bank passbook)', packed: true },
    { item: 'குழந்தைகளின் பிறப்புச் சான்றிதழ் (Birth certificates)', packed: false },
    { item: 'அவசரப் பணம் & செல்போன் சார்ஜர் (Cash & Charger)', packed: true },
    { item: 'அவசர மருந்துகள் (Medicines)', packed: false }
  ]);
  const [showAddContact, setShowAddContact] = useState(false);

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

  const handleToggleChecklist = (index: number) => {
    playAudioChime('pop');
    const updated = [...checklist];
    updated[index].packed = !updated[index].packed;
    setChecklist(updated);
  };

  const handleAddContact = () => {
    if (!newContactName || !newContactPhone) return;
    playAudioChime('success');
    setTrustedContacts([
      ...trustedContacts,
      {
        id: Date.now().toString(),
        name: newContactName,
        relationship: 'நம்பகமான நபர்',
        phoneNumber: newContactPhone,
        notifyOnEmergency: true
      }
    ]);
    setNewContactName('');
    setNewContactPhone('');
    setShowAddContact(false);
  };

  const handleDeletePlan = () => {
    if (confirm('உங்கள் பாதுகாப்புத் திட்டத்தை அழிக்க விரும்புகிறீர்களா? (Delete plan?)')) {
      setTrustedContacts([]);
      setSafePlace('');
      setChecklist(checklist.map(c => ({ ...c, packed: false })));
      playAudioChime('pop');
    }
  };

  return (
    <div className="space-y-4 p-4 pb-28 max-w-md mx-auto">
      {/* Top Banner with Quick Exit & Safe Header */}
      <div className="flex items-center justify-between pb-1 border-b border-rose-100">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-2xl bg-rose-100 text-rose-700">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 leading-tight">
              {t.safetyTitle}
            </h1>
            <p className="text-[11px] text-rose-700 font-bold">
              24/7 இலவச அவசர உதவி மற்றும் ரகசிய ஆதரவு
            </p>
          </div>
        </div>

        <SafeExitButton language={language} onQuickExit={onQuickExit} variant="compact" />
      </div>

      {/* Immediate Danger Top Red Action Button */}
      {safetyMode !== 'immediate' && (
        <button
          onClick={() => {
            playAudioChime('alert');
            setSafetyMode('immediate');
          }}
          className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-extrabold text-base py-4 px-5 rounded-3xl shadow-xl flex items-center justify-between border-2 border-red-400 active:scale-95 transition-transform"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white text-red-600 flex items-center justify-center font-black animate-pulse">
              🚨
            </div>
            <div className="text-left">
              <span className="block text-base leading-tight font-black">{t.iAmInDanger}</span>
              <span className="text-[11px] text-red-100 font-normal">உடனடி 112 / 181 உதவிக்கு இங்கே தொடவும்</span>
            </div>
          </div>
          <ArrowRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* MODE 1: IMMEDIATE DANGER SCREEN */}
      {safetyMode === 'immediate' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-200">
          <div className="bg-red-50 border-2 border-red-500 rounded-3xl p-5 text-center space-y-2">
            <div className="w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center mx-auto text-2xl animate-bounce">
              🚨
            </div>
            <h2 className="text-lg font-black text-red-950">
              அவசர உதவி அழைப்புகள் (Emergency Contacts)
            </h2>
            <p className="text-xs text-red-800 font-medium">
              கீழே உள்ள எண்களைத் தொட்டு நேரடியாக அழைக்கலாம்.
            </p>
          </div>

          {/* Big Call 112 Button */}
          <a
            href="tel:112"
            className="w-full py-4 px-5 bg-red-600 hover:bg-red-700 text-white rounded-3xl shadow-lg flex items-center justify-between border-2 border-red-400 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-white text-red-600 rounded-full flex items-center justify-center">
                <PhoneCall className="w-6 h-6 animate-pulse" />
              </div>
              <div className="text-left">
                <span className="text-xl font-black block leading-none">112 அவசர உதவி</span>
                <span className="text-xs text-red-100 font-medium">காவல்துறை, தீயணைப்பு, ஆம்புலன்ஸ்</span>
              </div>
            </div>
            <span className="text-xs font-black bg-white text-red-600 px-3 py-1.5 rounded-full uppercase">
              CALL 112
            </span>
          </a>

          {/* Call 181 Women Helpline */}
          <a
            href="tel:181"
            className="w-full py-4 px-5 bg-purple-900 hover:bg-purple-950 text-white rounded-3xl shadow-lg flex items-center justify-between border-2 border-purple-400 active:scale-95 transition-all"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 bg-amber-400 text-slate-950 rounded-full flex items-center justify-center">
                <PhoneCall className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="text-xl font-black block leading-none">181 மகளிர் உதவி எண்</span>
                <span className="text-xs text-purple-200 font-medium">24 மணி நேர பெண்கள் பாதுகாப்பு</span>
              </div>
            </div>
            <span className="text-xs font-black bg-amber-400 text-slate-950 px-3 py-1.5 rounded-full uppercase">
              CALL 181
            </span>
          </a>

          {/* Child Helpline 1098 if child involved */}
          <a
            href="tel:1098"
            className="w-full py-3.5 px-5 bg-indigo-900 text-white rounded-2xl shadow-md flex items-center justify-between border border-indigo-400 active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center">
                <Phone className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="text-base font-bold block">1098 குழந்தைகள் உதவி எண்</span>
                <span className="text-[11px] text-indigo-200">குழந்தைகள் பாதுகாப்பு மற்றும் பராமரிப்பு</span>
              </div>
            </div>
            <span className="text-xs font-bold bg-white text-indigo-900 px-2.5 py-1 rounded-full">
              CALL 1098
            </span>
          </a>

          {/* Trusted Contact Dial */}
          {trustedContacts.length > 0 && (
            <div className="bg-emerald-50 border border-emerald-300 rounded-3xl p-4 space-y-2">
              <span className="text-xs font-bold text-emerald-950 block">
                👤 உங்கள் நம்பகமான நபர்:
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-sm text-slate-900">{trustedContacts[0].name}</h4>
                  <span className="text-xs text-slate-600">{trustedContacts[0].phoneNumber}</span>
                </div>
                <a
                  href={`tel:${trustedContacts[0].phoneNumber}`}
                  className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>அழைக்கவும்</span>
                </a>
              </div>
            </div>
          )}

          {/* Back button */}
          <button
            onClick={() => setSafetyMode('hub')}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
          >
            ← பாதுகாப்பு முகப்பிற்குத் திரும்பு (Back to Safety Hub)
          </button>
        </div>
      )}

      {/* MODE 2: MAIN SAFETY HUB CATEGORY TILES */}
      {safetyMode === 'hub' && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Domestic Violence Tile */}
            <button
              onClick={() => {
                playAudioChime('pop');
                setSafetyMode('domestic');
              }}
              className="p-4 rounded-3xl bg-white border border-rose-100 shadow-sm hover:shadow-md text-left space-y-2 transition-all active:scale-95"
            >
              <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  {t.domesticViolenceHelp}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  குடும்ப வன்முறைக்கு எதிரான ரகசிய உதவி
                </p>
              </div>
            </button>

            {/* Dowry Harassment Tile */}
            <button
              onClick={() => {
                playAudioChime('pop');
                setSafetyMode('dowry');
              }}
              className="p-4 rounded-3xl bg-white border border-purple-100 shadow-sm hover:shadow-md text-left space-y-2 transition-all active:scale-95"
            >
              <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  {t.dowryHelp}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  வரதட்சணை மிரட்டல் & சட்ட தீர்வுகள்
                </p>
              </div>
            </button>

            {/* One Stop Centres Tile */}
            <button
              onClick={() => {
                playAudioChime('pop');
                setSafetyMode('centres');
              }}
              className="p-4 rounded-3xl bg-white border border-indigo-100 shadow-sm hover:shadow-md text-left space-y-2 transition-all active:scale-95"
            >
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  {t.findSupportCentre}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  சகி ஆதரவு மையங்கள் & தங்குமிடம்
                </p>
              </div>
            </button>

            {/* Legal Rights Tile */}
            <button
              onClick={() => {
                playAudioChime('pop');
                setSafetyMode('legal');
              }}
              className="p-4 rounded-3xl bg-white border border-amber-100 shadow-sm hover:shadow-md text-left space-y-2 transition-all active:scale-95"
            >
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <Scale className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-900">
                  {t.legalRightsTitle}
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  இலவச சட்ட உதவி மற்றும் உரிமைகள்
                </p>
              </div>
            </button>
          </div>

          {/* My Safety Plan Trigger Card */}
          <button
            onClick={() => {
              playAudioChime('pop');
              setSafetyMode('plan');
            }}
            className="w-full bg-gradient-to-r from-purple-900 to-indigo-900 text-white p-5 rounded-3xl shadow-md flex items-center justify-between active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/15 rounded-2xl">
                <ShieldCheck className="w-6 h-6 text-amber-300" />
              </div>
              <div className="text-left">
                <h3 className="font-extrabold text-base">{t.safetyPlanTitle}</h3>
                <p className="text-xs text-purple-200">
                  நம்பகமான நபர், பாதுகாப்பான இடம் மற்றும் அவசர ஆவணங்கள்
                </p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-amber-300" />
          </button>

          {/* Tele-MANAS Counselling Card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Heart className="w-5 h-5 text-emerald-700" />
                <h3 className="font-black text-sm text-emerald-950">
                  Tele-MANAS இலவச 24/7 மனநல உதவி
                </h3>
              </div>
              <span className="text-[10px] font-black bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                24x7 TOLL FREE
              </span>
            </div>

            <p className="text-xs text-emerald-900 leading-relaxed">
              பயம், பதற்றம் அல்லது தூக்கமின்மை உள்ளதா? பெண் ஆலோசகரிடம் பேச 14416 அழையுங்கள்.
            </p>

            <div className="flex gap-2">
              <a
                href="tel:14416"
                className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-sm"
              >
                <PhoneCall className="w-4 h-4 text-amber-300" />
                <span>14416 அழைக்க</span>
              </a>

              <button
                onClick={onNavigateCounselling}
                className="py-3 px-4 bg-white border border-emerald-300 text-emerald-900 font-bold text-xs rounded-2xl hover:bg-emerald-100"
              >
                இலவச ஆலோசனை பதிவு
              </button>
            </div>
          </div>

          {/* Privacy Reassurance Banner */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-600 flex items-start gap-2.5">
            <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              {t.safetyConfidentialityNotice}
            </p>
          </div>
        </div>
      )}

      {/* MODE 3: DOMESTIC VIOLENCE / DOWRY HARASSMENT GUIDED SUPPORT */}
      {(safetyMode === 'domestic' || safetyMode === 'dowry') && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-purple-50 p-4 rounded-3xl border border-purple-200 space-y-2">
            <h2 className="font-extrabold text-base text-purple-950">
              {safetyMode === 'domestic' ? t.domesticViolenceHelp : t.dowryHelp}
            </h2>
            <p className="text-xs text-purple-900 leading-relaxed">
              நீங்கள் எதையும் கட்டாயப்படுத்தி விவரிக்க வேண்டிய அவசியமில்லை. உங்கள் பாதுகாப்பிற்கான வழிகளை நாங்கள் உங்களுக்குக் காட்டுகிறோம்.
            </p>
          </div>

          {/* Gentle Options */}
          <div className="space-y-2">
            <a
              href="tel:181"
              className="w-full p-4 rounded-2xl bg-white border-2 border-purple-300 text-purple-900 font-extrabold text-sm flex items-center justify-between shadow-xs hover:bg-purple-50"
            >
              <div className="flex items-center gap-3">
                <PhoneCall className="w-5 h-5 text-purple-700" />
                <span>மகளிர் உதவி எண் 181-ஐ அழைக்கவும்</span>
              </div>
              <ArrowRight className="w-4 h-4 text-purple-500" />
            </a>

            <button
              onClick={() => setSafetyMode('centres')}
              className="w-full p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-between shadow-xs hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <span>அருகிலுள்ள சகி ஆதரவு மையம் (One Stop Centre) விவரம்</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => setSafetyMode('legal')}
              className="w-full p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-between shadow-xs hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <Scale className="w-5 h-5 text-amber-700" />
                <span>இலவச அரசு வழக்கறிஞர் மற்றும் சட்ட உரிமைகள்</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={onNavigateCounselling}
              className="w-full p-4 rounded-2xl bg-white border border-slate-200 text-slate-800 font-bold text-xs flex items-center justify-between shadow-xs hover:bg-slate-50"
            >
              <div className="flex items-center gap-3">
                <Heart className="w-5 h-5 text-emerald-600" />
                <span>பெண் ஆலோசகருடன் மன அமைதி ஆலோசனை</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <button
            onClick={() => setSafetyMode('hub')}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
          >
            ← பாதுகாப்பு முகப்பிற்குத் திரும்பு
          </button>
        </div>
      )}

      {/* MODE 4: ONE STOP CENTRES (SAKHI) LIST */}
      {safetyMode === 'centres' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-base text-slate-900">
                {t.findSupportCentre}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                அரசு அங்கீகரிக்கப்பட்ட 24x7 சகி மையங்கள்
              </p>
            </div>
          </div>

          {VERIFIED_SUPPORT_CENTRES.map((centre) => {
            const isSpeaking = speakingId === centre.id;
            const speechText = `${centre.name[language]}. முகவரி: ${centre.address[language]}. தொலைவு: ${centre.distanceKm}. தொலைபேசி எண்: ${centre.phoneNumber}. சேவைகள்: ${centre.services[language].join(', ')}.`;

            return (
              <div
                key={centre.id}
                className="bg-white rounded-3xl p-5 border border-purple-200 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      OPEN 24x7 • VERIFIED
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 mt-1 leading-snug">
                      {centre.name[language]}
                    </h3>
                  </div>

                  <button
                    onClick={() => handleSpeak(centre.id, speechText)}
                    className={`p-2.5 rounded-full shadow-xs shrink-0 ${
                      isSpeaking ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                    }`}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                <div className="text-xs text-slate-700 flex items-start gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-100">
                  <MapPin className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">{centre.address[language]}</span>
                    <span className="text-[11px] text-purple-700 font-bold">தொலைவு: {centre.distanceKm}</span>
                  </div>
                </div>

                {/* Services */}
                <div className="space-y-1 text-xs">
                  <span className="font-bold text-slate-500 block text-[11px]">வழங்கப்படும் இலவச சேவைகள்:</span>
                  <div className="space-y-1">
                    {centre.services[language].map((srv, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-slate-700">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{srv}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions: Call & Directions */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  <a
                    href={`tel:${centre.phoneNumber}`}
                    className="py-2.5 px-3 bg-purple-900 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-amber-300" />
                    <span>நேரடி அழைப்பு</span>
                  </a>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(centre.name[language])}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5"
                  >
                    <Navigation className="w-3.5 h-3.5 text-purple-700" />
                    <span>{t.getDirections}</span>
                  </a>
                </div>
              </div>
            );
          })}

          <button
            onClick={() => setSafetyMode('hub')}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
          >
            ← பாதுகாப்பு முகப்பிற்குத் திரும்பு
          </button>
        </div>
      )}

      {/* MODE 5: LEGAL RIGHTS INFO */}
      {safetyMode === 'legal' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="bg-amber-50 p-4 rounded-3xl border border-amber-200 space-y-2">
            <h2 className="font-extrabold text-base text-amber-950">
              {t.legalRightsTitle}
            </h2>
            <p className="text-xs text-amber-900 leading-relaxed">
              சட்டப்படி பெண்களுக்கு இலவச அரசு வழக்கறிஞர் மற்றும் இடைக்கால பாதுகாப்பு உத்தரவு பெற முழு உரிமை உண்டு.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
              <h3 className="font-extrabold text-sm text-slate-900">
                1. பாதுகாப்பு உத்தரவு (Protection Order - DV Act 2005)
              </h3>
              <p className="text-slate-600 leading-relaxed">
                கணவர் அல்லது புகுந்த வீட்டினர் உங்களை அணுகவோ, மிரட்டவோ, அடிக்கவோ கூடாது என நீதிமன்றம் மூலம் உடனடியாக உத்தரவு பெறலாம்.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
              <h3 className="font-extrabold text-sm text-slate-900">
                2. வசிப்பிட உரிமை (Right to Residence)
              </h3>
              <p className="text-slate-600 leading-relaxed">
                உங்களை வாழும் வீட்டில் இருந்து யாரும் வெளியேற்ற முடியாது. நீங்கள் தொடர்ந்து அதே வீட்டில் வசிக்க உரிமை உண்டு.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
              <h3 className="font-extrabold text-sm text-slate-900">
                3. மாதாந்திர ஜீவனாம்சம் & குழந்தைகள் பராமரிப்பு (Maintenance)
              </h3>
              <p className="text-slate-600 leading-relaxed">
                உங்களின் உணவு, உடை, மருத்துவ செலவுகள் மற்றும் குழந்தைகளின் கல்விக்கு மாதாந்திர பராமரிப்பு தொகை பெறலாம்.
              </p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1">
              <h3 className="font-extrabold text-sm text-slate-900">
                4. 100% இலவச அரசு வழக்கறிஞர் (Legal Aid)
              </h3>
              <p className="text-slate-600 leading-relaxed">
                வழக்கறிஞர் கட்டணம் செலுத்த முடியாத பெண்களுக்கு சட்டப் பணிகள் ஆணைக்குழு (DLSA) மூலம் அரசு செலவில் இலவச வழக்கறிஞர் நியமிக்கப்படுவார். Toll-Free: 15100.
              </p>
            </div>
          </div>

          <button
            onClick={() => setSafetyMode('hub')}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
          >
            ← பாதுகாப்பு முகப்பிற்குத் திரும்பு
          </button>
        </div>
      )}

      {/* MODE 6: MY SAFETY PLAN */}
      {safetyMode === 'plan' && (
        <div className="space-y-4 animate-in fade-in duration-150">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-extrabold text-base text-slate-900">
                {t.safetyPlanTitle}
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                அவசர காலத்தில் நீங்கள் பாதுகாப்பாக இருக்க உதவும் தனிப்பட்ட திட்டம்
              </p>
            </div>

            <button
              onClick={handleDeletePlan}
              className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 border border-rose-200 text-xs font-bold flex items-center gap-1"
              title="Delete Plan"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>அழி</span>
            </button>
          </div>

          {/* Trusted Contacts Manager */}
          <div className="bg-white rounded-3xl p-4 border border-purple-100 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider">
                1. நம்பகமான நபர்கள் (Trusted Contacts):
              </h3>
              <button
                onClick={() => setShowAddContact(!showAddContact)}
                className="text-xs text-purple-700 font-bold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>சேர்</span>
              </button>
            </div>

            {showAddContact && (
              <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200 space-y-2 text-xs">
                <input
                  type="text"
                  placeholder="நபர் பெயர் (உதா: அக்கா)"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  className="w-full p-2.5 bg-white border border-purple-200 rounded-xl font-bold"
                />
                <input
                  type="tel"
                  placeholder="மொபைல் எண்"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                  className="w-full p-2.5 bg-white border border-purple-200 rounded-xl font-bold"
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleAddContact}
                    className="flex-1 py-2 bg-purple-700 text-white font-bold rounded-xl"
                  >
                    சேமி
                  </button>
                  <button
                    onClick={() => setShowAddContact(false)}
                    className="py-2 px-3 bg-slate-200 text-slate-700 font-bold rounded-xl"
                  >
                    ரத்து
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {trustedContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{contact.name}</span>
                    <span className="text-slate-500">{contact.phoneNumber}</span>
                  </div>
                  <a
                    href={`tel:${contact.phoneNumber}`}
                    className="p-2 rounded-xl bg-purple-100 text-purple-800 hover:bg-purple-200"
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Safe Place */}
          <div className="bg-white rounded-3xl p-4 border border-purple-100 shadow-sm space-y-2 text-xs">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
              2. அவசர அடைக்கல இடம் (Safe Place):
            </h3>
            <input
              type="text"
              value={safePlace}
              onChange={(e) => setSafePlace(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
            />
          </div>

          {/* Emergency Bag Document Checklist */}
          <div className="bg-white rounded-3xl p-4 border border-purple-100 shadow-sm space-y-2 text-xs">
            <h3 className="font-extrabold text-slate-900 uppercase tracking-wider text-[11px]">
              3. அவசர ஆவணங்கள் பை பட்டியல் (Emergency Checklist):
            </h3>
            <div className="space-y-1.5">
              {checklist.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleToggleChecklist(idx)}
                  className={`w-full p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                    item.packed ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}
                >
                  {item.packed ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span>{item.item}</span>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => setSafetyMode('hub')}
            className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
          >
            ← பாதுகாப்பு முகப்பிற்குத் திரும்பு
          </button>
        </div>
      )}
    </div>
  );
};
