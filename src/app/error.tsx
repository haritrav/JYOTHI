'use client';

import React from 'react';
import { RotateCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-slate-950 text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-4 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl">
        <div className="w-14 h-14 rounded-full bg-rose-500/20 text-rose-400 border border-rose-400/40 flex items-center justify-center mx-auto text-2xl font-bold">
          ⚠️
        </div>

        <h2 className="text-lg font-black text-white">
          தகவல் ஏற்றுவதில் சிறிய தடை ஏற்பட்டது
        </h2>

        <p className="text-xs text-slate-300">
          தயவுசெய்து மீண்டும் முயற்சிக்கவும் அல்லது முகப்பிற்குச் செல்லவும்.
        </p>

        <div className="flex gap-2 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 py-3 bg-amber-400 text-slate-950 font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5 active:scale-95"
          >
            <RotateCcw className="w-4 h-4" />
            <span>மீண்டும் முயற்சி (Try Again)</span>
          </button>

          <a
            href="/"
            className="py-3 px-4 bg-white/15 text-white font-bold text-xs rounded-2xl flex items-center justify-center gap-1.5"
          >
            <Home className="w-4 h-4" />
            <span>முகப்பு</span>
          </a>
        </div>
      </div>
    </div>
  );
}
