'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { TrustedContact, SafetyPlan } from '@/types';
import { SpeechService } from '@/lib/speech';

interface SafetyContextType {
  trustedContact: TrustedContact | null;
  setTrustedContact: (contact: TrustedContact | null) => void;
  safetyPlan: SafetyPlan | null;
  saveSafetyPlan: (plan: SafetyPlan) => void;
  triggerQuickExit: () => void;
  isNeutralMode: boolean;
  exitNeutralMode: () => void;
  showEmergencyModal: boolean;
  setShowEmergencyModal: (show: boolean) => void;
}

const DEFAULT_SAFETY_PLAN: SafetyPlan = {
  trustedContact: {
    name: '',
    phone: '',
    relationship: '',
  },
  safePlaces: [
    'அருகிலுள்ள தாய்வீடு / தோழி இல்லம்',
    'அரசு ஆரம்ப சுகாதார நிலையம் (PHC)',
    'அருகிலுள்ள பெண்கள் நல விடுதி / சகி மையம்',
  ],
  emergencyBagItems: [
    'ஆதார் அட்டை & குடும்ப அட்டை அசல் / நகல்',
    'வங்கி பாஸ்புக் & ஏடிஎம் கார்டு',
    'குழந்தைகளின் பிறப்புச் சான்றிதழ்கள் & மருத்துவக் குறிப்புகள்',
    'அவசர பண சேமிப்பு (ரொக்கம்)',
    'அத்தியாவசிய மாத்திரைகள் & துணிகள்',
  ],
  importantNumbers: [
    { name: 'National Emergency', phone: '112' },
    { name: 'Women Helpline (24/7)', phone: '181' },
    { name: 'Police Women Cell', phone: '1091' },
    { name: 'Tele-MANAS Mental Health', phone: '14416' },
  ],
  lastUpdated: new Date().toISOString(),
};

const SafetyContext = createContext<SafetyContextType | undefined>(undefined);

export function SafetyProvider({ children }: { children: React.ReactNode }) {
  const [trustedContact, setTrustedContactState] = useState<TrustedContact | null>(null);
  const [safetyPlan, setSafetyPlanState] = useState<SafetyPlan | null>(null);
  const [isNeutralMode, setIsNeutralMode] = useState<boolean>(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedContact = localStorage.getItem('jyothi_trusted_contact');
      if (savedContact) {
        setTrustedContactState(JSON.parse(savedContact));
      }

      const savedPlan = localStorage.getItem('jyothi_safety_plan');
      if (savedPlan) {
        setSafetyPlanState(JSON.parse(savedPlan));
      } else {
        setSafetyPlanState(DEFAULT_SAFETY_PLAN);
      }
    } catch (e) {
      console.error('Failed to load safety storage', e);
    }
  }, []);

  const setTrustedContact = (contact: TrustedContact | null) => {
    setTrustedContactState(contact);
    if (contact) {
      localStorage.setItem('jyothi_trusted_contact', JSON.stringify(contact));
    } else {
      localStorage.removeItem('jyothi_trusted_contact');
    }
  };

  const saveSafetyPlan = (plan: SafetyPlan) => {
    setSafetyPlanState(plan);
    localStorage.setItem('jyothi_safety_plan', JSON.stringify(plan));
  };

  const triggerQuickExit = () => {
    // Immediately stop speech/audio
    SpeechService.stop();
    // Close emergency and any active sensitive modal
    setShowEmergencyModal(false);
    // Switch to neutral disguise screen immediately
    setIsNeutralMode(true);
  };

  const exitNeutralMode = () => {
    setIsNeutralMode(false);
  };

  return (
    <SafetyContext.Provider
      value={{
        trustedContact,
        setTrustedContact,
        safetyPlan,
        saveSafetyPlan,
        triggerQuickExit,
        isNeutralMode,
        exitNeutralMode,
        showEmergencyModal,
        setShowEmergencyModal,
      }}
    >
      {children}
    </SafetyContext.Provider>
  );
}

export function useSafety() {
  const context = useContext(SafetyContext);
  if (!context) {
    throw new Error('useSafety must be used within a SafetyProvider');
  }
  return context;
}
