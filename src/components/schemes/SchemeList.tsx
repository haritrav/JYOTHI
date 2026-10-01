'use client';

import React, { useState } from 'react';
import { Scheme } from '@/types';
import { VERIFIED_SCHEMES } from '@/data/verifiedSchemes';
import { useLanguage } from '@/contexts/LanguageContext';
import { Landmark, Search, Filter, Sparkles, CheckCircle2 } from 'lucide-react';
import { SchemeCard } from './SchemeCard';
import { ConversationalFormModal } from './ConversationalFormModal';

export const SchemeList: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeApplyingScheme, setActiveApplyingScheme] = useState<Scheme | null>(null);
  const [submittedAppId, setSubmittedAppId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'அனைத்து திட்டங்கள் / All' },
    { id: 'maternity', label: '👶 மகப்பேறு & தாய்மை' },
    { id: 'women', label: '🛡️ பெண்கள் நலம் & கேஸ்' },
    { id: 'education', label: '🎓 பெண் குழந்தைகள் கல்வி' },
    { id: 'employment', label: '⛏️ 100 நாள் ஊரக வேலை' },
  ];

  const filteredSchemes = VERIFIED_SCHEMES.filter((s) => {
    const matchesCat = selectedCategory === 'all' || s.category === selectedCategory;
    const title = (s.title[language] || s.title.ta).toLowerCase();
    const benefit = (s.benefitSummary[language] || s.benefitSummary.ta).toLowerCase();
    const matchesSearch = !searchQuery.trim() || title.includes(searchQuery.toLowerCase()) || benefit.includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Title Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-2xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-400 flex items-center justify-center">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
              {t('catGovt')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              சரிபார்க்கப்பட்ட அதிகாரப்பூர்வ அரசு திட்டங்கள்
            </p>
          </div>
        </div>
      </div>

      {/* Success Banner if user submitted recently */}
      {submittedAppId && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-950 dark:text-emerald-200 flex items-start gap-3 animate-slide-up shadow-sm">
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs md:text-sm">
            <span className="font-bold block">
              விண்ணப்பம் வெற்றிகரமாகப் பதிவு செய்யப்பட்டது! (ID: {submittedAppId})
            </span>
            <p className="mt-0.5 text-slate-600 dark:text-slate-300">
              உங்கள் விண்ணப்பத்தின் முன்னேற்ற நிலையை "எனது விண்ணப்பங்கள்" பகுதியில் எப்போதும் பார்க்கலாம்.
            </p>
          </div>
          <button
            onClick={() => setSubmittedAppId(null)}
            className="text-xs text-emerald-700 font-bold hover:underline"
          >
            சரி
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="திட்டத்தின் பெயர் அல்லது நன்மையை தேடுங்கள்..."
          className="w-full pl-10 pr-4 py-3 rounded-2xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-jyothi-500 shadow-sm"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-3.5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition active:scale-95 ${
              selectedCategory === c.id
                ? 'bg-jyothi-700 text-white shadow-md'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-warm-200 dark:border-slate-700 hover:bg-warm-100'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Schemes Grid */}
      <div className="space-y-4">
        {filteredSchemes.map((scheme) => (
          <SchemeCard
            key={scheme.id}
            scheme={scheme}
            onStartApplication={(s) => setActiveApplyingScheme(s)}
          />
        ))}
      </div>

      {/* Conversational Guided Form Modal */}
      {activeApplyingScheme && (
        <ConversationalFormModal
          isOpen={!!activeApplyingScheme}
          scheme={activeApplyingScheme}
          onClose={() => setActiveApplyingScheme(null)}
          onSuccessSubmission={(id) => {
            setSubmittedAppId(id);
            setActiveApplyingScheme(null);
          }}
        />
      )}
    </div>
  );
};
