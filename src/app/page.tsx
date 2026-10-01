'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from '@/contexts/LocationContext';
import { useSafety } from '@/contexts/SafetyContext';
import { Header } from '@/components/layout/Header';
import { BottomNav, NavTab } from '@/components/layout/BottomNav';
import { AccessibilityBar } from '@/components/layout/AccessibilityBar';
import { QuickExitBar } from '@/components/layout/QuickExitBar';
import { DisguiseNeutralScreen } from '@/components/layout/DisguiseNeutralScreen';
import { VoiceModal } from '@/components/common/VoiceModal';
import { LanguageSelectorModal } from '@/components/common/LanguageSelectorModal';
import { LocationSelectorModal } from '@/components/common/LocationSelectorModal';
import { AudioButton } from '@/components/common/AudioButton';
import { SchemeList } from '@/components/schemes/SchemeList';
import { LocalUpdatesHub } from '@/components/updates/LocalUpdatesHub';
import { HealthHub } from '@/components/health/HealthHub';
import { SafetyHub } from '@/components/safety/SafetyHub';
import { CounsellingHub } from '@/components/counselling/CounsellingHub';
import { ApplicationTracker } from '@/components/schemes/ApplicationTracker';
import { HelpScreen } from '@/components/help/HelpScreen';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import {
  Mic,
  Landmark,
  Radio,
  HeartPulse,
  Baby,
  ShieldAlert,
  HeartHandshake,
  ClipboardList,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Shield,
  Zap,
  ShoppingBag,
  Pickaxe,
  CheckCircle2
} from 'lucide-react';

