"use client";

import React, { useEffect, useRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import Hero3DCanvas from "@/components/hero/Hero3DCanvas";
import gsap from "gsap";

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".hero-stagger",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: "power3.out", delay: 0.2 }
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section ref={containerRef} id="hero" className="w-full min-h-[90vh] bg-white flex items-center justify-center relative pt-20 pb-12 overflow-hidden border-b border-gray-100">

      {/* Background Subtle Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white pointer-events-none" />

      <div className="max-w-[1200px] w-full mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">

        {/* Left Column: Copy */}
        <div className="flex flex-col items-start justify-center text-left max-w-xl">
          <br></br>

          <h1 className="hero-stagger font-display font-bold text-gray-950 text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight mb-6">
            Your Entire Professional Identity.<br />
            <span className="text-gray-400">Shared In One Tap.</span>
          </h1>

          <p className="hero-stagger text-gray-600 text-lg md:text-xl leading-relaxed mb-10 max-w-[540px]">
            TapFolio combines premium NFC business cards, digital profiles, lead capture, analytics, and team management into one unified platform.
          </p>

          <div className="hero-stagger flex flex-wrap items-center gap-4">
            <button
              onClick={() => scrollToSection("order")}
              className="bg-gray-950 hover:bg-blue-600 text-white font-medium py-4 px-8 rounded-full flex items-center gap-2 transition-all shadow-lg hover:shadow-blue-500/25 cursor-pointer"
            >
              Order Now <ArrowRight size={18} />
            </button>
            <button
              onClick={() => scrollToSection("demo")}
              className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 font-medium py-4 px-8 rounded-full flex items-center gap-2 transition-all cursor-pointer"
            >
              <Play size={18} className="fill-gray-900" /> Watch Demo
            </button>
          </div>

          <div className="hero-stagger mt-10 flex items-center gap-4 text-sm text-gray-500 font-medium">
            <div className="flex -space-x-2">
              <img src="https://i.pravatar.cc/100?img=1" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
              <img src="https://i.pravatar.cc/100?img=2" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
              <img src="https://i.pravatar.cc/100?img=3" alt="User" className="w-8 h-8 rounded-full border-2 border-white" />
            </div>
            <span>Join 10,000+ professionals</span>
          </div>
        </div>

        {/* Right Column: 3D Card / Profile Preview */}
        <div className="hero-stagger relative w-full h-[500px] lg:h-[600px] rounded-3xl bg-gray-50/50 border border-gray-100 flex items-center justify-center overflow-visible">
          <Hero3DCanvas />
        </div>

      </div>
    </section>
  );
}
