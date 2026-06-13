"use client";

import React, { useState } from "react";
import LenisScrollProvider from "@/lib/LenisScrollProvider";
import Navbar from "@/components/navigation/Navbar";
import Preloader from "@/components/hero/Preloader";

// The 12 Sections
import HeroSection from "@/components/sections/HeroSection";
import TrustedBySection from "@/components/sections/TrustedBySection";
import MetricsStrip from "@/components/sections/MetricsStrip";
import WhyTapfolioSection from "@/components/sections/WhyTapfolioSection";
import ProductsSection from "@/components/sections/ProductsSection";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import EcosystemBento from "@/components/sections/EcosystemBento";
import SecuritySection from "@/components/sections/SecuritySection";
import LiveDemoSection from "@/components/sections/LiveDemoSection";
import TrustCompanySection from "@/components/sections/TrustCompanySection";
import ConfiguratorSection from "@/components/sections/ConfiguratorSection";
import FooterSection from "@/components/sections/FooterSection";

export default function Home() {
  const [preloaderComplete, setPreloaderComplete] = useState(false);

  return (
    <div className="bg-white min-h-screen font-sans selection:bg-blue-200">
      <Navbar />

      {!preloaderComplete && (
        <Preloader onComplete={() => setPreloaderComplete(true)} />
      )}

      {preloaderComplete && (
        <LenisScrollProvider>
          <div className="flex flex-col relative w-full overflow-hidden">

            {/* Main Page Flow (12 Sections) */}
            <main className="w-full flex flex-col">
              <HeroSection />
              <TrustedBySection />
              <MetricsStrip />
              <WhyTapfolioSection />
              <ProductsSection />
              <HowItWorksSection />
              <EcosystemBento />
              <SecuritySection />
              <LiveDemoSection />
              <TrustCompanySection />
              <ConfiguratorSection />
            </main>

            <FooterSection />
          </div>
        </LenisScrollProvider>
      )}
    </div>
  );
}
