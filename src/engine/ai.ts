import type { AIAnalysis, TerminalMessage } from "@/types";
import { generateId, randomBetween } from "@/lib/utils";
import { getMarketState } from "./market";
import { getPortfolioState } from "./portfolio";
import { calculateRiskMetrics } from "./risk";
import { getMarketRegime } from "./trading";

let ollamaAvailable = false;
let ollamaChecked = false;
export function setOllamaAvailable(v: boolean) { ollamaAvailable = v; ollamaChecked = true; }
export function isOllamaAvailable(): boolean { return ollamaAvailable; }

async function queryOllama(prompt: string): Promise<string | null> {
  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ model: "llama3", prompt, stream: false, options: { temperature: 0.7, max_tokens: 150 } }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.response || null;
  } catch { return null; }
}

function generateProceduralAnalysis(): AIAnalysis[] {
  const analyses: AIAnalysis[] = [];
  const market = getMarketState();
  const portfolio = getPortfolioState();
  const risk = calculateRiskMetrics();
  const regime = getMarketRegime();

  const agents: { agent: AIAnalysis["agent"]; generate: () => string }[] = [
    { agent: "risk", generate: () => `Riesgo ${risk.riskScore > 0.6 ? "elevado" : risk.riskScore > 0.3 ? "moderado" : "controlado"} | Drawdown: ${portfolio.currentDrawdown.toFixed(1)}% | VaR(95%): ${risk.var_95.toFixed(0)} USD | Score: ${(risk.riskScore * 100).toFixed(0)}/100` },
    { agent: "macro", generate: () => `Contexto macro: ${["expansión moderada", "presión inflacionaria", "política restrictiva"][Math.floor(Math.random() * 3)]}. Sentimiento: ${(market.sentiment * 100).toFixed(0)}/100` },
    { agent: "sentiment", generate: () => `Fear & Greed: ${market.fearGreed.toFixed(0)}/100 (${market.fearGreed > 70 ? "codicia extrema" : market.fearGreed > 50 ? "codicia" : market.fearGreed > 30 ? "miedo moderado" : "miedo extremo"})` },
    { agent: "execution", generate: () => {
      const last = portfolio.trades.slice(-1)[0];
      return last ? `Última: ${last.symbol} ${last.side.toUpperCase()} @ ${last.entryPrice} | Confianza: ${(last.confidence * 100).toFixed(0)}%` : "Esperando señales...";
    }},
    { agent: "portfolio", generate: () => `Equity: $${portfolio.equity.toFixed(2)} | PnL: ${portfolio.totalPnl >= 0 ? "+" : ""}$${portfolio.totalPnl.toFixed(2)} (${portfolio.totalPnlPercent >= 0 ? "+" : ""}${portfolio.totalPnlPercent.toFixed(2)}%) | Sharpe: ${portfolio.sharpeRatio.toFixed(2)}` },
    { agent: "strategy", generate: () => `Régimen: ${regime.toUpperCase()} | Estrategia: ${regime === "trending" ? "Trend Following" : regime === "volatile" ? "Scalping + ATR" : regime === "ranging" ? "Mean Reversion" : "VWAP"} | Win Rate: ${portfolio.winRate.toFixed(1)}%` },
  ];

  const selected = agents.filter(() => Math.random() > 0.3);
  for (const { agent, generate } of selected) {
    analyses.push({ id: generateId(), agent, message: generate(), confidence: randomBetween(0.6, 0.95), timestamp: Date.now() });
  }
  return analyses;
}

export async function generateAnalysis(): Promise<AIAnalysis[]> {
  if (ollamaAvailable && ollamaChecked) {
    const portfolio = getPortfolioState();
    const response = await queryOllama(`Eres un analista cuantitativo. Analiza este portafolio y da una recomendación breve (máx 100 palabras): Capital: $${portfolio.equity.toFixed(2)} PnL: $${portfolio.totalPnl.toFixed(2)} (${portfolio.totalPnlPercent.toFixed(2)}%) Trades: ${portfolio.totalTrades} Win Rate: ${portfolio.winRate.toFixed(1)}% Drawdown: ${portfolio.currentDrawdown.toFixed(1)}%`);
    if (response) return [{ id: generateId(), agent: "strategy", message: response.trim(), confidence: randomBetween(0.75, 0.95), timestamp: Date.now() }];
  }
  return generateProceduralAnalysis();
}

export function generateTerminalMessages(): TerminalMessage[] {
  const messages: TerminalMessage[] = [];
  const portfolio = getPortfolioState();
  const market = getMarketState();
  const regime = getMarketRegime();

  const templates: { module: TerminalMessage["module"]; level: TerminalMessage["level"]; text: string }[] = [
    { module: "AI", level: "info", text: `[ANALYSIS] ${regime === "trending" ? "Tendencia alcista confirmada" : regime === "volatile" ? "Volatilidad elevada — ajustando stops" : "Mercado en rango — estrategia mean reversion"}` },
    { module: "RISK", level: portfolio.currentDrawdown > 10 ? "warning" : "success", text: portfolio.currentDrawdown > 10 ? `[WARNING] Drawdown: ${portfolio.currentDrawdown.toFixed(1)}%. Reducir exposición.` : `[OK] Riesgo controlado. Drawdown: ${portfolio.currentDrawdown.toFixed(1)}%` },
    { module: "EXECUTION", level: "success", text: `[EXEC] Escaneando ${Object.keys(market.prices).length} activos — ${portfolio.openPositions} posiciones abiertas` },
    { module: "PORTFOLIO", level: "info", text: `[BALANCE] Equity: $${portfolio.equity.toFixed(2)} | PnL: ${portfolio.totalPnl >= 0 ? "+" : ""}$${portfolio.totalPnl.toFixed(2)}` },
    { module: "SYSTEM", level: "system", text: `[SYS] Tick actualizado — ${new Date().toLocaleTimeString()}` },
    { module: "MARKET", level: market.sentiment > 0.6 ? "success" : "info", text: `[MARKET] Sentimiento: ${(market.sentiment * 100).toFixed(0)}/100 — ${market.sentiment > 0.6 ? "Alcista" : market.sentiment > 0.4 ? "Neutral" : "Bajista"}` },
  ];

  const selected = templates.filter(() => Math.random() > 0.3);
  for (const { module, level, text } of selected) {
    messages.push({ id: generateId(), module, message: text, level, timestamp: Date.now() });
  }
  return messages;
}