export default function Home() {
  const { language, langInfo, t, showLanguageModal, setShowLanguageModal } = useLanguage();
  const { location, showLocationModal, setShowLocationModal } = useLocation();
  const { isNeutralMode, setShowEmergencyModal } = useSafety();

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [showVoiceModal, setShowVoiceModal] = useState<boolean>(false);

  // If Quick Exit disguise mode is activated, immediately render neutral calculator
  if (isNeutralMode) {
    return <DisguiseNeutralScreen />;
  }

  const categoryCards = [
    {
      id: 'schemes',
      title: t('catGovt'),
      desc: t('catGovtDesc'),
      icon: Landmark,
      color: 'bg-indigo-50 dark:bg-indigo-950/50 border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300',
      iconBg: 'bg-indigo-600 text-white',
      badge: '₹5,000 - ₹6,000 வரை',
    },
    {
      id: 'updates',
      title: t('catUpdates'),
      desc: t('catUpdatesDesc'),
      icon: Radio,
      color: 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300',
      iconBg: 'bg-amber-600 text-white',
      badge: 'நேரலை விபரம்',
    },
    {
      id: 'health',
      title: t('catHealth'),
      desc: t('catHealthDesc'),
      icon: HeartPulse,
      color: 'bg-pink-50 dark:bg-pink-950/50 border-pink-200 dark:border-pink-800 text-pink-700 dark:text-pink-300',
      iconBg: 'bg-pink-600 text-white',
      badge: '100% இலவச முகாம்கள்',
    },
    {
      id: 'safety',
      title: t('catSafety'),
      desc: t('catSafetyDesc'),
      icon: ShieldAlert,
      color: 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300',
      iconBg: 'bg-red-600 text-white',
      badge: '24/7 உதவி எண்கள்',
    },
    {
      id: 'counselling',
      title: t('catCounselling'),
      desc: t('catCounsellingDesc'),
      icon: HeartHandshake,
      color: 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300',
      iconBg: 'bg-emerald-600 text-white',
      badge: 'Tele-MANAS 14416',
    },
    {
      id: 'applications',
      title: t('catApplications'),
      desc: 'உங்கள் விண்ணப்பத்தின் நிலையை அறிய',
      icon: ClipboardList,
      color: 'bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300',
      iconBg: 'bg-purple-600 text-white',
      badge: 'நேரலை கண்காணிப்பு',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col pb-24 bg-warm-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* 🚨 Quick Exit Bar at top */}
      <QuickExitBar />

      {/* Accessibility Controls Toolbar (Text Size, High Contrast, Screen Reader) */}
      <AccessibilityBar />

      {/* Header with App Logo, Language Switcher, Location & Notifications */}
      <Header
        onOpenVoice={() => setShowVoiceModal(true)}
        onSelectCategory={(cat) => setActiveTab(cat as NavTab)}
      />

      {/* Main Content Body */}
      <main id="main-content" className="flex-1 max-w-4xl mx-auto w-full px-4 pt-4 pb-8 space-y-6">
        {activeTab === 'home' && (
          <div className="space-y-6 animate-fade-in">
            {/* Greeting Banner */}
            <div className="flex items-center justify-between bg-gradient-to-r from-jyothi-700 via-pink-600 to-indigo-700 rounded-3xl p-5 md:p-6 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-md">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[11px] font-extrabold uppercase tracking-wide">
                    {langInfo.nativeName} ({langInfo.name})
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black leading-tight">
                  {langInfo.welcomeGreeting}
                </h1>
                <p className="text-xs md:text-sm text-pink-100 mt-2 font-medium">
                  {t('welcomeSubtitle')}
                </p>
              </div>

              {/* Audio Listen for Greeting */}
              <div className="relative z-10 shrink-0">
                <AudioButton
                  textToRead={`${langInfo.welcomeGreeting}. ${t('welcomeSubtitle')}`}
                  size="md"
                  variant="floating"
                />
              </div>

              {/* Decorative gentle glow */}
              <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />
            </div>

            {/* 🎙️ MASTER VOICE ACTION CARD ("ASK JYOTHI") — Requirement #6, #7 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border-2 border-jyothi-500/40 shadow-xl text-center flex flex-col items-center justify-center relative overflow-hidden">
              <span className="text-xs font-extrabold text-jyothi-700 dark:text-jyothi-400 uppercase tracking-widest mb-1">
                குரல் வழி துணைவன் / Voice Companion
              </span>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100 mb-4">
                {t('whatHelp')}
              </h2>

              {/* Huge pulsating microphone button */}
              <div className="relative my-2">
                <div className="absolute inset-0 rounded-full bg-jyothi-500/20 animate-ping pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowVoiceModal(true)}
                  className="relative z-10 w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-tr from-jyothi-600 via-pink-600 to-amber-500 text-white shadow-2xl flex flex-col items-center justify-center hover:scale-105 active:scale-95 transition-all ring-8 ring-jyothi-100 dark:ring-jyothi-950/60"
                  aria-label="Start Voice Interaction"
                >
                  <Mic className="w-10 h-10 md:w-12 md:h-12 text-white animate-pulse" />
                  <span className="text-[10px] md:text-xs font-black mt-0.5 tracking-wide">
                    {t('askJyothi')}
                  </span>
                </button>
              </div>

              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-4 max-w-sm">
                மைக்கை அழுத்தி உங்கள் குரலில் பேசலாம் அல்லது தட்டச்சு செய்யலாம்
              </p>

              {/* Tap to ask sample presets */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-4">
                {[
                  '🏛️ அரசு திட்டம்',
                  '⚡ மின்சார வெட்டு',
                  '🌾 ரேஷன் இருப்பு',
                  '🏥 மருத்துவ முகாம்',
                  '⛏️ 100 நாள் வேலை',
                  '🚨 எனக்கு ஆபத்து',
                ].map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setShowVoiceModal(true)}
                    className="px-3 py-1.5 rounded-full bg-warm-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-jyothi-100 dark:hover:bg-slate-700 text-xs font-bold transition active:scale-95"
                  >
                    {sample}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Emergency Help Bar */}
            <div
              onClick={() => setShowEmergencyModal(true)}
              className="p-4 rounded-3xl bg-red-600 hover:bg-red-700 text-white shadow-lg cursor-pointer transition active:scale-98 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm md:text-base">{t('emergencyHelp')}</h3>
                  <p className="text-xs text-red-100">112 காவல்துறை • 181 மகளிர் உதவி எண்</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-amber-300" />
            </div>

            {/* 6 Core Categories Grid */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  முக்கிய பிரிவுகள் / Categories:
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {categoryCards.map((card) => {
                  const IconComp = card.icon;
                  return (
                    <div
                      key={card.id}
                      onClick={() => setActiveTab(card.id as NavTab)}
                      className={`p-5 rounded-3xl border-2 transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-98 flex flex-col justify-between ${card.color}`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${card.iconBg}`}>
                          <IconComp className="w-6 h-6" />
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-white/80 dark:bg-slate-900/80 shadow-xs">
                          {card.badge}
                        </span>
                      </div>

                      <div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-slate-100">
                          {card.title}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {card.desc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/5 dark:border-white/5">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                          திறக்க <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                        <AudioButton textToRead={`${card.title}. ${card.desc}`} size="sm" variant="subtle" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Help & How to Use Card */}
            <div
              onClick={() => setActiveTab('help')}
              className="p-4 rounded-3xl bg-white dark:bg-slate-800/90 border border-warm-200 dark:border-slate-700 shadow-sm flex items-center justify-between cursor-pointer hover:bg-warm-100 dark:hover:bg-slate-700 transition"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <HelpCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{t('catHelp')}</h4>
                  <p className="text-xs text-slate-500">குரல் மற்றும் ஒலி வழிகாட்டுதல்கள்</p>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </div>
          </div>
        )}

        {/* Tab 2: Schemes */}
        {activeTab === 'schemes' && <SchemeList />}

        {/* Tab 3: Local Updates (Electricity, Ration, 100-Day Work) */}
        {activeTab === 'updates' && <LocalUpdatesHub />}

        {/* Tab 4: Health (Camps, Kids & Family Vaccination) */}
        {activeTab === 'health' && <HealthHub />}

        {/* Tab 5: Women's Safety */}
        {activeTab === 'safety' && <SafetyHub />}

        {/* Tab 6: Counselling & Mental Health */}
        {activeTab === 'counselling' && <CounsellingHub />}

        {/* Tab 7: Application Tracking */}
        {activeTab === 'applications' && <ApplicationTracker />}

        {/* Tab 8: Help Screen */}
        {activeTab === 'help' && <HelpScreen />}

        {/* Tab 9: Admin Dashboard */}
        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Floating Center Voice Button for quick tap anywhere */}
      <div className="fixed bottom-20 right-4 z-40">
        <button
          type="button"
          onClick={() => setShowVoiceModal(true)}
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-jyothi-600 to-amber-500 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all ring-4 ring-amber-400/40"
          aria-label="Open Voice Assistant"
          title="ஜோதியிடம் குரல் மூலம் கேளுங்கள் / Ask Jyothi"
        >
          <Mic className="w-7 h-7 animate-pulse" />
        </button>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        onOpenVoice={() => setShowVoiceModal(true)}
      />

      {/* Full-screen Voice Companion Modal */}
      <VoiceModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onNavigateToCategory={(cat) => {
          setActiveTab(cat as NavTab);
          setShowVoiceModal(false);
        }}
      />

      {/* 4-Language Selection Modal */}
      <LanguageSelectorModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />

      {/* State & District Location Modal */}
      <LocationSelectorModal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
      />
    </div>
  );
}
