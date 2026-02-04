"use client";

import { motion } from "framer-motion";

interface GlowingOrbProps {
  color?: string;
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  delay?: number;
}

export default function GlowingOrb({
  color = "#06b6d4",
  size = 400,
  top,
  left,
  right,
  bottom,
  delay = 0,
}: GlowingOrbProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: [0.3, 0.6, 0.3],
        scale: [1, 1.2, 1],
      }}
      transition={{
        duration: 8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="fixed pointer-events-none z-0"
      style={{
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        background: `radial-gradient(circle, ${color}40 0%, ${color}10 40%, transparent 70%)`,
        filter: "blur(60px)",
        borderRadius: "50%",
      }}
    />
  );
}