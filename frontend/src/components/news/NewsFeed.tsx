"use client";

import { useEffect, useState } from 'react';
import { getNews, NewsCategory, NewsItem } from '@/lib/news-service';
import NewsCard from './NewsCard';
import { LucideIcon, Activity, AlertTriangle, Cpu, Radio } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function NewsFeed() {
  const [activeCategory, setActiveCategory] = useState<NewsCategory | 'all'>('all');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const data = await getNews(activeCategory);
        setNews(data);
      } catch (error) {
        console.error("Failed to fetch news", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [activeCategory]);

  const tabs: { id: NewsCategory | 'all'; label: string; icon: LucideIcon }[] = [
    { id: 'all', label: 'All Updates', icon: Activity },
    { id: 'deepfake', label: 'Deepfakes', icon: Radio },
    { id: 'cybercrime', label: 'Cybercrime', icon: AlertTriangle },
    { id: 'ai', label: 'AI News', icon: Cpu },
  ];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/50 p-2 rounded-xl border border-slate-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto no-scrollbar mask-gradient">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeCategory === tab.id
                  ? "bg-sky-500/10 text-sky-400 border border-sky-500/20 shadow-sm shadow-sky-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 text-xs text-slate-500 px-2">
            <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Live Updates Open
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {[1, 2, 3, 4].map((i) => (
             <div key={i} className="h-64 rounded-xl bg-slate-900/30 animate-pulse border border-slate-800/50" />
           ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {news.map((item) => (
            <NewsCard key={item.id} news={item} />
          ))}
        </div>
      )}
    </div>
  );
}
