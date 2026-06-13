"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PreloaderProps {
  onComplete: () => void;
  minDisplayTime?: number; // Minimum time to show preloader
  enableSkip?: boolean; // Allow users to skip preloader
}

export default function Preloader({
  onComplete,
  minDisplayTime = 500,
  enableSkip = true
}: PreloaderProps) {
  const [stage, setStage] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [startTime] = useState(Date.now());

  // Memoized complete function to ensure min display time
  const handleComplete = useCallback(() => {
    const elapsedTime = Date.now() - startTime;
    const remainingTime = Math.max(0, minDisplayTime - elapsedTime);

    setTimeout(() => {
      setIsVisible(false);
      onComplete();
    }, remainingTime);
  }, [onComplete, minDisplayTime, startTime]);

  // Skip preloader functionality
  const handleSkip = useCallback(() => {
    if (enableSkip) {
      handleComplete();
    }
  }, [enableSkip, handleComplete]);

  // Main animation sequence
  useEffect(() => {
    // Removed localStorage skip so the preloader always shows during development/demo

    // Stage timings with better synchronization
    const stage1Timer = setTimeout(() => setStage(1), 100);
    const stage2Timer = setTimeout(() => setStage(2), 300);
    const completeTimer = setTimeout(() => handleComplete(), minDisplayTime);

    // Safety timeout to prevent infinite loading
    const safetyTimer = setTimeout(() => {
      console.warn("Preloader safety timeout triggered");
      handleComplete();
    }, minDisplayTime + 2000);

    return () => {
      clearTimeout(stage1Timer);
      clearTimeout(stage2Timer);
      clearTimeout(completeTimer);
      clearTimeout(safetyTimer);
    };
  }, [handleComplete, minDisplayTime, enableSkip]);

  // Keyboard skip support
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        handleSkip();
      }
    };

    if (enableSkip) {
      window.addEventListener('keydown', handleKeyPress);
      return () => window.removeEventListener('keydown', handleKeyPress);
    }
  }, [enableSkip, handleSkip]);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-gradient-to-br from-white via-gray-50 to-gray-100 z-[9999] flex items-center justify-center overflow-hidden"
      aria-live="polite"
      aria-label="Loading TapFolio - Your digital business card solution"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      {/* Skip button */}
      {enableSkip && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 z-10 px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 bg-white/80 backdrop-blur-sm rounded-full shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Skip loading animation"
        >
          Skip →
        </button>
      )}

      {/* Loading indicator for screen readers */}
      <div className="sr-only" role="status" aria-live="polite">
        {stage === 0 && "Loading TapFolio"}
        {stage === 1 && "Establishing secure connection"}
        {stage === 2 && "Preparing your digital card"}
      </div>

      {/* Main content container */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-8">
        <AnimatePresence mode="wait">
          {stage === 0 && (
            <motion.div
              key="text"
              initial={{ opacity: 0, y: 20, letterSpacing: "-0.05em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.15em" }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1],
                letterSpacing: { duration: 0.8 }
              }}
              className="text-center"
            >
              <motion.h1
                className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent font-sans tracking-widest"
                animate={{
                  backgroundPosition: ["0%", "100%", "0%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% auto"
                }}
              >
                TapFolio
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="mt-4 text-sm md:text-base text-gray-500 tracking-wide"
              >
                Digital Business Cards
              </motion.p>
            </motion.div>
          )}

          {stage === 1 && (
            <motion.div
              key="signal"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative flex flex-col items-center gap-6"
            >
              {/* NFC Signal Waves */}
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Wave 1 */}
                <motion.div
                  animate={{
                    scale: [1, 2.8, 1],
                    opacity: [0.5, 0, 0.5]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "easeInOut"
                  }}
                  className="absolute w-14 h-14 rounded-full border-2 border-blue-400"
                />
                {/* Wave 2 */}
                <motion.div
                  animate={{
                    scale: [1, 2.4, 1],
                    opacity: [0.4, 0, 0.4]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: 0.3,
                    ease: "easeInOut"
                  }}
                  className="absolute w-14 h-14 rounded-full border-2 border-blue-400"
                />
                {/* Wave 3 */}
                <motion.div
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.3, 0, 0.3]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    delay: 0.6,
                    ease: "easeInOut"
                  }}
                  className="absolute w-14 h-14 rounded-full border-2 border-blue-400"
                />
                {/* Center dot */}
                <motion.div
                  animate={{
                    scale: [1, 1.2, 1],
                    boxShadow: [
                      "0 0 0 0 rgba(59,130,246,0.7)",
                      "0 0 0 10px rgba(59,130,246,0)",
                      "0 0 0 0 rgba(59,130,246,0.7)"
                    ]
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                    ease: "easeInOut"
                  }}
                  className="w-5 h-5 rounded-full bg-blue-600 shadow-lg"
                />
              </div>

              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 text-sm md:text-base font-medium"
              >
                Establishing secure connection...
              </motion.p>
            </motion.div>
          )}

          {stage === 2 && (
            <motion.div
              key="card"
              initial={{ opacity: 0, rotateY: 90, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, rotateY: 0, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.2, rotateY: -90 }}
              transition={{
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
                rotateY: { type: "spring", stiffness: 100 }
              }}
              className="relative"
            >
              {/* Card shadow */}
              <div className="absolute -inset-4 bg-blue-500/10 rounded-2xl blur-xl" />

              {/* Main card */}
              <div className="relative w-72 h-44 md:w-80 md:h-48 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl shadow-2xl flex flex-col justify-between p-6 border border-gray-200/50 backdrop-blur-sm">
                {/* Card chip */}
                <div className="flex justify-between items-start">
                  <div className="w-12 h-9 md:w-14 md:h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg shadow-inner flex items-center justify-center">
                    <div className="w-8 h-6 bg-amber-300/50 rounded" />
                  </div>
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 2,
                      repeatDelay: 1
                    }}
                    className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg"
                  />
                </div>

                {/* Card details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <motion.div
                      className="w-24 h-3 bg-gray-300/80 rounded"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                    />
                    <motion.div
                      className="w-8 h-3 bg-blue-300/80 rounded"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                    />
                  </div>
                  <div className="flex gap-1">
                    <motion.div
                      className="w-12 h-2 bg-gray-200/80 rounded"
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
                    />
                    <motion.div
                      className="w-16 h-2 bg-gray-200/80 rounded"
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
                    />
                  </div>
                </div>

                {/* NFC icon indicator */}
                <motion.div
                  className="absolute bottom-3 right-3 text-blue-500 text-xs font-mono"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  NFC READY
                </motion.div>
              </div>

              {/* Loading progress bar */}
              <motion.div
                className="absolute -bottom-8 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-500 rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stage indicator dots */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2">
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${stage === index
                  ? "bg-blue-600 w-4"
                  : stage > index
                    ? "bg-blue-300"
                    : "bg-gray-300"
                }`}
              animate={{
                scale: stage === index ? [1, 1.2, 1] : 1
              }}
              transition={{
                repeat: stage === index ? Infinity : 0,
                duration: 1.5
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}