"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const inputClass =
    "w-full bg-white border border-stone-200 rounded-lg px-3 py-2.5 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-colors";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Auth not yet connected — coming soon!");
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col">
      {/* Nav */}
      <nav className="border-b border-stone-200 bg-[#fffdf8] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">⚽</span>
            <span className="text-stone-800 font-bold">AI Tactics Coach</span>
          </Link>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-amber-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl">⚽</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-800">
              {tab === "login" ? "Welcome back" : "Create an account"}
            </h1>
            <p className="text-stone-500 text-sm mt-1">
              {tab === "login"
                ? "Sign in to access your tactical plans"
                : "Start building smarter tactics today"}
            </p>
          </div>

          {/* Tab toggle */}
          <div className="flex bg-stone-100 rounded-lg p-1 mb-6">
            {(["login", "signup"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                  tab === t
                    ? "bg-white text-stone-800 shadow-sm"
                    : "text-stone-500 hover:text-stone-700"
                }`}
              >
                {t === "login" ? "Sign In" : "Sign Up"}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-[#fffdf8] border border-stone-200 rounded-2xl p-6 shadow-sm space-y-4">
            {tab === "signup" && (
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className={inputClass}
                  placeholder="Alex Ferguson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Email
              </label>
              <input
                type="email"
                className={inputClass}
                placeholder="coach@club.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Password
                </label>
                {tab === "login" && (
                  <button type="button" className="text-xs text-amber-600 hover:text-amber-800">
                    Forgot password?
                  </button>
                )}
              </div>
              <input
                type="password"
                className={inputClass}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-amber-700 hover:bg-amber-600 text-white font-bold py-2.5 rounded-lg transition-colors mt-2"
            >
              {tab === "login" ? "Sign In" : "Create Account"}
            </button>

            {/* Divider */}
            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#fffdf8] px-2 text-stone-400">or continue with</span>
              </div>
            </div>

            {/* Social placeholders */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 border border-stone-200 rounded-lg py-2 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 border border-stone-200 rounded-lg py-2 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-stone-400 mt-6">
            By continuing, you agree to our{" "}
            <button className="text-amber-600 hover:underline">Terms</button> and{" "}
            <button className="text-amber-600 hover:underline">Privacy Policy</button>.
          </p>
        </div>
      </div>
    </div>
  );
}
