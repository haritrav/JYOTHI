'use client';

import React from 'react';
import { X, Bell, Zap, ShoppingBag, Heart, Shield, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { AudioButton } from './AudioButton';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (cat: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onSelectCategory,
}) => {
  const { language, t } = useLanguage();

  if (!isOpen) return null;

  const notifications = [
    {
      id: 'notif-1',
      category: 'electricity',
      icon: Zap,
      iconColor: 'text-amber-500 bg-amber-100 dark:bg-amber-950/60',
      title: {
        ta: 'மின்சார பராமரிப்பு அறிவிப்பு (வாடிப்பட்டி)',
        hi: 'बिजली कटौती सूचना (वाडीपट्टी)',
        te: 'విద్యుత్ కోత సమాచారం (వాడిపట్టి)',
        ml: 'വൈദ്യുതി മുടക്ക വിവരം (വാടിപ്പട്ടി)',
      },
      body: {
        ta: 'அக்டோபர் 05 அன்று காலை 9 மணி முதல் மாலை 4 மணி வரை மின் விநியோகம் நிறுத்தப்படும்.',
        hi: '05 अक्टूबर को सुबह 9 से शाम 4 बजे तक बिजली आपूर्ति बाधित रहेगी।',
        te: 'అక్టోబర్ 05 న ఉదయం 9 నుండి సాయంత్రం 4 వరకు విద్యుత్ సరఫరా ఉండదు.',
        ml: 'ഒക്ടോബർ 05 ന് രാവിലെ 9 മുതൽ വൈകിട്ട് 4 വരെ വൈദ്യുതി മുടങ്ങും.',
      },
      time: 'இன்று / Today',
      categoryKey: 'updates',
    },
    {
      id: 'notif-2',
      category: 'health',
      icon: Heart,
      iconColor: 'text-pink-600 bg-pink-100 dark:bg-pink-950/60',
      title: {
        ta: 'இலவச மகளிர் சிறப்பு நல்வாழ்வு முகாம்',
        hi: 'निःशुल्क महिला स्वास्थ्य शिविर',
        te: 'ఉచిత మహిళా ప్రత్యేక ఆరోగ్య శిబిరం',
        ml: 'സൗജന്യ വനിതാ ആരോഗ്യ ക്യാമ്പ്',
      },
      body: {
        ta: 'அக்டோபர் 08 அன்று ஆரம்ப சுகாதார நிலையத்தில் இரத்த சோகை பரிசோதனை நடைபெறும்.',
        hi: '08 अक्टूबर को प्राथमिक स्वास्थ्य केंद्र में एनीमिया जांच की जाएगी।',
        te: 'అక్టోబర్ 08 న ప్రాథమిక ఆరోగ్య కేంద్రంలో రక్తహీనత పరీక్షలు ఉంటాయి.',
        ml: 'ഒക്ടോബർ 08 ന് പ്രാഥമികാരോഗ്യ കേന്ദ്രത്തിൽ രക്തപരിശോധന ഉണ്ടായിരിക്കും.',
      },
      time: 'நேற்று / Yesterday',
      categoryKey: 'health',
    },
    {
      id: 'notif-3',
      category: 'neutral_support',
      icon: Shield,
      iconColor: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-950/60',
      title: {
        ta: 'புதிய ஆதரவு தகவல் (Support Update)',
        hi: 'नई सहायता सूचना (Support Update)',
        te: 'కొత్త సహాయ సమాచారం (Support Update)',
        ml: 'പുതിയ സഹായ വിവരം (Support Update)',
      },
      body: {
        ta: 'உங்கள் பகுதியில் உள்ள ஒன் ஸ்டாப் சேவை மையம் (Sakhi) 24 மணி நேரமும் செயல்படுகிறது.',
        hi: 'आपके क्षेत्र का सखी वन स्टॉप सेंटर 24 घंटे सातों दिन उपलब्ध है।',
        te: 'మీ ప్రాంతంలోని సఖి వన్ స్టాప్ సెంటర్ 24 గంటలు అందుబాటులో ఉంది.',
        ml: 'നിങ്ങളുടെ പ്രദേശത്തെ സഖി വൺ സ്റ്റോപ്പ് സെന്റർ 24 മണിക്കൂറും പ്രവർത്തിക്കുന്നു.',
      },
      time: '2 நாட்களுக்கு முன் / 2d ago',
      categoryKey: 'safety',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-warm-50 dark:bg-slate-900 h-full p-5 shadow-2xl flex flex-col justify-between overflow-y-auto border-l border-warm-200 dark:border-slate-800 animate-slide-up">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-warm-200 dark:border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-jyothi-100 dark:bg-jyothi-950/60 text-jyothi-700 dark:text-jyothi-400 flex items-center justify-center">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">
                முக்கிய அறிவிப்புகள்
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-warm-200 dark:hover:bg-slate-800 text-slate-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Privacy Notice Banner */}
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400 mb-4">
            🔒 {t('safeNotificationNotice')}
          </div>

          {/* List of Notifications */}
          <div className="space-y-3">
            {notifications.map((n) => {
              const IconComp = n.icon;
              const title = n.title[language] || n.title.ta;
              const body = n.body[language] || n.body.ta;

              return (
                <div
                  key={n.id}
                  onClick={() => {
                    if (onSelectCategory) onSelectCategory(n.categoryKey);
                    onClose();
                  }}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-warm-200 dark:border-slate-700 hover:border-jyothi-400 transition cursor-pointer shadow-sm active:scale-98"
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${n.iconColor}`}>
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{title}</h4>
                        <span className="text-[10px] text-slate-400 font-medium">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">{body}</p>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-warm-100 dark:border-slate-700/50">
                        <span className="text-xs font-semibold text-jyothi-700 dark:text-jyothi-400">
                          விவரம் பார்க்க →
                        </span>
                        <AudioButton textToRead={`${title}. ${body}`} size="sm" variant="subtle" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 rounded-xl bg-warm-200 dark:bg-slate-800 hover:bg-warm-300 text-slate-800 dark:text-slate-200 font-bold text-sm"
        >
          மூடுக / Close
        </button>
      </div>
    </div>
  );
};
