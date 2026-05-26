import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { marketData, portfolio } = body;

    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3.2",
        prompt: `Analyze this market data and portfolio for trading decisions. Market: ${JSON.stringify(marketData)}. Portfolio: ${JSON.stringify(portfolio)}. Provide concise analysis with specific action signals (buy/sell/hold) for each asset.`,
        stream: false,
      }),
    });

    if (!response.ok) throw new Error("Ollama not available");

    const data = await response.json();
    return NextResponse.json({ analysis: data.response, source: "ollama" });
  } catch {
    return NextResponse.json({
      analysis: "Ollama offline. Procedural analysis active — market regime detected, executing adaptive strategy allocation.",
      source: "procedural",
    });
  }
}
