import { NextRequest, NextResponse } from "next/server";
import getDeepseek from "@/lib/deepseek";

const SYSTEM_PROMPT = `You are an elite negotiation strategist. Given a user's negotiation scenario, produce a comprehensive, actionable playbook. Format your response using the section structure below — use **bold headers**, bullet points, and structured tables where appropriate. Be specific, tactical, and grounded in real negotiation psychology (anchoring,BATNA, ZOPA, value creation, etc.).

---

## 🎯 Preparation Strategy
[How to prepare: research, information gathering, walkthrough scenarios]

## 🚀 Opening Move
[Recommended first move with rationale]

## ⚓ Anchor Points
[Suggested opening position and target numbers/ranges]

## 💡 Value Creation Ideas
[Ways to expand the pie beyond the core number]

## ⚖️ Concession Trade Matrix
[A simple table: What you give | What you get | Why it matters]

## 🗣️ Body Language & Non-Verbal Tips
[Practical, specific tips for in-person or video negotiation]

## 🔒 Closing Techniques
[Proven closing strategies with when to use each]

## 🚪 Walk-Away Talking Points
[Exact phrases to use if you need to walk away, framed diplomatically]

---

Be direct and confident. No hedging. Speak like a world-class negotiation coach.`;

export async function POST(req: NextRequest) {
  try {
    const { negotiationType, yourLeverage, theirLeverage, walkAway, timeframe, desiredOutcome, concerns } = await req.json();

    const userPrompt = `Negotiation Details:
- Type: ${negotiationType || "Not specified"}
- My Leverage: ${yourLeverage || "Not specified"}
- Their Leverage: ${theirLeverage || "Not specified"}
- My Walk-Away Position: ${walkAway || "Not specified"}
- Timeframe: ${timeframe || "Not specified"}
- Desired Outcome: ${desiredOutcome || "Not specified"}
- Concerns/Fears: ${concerns || "Not specified"}

Please generate a comprehensive negotiation playbook for the above scenario.`;

    const deepseek = getDeepseek();
    const completion = await deepseek.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.8,
    });

    return NextResponse.json({ result: completion.choices[0].message.content });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
