import React from 'react';

export default function TrustedBySection() {
  return (
    <section className="w-full py-12 bg-white border-b border-gray-50 flex flex-col items-center justify-center">
      <div className="max-w-[1200px] w-full px-6 flex flex-col items-center">
        <p className="text-sm font-bold tracking-widest text-gray-400 uppercase mb-8 text-center">
          Trusted by professionals, startups and growing teams
        </p>
        
        <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          {/* Fictional/Placeholder SaaS Logos */}
          <div className="text-xl font-black font-sans tracking-tighter text-gray-800 flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-600 rounded-sm"></div>
            AcmeCorp
          </div>
          <div className="text-xl font-bold font-serif italic text-gray-800">
            Nexus.
          </div>
          <div className="text-xl font-black tracking-widest text-gray-800">
            STRATOS
          </div>
          <div className="text-xl font-bold text-gray-800 flex items-center gap-1">
            <span className="text-blue-600">✦</span> Vertex
          </div>
          <div className="text-xl font-black font-sans lowercase tracking-tight text-gray-800">
            lumina
          </div>
        </div>
      </div>
    </section>
  );
}
