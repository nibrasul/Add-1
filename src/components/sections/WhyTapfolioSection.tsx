import React from 'react';
import { XCircle, CheckCircle2 } from 'lucide-react';

export default function WhyTapfolioSection() {
  return (
    <section className="w-full py-32 bg-white flex justify-center">
      <div className="max-w-[1000px] w-full px-6 text-center">
        <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-950 mb-4">
          The Problem with Paper.
        </h2>
        <p className="text-gray-500 text-lg mb-16 max-w-[600px] mx-auto">
          Traditional business cards were designed for a disconnected world. TapFolio brings networking into the digital age.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          
          {/* Old Way */}
          <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 relative overflow-hidden">
            <h3 className="font-display font-bold text-2xl text-gray-900 mb-6">Traditional Card</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-600">
                <XCircle size={20} className="text-red-400 shrink-0" /> Easily lost or thrown away
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <XCircle size={20} className="text-red-400 shrink-0" /> Cannot be updated after printing
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <XCircle size={20} className="text-red-400 shrink-0" /> Requires constant reprinting
              </li>
              <li className="flex items-center gap-3 text-gray-600">
                <XCircle size={20} className="text-red-400 shrink-0" /> Zero tracking or analytics
              </li>
            </ul>
          </div>

          {/* New Way */}
          <div className="bg-blue-600 rounded-3xl p-10 border border-blue-500 relative overflow-hidden shadow-2xl shadow-blue-500/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <h3 className="font-display font-bold text-2xl text-white mb-6">TapFolio</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-blue-50">
                <CheckCircle2 size={20} className="text-blue-200 shrink-0" /> Always updated instantly in the cloud
              </li>
              <li className="flex items-center gap-3 text-blue-50">
                <CheckCircle2 size={20} className="text-blue-200 shrink-0" /> One-tap sharing to any smartphone
              </li>
              <li className="flex items-center gap-3 text-blue-50">
                <CheckCircle2 size={20} className="text-blue-200 shrink-0" /> Advanced CRM analytics dashboard
              </li>
              <li className="flex items-center gap-3 text-blue-50">
                <CheckCircle2 size={20} className="text-blue-200 shrink-0" /> 100% Eco-friendly. Only buy it once
              </li>
            </ul>
          </div>

        </div>
      </div>
    </section>
  );
}
