'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  SupportedLanguage,
  TextSize,
  UserLocation,
  ApplicationRecord,
  AppNotification,
  CounsellingRequest
} from '@/types';
import { UI_TRANSLATIONS } from '@/data/translations';
import {
  INITIAL_APPLICATIONS,
  INITIAL_NOTIFICATIONS
} from '@/data/verifiedData';
import { useVoiceCompanion } from '@/hooks/useVoiceCompanion';
import { speakText, stopSpeech, playAudioChime } from '@/utils/speech';

// Components
import { Header } from '@/components/layout/Header';
import { BottomNav, TabType } from '@/components/layout/BottomNav';
import { LanguageSelector } from '@/components/common/LanguageSelector';
import { LocationSelector } from '@/components/common/LocationSelector';
import { HomeDashboard } from '@/components/home/HomeDashboard';
import { SchemeFinder } from '@/components/schemes/SchemeFinder';
import { MyApplications } from '@/components/schemes/MyApplications';
import { LocalUpdatesHub } from '@/components/updates/LocalUpdatesHub';
import { HealthSection } from '@/components/health/HealthSection';
import { SafetySection } from '@/components/safety/SafetySection';
import { CounsellingSection } from '@/components/counselling/CounsellingSection';
import { VoiceCompanionModal } from '@/components/voice/VoiceCompanionModal';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { AdminDashboard } from '@/components/admin/AdminDashboard';
import { NeutralWeatherView } from '@/components/safety/SafeExitButton';

