import NewsFeed from "@/components/news/NewsFeed";
import TopNav from "@/components/navigation/TopNav";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Live Updates & News | Authenex TrustLens",
    description: "Real-time updates on Deepfakes, Cybercrime, and AI developments.",
};

export default function NewsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-indigo-400">
                    Live Updates & Intel
                </h1>
                <p className="text-slate-400 max-w-2xl">
                    Stay ahead of digital threats with real-time reporting on deepfakes, cybercrime trends, and AI regulations from verified sources.
                </p>
            </div>

            <NewsFeed />
        </div>
    );
}
