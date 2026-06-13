import React from 'react';
import { BarChart2, LayoutDashboard, Users, QrCode, Link2, Share2 } from 'lucide-react';

export default function EcosystemBento() {
  return (
    <section className="w-full py-32 bg-white flex flex-col items-center">
      <div className="max-w-[1200px] w-full px-6">
        
        <div className="mb-16">
          <span className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-4 block">
            Digital Ecosystem
          </span>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-950 mb-4 tracking-tight">
            More than just a card.
          </h2>
          <p className="text-gray-500 text-lg max-w-[600px]">
            TapFolio operates on a powerful software backend designed to convert taps into measurable relationships.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[240px]">
          
          {/* Analytics Dashboard (Large - 2x2) */}
          <div className="md:col-span-2 md:row-span-2 bg-[#0a0a0a] rounded-3xl p-8 relative overflow-hidden flex flex-col group">
            <div className="relative z-10 flex-1">
              <BarChart2 size={28} className="text-blue-500 mb-6" />
              <h3 className="font-display font-bold text-3xl text-white mb-2">Analytics Dashboard</h3>
              <p className="text-gray-400 text-sm max-w-[280px]">
                Track tap locations, measure profile conversion rates, and understand exactly when and where your networking is most effective.
              </p>
            </div>
            {/* Visual Placeholder for Analytics */}
            <div className="absolute -bottom-10 -right-10 w-[80%] h-[60%] bg-gray-900 rounded-tl-3xl border-t border-l border-gray-800 p-6 flex items-end gap-2 group-hover:-translate-y-2 group-hover:-translate-x-2 transition-transform duration-500">
               <div className="w-8 h-full bg-blue-600 rounded-t-sm" />
               <div className="w-8 h-[70%] bg-blue-500 rounded-t-sm" />
               <div className="w-8 h-[40%] bg-blue-800 rounded-t-sm" />
               <div className="w-8 h-[90%] bg-blue-400 rounded-t-sm" />
            </div>
          </div>

          {/* Profile Builder (Medium) */}
          <div className="md:col-span-2 bg-gray-50 border border-gray-100 rounded-3xl p-8 flex flex-col justify-between group">
            <div>
              <LayoutDashboard size={24} className="text-gray-900 mb-4" />
              <h3 className="font-display font-bold text-2xl text-gray-950 mb-2">Profile Builder</h3>
              <p className="text-gray-500 text-sm">
                Drag and drop links, videos, and portfolio items into your live mobile page.
              </p>
            </div>
          </div>

          {/* Lead Capture (Medium) */}
          <div className="md:col-span-1 lg:col-span-2 bg-blue-50 border border-blue-100 rounded-3xl p-8 flex flex-col justify-between group">
            <div>
              <Users size={24} className="text-blue-600 mb-4" />
              <h3 className="font-display font-bold text-2xl text-blue-950 mb-2">Lead Capture</h3>
              <p className="text-blue-800/70 text-sm">
                Two-way contact sharing allows you to collect emails instantly when tapped.
              </p>
            </div>
          </div>

          {/* Team Management (Medium) */}
          <div className="md:col-span-1 bg-white border border-gray-200 rounded-3xl p-8 shadow-sm flex flex-col justify-between">
            <div>
              <Share2 size={24} className="text-gray-900 mb-4" />
              <h3 className="font-display font-bold text-xl text-gray-950 mb-2">Team Sync</h3>
              <p className="text-gray-500 text-sm">
                Manage all employee cards from one unified admin console.
              </p>
            </div>
          </div>

          {/* CRM Integrations (Small) */}
          <div className="md:col-span-1 lg:col-span-2 bg-gray-50 border border-gray-100 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
             <Link2 size={28} className="text-gray-400 mb-3" />
             <h3 className="font-display font-bold text-lg text-gray-950">CRM Ready</h3>
             <p className="text-gray-500 text-xs mt-1">Export to Salesforce & Hubspot</p>
          </div>

          {/* QR Sharing (Small) */}
          <div className="md:col-span-1 bg-gray-950 rounded-3xl p-8 flex flex-col justify-center items-center text-center">
             <QrCode size={28} className="text-white mb-3" />
             <h3 className="font-display font-bold text-lg text-white">Apple Wallet</h3>
             <p className="text-gray-400 text-xs mt-1">Native QR integration</p>
          </div>

        </div>

      </div>
    </section>
  );
}
