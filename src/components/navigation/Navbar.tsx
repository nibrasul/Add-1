"use client";

import React from "react";
import { ChevronRight } from "lucide-react";

export default function Navbar() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full h-20 bg-white/70 backdrop-blur-md border-b border-gray-200 z-50 flex items-center justify-between px-6 md:px-12/100 max-w-[1440px] left-1/2 -translate-x-1/2">
      {/* Brand Logo */}
      <div 
        className="flex items-center gap-1 cursor-pointer" 
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
          <path d="M5 14C6.10457 14 7 13.1046 7 12C7 10.8954 6.10457 10 5 10C3.89543 10 3 10.8954 3 12C3 13.1046 3.89543 14 5 14Z" fill="#60A5FA"/>
          <path d="M9 8C11.2091 8 13 9.79086 13 12C13 14.2091 11.2091 16 9 16" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M13 4C17.4183 4 21 7.58172 21 12C21 16.4183 17.4183 20 13 20" stroke="#2563EB" strokeWidth="3" strokeLinecap="round"/>
        </svg>
        <span className="font-bold text-2xl tracking-tight font-sans" style={{ color: '#020b2d' }}>
          Tap<span style={{ color: '#2563EB' }}>folio</span>
        </span>
      </div>

      {/* Navigation Links */}
      <div className="hidden md:flex items-center gap-8">
        <button
          type="button"
          onClick={() => scrollToSection("products")}
          className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
        >
          Products
        </button>
        <button
          type="button"
          onClick={() => scrollToSection("technology")}
          className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
        >
          Technology
        </button>
        <button
          type="button"
          onClick={() => scrollToSection("industries")}
          className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
        >
          Industries
        </button>
        <button
          type="button"
          onClick={() => scrollToSection("pricing")}
          className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
        >
          Pricing
        </button>
        <button
          type="button"
          onClick={() => scrollToSection("order")}
          className="text-gray-600 hover:text-gray-900 font-medium transition-colors cursor-pointer"
        >
          Order
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => scrollToSection("order")}
          className="hidden sm:inline-flex items-center justify-center px-6 h-[50px] border border-gray-900 text-gray-900 font-semibold rounded-full hover:bg-gray-50 transition-all cursor-pointer"
        >
          Configure
        </button>
        <button
          type="button"
          onClick={() => scrollToSection("order")}
          className="inline-flex items-center justify-center px-6 h-[50px] bg-gray-900 text-white font-semibold rounded-full hover:bg-blue-600 hover:border-blue-600 transition-all cursor-pointer shadow-md"
        >
          Order Now
        </button>
      </div>
    </nav>
  );
}
