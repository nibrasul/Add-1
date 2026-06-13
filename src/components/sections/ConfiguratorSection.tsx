"use client";

import React, { useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import ConfiguratorPanel from '@/components/ConfiguratorPanel';
import Configurator3DCanvas from './Configurator3DCanvas';

export default function ConfiguratorSection() {
  const [config, setConfig] = useState({
    name: "John Doe",
    role: "Creative Director",
    company: "TAPFOLIO INC.",
    color: "#111111",
    material: "pvc" as "pvc" | "metal",
    finish: "matte" as "glossy" | "matte" | "brushed",
    logoUrl: null as string | null,
    email: "john@tapfolio.me",
    phone: "+1 (555) 019-2834",
    website: "tapfolio.me/johndoe",
    linkedin: "in/johndoe",
    x: "johndoe_design",
    instagram: "johndoe.creates",
    whatsapp: "+15550192834",
    meetingLink: "calendly.com/johndoe",
    profileTheme: "dark" as "light" | "dark",
    qrPosition: "back" as "front" | "back" | "hidden",
  });

  return (
    <section id="order" className="w-full py-32 bg-[#050505] text-white flex justify-center">
      <div className="max-w-[1400px] w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Side: Live 3D Preview */}
        <div className="w-full lg:sticky lg:top-32 flex flex-col items-center">
          <div className="text-center mb-8">
            <h2 className="font-display font-bold text-4xl text-white mb-4">Build Your TapFolio.</h2>
            <p className="text-gray-400">See your design update in real-time before ordering.</p>
          </div>
          
          <div className="w-full h-[500px] bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mb-8 relative">
             <div className="absolute top-6 left-6 z-20">
               <span className="bg-black/50 border border-white/10 px-3 py-1.5 rounded-full text-xs font-bold text-gray-300">
                 Live 3D Preview Mount Point
               </span>
             </div>
             
             {/* Live Interactive Configurator 3D Canvas */}
             <div className="absolute inset-0 z-10">
               <Configurator3DCanvas config={config} />
             </div>
          </div>

          <button className="w-full max-w-[400px] bg-blue-600 hover:bg-blue-500 text-white font-bold py-5 px-8 rounded-full flex items-center justify-center gap-3 transition-colors text-lg shadow-lg shadow-blue-600/20">
            Get My Card — {config.material === 'metal' ? '$89' : '$39'}
            <ShoppingBag size={20} />
          </button>
          <p className="text-gray-500 text-xs mt-4 text-center">Includes free shipping and lifetime profile hosting.</p>
        </div>

        {/* Right Side: Configurator Panel */}
        <div className="w-full bg-white text-gray-900 rounded-[40px] p-8 md:p-12 shadow-2xl">
          <ConfiguratorPanel config={config} setConfig={setConfig} />
        </div>

      </div>
    </section>
  );
}
