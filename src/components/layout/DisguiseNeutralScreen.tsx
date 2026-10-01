'use client';

import React, { useState } from 'react';
import { useSafety } from '@/contexts/SafetyContext';
import { Calculator, Sun, RotateCcw, ArrowRight } from 'lucide-react';

export const DisguiseNeutralScreen: React.FC = () => {
  const { exitNeutralMode } = useSafety();

  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcMemory, setCalcMemory] = useState<number | null>(null);
  const [activeOp, setActiveOp] = useState<string | null>(null);

  const handleNum = (n: string) => {
    setCalcDisplay((prev) => (prev === '0' ? n : prev + n));
  };

  const handleOp = (op: string) => {
    setCalcMemory(parseFloat(calcDisplay));
    setActiveOp(op);
    setCalcDisplay('0');
  };

  const handleEqual = () => {
    if (calcMemory === null || activeOp === null) return;
    const current = parseFloat(calcDisplay);
    let result = 0;
    if (activeOp === '+') result = calcMemory + current;
    if (activeOp === '-') result = calcMemory - current;
    if (activeOp === '×') result = calcMemory * current;
    if (activeOp === '÷') result = current !== 0 ? calcMemory / current : 0;
    setCalcDisplay(String(result));
    setCalcMemory(null);
    setActiveOp(null);
  };

  const handleClear = () => {
    setCalcDisplay('0');
    setCalcMemory(null);
    setActiveOp(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-100 text-slate-800 p-4 flex flex-col justify-between max-w-md mx-auto shadow-2xl overflow-y-auto">
      {/* Top Header: Neutral Daily Utility disguise */}
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-300">
          <div className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-700" />
            <h1 className="text-base font-bold text-slate-800">வீட்டு வரவு-செலவு கால்குலேட்டர்</h1>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-amber-700 font-medium">
            <Sun className="w-4 h-4" />
            <span>32°C வெயில்</span>
          </div>
        </div>

        {/* Small Daily Tip */}
        <div className="my-3 p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs text-indigo-900 leading-relaxed">
          💡 <span className="font-semibold">தினசரி சேமிப்பு குறிப்பு:</span> வாரத்திற்கு ஒரு முறை வீட்டு மளிகை பட்ஜெட்டை எழுதி வைப்பது தேவையற்ற செலவுகளைத் தவிர்க்க உதவும்.
        </div>

        {/* Calculator Display */}
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-4 text-right mb-3 shadow-inner">
          <span className="text-xs text-slate-400 block h-4">{calcMemory !== null ? `${calcMemory} ${activeOp}` : ''}</span>
          <span className="text-3xl font-mono font-bold text-slate-900 tracking-wider overflow-x-auto block">
            {calcDisplay}
          </span>
        </div>

        {/* Calculator Keypad */}
        <div className="grid grid-cols-4 gap-2 text-lg font-bold">
          {['C', '÷', '×', '-'].map((op, idx) => (
            <button
              key={idx}
              onClick={() => (op === 'C' ? handleClear() : handleOp(op))}
              className="py-3 rounded-xl bg-slate-200 text-indigo-800 hover:bg-slate-300 active:scale-95 shadow-sm"
            >
              {op}
            </button>
          ))}
          {['7', '8', '9', '+'].map((k, idx) => (
            <button
              key={idx}
              onClick={() => (k === '+' ? handleOp('+') : handleNum(k))}
              className={`py-3 rounded-xl shadow-sm active:scale-95 ${
                k === '+' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-900 hover:bg-slate-50'
              }`}
            >
              {k}
            </button>
          ))}
          {['4', '5', '6', '='].map((k, idx) => (
            <button
              key={idx}
              onClick={() => (k === '=' ? handleEqual() : handleNum(k))}
              className={`py-3 rounded-xl shadow-sm active:scale-95 ${
                k === '=' ? 'row-span-2 bg-emerald-600 text-white flex items-center justify-center' : 'bg-white text-slate-900 hover:bg-slate-50'
              }`}
            >
              {k}
            </button>
          ))}
          {['1', '2', '3'].map((k, idx) => (
            <button
              key={idx}
              onClick={() => handleNum(k)}
              className="py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-50 shadow-sm active:scale-95"
            >
              {k}
            </button>
          ))}
          {['0', '.'].map((k, idx) => (
            <button
              key={idx}
              onClick={() => handleNum(k)}
              className={`py-3 rounded-xl bg-white text-slate-900 hover:bg-slate-50 shadow-sm active:scale-95 ${
                k === '0' ? 'col-span-2' : ''
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {/* Discreet exit back to companion for the user when safe */}
      <div className="pt-4 border-t border-slate-300 text-center">
        <p className="text-[11px] text-slate-400 mb-2">
          குறிப்பு: இந்த திரை அவசர சூழலில் பாதுகாப்பிற்காக திறக்கப்பட்டது.
        </p>
        <button
          onClick={exitNeutralMode}
          className="w-full py-2.5 px-4 rounded-xl bg-slate-300 hover:bg-slate-400 text-slate-800 text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95"
        >
          <span>மீண்டும் பயன்பாட்டிற்கு செல்ல (Return)</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
