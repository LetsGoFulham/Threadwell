"use client";

import { useState } from "react";
import Link from "next/link";
import SquadForm from "./components/SquadForm";
import TacticsReport from "./components/TacticsReport";

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

interface SquadPlayer {
  name: string;
  positions: string[];
  strengths: string;
  weaknesses: string;
  notes: string;
}

interface SubmittedSquad {
  gameSize: string;
  starterCount: number;
  playerCount: number;
  players: SquadPlayer[];
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

async function streamTactics(
  body: Record<string, unknown>,
  onChunk: (text: string) => void
): Promise<TacticsData> {
  const res = await fetch("/api/tactics", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Failed to get tactics");

  const reader = res.body!.getReader();
  const decoder = new TextDecoder();
  let full = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    full += decoder.decode(value, { stream: true });
    onChunk(full);
  }
  const jsonStr = full.replace(/^```json\n?/, "").replace(/\n?```$/, "").trim();
  return JSON.parse(jsonStr) as TacticsData;
}

export default function Home() {
  const [tactics, setTactics] = useState<TacticsData | null>(null);
  const [submittedSquad, setSubmittedSquad] = useState<SubmittedSquad | null>(null);
  const [loading, setLoading] = useState(false);
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [streamText, setStreamText] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const handleSubmit = async (squadInfo: unknown) => {
    setLoading(true);
    setError(null);
    setTactics(null);
    setStreamText("");
    setChatMessages([]);

    const sq = squadInfo as SubmittedSquad;
    setSubmittedSquad(sq);

    try {
      const parsed = await streamTactics({ squadInfo }, (t) => setStreamText(t));
      setTactics(parsed);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
      setStreamText("");
    }
  };

  const handleChatMessage = async (message: string) => {
    if (!submittedSquad || !tactics) return;
    const newMessages: ChatMessage[] = [...chatMessages, { role: "user", content: message }];
    setChatMessages(newMessages);
    setChatLoading(true);

    try {
      const parsed = await streamTactics(
        { squadInfo: submittedSquad, currentTactics: tactics, modificationRequest: message },
        () => {}
      );
      setTactics(parsed);
      setChatMessages([...newMessages, {
        role: "assistant",
        content: `Done! I've updated the tactics: ${parsed.formationRationale}`,
      }]);
    } catch (e) {
      setChatMessages([...newMessages, {
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const subPlayers: SquadPlayer[] =
    submittedSquad && submittedSquad.gameSize !== "free" && submittedSquad.starterCount > 0
      ? submittedSquad.players.slice(submittedSquad.starterCount)
      : [];

  return (
    <div className="min-h-screen bg-[#faf7f2]">
      {/* Nav */}
      <nav className="border-b border-stone-200 bg-[#fffdf8] sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">⚽</span>
            <div>
              <span className="text-stone-800 font-bold text-lg">AI Tactics Coach</span>
              <span className="text-amber-600 text-xs ml-2">powered by Claude</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/login" className="text-sm text-white bg-amber-700 hover:bg-amber-600 px-3 py-1.5 rounded-lg transition-colors font-medium">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Form — always mounted to preserve state */}
        <div className={`max-w-2xl mx-auto ${tactics || loading ? "hidden" : ""}`}>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-stone-800 mb-3">
              Your AI Football <span className="text-amber-700">Tactics Coach</span>
            </h1>
            <p className="text-stone-500 text-lg">
              Describe your squad and get a complete tactical plan — formation, roles, set pieces, and in-game adjustments.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {["Formation Recommendations", "Position-by-Position Roles", "Set Piece Strategies", "In-Game Adjustments"].map((f) => (
              <span key={f} className="bg-amber-50 border border-amber-200 text-amber-800 text-xs px-3 py-1.5 rounded-full">
                ✓ {f}
              </span>
            ))}
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
              ⚠ {error} — your squad details are still filled in, just try again.
            </div>
          )}

          <div className="bg-[#fffdf8] border border-stone-200 rounded-2xl p-6 shadow-sm">
            <SquadForm onSubmit={handleSubmit} loading={loading} />
          </div>
        </div>

        {loading && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-[#fffdf8] border border-stone-200 rounded-2xl p-8 text-center shadow-sm">
              <div className="w-12 h-12 border-4 border-stone-200 border-t-amber-600 rounded-full animate-spin mx-auto mb-4" />
              <h3 className="text-stone-800 font-semibold text-lg mb-1">Analysing your squad...</h3>
              <p className="text-stone-400 text-sm mb-4">Building your tactical plan</p>
              {streamText && (
                <div className="bg-amber-50 rounded-lg p-3 text-left max-h-32 overflow-hidden relative">
                  <div className="text-amber-700 text-xs font-mono opacity-60">{streamText.slice(-300)}</div>
                  <div className="absolute bottom-0 inset-x-0 h-8 bg-gradient-to-t from-amber-50 to-transparent" />
                </div>
              )}
            </div>
          </div>
        )}

        {tactics && !loading && (
          <TacticsReport
            data={tactics}
            subs={subPlayers}
            onEdit={() => setTactics(null)}
            onChatMessage={handleChatMessage}
            chatMessages={chatMessages}
            chatLoading={chatLoading}
          />
        )}
      </main>

      <footer className="border-t border-stone-200 mt-16 py-6 text-center text-stone-400 text-xs print:hidden">
        AI Tactics Coach — Built with Next.js & Claude
      </footer>
    </div>
  );
}
