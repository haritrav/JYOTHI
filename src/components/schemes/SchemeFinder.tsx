'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Search,
  Volume2,
  VolumeX,
  FileCheck,
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Layers,
  HelpCircle,
  Building2,
  BadgePercent
} from 'lucide-react';
import { Scheme, SupportedLanguage, ApplicationRecord } from '@/types';
import { VERIFIED_SCHEMES } from '@/data/verifiedData';
import { UI_TRANSLATIONS } from '@/data/translations';
import { speakText, stopSpeech, playAudioChime } from '@/utils/speech';
import { StepByStepGuide } from './StepByStepGuide';
import { EligibilityWizard } from './EligibilityWizard';
import { ConversationalApplyModal } from './ConversationalApplyModal';
import { DocumentAssistance } from './DocumentAssistance';

interface SchemeFinderProps {
  language: SupportedLanguage;
  userVillage: string;
  userDistrict: string;
  userState: string;
  onApplicationCreated: (app: ApplicationRecord) => void;
}

export const SchemeFinder: React.FC<SchemeFinderProps> = ({
  language,
  userVillage,
  userDistrict,
  userState,
  onApplicationCreated
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeGuideScheme, setActiveGuideScheme] = useState<Scheme | null>(null);
  const [activeEligibilityScheme, setActiveEligibilityScheme] = useState<Scheme | null>(null);
  const [activeApplyScheme, setActiveApplyScheme] = useState<Scheme | null>(null);
  const [showDocumentGuide, setShowDocumentGuide] = useState(false);
  const [speakingSchemeId, setSpeakingSchemeId] = useState<string | null>(null);

  const t = UI_TRANSLATIONS[language];

  const categories = [
    { id: 'all', label: t.filterAll },
    { id: 'financial', label: t.filterFinancial },
    { id: 'maternity', label: t.filterMaternity },
    { id: 'livelihood', label: t.filterLivelihood },
    { id: 'housing', label: t.filterHousing }
  ];

  const filteredSchemes = VERIFIED_SCHEMES.filter((sc) => {
    const matchesCat = activeCategory === 'all' || sc.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      sc.title[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.whoItIsFor[language].toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.mainBenefit[language].toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSpeakScheme = (sc: Scheme) => {
    if (speakingSchemeId === sc.id) {
      stopSpeech();
      setSpeakingSchemeId(null);
      return;
    }

    const textToRead = `${sc.title[language]}. ${t.schemeWhoFor}: ${sc.whoItIsFor[language]}. ${t.schemeMainBenefit}: ${sc.mainBenefit[language]}. ${t.schemeEligibility}: ${sc.eligibilitySummary[language]}`;
    setSpeakingSchemeId(sc.id);
    speakText(
      textToRead,
      language,
      () => setSpeakingSchemeId(sc.id),
      () => setSpeakingSchemeId(null),
      () => setSpeakingSchemeId(null)
    );
  };

  return (
    <div className="space-y-4 p-4 pb-24 max-w-md mx-auto">
      {/* Top Banner */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-700" />
            <span>{t.findSchemeTitle}</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            அனைத்து தகவல்களும் அரசு அதிகாரப்பூர்வ இணையதளங்களில் இருந்து சரிபார்க்கப்பட்டவை
          </p>
        </div>

        <button
          onClick={() => setShowDocumentGuide(true)}
          className="px-3 py-1.5 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold flex items-center gap-1 shrink-0"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>ஆவணங்கள்</span>
        </button>
      </div>

      {/* Search Input Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="திட்டத்தின் பெயர் அல்லது பயனைத் தேடுங்கள்..."
          className="w-full text-xs font-medium pl-10 pr-4 py-3 bg-white rounded-2xl border border-slate-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-purple-600"
        />
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              playAudioChime('pop');
              setActiveCategory(cat.id);
            }}
            className={`px-3.5 py-2 rounded-2xl text-xs font-bold shrink-0 border transition-all active:scale-95 ${
              activeCategory === cat.id
                ? 'bg-purple-800 text-white border-purple-900 shadow-xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Scheme Cards Grid */}
      <div className="space-y-4">
        {filteredSchemes.map((scheme) => {
          const isSpeaking = speakingSchemeId === scheme.id;

          return (
            <div
              key={scheme.id}
              className="bg-white rounded-3xl p-5 border border-purple-100 shadow-sm space-y-3.5 transition-all hover:shadow-md"
            >
              {/* Card Header & Benefit Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
                    {scheme.category}
                  </span>
                  <h3 className="font-extrabold text-base text-slate-900 mt-1 leading-snug">
                    {scheme.title[language]}
                  </h3>
                </div>

                <button
                  onClick={() => handleSpeakScheme(scheme)}
                  className={`p-2.5 rounded-full shadow-xs active:scale-95 transition-all shrink-0 ${
                    isSpeaking
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-amber-400 hover:bg-amber-300 text-slate-950'
                  }`}
                  title="Listen aloud"
                  aria-label={`Listen to ${scheme.title[language]}`}
                >
                  {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Benefit Highlight */}
              {scheme.benefitAmount && (
                <div className="bg-emerald-50 text-emerald-900 font-extrabold text-xs px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1.5">
                  <BadgePercent className="w-4 h-4 text-emerald-700" />
                  <span>உதவித் தொகை: {scheme.benefitAmount}</span>
                </div>
              )}

              {/* Who it is for & Main Benefit */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold text-slate-400 text-[11px] block">
                    {t.schemeWhoFor}:
                  </span>
                  <p className="font-bold text-slate-800 leading-normal">
                    {scheme.whoItIsFor[language]}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 text-[11px] block">
                    {t.schemeMainBenefit}:
                  </span>
                  <p className="text-slate-700 leading-normal">
                    {scheme.mainBenefit[language]}
                  </p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 text-[11px] block">
                    {t.schemeEligibility}:
                  </span>
                  <p className="text-slate-600 text-[11px] leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    {scheme.eligibilitySummary[language]}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => {
                    playAudioChime('pop');
                    setActiveEligibilityScheme(scheme);
                  }}
                  className="py-2.5 px-3 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs border border-amber-300 flex items-center justify-center gap-1.5 active:scale-95 shadow-2xs"
                >
                  <FileCheck className="w-3.5 h-3.5 text-amber-800" />
                  <span>{t.schemeCheckEligibility}</span>
                </button>

                <button
                  onClick={() => {
                    playAudioChime('pop');
                    setActiveGuideScheme(scheme);
                  }}
                  className="py-2.5 px-3 rounded-2xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                >
                  <span>{t.schemeStepByStep}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Source attribution */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[10px] text-slate-400">
                <span className="truncate max-w-[200px]">ஆதாரம்: {scheme.officialSource}</span>
                <span className="shrink-0">{scheme.lastUpdated}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Step by step modal */}
      {activeGuideScheme && (
        <StepByStepGuide
          scheme={activeGuideScheme}
          language={language}
          onClose={() => setActiveGuideScheme(null)}
          onApplyDirect={() => {
            const sc = activeGuideScheme;
            setActiveGuideScheme(null);
            setActiveApplyScheme(sc);
          }}
        />
      )}

      {/* Eligibility questionnaire modal */}
      {activeEligibilityScheme && (
        <EligibilityWizard
          scheme={activeEligibilityScheme}
          language={language}
          onClose={() => setActiveEligibilityScheme(null)}
          onProceedToApply={() => {
            const sc = activeEligibilityScheme;
            setActiveEligibilityScheme(null);
            setActiveApplyScheme(sc);
          }}
        />
      )}

      {/* Conversational Apply modal */}
      {activeApplyScheme && (
        <ConversationalApplyModal
          scheme={activeApplyScheme}
          language={language}
          userVillage={userVillage}
          userDistrict={userDistrict}
          userState={userState}
          onClose={() => setActiveApplyScheme(null)}
          onApplicationCreated={(app) => {
            onApplicationCreated(app);
          }}
        />
      )}

      {/* Document Guide Modal */}
      {showDocumentGuide && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white text-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-4 max-h-[90vh] overflow-y-auto">
            <DocumentAssistance
              language={language}
              onClose={() => setShowDocumentGuide(false)}
              isModal={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};
