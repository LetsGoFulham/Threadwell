"use client";

import { useState, KeyboardEvent } from "react";

interface PlayerInfo {
  name: string;
  positions: string[];
  positionInput: string;
  strengths: string;
  weaknesses: string;
  notes: string;
}

interface SquadInfo {
  gameSize: string;
  starterCount: number;
  playerCount: number;
  ageGroup: string;
  competition: string;
  players: PlayerInfo[];
}

interface Props {
  onSubmit: (squadInfo: SquadInfo) => void;
  loading: boolean;
}

function makePlayer(): PlayerInfo {
  return { name: "", positions: [], positionInput: "", strengths: "", weaknesses: "", notes: "" };
}

const GAME_SIZES: Record<string, { label: string; starters: number; total: number }> = {
  "11v11": { label: "11v11", starters: 11, total: 16 },
  "9v9":   { label: "9v9",   starters: 9,  total: 14 },
  "7v7":   { label: "7v7",   starters: 7,  total: 11 },
  "4v4":   { label: "4v4",   starters: 4,  total: 6  },
  "free":  { label: "Free",  starters: 0,  total: 0  },
};

const labelClass = "block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1";
const inputClass =
  "w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-800 placeholder-stone-400 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-100 transition-colors";
const textareaClass = inputClass + " resize-none";

