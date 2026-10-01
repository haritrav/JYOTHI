'use client';

import React, { useState, useEffect } from 'react';
import { UserCog, Plus, ShieldCheck, FileText, Zap, ShoppingBag, Heart, Shield, Activity, Check, RefreshCw } from 'lucide-react';
import { AuditLog } from '@/types';
import { VERIFIED_SCHEMES } from '@/data/verifiedSchemes';
import { VERIFIED_HEALTH_CAMPS } from '@/data/verifiedHealth';
import { VERIFIED_ELECTRICITY_UPDATES } from '@/data/verifiedUpdates';

export const AdminDashboard: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'overview' | 'schemes' | 'updates' | 'health' | 'audit'>('overview');
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  // New Quick Notification / Content Publisher Form state
  const [newItemTitle, setNewItemTitle] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('HEALTH_CAMP');
  const [publishSuccess, setPublishSuccess] = useState(false);

  const fetchAuditLogs = async () => {
    try {
      setIsLoadingLogs(true);
      const res = await fetch('/api/admin/audit-logs');
      const data = await res.json();
      if (data.data) {
        setAuditLogs(data.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, []);

  const handlePublishNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemTitle.trim()) return;

    try {
      const res = await fetch('/api/admin/audit-logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminEmail: 'admin.madurai@jyothi.gov.in',
          action: 'PUBLISH',
          entity: newItemCategory,
          entityId: `ITEM-${Math.floor(100 + Math.random() * 900)}`,
          details: `Published official verified record: ${newItemTitle}`,
        }),
      });

      if (res.ok) {
        setPublishSuccess(true);
        setNewItemTitle('');
        fetchAuditLogs();
        setTimeout(() => setPublishSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-slate-900 text-white p-5 rounded-3xl shadow-lg border border-slate-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center">
              <UserCog className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold">அரசு நிர்வாகி கட்டுப்பாட்டகம்</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950">
                  SUPER_ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Government Verified Content Management & Provenance Audit
              </p>
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-800 overflow-x-auto">
          {[
            { id: 'overview', label: 'மேலோட்டம் / Overview' },
            { id: 'schemes', label: `திட்டங்கள் (${VERIFIED_SCHEMES.length})` },
            { id: 'health', label: `மருத்துவ முகாம்கள் (${VERIFIED_HEALTH_CAMPS.length})` },
            { id: 'audit', label: `தணிக்கை பதிவு (Audit Logs)` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
                activeSection === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Verified Content Publisher Form — Requirement #43 */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 md:p-6 border border-warm-200 dark:border-slate-700 shadow-md">
        <div className="flex items-center gap-2 mb-3">
          <Plus className="w-5 h-5 text-indigo-600" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
            அதிகாரப்பூர்வ தகவலை வெளியிடு (Publish Verified Bulletin)
          </h3>
        </div>

        {publishSuccess && (
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold mb-3 flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>தகவல் சரிபார்க்கப்பட்டு தணிக்கைப் பதிவேட்டில் (Audit Log) பாதுகாப்பாகப் பதிவானது!</span>
          </div>
        )}

        <form onSubmit={handlePublishNew} className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                பிரிவு (Category)
              </label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-warm-300 dark:border-slate-700 bg-warm-50 dark:bg-slate-800 text-xs font-semibold"
              >
                <option value="HEALTH_CAMP">மருத்துவ முகாம் (Health Camp)</option>
                <option value="VACCINATION">தடுப்பூசி நாள் (Vaccination Session)</option>
                <option value="ELECTRICITY_UPDATE">மின் பராமரிப்பு (Electricity Cut)</option>
                <option value="RATION_UPDATE">ரேஷன் இருப்பு (Ration Update)</option>
                <option value="GOVT_SCHEME">அரசு திட்டம் (Govt Scheme)</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                அறிவிப்பு தலைப்பு (Official Announcement Title)
              </label>
              <input
                type="text"
                required
                value={newItemTitle}
                onChange={(e) => setNewItemTitle(e.target.value)}
                placeholder="எ.கா: வாடிப்பட்டி ஆரம்ப சுகாதார நிலையத்தில் சிறப்பு இலவச கண் முகாம்"
                className="w-full p-2.5 rounded-xl border border-warm-300 dark:border-slate-700 bg-warm-50 dark:bg-slate-800 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>சரிபார்த்து வெளியிடவும் (Publish with Audit Trail)</span>
          </button>
        </form>
      </div>

      {/* Audit Trail Section — Mandatory Requirement #43, #59 */}
      <div className="bg-white dark:bg-slate-800/90 rounded-3xl p-5 md:p-6 border border-warm-200 dark:border-slate-700 shadow-md">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              நிர்வாக தணிக்கைப் பதிவு (Official Audit Trail)
            </h3>
          </div>
          <button
            onClick={fetchAuditLogs}
            className="p-1.5 rounded-lg hover:bg-warm-100 dark:hover:bg-slate-700 text-slate-500"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingLogs ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <p className="text-xs text-slate-500 mb-3">
          அரசு விதிகளின்படி அனைத்து உள்ளடக்க மாற்றங்களும் தணிக்கைப் பதிவேட்டில் நிரந்தரமாக பதிவு செய்யப்படுகின்றன.
        </p>

        <div className="space-y-2">
          {auditLogs.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-2xl bg-warm-50 dark:bg-slate-900/60 border border-warm-200 dark:border-slate-800 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-[10px] px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                  {log.action} • {log.entity}
                </span>
                <span className="text-[10px] text-slate-400">
                  {new Date(log.timestamp).toLocaleString('ta-IN')}
                </span>
              </div>
              <p className="font-medium text-slate-800 dark:text-slate-200">{log.details}</p>
              <p className="text-[10px] text-slate-400">நிர்வாகி: {log.adminEmail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
