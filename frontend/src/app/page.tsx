"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TopNav from "@/components/navigation/TopNav";
import NewsHighlights from "@/components/landing/NewsHighlights";
import ParticleNetwork from "@/components/background/ParticleNetwork";
import AuroraBackground from "@/components/background/AuroraBackground";
import HeroSection from "@/components/hero/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import ProcessSection from "@/components/sections/ProcessSection";
import StatsSection from "@/components/sections/StatsSection";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import CTASection from "@/components/sections/CTASection";
export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (!mounted) return null;

  // Don't show anything while redirecting
  if (status === "authenticated") return null;

  return (
    <main className="min-h-screen bg-[#020617] overflow-x-hidden relative">
      {/* Background Layers */}
      <AuroraBackground />
      <ParticleNetwork />
      
      {/* Subtle grid overlay */}
      <div className="fixed inset-0 bg-[linear-gradient(rgba(14,165,233,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.03)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none z-0" />
      
      {/* Content */}
      <div className="relative z-10">
        <TopNav />
        <NewsHighlights />
        
        <HeroSection />
        <FeaturesSection />
        <ProcessSection />
        <StatsSection />
        <TestimonialsSection />
        <CTASection />
        
        {/* Footer */}
        <footer className="relative py-12 border-t border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-sky-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div>
                  <p className="font-bold text-slate-200">Authenex TrustLens</p>
                  <p className="text-xs text-slate-500">Defending digital truth since 2022</p>
                </div>
              </div>
              <div className="flex gap-6 text-sm text-slate-500">
                <a href="#" className="hover:text-sky-400 transition-colors">Privacy</a>
                <a href="#" className="hover:text-sky-400 transition-colors">Terms</a>
                <a href="#" className="hover:text-sky-400 transition-colors">Security</a>
                <a href="#" className="hover:text-sky-400 transition-colors">API</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}