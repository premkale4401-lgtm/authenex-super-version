"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Menu, 
  X, 
  User, 
  LogOut, 
  ChevronDown,
  FileCheck,
  Lock,
  BarChart3
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function TopNav() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navLinks = [
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Verify", href: "/verify", icon: FileCheck },
    { name: "Cases", href: "/cases", icon: Lock },
  ];

  if (status === "loading") {
    return (
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-slate-900/60 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/60 backdrop-blur-xl border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500 blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
              <Shield className="w-8 h-8 text-cyan-400 relative z-10" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Authenex
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-slate-500 tracking-widest uppercase">
                TrustLens
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Only if logged in */}
          {session && (
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-all"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          )}

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {!session ? (
              <button
                onClick={() => signIn()}
                className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-semibold text-sm transition-all flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-slate-800/50 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/30 transition-all"
                >
                  <img
                    src={session.user?.image || "https://ui-avatars.com/api/?name=User&background=0f172a&color=22d3ee"}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border border-slate-600"
                  />
                  <span className="hidden sm:block text-sm text-slate-300">
                    {session.user?.name?.split(" ")[0] || "User"}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isProfileOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl shadow-cyan-500/10 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-800">
                        <p className="font-medium text-slate-200">{session.user?.name}</p>
                        <p className="text-sm text-slate-500">{session.user?.email}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-xs bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {(session.user as any)?.role || "USER"}
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-2">
                        <button
                          onClick={() => signOut({ callbackUrl: "/" })}
                          className="w-full text-left px-4 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-slate-800/50"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-2">
              {session ? (
                navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 transition-colors"
                  >
                    <link.icon className="w-5 h-5" />
                    {link.name}
                  </Link>
                ))
              ) : (
                <button
                  onClick={() => signIn()}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                >
                  <User className="w-5 h-5" />
                  Sign In
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}