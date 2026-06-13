"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/portfolio/animationVariants";

interface ProfilePhotoProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ProfilePhoto({ src, alt, className = "" }: ProfilePhotoProps) {
  return (
    <motion.div
      variants={fadeInUp}
      className={`relative overflow-hidden rounded-2xl shadow-2xl shadow-black/80 border border-[#F5F5F5]/10 ${className}`}
    >
      <motion.img
        src={src}
        alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
      />
      {/* Subtle inner border to keep it crisp */}
      <div className="absolute inset-0 rounded-2xl border border-[#F5F5F5]/5 pointer-events-none" />
    </motion.div>
  );
}