export default function SquadForm({ onSubmit, loading }: Props) {
  const [playerCountInput, setPlayerCountInput] = useState("");
  const [squad, setSquad] = useState<SquadInfo>({
    gameSize: "",
    starterCount: 0,
    playerCount: 0,
    ageGroup: "",
    competition: "",
    players: [],
  });

  const resizePlayers = (count: number, current: PlayerInfo[]) => {
    if (count <= 0) return [];
    return count > current.length
      ? [...current, ...Array(count - current.length).fill(null).map(makePlayer)]
      : current.slice(0, count);
  };

  const handleGameSize = (key: string) => {
    const gs = GAME_SIZES[key];
    if (!gs) return;
    if (key === "free") {
      setSquad((s) => ({ ...s, gameSize: key, starterCount: 0 }));
      return;
    }
    const newCount = gs.total;
    setPlayerCountInput(String(newCount));
    setSquad((s) => ({
      ...s,
      gameSize: key,
      starterCount: gs.starters,
      playerCount: newCount,
      players: resizePlayers(newCount, s.players),
    }));
  };

  const applyPlayerCount = () => {
    const n = parseInt(playerCountInput, 10);
    if (!n || n < 1 || n > 50) return;
    setSquad((s) => ({
      ...s,
      playerCount: n,
      players: resizePlayers(n, s.players),
    }));
  };

  const updatePlayer = (i: number, patch: Partial<PlayerInfo>) => {
    setSquad((s) => ({
      ...s,
      players: s.players.map((p, idx) => (idx === i ? { ...p, ...patch } : p)),
    }));
  };

  const addPosition = (i: number) => {
    const p = squad.players[i];
    const val = p.positionInput.trim();
    if (!val || p.positions.includes(val)) {
      updatePlayer(i, { positionInput: "" });
      return;
    }
    updatePlayer(i, { positions: [...p.positions, val], positionInput: "" });
  };

  const removePosition = (i: number, pos: string) => {
    updatePlayer(i, { positions: squad.players[i].positions.filter((p) => p !== pos) });
  };

  const handlePositionKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addPosition(i);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(squad);
  };

  const isFree = squad.gameSize === "free";
  const starterCount = squad.starterCount;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Row 1: Game Size + Age Group + Competition */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className={labelClass}>Game Size</label>
          <select
            className={inputClass}
            value={squad.gameSize}
            onChange={(e) => handleGameSize(e.target.value)}
          >
            <option value="">Select...</option>
            {Object.entries(GAME_SIZES).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Age Group</label>
          <input
            type="text"
            className={inputClass}
            placeholder="e.g. U14, Senior"
            value={squad.ageGroup}
            onChange={(e) => setSquad((s) => ({ ...s, ageGroup: e.target.value }))}
          />
        </div>
        <div>
          <label className={labelClass}>League / Competition</label>
          <input
            type="text"
            className={inputClass}
            placeholder="e.g. Sunday League"
            value={squad.competition}
            onChange={(e) => setSquad((s) => ({ ...s, competition: e.target.value }))}
          />
        </div>
      </div>

      {/* Number of players */}
      {squad.gameSize && (
        <div>
          <label className={labelClass}>
            Number of Players
            {!isFree && starterCount > 0 && (
              <span className="ml-2 text-amber-600 normal-case font-normal">
                ({starterCount} starters + {squad.playerCount - starterCount} subs)
              </span>
            )}
          </label>
          <input
            type="number"
            min={1}
            max={50}
            className={inputClass}
            placeholder={isFree ? "Enter total players" : "Auto-set — adjust if needed"}
            value={playerCountInput}
            onChange={(e) => setPlayerCountInput(e.target.value)}
            onBlur={applyPlayerCount}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), applyPlayerCount())}
          />
        </div>
      )}

      {/* Player cards */}
      {squad.playerCount > 0 && (
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-wider">
            Player Cards
          </h3>
          {squad.players.map((player, i) => {
            const isSub = !isFree && starterCount > 0 && i >= starterCount;
            return (
              <div
                key={i}
                className={`bg-white border rounded-xl p-4 space-y-3 shadow-sm ${
                  isSub ? "border-stone-200 opacity-80" : "border-stone-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shrink-0 ${
                    isSub ? "bg-stone-100 text-stone-400" : "bg-amber-50 text-amber-700"
                  }`}>
                    {i + 1}
                  </span>
                  <input
                    type="text"
                    className="flex-1 bg-transparent border-none outline-none text-stone-800 text-sm font-medium placeholder-stone-400"
                    placeholder={`${isSub ? "Sub" : "Player"} ${i + 1} name (optional)`}
                    value={player.name}
                    onChange={(e) => updatePlayer(i, { name: e.target.value })}
                  />
                  {isSub && (
                    <span className="text-xs text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full">Sub</span>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Positions</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {player.positions.map((pos) => (
                      <span
                        key={pos}
                        className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-800 text-xs px-2 py-0.5 rounded-full"
                      >
                        {pos}
                        <button
                          type="button"
                          onClick={() => removePosition(i, pos)}
                          className="text-amber-400 hover:text-amber-700 ml-0.5"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    className={inputClass}
                    placeholder='Type a position and press Enter (e.g. "ST", "CM", "LB")'
                    value={player.positionInput}
                    onChange={(e) => updatePlayer(i, { positionInput: e.target.value })}
                    onKeyDown={(e) => handlePositionKey(i, e)}
                    onBlur={() => player.positionInput.trim() && addPosition(i)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Strengths</label>
                    <textarea
                      className={textareaClass}
                      rows={2}
                      placeholder="e.g. Pace, aerial ability, long passing"
                      value={player.strengths}
                      onChange={(e) => updatePlayer(i, { strengths: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Weaknesses</label>
                    <textarea
                      className={textareaClass}
                      rows={2}
                      placeholder="e.g. Weak foot, poor positioning"
                      value={player.weaknesses}
                      onChange={(e) => updatePlayer(i, { weaknesses: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Other Notes</label>
                  <textarea
                    className={textareaClass}
                    rows={2}
                    placeholder="e.g. Captain, injury concerns, preferred partnerships"
                    value={player.notes}
                    onChange={(e) => updatePlayer(i, { notes: e.target.value })}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {squad.playerCount > 0 && (
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-700 hover:bg-amber-600 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Analysing...
            </span>
          ) : (
            "Generate Tactics ⚽"
          )}
        </button>
      )}
    </form>
  );
}
