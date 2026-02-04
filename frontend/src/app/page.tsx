"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import TopNav from "@/components/navigation/TopNav";
import NeuralGlobe from "@/components/hero/NeuralGlobe";
import FloatingLines from "@/components/background/FloatingLines";
import AnimatedGrid from "@/components/background/AnimatedGrid";
import GlowingOrb from "@/components/effects/GlowingOrb";
import AnimatedCounter from "@/components/effects/AnimatedCounter";
import { 
  Sparkles, 
  Shield, 
  Zap, 
  Globe, 
  Lock, 
  FileCheck, 
  BarChart3,
  ArrowRight,
  Play,
  CheckCircle2,
  Cpu,
  Fingerprint,
  Scan,
  Radio
} from "lucide-react";


export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  const features = [
    {
      icon: FileCheck,
      title: "Image Forensics",
      desc: "Deepfake detection, GAN fingerprints, metadata analysis",
      color: "cyan",
      stats: "99.9% accuracy",
    },
    {
      icon: Scan,
      title: "Video Analysis",
      desc: "Temporal consistency, frame interpolation detection",
      color: "violet",
      stats: "Real-time processing",
    },
    {
      icon: Lock,
      title: "Document Auth",
      desc: "Font forensics, signature verification, layout analysis",
      color: "emerald",
      stats: "Forensic grade",
    },
    {
      icon: BarChart3,
      title: "Email Intel",
      desc: "Header analysis, DKIM/SPF validation, phishing detection",
      color: "rose",
      stats: "ISP integrated",
    },
    {
      icon: Radio,
      title: "Audio Verify",
      desc: "Voice biometrics, spectral analysis, synthetic detection",
      color: "amber",
      stats: "Deep neural net",
    },
    {
      icon: Cpu,
      title: "Text AI Detect",
      desc: "Perplexity scoring, stylometry, source attribution",
      color: "indigo",
      stats: "GPT-4 resistant",
    },
  ];

  const stats = [
    { value: 99.9, suffix: "%", label: "Detection Accuracy", icon: CheckCircle2 },
    { value: 50, suffix: "M+", label: "Files Analyzed", icon: FileCheck },
    { value: 150, suffix: "+", label: "Countries Protected", icon: Globe },
    { value: 2, suffix: "s", label: "Average Analysis Time", icon: Zap },
  ];

  return (
    <main className="min-h-screen bg-[#020617] overflow-x-hidden relative">
      {/* Background Layers */}
      <div className="fixed inset-0 z-0">
        <AnimatedGrid />
        <FloatingLines lineCount={40} color="#06b6d4" speed={0.5} opacity={0.4} />
      </div>

      {/* Glowing Orbs */}
      <GlowingOrb color="#06b6d4" size={500} top="-10%" left="-10%" delay={0} />
      <GlowingOrb color="#8b5cf6" size={600} top="20%" right="-15%" delay={2} />
      <GlowingOrb color="#06b6d4" size={400} bottom="10%" left="20%" delay={4} />

      {/* Navigation */}
      <TopNav />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="relative z-10"
            >
              <motion.div variants={itemVariants} className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">
                  <Radio className="w-4 h-4 animate-pulse" />
                  System Operational
                </span>
              </motion.div>

              <motion.h1 
                variants={itemVariants}
                className="text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6"
              >
                <span className="text-slate-100">Verify Truth in the</span>
                <br />
                <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                  Age of AI
                </span>
              </motion.h1>

              <motion.p 
                variants={itemVariants}
                className="text-lg md:text-xl text-slate-400 mb-8 max-w-xl leading-relaxed"
              >
                Authenex combines neural forensics, quantum-resistant cryptography, 
                and explainable AI to detect synthetic media with unprecedented precision.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="group px-8 py-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-semibold text-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5">
                  <Shield className="w-5 h-5" />
                  Start Analysis
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="group px-8 py-4 rounded-full glass-card hover:bg-slate-800/50 text-slate-300 hover:text-cyan-400 font-semibold text-lg transition-all flex items-center justify-center gap-3 border-slate-700 hover:border-cyan-500/30">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div variants={itemVariants} className="flex items-center gap-6 text-sm text-slate-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>SOC 2 Certified</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>FISMA Compliant</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>GDPR Ready</span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Enhanced 3D Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative h-[500px] lg:h-[600px]"
            >
              <NeuralGlobe />
              
              {/* Floating Stats Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-10 -left-4 glass-card p-4 border-cyan-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                    <Fingerprint className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Digital Signature</p>
                    <p className="text-sm font-semibold text-cyan-400">Verified</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-20 -right-4 glass-card p-4 border-violet-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <Cpu className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">AI Model</p>
                    <p className="text-sm font-semibold text-violet-400">v4.2.1</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 border-y border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-slate-800/50 border border-slate-700/50 mb-4">
                  <stat.icon className="w-6 h-6 text-cyan-400" />
                </div>
                <p className="text-3xl md:text-4xl font-bold text-slate-100 mb-1">
                  <AnimatedCounter 
                    end={stat.value} 
                    suffix={stat.suffix} 
                    duration={2.5}
                  />
                </p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Multi-Modal Detection
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-100 mb-4">
              Six Dimensions of{" "}
              <span className="bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                Truth
              </span>
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Our neural forensics engine analyzes every pixel, frequency, and token 
              to expose synthetic manipulation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="group relative glass-card p-8 hover:bg-slate-800/50 transition-all duration-500 overflow-hidden"
              >
                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-cyan-500/0 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`w-14 h-14 rounded-2xl bg-${feature.color}-500/10 border border-${feature.color}-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className={`w-7 h-7 text-${feature.color}-400`} />
                    </div>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full bg-${feature.color}-500/10 text-${feature.color}-400 border border-${feature.color}-500/20`}>
                      {feature.stats}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-200 mb-2 group-hover:text-cyan-400 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-950/20 to-transparent" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card p-12 border-cyan-500/20"
          >
            <Globe className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold text-slate-100 mb-4">
              Ready to Defend the Truth?
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              Join government agencies, news organizations, and enterprises 
              using Authenex to combat digital deception.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-all glow-cyan">
                Start Free Trial
              </button>
              <button className="px-8 py-4 rounded-full glass-card hover:bg-slate-800/50 text-slate-300 font-semibold transition-all">
                Contact Sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 border-t border-slate-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-cyan-400" />
              <div>
                <p className="font-bold text-slate-200">Authenex</p>
                <p className="text-xs text-slate-500">TrustLens Forensic Platform</p>
              </div>
            </div>
            <p className="text-slate-500 text-sm">
              © 2024 Authenex. Built for truth in the age of synthetic media.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}