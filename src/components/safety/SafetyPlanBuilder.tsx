'use client';

import React, { useState } from 'react';
import { useSafety } from '@/contexts/SafetyContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ShieldCheck, MapPin, CheckSquare, Plus, Trash2, Save, Sparkles } from 'lucide-react';
import { AudioButton } from '../common/AudioButton';

export const SafetyPlanBuilder: React.FC = () => {
  const { safetyPlan, saveSafetyPlan } = useSafety();
  const { t } = useLanguage();

  const [safePlaces, setSafePlaces] = useState<string[]>(
    safetyPlan?.safePlaces || [
      'அருகிலுள்ள தாய்வீடு / தோழி இல்லம்',
      'அரசு ஆரம்ப சுகாதார நிலையம் (PHC)',
      'அருகிலுள்ள பெண்கள் நல விடுதி / சகி மையம்',
    ]
  );
  const [newPlace, setNewPlace] = useState('');

  const [bagItems, setBagItems] = useState<string[]>(
    safetyPlan?.emergencyBagItems || [
      'ஆதார் அட்டை & குடும்ப அட்டை அசல் / நகல்',
      'வங்கி பாஸ்புக் & ஏடிஎம் கார்டு',
      'குழந்தைகளின் பிறப்புச் சான்றிதழ்கள்',
      'அவசர ரொக்கப் பணம்',
      'அத்தியாவசிய மருந்துகள்',
    ]
  );
  const [newItem, setNewItem] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAddPlace = () => {
    if (!newPlace.trim()) return;
    setSafePlaces([...safePlaces, newPlace.trim()]);
    setNewPlace('');
  };

  const handleRemovePlace = (idx: number) => {
    setSafePlaces(safePlaces.filter((_, i) => i !== idx));
  };

  const handleAddItem = () => {
    if (!newItem.trim()) return;
    setBagItems([...bagItems, newItem.trim()]);
    setNewItem('');
  };

  const handleRemoveItem = (idx: number) => {
    setBagItems(bagItems.filter((_, i) => i !== idx));
  };

  const handleSaveAll = () => {
    if (safetyPlan) {
      saveSafetyPlan({
        ...safetyPlan,
        safePlaces,
        emergencyBagItems: bagItems,
        lastUpdated: new Date().toISOString(),
      });
    }
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 md:p-6 border border-warm-200 dark:border-slate-700 shadow-md space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-jyothi-700 dark:text-jyothi-400" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            {t('safetyPlanTitle')}
          </h3>
        </div>
        <AudioButton
          textToRead="தனிப்பட்ட பாதுகாப்பு திட்டம். ஆபத்து நேரத்தில் நீங்கள் செல்லக்கூடிய பாதுகாப்பான இடம் மற்றும் எடுத்துச் செல்ல வேண்டிய ஆவணங்களை இங்கு குறித்து வைக்கலாம்."
          size="sm"
        />
      </div>

      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
        நெருக்கடியான சூழலில் எங்கு செல்ல வேண்டும், என்னென்ன ஆவணங்களை தயாராக வைத்திருக்க வேண்டும் என்பதற்கான உங்கள் தனிப்பட்ட வழிகாட்டி.
      </p>

      {/* Safe Places List */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          🏡 நான் செல்லக்கூடிய பாதுகாப்பான இடங்கள் (Safe Places):
        </label>
        <div className="space-y-1.5">
          {safePlaces.map((place, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-warm-50 dark:bg-slate-900/60 border border-warm-200 dark:border-slate-800 text-xs"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-jyothi-600" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">{place}</span>
              </div>
              <button
                onClick={() => handleRemovePlace(idx)}
                className="text-slate-400 hover:text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <input
            type="text"
            value={newPlace}
            onChange={(e) => setNewPlace(e.target.value)}
            placeholder="புதிய பாதுகாப்பான இடத்தை சேர்க்க..."
            className="flex-1 p-2.5 rounded-xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
          />
          <button
            type="button"
            onClick={handleAddPlace}
            className="p-2.5 rounded-xl bg-warm-200 dark:bg-slate-700 hover:bg-warm-300 text-slate-800 dark:text-slate-200 text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Emergency Bag / Documents Checklist */}
      <div className="space-y-2 pt-2 border-t border-warm-100 dark:border-slate-700/60">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
          🎒 அவசர பையில் வைத்திருக்க வேண்டியவை (Emergency Bag Checklist):
        </label>
        <div className="space-y-1.5">
          {bagItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-2.5 rounded-xl bg-warm-50 dark:bg-slate-900/60 border border-warm-200 dark:border-slate-800 text-xs"
            >
              <div className="flex items-center gap-2">
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-semibold text-slate-800 dark:text-slate-200">{item}</span>
              </div>
              <button
                onClick={() => handleRemoveItem(idx)}
                className="text-slate-400 hover:text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="பொருளை சேர்க்க (எ.கா: மாத்திரை)..."
            className="flex-1 p-2.5 rounded-xl border border-warm-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs"
          />
          <button
            type="button"
            onClick={handleAddItem}
            className="p-2.5 rounded-xl bg-warm-200 dark:bg-slate-700 hover:bg-warm-300 text-slate-800 dark:text-slate-200 text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-2">
        {savedSuccess && (
          <p className="text-xs text-emerald-600 font-bold mb-2">
            ✓ பாதுகாப்பு திட்டம் வெற்றிகரமாக சேமிக்கப்பட்டது!
          </p>
        )}
        <button
          type="button"
          onClick={handleSaveAll}
          className="w-full py-3 px-4 rounded-xl bg-jyothi-700 hover:bg-jyothi-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition active:scale-95"
        >
          <Save className="w-4 h-4" />
          <span>திட்டத்தை சேமிக்கவும் / Save Plan</span>
        </button>
      </div>
    </div>
  );
};
