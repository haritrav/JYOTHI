'use client';

import React from 'react';
import Link from 'next/link';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 via-indigo-950 to-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-5 bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 shadow-2xl">
        <div className="w-16 h-16 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mx-auto text-3xl font-black">
          🌸
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black tracking-tight text-amber-300">
            ஜோதி • JYOTHI
          </h1>
          <p className="text-sm font-semibold text-purple-200">
            பக்கம் கிடைக்கவில்லை / Page Not Found
          </p>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          நீங்கள் தேடும் பக்கம் இங்கு இல்லை. முகப்பு பக்கத்திற்கு செல்ல கீழே உள்ள பொத்தானைத் தொடவும்.
        </p>

        <Link
          href="/"
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-transform active:scale-95"
        >
          <Home className="w-4 h-4" />
          <span>முகப்பிற்குச் செல்க (Go to Home)</span>
        </Link>
      </div>
    </div>
  );
}
