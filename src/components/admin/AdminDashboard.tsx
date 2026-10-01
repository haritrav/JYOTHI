'use client';

import React, { useState } from 'react';
import {
  Lock,
  Shield,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Zap,
  Layers,
  Heart,
  Syringe,
  Clock,
  LogOut,
  X,
  History
} from 'lucide-react';
import { SupportedLanguage, AuditLog, Scheme, ElectricityUpdate, CounsellingRequest } from '@/types';
import {
  VERIFIED_SCHEMES,
  VERIFIED_ELECTRICITY_UPDATES,
  INITIAL_AUDIT_LOGS
} from '@/data/verifiedData';
import { UI_TRANSLATIONS } from '@/data/translations';
import { playAudioChime } from '@/utils/speech';

interface AdminDashboardProps {
  language: SupportedLanguage;
  onClose: () => void;
  counsellingRequests: CounsellingRequest[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  onClose,
  counsellingRequests
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeAdminTab, setActiveAdminTab] = useState<'schemes' | 'electricity' | 'counselling' | 'audit'>('schemes');
  
  const [schemes, setSchemes] = useState<Scheme[]>(VERIFIED_SCHEMES);
  const [electricityUpdates, setElectricityUpdates] = useState<ElectricityUpdate[]>(VERIFIED_ELECTRICITY_UPDATES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // New Electricity Outage Form State
  const [showAddOutage, setShowAddOutage] = useState(false);
  const [outageArea, setOutageArea] = useState('');
  const [outageTime, setOutageTime] = useState('10:00 AM – 02:00 PM');
  const [outageDate, setOutageDate] = useState('Tomorrow');

  const t = UI_TRANSLATIONS[language];

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === '1234' || pin === 'admin') {
      setIsAuthenticated(true);
      setPinError(false);
      playAudioChime('success');
    } else {
      setPinError(true);
      playAudioChime('alert');
    }
  };

  const handleAddElectricityOutage = () => {
    if (!outageArea) return;

    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      adminUser: 'Admin_Officer_Pollachi',
      action: 'PUBLISH_POWER_SHUTDOWN',
      category: 'Electricity',
      details: `Added maintenance shutdown for ${outageArea}`,
      timestamp: '2026-10-01 11:35:00 IST'
    };

    const newOutage: ElectricityUpdate = {
      id: `elec-${Date.now()}`,
      location: {
        state: 'Tamil Nadu',
        district: 'Coimbatore',
        block: 'Pollachi',
        area: outageArea
      },
      title: {
        ta: `${outageArea} பகுதியில் திட்டமிடப்பட்ட மின் தடை`,
        hi: `${outageArea} में निर्धारित विद्युत कटौती`,
        te: `${outageArea} లో విద్యుత్ సరఫరా నిలుపుదల`,
        ml: `${outageArea} ൽ വൈദ്യുതി മുടങ്ങും`
      },
      description: {
        ta: 'மாதாந்திர பராமரிப்பு பணிகள் காரணமாக மின் விநியோகம் நிறுத்தப்படும்.',
        hi: 'मासिक रखरखाव कार्य हेतु शटडाउन।',
        te: 'నిర్వహణ పనుల వల్ల విద్యుత్ సరఫరా ఉండదు.',
        ml: 'മെയിന്റനൻസ് കാരണം വൈദ്യുതി മുടങ്ങും.'
      },
      scheduleDate: outageDate,
      startTime: '10:00 AM',
      endTime: '02:00 PM',
      affectedVillages: [outageArea, 'Surrounding Fields'],
      reason: {
        ta: 'டிரான்ஸ்பார்மர் பழுது நீக்கம்',
        hi: 'ट्रांसफार्मर रिपेयर',
        te: 'ట్రాన్స్‌ఫార్మర్ మరమ్మతు',
        ml: 'ട്രാൻസ്ഫോർമർ മെയിന്റനൻസ്'
      },
      officialSource: 'TANGEDCO Sub-Division',
      sourceContact: '1912',
      lastUpdated: '2026-10-01 11:35 AM',
      status: 'scheduled'
    };

    setElectricityUpdates([newOutage, ...electricityUpdates]);
    setAuditLogs([newLog, ...auditLogs]);
    setShowAddOutage(false);
    setOutageArea('');
    playAudioChime('success');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200 text-slate-900">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="font-extrabold text-sm tracking-wide">
                {t.adminDashboard}
              </h2>
              <p className="text-[10px] text-slate-400">
                Authorized Officers & Department Management
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isAuthenticated ? (
          /* Authentication Screen */
          <div className="p-8 text-center space-y-4">
            <div className="w-14 h-14 bg-purple-100 text-purple-800 rounded-full flex items-center justify-center mx-auto">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-extrabold text-base text-slate-900">
                {t.adminLoginPrompt}
              </h3>
              <p className="text-xs text-slate-500">
                Enter officer access PIN (Default demo PIN: <strong className="text-purple-700">1234</strong>)
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3 max-w-xs mx-auto">
              <input
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter PIN"
                maxLength={6}
                className="w-full text-center text-xl tracking-widest font-black p-3 bg-slate-50 border border-slate-300 rounded-2xl focus:ring-2 focus:ring-purple-700 outline-none"
                autoFocus
              />

              {pinError && (
                <p className="text-xs text-rose-600 font-bold">
                  Invalid PIN. Please enter 1234.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-2xl shadow-md"
              >
                {t.adminSubmit}
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Portal */
          <div className="flex-1 overflow-y-auto flex flex-col">
            {/* Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 p-1 gap-1 text-xs font-bold text-slate-600">
              <button
                onClick={() => setActiveAdminTab('schemes')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  activeAdminTab === 'schemes' ? 'bg-white text-purple-900 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Schemes ({schemes.length})
              </button>

              <button
                onClick={() => setActiveAdminTab('electricity')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  activeAdminTab === 'electricity' ? 'bg-white text-purple-900 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Power ({electricityUpdates.length})
              </button>

              <button
                onClick={() => setActiveAdminTab('counselling')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  activeAdminTab === 'counselling' ? 'bg-white text-purple-900 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Counselling ({counsellingRequests.length})
              </button>

              <button
                onClick={() => setActiveAdminTab('audit')}
                className={`flex-1 py-2 rounded-xl transition-all ${
                  activeAdminTab === 'audit' ? 'bg-white text-purple-900 shadow-2xs' : 'hover:text-slate-900'
                }`}
              >
                Audit ({auditLogs.length})
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-4 flex-1 overflow-y-auto space-y-3">
              
              {/* Schemes Tab */}
              {activeAdminTab === 'schemes' && (
                <div className="space-y-3 text-xs">
                  {schemes.map((sc) => (
                    <div key={sc.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-extrabold text-slate-900">{sc.title[language]}</span>
                        <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                          ACTIVE
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px]">{sc.officialSource} • {sc.lastUpdated}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Electricity Tab */}
              {activeAdminTab === 'electricity' && (
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-700">Scheduled Power Outages</span>
                    <button
                      onClick={() => setShowAddOutage(!showAddOutage)}
                      className="px-3 py-1.5 bg-amber-500 text-slate-950 rounded-xl font-bold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Outage</span>
                    </button>
                  </div>

                  {showAddOutage && (
                    <div className="p-3 bg-amber-50 border border-amber-300 rounded-2xl space-y-2">
                      <input
                        type="text"
                        placeholder="Area / Feeder Name"
                        value={outageArea}
                        onChange={(e) => setOutageArea(e.target.value)}
                        className="w-full p-2 bg-white border border-amber-200 rounded-xl font-bold"
                      />
                      <input
                        type="text"
                        placeholder="Date (e.g. 03-Oct-2026)"
                        value={outageDate}
                        onChange={(e) => setOutageDate(e.target.value)}
                        className="w-full p-2 bg-white border border-amber-200 rounded-xl font-bold"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleAddElectricityOutage}
                          className="flex-1 py-2 bg-slate-900 text-white font-bold rounded-xl"
                        >
                          Publish Outage
                        </button>
                        <button
                          onClick={() => setShowAddOutage(false)}
                          className="py-2 px-3 bg-slate-200 text-slate-700 font-bold rounded-xl"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {electricityUpdates.map((item) => (
                    <div key={item.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-900">{item.location.area}</span>
                        <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                          {item.startTime} - {item.endTime}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px]">{item.scheduleDate} • {item.officialSource}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Counselling Tab */}
              {activeAdminTab === 'counselling' && (
                <div className="space-y-3 text-xs">
                  {counsellingRequests.length === 0 ? (
                    <p className="text-center text-slate-400 py-6">No counselling requests submitted yet.</p>
                  ) : (
                    counsellingRequests.map((req) => (
                      <div key={req.id} className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-1.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-slate-900 text-xs block">{req.userName}</span>
                            <span className="text-[11px] text-emerald-800 font-bold">{req.id}</span>
                          </div>
                          <span className="text-[10px] font-black uppercase bg-emerald-200 text-emerald-950 px-2 py-0.5 rounded-full">
                            {req.status}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          <strong>Mode:</strong> {req.preferredMode} | <strong>Time:</strong> {req.preferredTime}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Audit Logs Tab */}
              {activeAdminTab === 'audit' && (
                <div className="space-y-2 text-xs">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-slate-400">
                        <span className="font-bold text-purple-900">{log.adminUser}</span>
                        <span>{log.timestamp}</span>
                      </div>
                      <p className="font-bold text-slate-800 text-[11px]">{log.action}</p>
                      <p className="text-slate-500 text-[10px]">{log.details}</p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}
      </div>
    </div>
  );
};
