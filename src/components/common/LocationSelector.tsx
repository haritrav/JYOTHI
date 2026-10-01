'use client';

import React, { useState } from 'react';
import { MapPin, Navigation, ArrowRight, Volume2, ShieldCheck, Check } from 'lucide-react';
import { SupportedLanguage, UserLocation } from '@/types';
import { DISTRICT_LOCATIONS } from '@/data/verifiedData';
import { UI_TRANSLATIONS } from '@/data/translations';
import { speakText, playAudioChime } from '@/utils/speech';

interface LocationSelectorProps {
  language: SupportedLanguage;
  currentLocation: UserLocation;
  onSaveLocation: (loc: UserLocation) => void;
  onSkip: () => void;
  isModal?: boolean;
}

export const LocationSelector: React.FC<LocationSelectorProps> = ({
  language,
  currentLocation,
  onSaveLocation,
  onSkip,
  isModal = false
}) => {
  const t = UI_TRANSLATIONS[language];

  const stateOptions = Object.keys(DISTRICT_LOCATIONS) as Array<keyof typeof DISTRICT_LOCATIONS>;
  
  const [selectedState, setSelectedState] = useState<string>(
    currentLocation.state || (language === 'ta' ? 'Tamil Nadu' : language === 'hi' ? 'Uttar Pradesh' : language === 'te' ? 'Telangana' : 'Kerala')
  );

  const availableDistricts = DISTRICT_LOCATIONS[selectedState as keyof typeof DISTRICT_LOCATIONS]?.districts || [];
  const [selectedDistrict, setSelectedDistrict] = useState<string>(
    currentLocation.district || availableDistricts[0] || ''
  );

  const blockMap = DISTRICT_LOCATIONS[selectedState as keyof typeof DISTRICT_LOCATIONS]?.blocks || {};
  const availableBlocks = (blockMap as Record<string, string[]>)[selectedDistrict] || [];
  const [selectedBlock, setSelectedBlock] = useState<string>(
    currentLocation.block || availableBlocks[0] || ''
  );

  const villageMap = DISTRICT_LOCATIONS[selectedState as keyof typeof DISTRICT_LOCATIONS]?.villages || {};
  const availableVillages = (villageMap as Record<string, string[]>)[selectedBlock] || ['Main Village', 'South Ward', 'North Colony'];
  const [selectedVillage, setSelectedVillage] = useState<string>(
    currentLocation.village || availableVillages[0] || ''
  );

  const [isGpsLoading, setIsGpsLoading] = useState(false);

  const handleStateChange = (stateName: string) => {
    setSelectedState(stateName);
    const districts = DISTRICT_LOCATIONS[stateName as keyof typeof DISTRICT_LOCATIONS]?.districts || [];
    const firstDist = districts[0] || '';
    setSelectedDistrict(firstDist);

    const blocks = (DISTRICT_LOCATIONS[stateName as keyof typeof DISTRICT_LOCATIONS]?.blocks as Record<string, string[]>)?.[firstDist] || [];
    const firstBlk = blocks[0] || '';
    setSelectedBlock(firstBlk);

    const vils = (DISTRICT_LOCATIONS[stateName as keyof typeof DISTRICT_LOCATIONS]?.villages as Record<string, string[]>)?.[firstBlk] || ['Village 1'];
    setSelectedVillage(vils[0] || '');
  };

  const handleDistrictChange = (dist: string) => {
    setSelectedDistrict(dist);
    const blocks = (DISTRICT_LOCATIONS[selectedState as keyof typeof DISTRICT_LOCATIONS]?.blocks as Record<string, string[]>)?.[dist] || [];
    const firstBlk = blocks[0] || '';
    setSelectedBlock(firstBlk);

    const vils = (DISTRICT_LOCATIONS[selectedState as keyof typeof DISTRICT_LOCATIONS]?.villages as Record<string, string[]>)?.[firstBlk] || ['Village 1'];
    setSelectedVillage(vils[0] || '');
  };

  const handleBlockChange = (blk: string) => {
    setSelectedBlock(blk);
    const vils = (DISTRICT_LOCATIONS[selectedState as keyof typeof DISTRICT_LOCATIONS]?.villages as Record<string, string[]>)?.[blk] || ['Village 1'];
    setSelectedVillage(vils[0] || '');
  };

  const handleUseLocation = () => {
    setIsGpsLoading(true);
    playAudioChime('pop');
    setTimeout(() => {
      setIsGpsLoading(false);
      // Auto-populate based on language selection area
      if (language === 'ta') {
        setSelectedState('Tamil Nadu');
        setSelectedDistrict('Coimbatore');
        setSelectedBlock('Pollachi');
        setSelectedVillage('Zamin Uthukuli');
      } else if (language === 'hi') {
        setSelectedState('Uttar Pradesh');
        setSelectedDistrict('Varanasi');
        setSelectedBlock('Pindra');
        setSelectedVillage('Mangari');
      } else if (language === 'te') {
        setSelectedState('Telangana');
        setSelectedDistrict('Warangal');
        setSelectedBlock('Geesugonda');
        setSelectedVillage('Dharmaram');
      } else {
        setSelectedState('Kerala');
        setSelectedDistrict('Palakkad');
        setSelectedBlock('Chittur');
        setSelectedVillage('Nallepilly');
      }
    }, 600);
  };

  const handleSave = () => {
    playAudioChime('success');
    onSaveLocation({
      state: selectedState,
      district: selectedDistrict,
      block: selectedBlock,
      village: selectedVillage
    });
  };

  const handleListenExplainer = () => {
    speakText(`${t.whereDoYouLive}. ${t.locationExplainer}`, language);
  };

  return (
    <div className={`flex flex-col justify-between ${isModal ? 'p-4' : 'min-h-screen bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950 text-white p-4 py-8'}`}>
      <div className="max-w-md mx-auto w-full space-y-5">
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center border-2 border-amber-400/40">
            <MapPin className="w-8 h-8 animate-bounce" />
          </div>

          <div className="flex items-center justify-center gap-2">
            <h1 className={`text-2xl font-extrabold ${isModal ? 'text-slate-900' : 'text-white'}`}>
              {t.whereDoYouLive}
            </h1>
            <button
              onClick={handleListenExplainer}
              className="p-1.5 rounded-full bg-amber-400 text-slate-950 hover:bg-amber-300"
              aria-label="Listen location explanation"
            >
              <Volume2 className="w-4 h-4" />
            </button>
          </div>

          <p className={`text-xs leading-relaxed px-2 ${isModal ? 'text-slate-600' : 'text-purple-200'}`}>
            {t.locationExplainer}
          </p>
        </div>

        {/* GPS Button */}
        <button
          onClick={handleUseLocation}
          disabled={isGpsLoading}
          className={`w-full py-3 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 border shadow-sm transition-all active:scale-95 ${
            isModal
              ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border-indigo-200'
              : 'bg-white/15 hover:bg-white/20 text-amber-300 border-white/20'
          }`}
        >
          <Navigation className={`w-4 h-4 ${isGpsLoading ? 'animate-spin' : ''}`} />
          <span>{isGpsLoading ? '...' : t.useMyLocation}</span>
        </button>

        {/* Form Selectors */}
        <div className={`p-4 rounded-3xl space-y-3.5 border ${
          isModal ? 'bg-slate-50 border-slate-200' : 'bg-white/10 backdrop-blur-md border-white/15'
        }`}>
          {/* State */}
          <div>
            <label className={`block text-xs font-bold mb-1 ${isModal ? 'text-slate-700' : 'text-purple-200'}`}>
              1. {t.selectState}
            </label>
            <select
              value={selectedState}
              onChange={(e) => handleStateChange(e.target.value)}
              className="w-full bg-white text-slate-900 font-bold text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 outline-none"
            >
              {stateOptions.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* District */}
          <div>
            <label className={`block text-xs font-bold mb-1 ${isModal ? 'text-slate-700' : 'text-purple-200'}`}>
              2. {t.selectDistrict}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => handleDistrictChange(e.target.value)}
              className="w-full bg-white text-slate-900 font-bold text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 outline-none"
            >
              {availableDistricts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Block */}
          <div>
            <label className={`block text-xs font-bold mb-1 ${isModal ? 'text-slate-700' : 'text-purple-200'}`}>
              3. {t.selectBlock}
            </label>
            <select
              value={selectedBlock}
              onChange={(e) => handleBlockChange(e.target.value)}
              className="w-full bg-white text-slate-900 font-bold text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 outline-none"
            >
              {availableBlocks.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Village */}
          <div>
            <label className={`block text-xs font-bold mb-1 ${isModal ? 'text-slate-700' : 'text-purple-200'}`}>
              4. {t.selectVillage}
            </label>
            <select
              value={selectedVillage}
              onChange={(e) => setSelectedVillage(e.target.value)}
              className="w-full bg-white text-slate-900 font-bold text-sm p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-amber-400 outline-none"
            >
              {availableVillages.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Non-intrusive privacy reassurance */}
        <div className={`flex items-center gap-2 p-2.5 rounded-xl text-xs ${
          isModal ? 'bg-emerald-50 text-emerald-800' : 'bg-emerald-950/40 text-emerald-300 border border-emerald-500/30'
        }`}>
          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>உங்கள் இருப்பிடம் பாதுகாப்பானது, விளம்பரங்களுக்குப் பயன்படுத்தப்படாது.</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="max-w-md mx-auto w-full pt-6 space-y-2.5 z-10">
        <button
          onClick={handleSave}
          className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-base py-3.5 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <Check className="w-5 h-5 font-black" />
          <span>{t.saveLocation}</span>
        </button>

        {!isModal && (
          <button
            onClick={onSkip}
            className="w-full text-center text-xs text-purple-300 hover:text-white py-2"
          >
            {t.skipLocation}
          </button>
        )}
      </div>
    </div>
  );
};
