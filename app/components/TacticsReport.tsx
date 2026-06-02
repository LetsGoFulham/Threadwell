"use client";

import { useRef, useState, useEffect } from "react";
import FormationPitch from "./FormationPitch";
import type { ChatMessage } from "../page";

interface TacticsData {
  formation: string;
  formationRationale: string;
  positions: Array<{
    position: string;
    label: string;
    playerName: string;
    role: string;
    instructions: string[];
    x: number;
    y: number;
  }>;
  setPieces: {
    corners: string[];
    freeKicks: string[];
    throwIns: string[];
  };
  inGameAdjustments: Array<{
    scenario: string;
    adjustment: string;
  }>;
  keyTactics: string[];
  pressureMap: string;
}

interface SubPlayer {
  name: string;
  positions: string[];
  strengths: string;
  weaknesses: string;
  notes: string;
}

interface Props {
  data: TacticsData;
  subs: SubPlayer[];
  onEdit: () => void;
  onChatMessage: (msg: string) => void;
  chatMessages: ChatMessage[];
  chatLoading: boolean;
}

export default function TacticsReport({ data, subs, onEdit, onChatMessage, chatMessages, chatLoading }: Props) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, chatLoading]);

  const sendMessage = () => {
    const msg = chatInput.trim();
    if (!msg || chatLoading) return;
    setChatInput("");
    onChatMessage(msg);
  };

  const handlePrint = () => window.print();

  return (
    <div className="relative" ref={reportRef}>

      {/* ── Action bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-end gap-2 mb-4 print:hidden">
        {/* Edit */}
        <button
          onClick={onEdit}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:border-stone-400 hover:text-stone-800 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 12.362-12.303z" />
          </svg>
          Edit Squad
        </button>

        {/* Chat */}
        <button
          onClick={() => setChatOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-amber-700 border border-amber-700 rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.862 9.862 0 0 1-4.255-.949L3 20l1.395-3.72A7.963 7.963 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Ask AI
        </button>

        {/* Save PDF */}
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-stone-600 bg-white border border-stone-200 rounded-lg hover:border-stone-400 hover:text-stone-800 transition-colors shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16v-8m0 8-3-3m3 3 3-3M3 17v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2M3 7V5a2 2 0 0 1 2-2h3l2 2h4l2-2h3a2 2 0 0 1 2 2v2" />
          </svg>
          Save PDF
        </button>
      </div>

      {/* ── Report content ─────────────────────────────────────── */}
      <div className="space-y-6 fade-in">

        {/* Header */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">⚽</span>
            <div>
              <h2 className="text-2xl font-bold text-amber-900">Tactical Plan Ready</h2>
              <p className="text-amber-600 text-sm">{data.pressureMap}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {data.keyTactics.map((tactic, i) => (
              <span key={i} className="bg-white border border-amber-200 text-amber-800 text-xs px-3 py-1 rounded-full shadow-sm">
                {tactic}
              </span>
            ))}
          </div>
        </div>

        {/* Formation + Bench + Position Roles */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-stone-400 font-semibold mb-3 text-xs uppercase tracking-wider">Formation</h3>
            <div className="flex gap-3 items-start">
              <div className="flex-1 min-w-0">
                <FormationPitch formation={data.formation} positions={data.positions} />
              </div>
              {subs.length > 0 && (
                <div className="w-28 shrink-0">
                  <div className="text-xs font-semibold text-stone-400 uppercase tracking-wider mb-2 text-center">Bench</div>
                  <div className="space-y-1.5">
                    {subs.map((sub, i) => (
                      <div key={i} className="bg-white border border-stone-200 rounded-lg px-2 py-1.5 shadow-sm">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-500 text-[9px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                          <span className="text-xs font-medium text-stone-700 truncate">{sub.name || `Sub ${i + 1}`}</span>
                        </div>
                        {sub.positions.length > 0 && (
                          <div className="flex flex-wrap gap-0.5 mt-1 pl-6">
                            {sub.positions.map((p) => (
                              <span key={p} className="text-[9px] bg-amber-50 border border-amber-200 text-amber-700 px-1 rounded">{p}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="mt-3 bg-white border border-stone-200 rounded-lg p-3 shadow-sm">
              <p className="text-stone-600 text-sm">{data.formationRationale}</p>
            </div>
          </div>

          <div>
            <h3 className="text-stone-400 font-semibold mb-3 text-xs uppercase tracking-wider">Position Roles</h3>
            <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
              {data.positions.map((pos, i) => (
                <div key={i} className="bg-white border border-stone-200 rounded-lg p-3 hover:border-amber-300 transition-colors shadow-sm">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      pos.position === "GK"
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>{pos.position}</span>
                    {pos.playerName && <span className="text-stone-800 font-semibold text-sm">{pos.playerName}</span>}
                    <span className="text-stone-500 text-sm">{pos.role}</span>
                  </div>
                  <ul className="space-y-0.5">
                    {pos.instructions.map((inst, j) => (
                      <li key={j} className="text-stone-500 text-xs flex gap-1">
                        <span className="text-amber-500 mt-0.5">›</span>
                        <span>{inst}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Set Pieces */}
        <div>
          <h3 className="text-stone-400 font-semibold mb-3 text-xs uppercase tracking-wider">Set Piece Strategies</h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: "Corners", icon: "🚩", items: data.setPieces.corners },
              { title: "Free Kicks", icon: "🎯", items: data.setPieces.freeKicks },
              { title: "Throw-ins", icon: "🤾", items: data.setPieces.throwIns },
            ].map(({ title, icon, items }) => (
              <div key={title} className="bg-white border border-stone-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <span>{icon}</span>
                  <span className="font-semibold text-stone-700 text-sm">{title}</span>
                </div>
                <ul className="space-y-2">
                  {items.map((item, i) => (
                    <li key={i} className="text-stone-500 text-xs flex gap-2">
                      <span className="text-amber-500 shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* In-Game Adjustments */}
        <div>
          <h3 className="text-stone-400 font-semibold mb-3 text-xs uppercase tracking-wider">In-Game Adjustments</h3>
          <div className="space-y-3">
            {data.inGameAdjustments.map((adj, i) => (
              <div key={i} className="bg-white border border-stone-200 rounded-xl p-4 flex gap-4 shadow-sm">
                <div className="shrink-0">
                  <span className="bg-orange-50 border border-orange-200 text-orange-700 text-xs px-2 py-1 rounded-lg whitespace-nowrap">{adj.scenario}</span>
                </div>
                <p className="text-stone-600 text-sm">{adj.adjustment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Chat drawer ────────────────────────────────────────── */}
      {chatOpen && (
        <div className="fixed inset-0 z-40 flex justify-end print:hidden">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setChatOpen(false)} />

          {/* Panel */}
          <div className="relative w-full max-w-sm bg-[#faf7f2] border-l border-stone-200 shadow-2xl flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 bg-[#fffdf8]">
              <div>
                <p className="font-semibold text-stone-800 text-sm">Ask AI to adjust</p>
                <p className="text-xs text-stone-400">Describe what you want changed</p>
              </div>
              <button onClick={() => setChatOpen(false)} className="text-stone-400 hover:text-stone-700 p-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center text-stone-400 text-sm mt-8 space-y-2">
                  <p className="text-2xl">💬</p>
                  <p>Tell the AI what you'd like changed.</p>
                  <div className="space-y-1 text-xs text-stone-400">
                    {[
                      "Switch to a 4-4-2",
                      "Make us more defensive",
                      "Push player X further forward",
                      "Focus on wing play",
                    ].map((s) => (
                      <button
                        key={s}
                        onClick={() => { setChatInput(s); }}
                        className="block w-full text-left bg-white border border-stone-200 rounded-lg px-3 py-1.5 hover:border-amber-300 transition-colors"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                    msg.role === "user"
                      ? "bg-amber-700 text-white rounded-br-sm"
                      : "bg-white border border-stone-200 text-stone-700 rounded-bl-sm shadow-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-stone-200 rounded-2xl rounded-bl-sm px-4 py-2 shadow-sm">
                    <div className="flex gap-1 items-center">
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-stone-200 bg-[#fffdf8]">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-colors"
                  placeholder="e.g. Switch to a 4-4-2..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  disabled={chatLoading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!chatInput.trim() || chatLoading}
                  className="bg-amber-700 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7 7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
