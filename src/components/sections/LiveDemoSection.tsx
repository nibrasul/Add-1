"use client";

import React, { useState } from 'react';
import { PlayCircle } from 'lucide-react';
import Demo3DCanvas from './Demo3DCanvas';

export default function LiveDemoSection() {

  return (
    <section id="demo" className="w-full py-32 bg-white flex flex-col items-center">
      <div className="max-w-[1200px] w-full px-6 text-center">
        
        <span className="text-xs font-bold tracking-widest text-blue-600 uppercase mb-4 block">
          Interactive Experience
        </span>
        <h2 className="font-display font-bold text-4xl md:text-5xl text-gray-950 mb-6 tracking-tight">
          See TapFolio in Action.
        </h2>
        <p className="text-gray-500 text-lg max-w-[600px] mx-auto mb-16">
          Experience the exact flow your clients will see. Tap the virtual card against the smartphone to instantly load your dynamic profile.
        </p>

        {/* 3D Demo Container Placeholder */}
        <div className="relative w-full h-[600px] bg-gray-50 rounded-[40px] border border-gray-200 shadow-inner flex items-center justify-center overflow-hidden group">
          
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
            <span className="bg-black/80 backdrop-blur-md px-6 py-2 rounded-full text-sm font-bold text-white shadow-xl animate-bounce">
              Tap the card
            </span>
          </div>

          {/* Live Interactive 3D Canvas */}
          <div className="w-full h-full absolute inset-0 cursor-grab active:cursor-grabbing">
             <Demo3DCanvas isPlaying={false} />
          </div>

        </div>

      </div>
    </section>
  );
}
