
import { NewsItem } from "@/lib/news-service";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Clock, AlertCircle, Zap } from "lucide-react";
import Image from "next/image";

interface NewsCardProps {
  news: NewsItem;
}

const categoryColors = {
  deepfake: "text-purple-400 border-purple-400/20 bg-purple-400/10",
  cybercrime: "text-red-400 border-red-400/20 bg-red-400/10",
  ai: "text-sky-400 border-sky-400/20 bg-sky-400/10",
};

const categoryLabels = {
  deepfake: "Deepflake Alert",
  cybercrime: "Cybercrime",
  ai: "AI News",
};

export default function NewsCard({ news }: NewsCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900/80 transition-all duration-300 hover:border-slate-700/50 hover:shadow-lg hover:shadow-sky-500/10">
      <div className="flex flex-col md:flex-row h-full">
        {/* Image Section */}
        <div className="relative w-full md:w-48 h-48 md:h-auto shrink-0 overflow-hidden">
          <Image
            src={news.imageUrl}
            alt={news.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:bg-gradient-to-r" />
          
          {/* Mobile Category Badge */}
          <div className="absolute top-2 left-2 md:hidden">
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${categoryColors[news.category]}`}>
              {categoryLabels[news.category]}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex flex-col flex-1 p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className={`hidden md:inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${categoryColors[news.category]}`}>
                {categoryLabels[news.category]}
              </span>
              {news.isLive && (
                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                  LIVE
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500">
               <Clock className="w-3 h-3" />
               {formatDistanceToNow(new Date(news.publishedAt), { addSuffix: true })}
            </div>
          </div>

          <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-sky-400 transition-colors line-clamp-2">
            {news.title}
          </h3>
          
          <p className="text-sm text-slate-400 mb-4 line-clamp-2 md:line-clamp-3 flex-1">
            {news.summary}
          </p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-800/50">
             <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-400" />
                {news.source}
             </span>
             
             <a 
               href={news.url}
               target="_blank"
               rel="noopener noreferrer"
               className="text-xs font-medium text-sky-400 hover:text-sky-300 flex items-center gap-1 group/link"
             >
               Read Full Story
               <ExternalLink className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
             </a>
          </div>
        </div>
      </div>
    </div>
  );
}
