import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { squadInfo, currentTactics, modificationRequest } = body;

  const starterCount: number = squadInfo?.starterCount || squadInfo?.playerCount || 11;
  const totalPlayers: number = squadInfo?.playerCount || starterCount;
  const gameSize: string = squadInfo?.gameSize || "free";
  const hasSubs = gameSize !== "free" && totalPlayers > starterCount;
  const subPlayers = hasSubs ? (squadInfo?.players || []).slice(starterCount) : [];

  const prompt = `You are an elite football (soccer) tactics coach. Analyze the squad info provided and return a detailed tactical plan as valid JSON only — no markdown, no extra text.

Squad Info:
${JSON.stringify(squadInfo, null, 2)}

IMPORTANT: This is a ${starterCount}-a-side match format. The starting lineup has EXACTLY ${starterCount} players. ${hasSubs ? `There are also ${subPlayers.length} substitutes: ${JSON.stringify(subPlayers.map((p: { name: string; positions: string[] }) => ({ name: p.name, positions: p.positions })))}. Include substitution recommendations in the in-game adjustments.` : ""}

You MUST include EXACTLY ${starterCount} players in the positions array — no more, no less. The formation string must only count OUTFIELD players (i.e. the ${starterCount - 1} non-GK players). The numbers in the formation string MUST add up to exactly ${starterCount - 1}. For example: 11-a-side → "4-3-3" (4+3+3=10), 9-a-side → "3-3-2" (3+3+2=8), 7-a-side → "2-3-1" (2+3+1=6), 4-a-side → "2-1" (2+1=3). Never include the GK in the formation numbers.

For each position, if the squad data includes a player whose listed positions match that role, use their name in the playerName field. Otherwise leave playerName as an empty string.

Return ONLY valid JSON matching this exact structure:
{
  "formation": "4-3-3",
  "formationRationale": "Why this formation suits the squad",
  "positions": [
    {
      "position": "GK",
      "label": "Goalkeeper",
      "playerName": "John Smith",
      "role": "Sweeper Keeper",
      "instructions": ["Instruction 1", "Instruction 2"],
      "x": 50,
      "y": 92
    }
  ],
  "setPieces": {
    "corners": ["Tip 1", "Tip 2"],
    "freeKicks": ["Tip 1", "Tip 2"],
    "throwIns": ["Tip 1"]
  },
  "inGameAdjustments": [
    {
      "scenario": "If losing at half time",
      "adjustment": "What to change"
    },
    {
      "scenario": "If winning with 20 mins left",
      "adjustment": "What to change"
    },
    {
      "scenario": "If opponent goes down to 10 men",
      "adjustment": "What to change"
    }
  ],
  "keyTactics": ["Overall tactic 1", "Overall tactic 2", "Overall tactic 3"],
  "pressureMap": "describe in one sentence where to press and how"
}

x/y coordinates use a 0-100 grid. The goalkeeper sits at (50, 92) at the bottom, the opponent's goal is at the top (y=8). Defenders around y=75-80, midfielders around y=45-55, attackers around y=15-25. Spread players across the x axis (0=left, 100=right). Scale the pitch layout to fit ${starterCount} players — with fewer players leave more space between lines.

Be specific, tactical, and detailed. Tailor everything to the squad's actual strengths and weaknesses.${
  modificationRequest
    ? `\n\nThe user has reviewed the current tactical plan (shown below) and has requested the following change:\n"${modificationRequest}"\n\nApply this change while keeping everything else optimal. Current plan:\n${JSON.stringify(currentTactics, null, 2)}`
    : ""
}`;

  const stream = await client.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    max_tokens: 4096,
    messages: [
      {
        role: "system",
        content: "You are an expert football tactics coach. Always respond with valid JSON only.",
      },
      { role: "user", content: prompt },
    ],
    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content ?? "";
        if (text) controller.enqueue(encoder.encode(text));
      }
      controller.close();
    },
  });

  return new NextResponse(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
