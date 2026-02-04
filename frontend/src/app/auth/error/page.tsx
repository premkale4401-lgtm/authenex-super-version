"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, AlertTriangle } from "lucide-react";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: any = {
    default: "An error occurred during authentication.",
    configuration: "There is a problem with the server configuration.",
    accessdenied: "Access denied. You do not have permission to sign in.",
    verification: "The verification token has expired or has already been used.",
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
          <AlertTriangle className="w-10 h-10 text-rose-400" />
        </div>
        
        <h1 className="text-2xl font-bold text-slate-100 mb-4">Authentication Error</h1>
        <p className="text-slate-400 mb-8">
          {errorMessages[error || "default"]}
        </p>
        
        <Link
          href="/auth/signin"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold transition-colors"
        >
          <Shield className="w-5 h-5" />
          Try Again
        </Link>
      </div>
    </div>
  );
}