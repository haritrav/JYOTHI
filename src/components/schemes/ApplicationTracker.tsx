'use client';

import React, { useState, useEffect } from 'react';
import { UserApplication } from '@/types';
import { useLanguage } from '@/contexts/LanguageContext';
import { ClipboardList, CheckCircle, Clock, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react';
import { AudioButton } from '../common/AudioButton';

export const ApplicationTracker: React.FC = () => {
  const { language, t } = useLanguage();
  const [applications, setApplications] = useState<UserApplication[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/applications');
      const data = await res.json();
      if (data.data) {
        setApplications(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-jyothi-700 dark:text-jyothi-400" />
          <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100">
            {t('catApplications')}
          </h2>
        </div>
        <button
          onClick={fetchApps}
          className="p-2 rounded-full hover:bg-warm-100 dark:hover:bg-slate-800 text-slate-600 transition"
          title="புதுப்பிக்க / Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {applications.length === 0 ? (
        <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-8 text-center border border-warm-200 dark:border-slate-700 shadow-sm">
          <p className="text-sm text-slate-500">
            விண்ணப்பங்கள் எதுவும் தற்போது இல்லை. திட்டங்கள் பிரிவில் சென்று புதிய திட்டத்திற்கு விண்ணப்பிக்கலாம்.
          </p>
        </div>
      ) : (
        applications.map((app) => {
          const statusText = app.statusDetails[language] || app.statusDetails.ta;
          const nextAct = app.nextAction[language] || app.nextAction.ta;
          const fullAudio = `விண்ணப்ப எண்: ${app.id}. திட்டம்: ${app.schemeName}. தற்போதைய நிலை: ${statusText}. அடுத்த கட்ட நடவடிக்கை: ${nextAct}`;

          return (
            <div
              key={app.id}
              className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 md:p-6 border border-warm-200 dark:border-slate-700 shadow-md"
            >
              {/* Top info */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <div>
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                    ID: {app.id}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mt-1.5">
                    {app.schemeName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    விண்ணப்பதாரர்: {app.applicantName} • {app.submissionDate}
                  </p>
                </div>
                <AudioButton textToRead={fullAudio} size="sm" />
              </div>

              {/* Status Badge */}
              <div className="my-3 p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 flex items-start gap-2.5">
                <Clock className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 block">
                    தற்போதைய நிலை (Current Status):
                  </span>
                  <p className="text-xs md:text-sm text-indigo-950 dark:text-indigo-200 mt-0.5 leading-relaxed">
                    {statusText}
                  </p>
                </div>
              </div>

              {/* Progress Timeline Tracker */}
              {app.timeline && (
                <div className="my-4 space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    முன்னேற்ற நிலைகள் / Timeline:
                  </span>
                  <div className="space-y-2">
                    {app.timeline.map((step, idx) => {
                      const stepTitle = step.step[language] || step.step.ta;
                      return (
                        <div key={idx} className="flex items-start gap-2.5 text-xs">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                              step.done
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
                            }`}
                          >
                            {step.done ? <CheckCircle className="w-3.5 h-3.5" /> : <span className="w-2 h-2 rounded-full bg-slate-400" />}
                          </div>
                          <div className="flex-1">
                            <span className={`font-semibold ${step.done ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400'}`}>
                              {stepTitle}
                            </span>
                            <span className="text-[10px] text-slate-400 block">{step.date}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Next Action Advice */}
              <div className="p-3 rounded-xl bg-warm-100 dark:bg-slate-900/60 border border-warm-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                <span className="font-bold text-jyothi-800 dark:text-jyothi-300">அடுத்த நடவடிக்கை: </span>
                <span>{nextAct}</span>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};
