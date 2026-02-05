"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Scan, 
  FolderKanban, 
  BarChart3, 
  Settings, 
  HelpCircle, 
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Newspaper
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "New Analysis", href: "/dashboard/analyze", icon: Scan },
  { name: "My Cases", href: "/dashboard/cases", icon: FolderKanban },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { name: "Live Updates", href: "/dashboard/news", icon: Newspaper },
];

const bottomItems = [
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
  { name: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
];

export default function DashboardSidebar({ 
  collapsed, 
  setCollapsed 
}: { 
  collapsed: boolean; 
  setCollapsed: (collapsed: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <div className="lg:hidden fixed inset-0 bg-black/50 z-40 hidden" id="mobile-overlay" />
      
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 80 : 288 }}
        className="fixed left-0 top-0 h-screen bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 z-50 hidden lg:flex flex-col"
      >
        <div className="flex flex-col h-full w-full overflow-hidden">
          {/* Logo */}
          <div className="h-20 flex items-center px-6 border-b border-slate-800/50 min-w-[288px]">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <span className="font-bold text-white text-lg">Authenex</span>
                  <span className="block text-[10px] text-sky-400 uppercase tracking-wider">TrustLens</span>
                </motion.div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                    isActive 
                      ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" 
                      : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                  }`}
                >
                  <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? "text-sky-400" : "group-hover:text-sky-400"} transition-colors`} />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-medium text-sm whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="active-pill"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Bottom section */}
          <div className="p-3 border-t border-slate-800/50 space-y-1 min-w-[288px]">
            {bottomItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all group"
                >
                  <Icon className="w-5 h-5 flex-shrink-0 group-hover:text-sky-400 transition-colors" />
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="font-medium text-sm whitespace-nowrap"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </Link>
              );
            })}
            
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all group mt-2"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="font-medium text-sm whitespace-nowrap"
                >
                  Sign Out
                </motion.span>
              )}
            </button>
          </div>
        </div>

        {/* Collapse button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 w-6 h-6 bg-slate-800 border border-slate-700 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-sky-500 hover:border-sky-500 transition-all z-50"
        >
          {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </motion.aside>

      {/* Mobile sidebar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/50 z-50 px-2 py-2">
        <nav className="flex justify-around">
          {navItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${
                  isActive ? "text-sky-400" : "text-slate-400"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}