export default function JyothiApp() {
  // Navigation & Onboarding States
  const [onboardingStep, setOnboardingStep] = useState<'language' | 'location' | 'main' | 'neutral_exit'>('language');
  const [language, setLanguage] = useState<SupportedLanguage>('ta');
  const [textSize, setTextSize] = useState<TextSize>('normal');
  const [isHighContrast, setIsHighContrast] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Location State
  const [location, setLocation] = useState<UserLocation>({
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    block: 'Pollachi',
    village: 'Zamin Uthukuli'
  });
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Overlays & Modals
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Dynamic Data Stores
  const [applications, setApplications] = useState<ApplicationRecord[]>(INITIAL_APPLICATIONS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [counsellingRequests, setCounsellingRequests] = useState<CounsellingRequest[]>([]);

  // Voice Companion Hook
  const voice = useVoiceCompanion(language, location.village);

  const t = UI_TRANSLATIONS[language];

  // Language Change handler with auto speech adjustment
  const handleLanguageChange = (newLang: SupportedLanguage) => {
    setLanguage(newLang);
    // Adjust default location if switching states
    if (newLang === 'hi' && location.state === 'Tamil Nadu') {
      setLocation({ state: 'Uttar Pradesh', district: 'Varanasi', block: 'Pindra', village: 'Mangari' });
    } else if (newLang === 'te' && location.state === 'Tamil Nadu') {
      setLocation({ state: 'Telangana', district: 'Warangal', block: 'Geesugonda', village: 'Dharmaram' });
    } else if (newLang === 'ml' && location.state === 'Tamil Nadu') {
      setLocation({ state: 'Kerala', district: 'Palakkad', block: 'Chittur', village: 'Nallepilly' });
    } else if (newLang === 'ta' && location.state !== 'Tamil Nadu') {
      setLocation({ state: 'Tamil Nadu', district: 'Coimbatore', block: 'Pollachi', village: 'Zamin Uthukuli' });
    }
  };

  // Quick Exit Safe Trigger
  const handleQuickExit = () => {
    voice.stopSpeaking();
    stopSpeech();
    setOnboardingStep('neutral_exit');
    setIsVoiceModalOpen(false);
    setIsNotificationsOpen(false);
    setIsAdminOpen(false);
  };

  // Return from Neutral Screen
  const handleReturnFromNeutral = () => {
    setOnboardingStep('main');
    setActiveTab('home');
  };

  // Global "Read This Page" TTS
  const handleReadCurrentPage = () => {
    voice.stopSpeaking();
    let textToRead = '';

    if (activeTab === 'home') {
      textToRead = `வணக்கம். நீங்கள் முகப்பு பக்கத்தில் உள்ளீர்கள். அரசு நலத்திட்டங்கள், மின்சார அறிவிப்பு, ரேஷன் கடை இருப்பு, 100 நாள் வேலை, மருத்துவ முகாம்கள் மற்றும் பெண்கள் பாதுகாப்பு சேவைகளை நீங்கள் இங்கு பார்க்கலாம். உதவி பெற மைக் பொத்தானை அழுத்தவும்.`;
    } else if (activeTab === 'schemes') {
      textToRead = `அரசு நலத்திட்டங்கள் பக்கம். கலைஞர் மகளிர் உரிமைத் திட்டம் மாதம் ஆயிரம் ரூபாய், பிரதான் மந்திரி மாத்ரு வந்தனா யோஜனா கர்ப்பிணி உதவி ஐந்தாயிரம் ரூபாய், மற்றும் உஜ்வாலா இலவச கேஸ் திட்டம் உள்ளன. தகுதி சரிபார்க்க திட்டத்தைத் தொடவும்.`;
    } else if (activeTab === 'updates') {
      textToRead = `உள்ளூர் தகவல்கள் பக்கம். உங்கள் பகுதிக்கான திட்டமிடப்பட்ட மின் தடை நேரம், ரேஷன் கடையில் அரிசி சர்க்கரை இருப்பு நிலை மற்றும் நூறு நாள் வேலை அறிவிப்புகள் உள்ளன.`;
    } else if (activeTab === 'health') {
      textToRead = `மருத்துவ முகாம்கள் பக்கம். ஞாயிற்றுக்கிழமை ஆரம்ப சுகாதார நிலையத்தில் இலவச மகளிர் சிறப்பு பரிசோதனை முகாம், கண் சிகிச்சை முகாம் மற்றும் புதன்கிழமை குழந்தை தடுப்பூசி முகாம் நடைபெறுகிறது.`;
    } else if (activeTab === 'safety') {
      textToRead = `பெண்கள் பாதுகாப்பு மற்றும் அவசர உதவி பக்கம். அவசர உதவிக்கு 112 மற்றும் 181 மகளிர் உதவி எண்ணை அழைக்கலாம். அருகிலுள்ள சகி ஆதரவு மையம் மற்றும் இலவச சட்ட உதவிகள் உள்ளன.`;
    } else if (activeTab === 'counselling') {
      textToRead = `மனநல ஆலோசனை பக்கம். Tele-MANAS இலவச 24 மணி நேர உதவி எண் 14416 அல்லது எங்கள் பெண் ஆலோசகருடன் பேச இலவசமாக பதிவு செய்யலாம்.`;
    } else if (activeTab === 'applications') {
      textToRead = `என் விண்ணப்பங்கள் பக்கம். உங்கள் பதிவு செய்யப்பட்ட திட்டங்களின் நிலை மற்றும் அடுத்த கட்ட விவரங்கள் இங்கு காட்டப்படுகின்றன.`;
    }

    voice.speak(textToRead);
  };

  // New Application Added
  const handleApplicationCreated = (newApp: ApplicationRecord) => {
    setApplications([newApp, ...applications]);
    setActiveTab('applications');
  };

  // New Counselling Request Added
  const handleCounsellingRequestSubmitted = (req: CounsellingRequest) => {
    setCounsellingRequests([req, ...counsellingRequests]);
    // Add safe masked notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      category: 'support_sensitive',
      type: 'safety_support',
      title: {
        ta: 'ஆலோசனை பதிவு உறுதி செய்யப்பட்டது',
        hi: 'परामर्श अनुरोध पुष्टि',
        te: 'కౌన్సెలింగ్ అభ్యర్థన నిర్ధారణ',
        ml: 'കൗൺസിലിംഗ് രജിസ്ട്രേഷൻ സ്ഥിരീകരിച്ചു'
      },
      safePreviewTitle: {
        ta: '💚 உங்களுக்கு ஒரு புதிய உதவித் தகவல் வந்துள்ளது',
        hi: '💚 आपके लिए एक नया सहायता संदेश है',
        te: '💚 మీకు ఒక కొత్త సహాయ సమాచారం వచ్చింది',
        ml: '💚 നിങ്ങൾക്ക് ഒരു പുതിയ സപ്പോർട്ട് സന്ദേശം ലഭിച്ചിട്ടുണ്ട്'
      },
      message: {
        ta: `உங்கள் ஆலோசனை எண் ${req.id} பெறப்பட்டது. பெண் ஆலோசகர் குறிப்பிட்ட நேரத்தில் அழைப்பார்.`,
        hi: `अनुरोध संख्या ${req.id} दर्ज हो गया है।`,
        te: `మీ అభ్యర్థన ${req.id} నమోదు చేయబడింది.`,
        ml: `അപേക്ഷ ${req.id} രേഖപ്പെടുത്തി.`
      },
      isSensitive: true,
      date: 'இப்போது (Just now)',
      isRead: false
    };
    setNotifications([newNotif, ...notifications]);
  };

  const unreadNotifCount = notifications.filter(n => !n.isRead).length;

  const handleMarkNotificationRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Text size class mapping
  const textSizeClass = textSize === 'large' ? 'text-scale-large' : textSize === 'xlarge' ? 'text-scale-xlarge' : 'text-scale-normal';

  // 1. NEUTRAL SAFE QUICK EXIT VIEW
  if (onboardingStep === 'neutral_exit') {
    return <NeutralWeatherView language={language} onReturn={handleReturnFromNeutral} />;
  }

  // 2. FIRST-TIME LANGUAGE ONBOARDING SCREEN
  if (onboardingStep === 'language') {
    return (
      <LanguageSelector
        selectedLanguage={language}
        onSelectLanguage={handleLanguageChange}
        onProceed={() => setOnboardingStep('location')}
        isInitialOnboarding={true}
      />
    );
  }

  // 3. FIRST-TIME LOCATION ONBOARDING SCREEN
  if (onboardingStep === 'location') {
    return (
      <LocationSelector
        language={language}
        currentLocation={location}
        onSaveLocation={(loc) => {
          setLocation(loc);
          setOnboardingStep('main');
        }}
        onSkip={() => setOnboardingStep('main')}
      />
    );
  }

  // 4. MAIN APP VIEWPORT
  return (
    <div className={`min-h-screen flex flex-col bg-slate-100 ${textSizeClass} ${isHighContrast ? 'high-contrast-mode' : ''}`}>
      
      {/* Mobile-First Centered Container */}
      <div className="w-full max-w-md mx-auto min-h-screen flex flex-col bg-[#FDFBF7] shadow-2xl relative border-x border-slate-200">
        
        {/* Sticky Header */}
        <Header
          language={language}
          onLanguageChange={handleLanguageChange}
          textSize={textSize}
          onTextSizeChange={setTextSize}
          isHighContrast={isHighContrast}
          onHighContrastToggle={() => setIsHighContrast(!isHighContrast)}
          isSpeaking={voice.isSpeaking}
          onReadPage={handleReadCurrentPage}
          onStopSpeech={voice.stopSpeaking}
          unreadCount={unreadNotifCount}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
          onQuickExit={handleQuickExit}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* Main Tab Content Stage */}
        <main className="flex-1 overflow-x-hidden">
          {activeTab === 'home' && (
            <HomeDashboard
              language={language}
              location={location}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
              onNavigateTab={(tab) => {
                if (tab === 'schemes' || tab === 'updates' || tab === 'health' || tab === 'safety' || tab === 'counselling' || tab === 'applications') {
                  setActiveTab(tab as TabType);
                }
              }}
              onChangeLocation={() => setShowLocationModal(true)}
              onQuickExit={handleQuickExit}
            />
          )}

          {activeTab === 'schemes' && (
            <SchemeFinder
              language={language}
              userVillage={location.village}
              userDistrict={location.district}
              userState={location.state}
              onApplicationCreated={handleApplicationCreated}
            />
          )}

          {activeTab === 'updates' && (
            <LocalUpdatesHub
              language={language}
              userVillage={location.village}
              userDistrict={location.district}
            />
          )}

          {activeTab === 'health' && (
            <HealthSection
              language={language}
              userVillage={location.village}
              userDistrict={location.district}
            />
          )}

          {activeTab === 'safety' && (
            <SafetySection
              language={language}
              onQuickExit={handleQuickExit}
              onNavigateCounselling={() => setActiveTab('counselling')}
            />
          )}

          {activeTab === 'counselling' && (
            <CounsellingSection
              language={language}
              onRequestSubmitted={handleCounsellingRequestSubmitted}
            />
          )}

          {activeTab === 'applications' && (
            <MyApplications
              applications={applications}
              language={language}
              onExploreMore={() => setActiveTab('schemes')}
            />
          )}
        </main>

        {/* Persistent Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
          language={language}
          isHighContrast={isHighContrast}
        />

        {/* Voice Assistant Modal */}
        <VoiceCompanionModal
          isOpen={isVoiceModalOpen}
          onClose={() => {
            setIsVoiceModalOpen(false);
            voice.stopSpeaking();
          }}
          language={language}
          isListening={voice.isListening}
          isSpeaking={voice.isSpeaking}
          isProcessing={voice.isProcessing}
          transcript={voice.transcript}
          lastResponse={voice.lastAIResponse}
          speechError={voice.speechError}
          onStartListening={voice.startListening}
          onStopListening={voice.stopListening}
          onSpeak={voice.speak}
          onStopSpeaking={voice.stopSpeaking}
          onProcessQuery={voice.processQuery}
          onNavigateTab={(tab) => {
            if (tab === 'schemes' || tab === 'updates' || tab === 'health' || tab === 'safety' || tab === 'counselling' || tab === 'applications') {
              setActiveTab(tab as TabType);
            }
          }}
        />

        {/* Notification Center Drawer */}
        {isNotificationsOpen && (
          <NotificationCenter
            notifications={notifications}
            language={language}
            onClose={() => setIsNotificationsOpen(false)}
            onMarkRead={handleMarkNotificationRead}
          />
        )}

        {/* Location Change Modal */}
        {showLocationModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
            <div className="bg-white text-slate-900 w-full max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl p-4 max-h-[90vh] overflow-y-auto">
              <LocationSelector
                language={language}
                currentLocation={location}
                onSaveLocation={(loc) => {
                  setLocation(loc);
                  setShowLocationModal(false);
                }}
                onSkip={() => setShowLocationModal(false)}
                isModal={true}
              />
            </div>
          </div>
        )}

        {/* Admin Dashboard Portal */}
        {isAdminOpen && (
          <AdminDashboard
            language={language}
            onClose={() => setIsAdminOpen(false)}
            counsellingRequests={counsellingRequests}
          />
        )}

      </div>
    </div>
  );
}
