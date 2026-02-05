"use client";

import { useEffect, useState } from "react";
import { getBreakingNews, NewsItem } from "@/lib/news-service";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export default function NewsHighlights() {
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const data = await getBreakingNews();
      setNews(data);
    };
    fetchNews();
  }, []);

  if (news.length === 0) return null;

  return (
    <div className="w-full bg-slate-900/50 border-y border-slate-800/50 backdrop-blur-sm overflow-hidden z-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold bg-red-500/10 text-red-500 border border-red-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            LIVE
          </span>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider hidden sm:block">
            Breaking Updates
          </span>
        </div>

        <div className="flex-1 overflow-hidden relative h-6">
           {/* Simple ticker effect using CSS animation or marquee usually, but for React standard implementation: */}
           <div className="animate-ticker flex items-center gap-8 whitespace-nowrap absolute top-0 left-0">
             {[...news, ...news].map((item, idx) => (
               <Link 
                 key={`${item.id}-${idx}`} 
                 href="/dashboard/news"
                 className="text-sm text-slate-300 hover:text-sky-400 transition-colors flex items-center gap-2"
               >
                 <span className="text-slate-500">•</span>
                 {item.title}
                 <ArrowRight className="w-3 h-3 opacity-50" />
               </Link>
             ))}
           </div>
        </div>

        <Link 
          href="/dashboard/news" 
          className="text-xs font-medium text-sky-400 hover:text-sky-300 whitespace-nowrap hidden sm:flex items-center gap-1"
        >
          View All <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
      
      <style jsx global>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}
