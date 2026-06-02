"use client";

interface Position {
  position: string;
  label: string;
  playerName: string;
  role: string;
  instructions: string[];
  x: number;
  y: number;
}

interface Props {
  formation: string;
  positions: Position[];
}

type PositionType = "gk" | "def" | "mid" | "fwd";

function getPositionType(pos: string): PositionType {
  const p = pos.toUpperCase();
  if (p === "GK") return "gk";
  if (
    p.includes("CB") || p.includes("LB") || p.includes("RB") ||
    p.includes("WB") || p.includes("SW") || p === "DEF" ||
    p.includes("BACK")
  ) return "def";
  if (
    p.includes("CM") || p.includes("DM") || p.includes("AM") ||
    p.includes("CDM") || p.includes("CAM") || p.includes("RM") ||
    p.includes("LM") || p === "MID" || p.includes("PIVOT")
  ) return "mid";
  return "fwd";
}

const dotStyles: Record<PositionType, { bg: string; border: string; text: string; label: string }> = {
  gk:  { bg: "bg-yellow-300",  border: "border-yellow-100", text: "text-yellow-900", label: "GK"  },
  def: { bg: "bg-sky-300",     border: "border-sky-100",    text: "text-sky-900",    label: "DEF" },
  mid: { bg: "bg-emerald-300", border: "border-emerald-100",text: "text-emerald-900",label: "MID" },
  fwd: { bg: "bg-rose-300",    border: "border-rose-100",   text: "text-rose-900",   label: "FWD" },
};

/**
 * Recomputes x/y coordinates purely from the formation string so the
 * graphic always matches what it says (e.g. "2-1" always shows 2 defenders
 * side-by-side, never 1-1-1).
 *
 * Strategy:
 *  1. Pull out the GK (highest y, or position === "GK").
 *  2. Sort the remaining outfield players by their original y descending
 *     (defenders are deepest, so highest y).
 *  3. Assign them row-by-row according to the formation numbers, spacing
 *     each row evenly across the x axis.
 */
function layoutFromFormation(formation: string, positions: Position[]): Position[] {
  // Parse "4-3-3" → [4, 3, 3]
  const lines = formation.split("-").map((n) => parseInt(n, 10)).filter((n) => n > 0);
  if (!lines.length || positions.length === 0) return positions;

  // Find GK: prefer explicit "GK" position label, fall back to highest y
  const gkIndex = positions.findIndex((p) => p.position.toUpperCase() === "GK");
  const gk = gkIndex >= 0 ? positions[gkIndex] : [...positions].sort((a, b) => b.y - a.y)[0];

  // Outfield = everyone else, sorted defenders-first (highest original y first)
  const outfield = positions
    .filter((p) => p !== gk)
    .sort((a, b) => b.y - a.y);

  // Y positions: GK at 88, lines spread from 72 (def) → 18 (fwd)
  const GK_Y = 88;
  const TOP_Y = 18;   // forwards
  const BOT_Y = 72;   // defenders (closest to our GK)
  const numLines = lines.length;

  const lineY = (i: number) =>
    numLines === 1
      ? (BOT_Y + TOP_Y) / 2
      : BOT_Y - i * (BOT_Y - TOP_Y) / (numLines - 1);

  const result: Position[] = [{ ...gk, x: 50, y: GK_Y }];

  let idx = 0;
  lines.forEach((count, lineIndex) => {
    const y = lineY(lineIndex);
    for (let i = 0; i < count; i++) {
      if (idx < outfield.length) {
        // Spread evenly: for count=2 → x = 33, 67; for count=3 → 25, 50, 75
        const x = (i + 1) * 100 / (count + 1);
        result.push({ ...outfield[idx], x, y });
        idx++;
      }
    }
  });

  return result;
}

export default function FormationPitch({ formation, positions }: Props) {
  const laid = layoutFromFormation(formation, positions);

  return (
    <div className="space-y-3">
      {/* Legend */}
      <div className="flex items-center justify-center gap-3 flex-wrap">
        {(["gk", "def", "mid", "fwd"] as PositionType[]).map((type) => {
          const s = dotStyles[type];
          return (
            <div key={type} className="flex items-center gap-1.5">
              <div className={`w-3 h-3 rounded-full ${s.bg} border ${s.border}`} />
              <span className="text-xs text-stone-500">{s.label}</span>
            </div>
          );
        })}
      </div>

      <div className="relative w-full max-w-sm mx-auto">
        <div className="text-center mb-2 text-amber-800 font-bold text-lg tracking-widest">
          {formation}
        </div>
        <div
          className="relative rounded-lg overflow-hidden border border-stone-300 shadow-sm"
          style={{
            aspectRatio: "0.65",
            background: "linear-gradient(180deg, #3a7d44 0%, #2d6a35 50%, #3a7d44 100%)",
          }}
        >
          {/* Pitch markings */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 154" preserveAspectRatio="none">
            <rect x="5" y="3" width="90" height="148" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <line x1="5" y1="77" x2="95" y2="77" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <circle cx="50" cy="77" r="14" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <circle cx="50" cy="77" r="0.8" fill="rgba(255,255,255,0.5)" />
            <rect x="22" y="3" width="56" height="22" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <rect x="35" y="3" width="30" height="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <circle cx="50" cy="18" r="0.8" fill="rgba(255,255,255,0.5)" />
            <rect x="22" y="129" width="56" height="22" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <rect x="35" y="143" width="30" height="8" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.8" />
            <circle cx="50" cy="136" r="0.8" fill="rgba(255,255,255,0.5)" />
            <rect x="40" y="1" width="20" height="3" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
            <rect x="40" y="150" width="20" height="3" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="0.8" />
            {[0,1,2,3,4,5,6].map((i) => (
              <rect key={i} x="5" y={3 + i * 21.1} width="90" height="10.5" fill="rgba(0,0,0,0.04)" />
            ))}
          </svg>

          {/* Players */}
          {laid.map((pos, i) => {
            const type = getPositionType(pos.position);
            const s = dotStyles[type];
            const shortName = pos.playerName
              ? pos.playerName.split(" ").pop()!.slice(0, 8)
              : pos.position;

            return (
              <div
                key={i}
                className="absolute flex flex-col items-center group"
                style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)", zIndex: 10 }}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[8px] font-bold border-2 shadow-lg transition-transform group-hover:scale-125 cursor-pointer ${s.bg} ${s.border} ${s.text}`}>
                  {pos.position.length > 3 ? pos.position.slice(0, 3) : pos.position}
                </div>
                <span className="text-[8px] text-white font-semibold mt-0.5 leading-none whitespace-nowrap bg-black/40 px-1 py-0.5 rounded">
                  {shortName}
                </span>

                {/* Tooltip */}
                <div className="hidden group-hover:block absolute bottom-full mb-2 w-52 bg-[#fffdf8] border border-stone-200 rounded-lg p-2 text-xs z-20 shadow-xl">
                  <div className="font-bold text-amber-700 mb-0.5">{pos.position} — {pos.role}</div>
                  {pos.playerName && <div className="text-stone-700 font-medium mb-1">{pos.playerName}</div>}
                  <ul className="space-y-0.5">
                    {pos.instructions.slice(0, 3).map((inst, j) => (
                      <li key={j} className="text-stone-500">• {inst}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs text-stone-400 mt-1">Hover players for role details</p>
      </div>
    </div>
  );
}
