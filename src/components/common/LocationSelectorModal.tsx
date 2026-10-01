'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, X, Check, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useLocation } from '@/contexts/LocationContext';
import { UserLocation } from '@/types';

interface LocationSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LocationSelectorModal: React.FC<LocationSelectorModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const { location, setLocation, detectLocation, isDetecting } = useLocation();

  const [state, setState] = useState(location.state || 'Tamil Nadu');
  const [district, setDistrict] = useState(location.district || 'Madurai');
  const [block, setBlock] = useState(location.block || 'Vadipatti');
  const [village, setVillage] = useState(location.village || 'Vadipatti Town');

  if (!isOpen) return null;

  const handleSave = () => {
    const updated: UserLocation = {
      state,
      district,
      block,
      village,
    };
    setLocation(updated);
    onClose();
  };

  const states = ['Tamil Nadu', 'Bihar', 'Andhra Pradesh', 'Telangana', 'Kerala', 'Uttar Pradesh'];
  const districts: Record<string, string[]> = {
    'Tamil Nadu': ['Madurai', 'Dindigul', 'Theni', 'Virudhunagar', 'Chennai', 'Salem', 'Tiruchirappalli'],
    'Bihar': ['Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga'],
    'Andhra Pradesh': ['Guntur', 'Krishna', 'Visakhapatnam', 'Chittoor', 'Kurnool'],
    'Telangana': ['Hyderabad', 'Warangal', 'Karimnagar', 'Nalgonda'],
    'Kerala': ['Ernakulam', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Palakkad'],
  };

  const currentDistricts = districts[state] || ['Madurai', 'Chennai', 'Coimbatore'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-warm-50 dark:bg-slate-900 w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-warm-200 dark:border-slate-800 animate-slide-up">
        <div className="flex items-center justify-between pb-3 border-b border-warm-200 dark:border-slate-800 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                இருப்பிடத்தை அமைக்கவும்
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Location Settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-warm-200 dark:hover:bg-slate-800 text-slate-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explain why location is useful */}
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs md:text-sm text-amber-900 dark:text-amber-200 mb-4 flex items-start gap-2">
          <Navigation className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <span>{t('locationExplain')}</span>
        </div>

        {/* Use My Location Button */}
        <button
          type="button"
          onClick={detectLocation}
          disabled={isDetecting}
          className="w-full py-3 px-4 rounded-2xl bg-white dark:bg-slate-800 border-2 border-jyothi-500 text-jyothi-700 dark:text-jyothi-300 font-bold text-sm flex items-center justify-center gap-2 hover:bg-jyothi-50 transition mb-4 shadow-sm"
        >
          <Navigation className={`w-4 h-4 ${isDetecting ? 'animate-spin' : ''}`} />
          <span>{isDetecting ? 'கண்டறியப்படுகிறது...' : t('useMyLocation')}</span>
        </button>

        {/* Manual Form Selectors */}
        <div className="space-y-3 mb-6">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('selectState')}
            </label>
            <select
              value={state}
              onChange={(e) => {
                setState(e.target.value);
                const firstDist = districts[e.target.value]?.[0] || 'Madurai';
                setDistrict(firstDist);
              }}
              className="w-full p-3 rounded-xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium text-sm focus:ring-2 focus:ring-jyothi-500"
            >
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              {t('selectDistrict')}
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full p-3 rounded-xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium text-sm focus:ring-2 focus:ring-jyothi-500"
            >
              {currentDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('selectTaluk')}
              </label>
              <input
                type="text"
                value={block}
                onChange={(e) => setBlock(e.target.value)}
                placeholder="எ.கா: வாடிப்பட்டி"
                className="w-full p-3 rounded-xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {t('selectVillage')}
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="எ.கா: கிராமம்"
                className="w-full p-3 rounded-xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl border border-warm-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-semibold hover:bg-warm-100"
          >
            {t('skipLocation')}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-xl bg-jyothi-700 hover:bg-jyothi-800 text-white font-bold text-sm shadow-md"
          >
            சேமிக்கவும் / Save
          </button>
        </div>
      </div>
    </div>
  );
};
