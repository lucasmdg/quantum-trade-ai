import type { AIAnalysis, TerminalMessage } from "@/types";
import { generateId, randomBetween } from "@/lib/utils";
import { getMarketState } from "./market";
import { getPortfolioState } from "./portfolio";
import { calculateRiskMetrics } from "./risk";
import { getMarketRegime } from "./trading";

let ollamaAvailable = false;
let ollamaChecked = false;

export function setOllamaAvailable(v: boolean) {
  ollamaAvailable = v;
  ollamaChecked = true;
}

export function isOllamaAvailable(): boolean {
  return ollamaAvailable;
}

const agentDescriptions: Record<string, string> = {
  risk: "Risk AI • Evaluación de Riesgos",
  macro: "Macro AI • Análisis Macroeconómico",
  sentiment: "Sentiment AI • Sentimiento de Mercado",
  execution: "Execution AI • Ejecución de Operaciones",
  portfolio: "Portfolio AI • Gestión de Cartera",
  strategy: "Strategy AI • Estrategia Algorítmica",
};

async function queryOllama(prompt: string): Promise<string | null> {
  try {
    const res = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama3",
        prompt,
        stream: false,
        options: { temperature: 0.7, max_tokens: 150 },
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.response || null;
  } catch {
    return null;
  }
}

function generateProceduralAnalysis(): AIAnalysis[] {
  const analyses: AIAnalysis[] = [];
  const market = getMarketState();
  const portfolio = getPortfolioState();
  const risk = calculateRiskMetrics();
  const regime = getMarketRegime();

  const confidenceLevels = ["alta", "media", "moderada", "elevada", "significativa"];
  const getConf = () => randomBetween(0.6, 0.95);

  const agents: { agent: AIAnalysis["agent"]; generate: () => string }[] = [
    {
      agent: "risk",
      generate: () => {
        const riskLevel = risk.riskScore > 0.6 ? "elevado" : risk.riskScore > 0.3 ? "moderado" : "controlado";
        const ddStatus = portfolio.currentDrawdown > 10 ? "requiere atención" : "dentro de parámetros";
        return `Riesgo ${riskLevel} | Drawdown: ${portfolio.currentDrawdown.toFixed(1)}% (${ddStatus}) | VaR(95%): ${risk.var_95.toFixed(0)} USD | Score: ${(risk.riskScore * 100).toFixed(0)}/100`;
      },
    },
    {
      agent: "macro",
      generate: () => {
        const conditions = ["expansión económica moderada", "presión inflacionaria controlada", "política monetaria restrictiva"];
        const outlook = Math.random() > 0.5 ? "favorable para activos de riesgo" : "cautelosa, preferencia por valor";
        return `Contexto macro: ${conditions[Math.floor(Math.random() * conditions.length)]}. Perspectiva ${outlook}. Sentimiento: ${(market.sentiment * 100).toFixed(0)}/100`;
      },
    },
    {
      agent: "sentiment",
      generate: () => {
        const fg = market.fearGreed;
        const label = fg > 70 ? "codicia extrema" : fg > 50 ? "codicia moderada" : fg > 30 ? "miedo moderado" : "miedo extremo";
        return `Fear & Greed: ${fg.toFixed(0)}/100 (${label}) | Flujo institucional: ${Math.random() > 0.5 ? "positivo" : "neutral"} | Sentimiento general: ${market.sentiment > 0.6 ? "alcista" : market.sentiment > 0.4 ? "neutral" : "bajista"}`;
      },
    },
    {
      agent: "execution",
      generate: () => {
        const lastTrades = portfolio.trades.slice(-3);
        if (lastTrades.length === 0) return "No hay operaciones recientes. Motor en espera de señales.";
        const last = lastTrades[lastTrades.length - 1];
        const pnlText = last.pnl ? (last.pnl > 0 ? `+${last.pnl.toFixed(2)} USD` : `${last.pnl.toFixed(2)} USD`) : "pendiente";
        return `Última ejecución: ${last.symbol} ${last.side === "long" ? "LARGO" : "CORTO"} | Entrada: ${last.entryPrice} | PnL: ${pnlText} | Confianza: ${(last.confidence * 100).toFixed(0)}%`;
      },
    },
    {
      agent: "portfolio",
      generate: () => {
        return `Equity: ${portfolio.equity.toFixed(2)} USD | PnL Total: ${portfolio.totalPnl >= 0 ? "+" : ""}${portfolio.totalPnl.toFixed(2)} (${portfolio.totalPnlPercent >= 0 ? "+" : ""}${portfolio.totalPnlPercent.toFixed(2)}%) | Exposición: ${(portfolio.exposure * 100).toFixed(1)}% | Sharpe: ${portfolio.sharpeRatio.toFixed(2)}`;
      },
    },
    {
      agent: "strategy",
      generate: () => {
        return `Régimen detectado: ${regime.toUpperCase()} | Estrategia activa: ${getPrimaryStrategy(regime)} | Señales generadas: ${portfolio.totalTrades} | Win Rate: ${portfolio.winRate.toFixed(1)}%`;
      },
    },
  ];

  const selected = agents.filter(() => Math.random() > 0.3);
  for (const { agent, generate } of selected) {
    analyses.push({
      id: generateId(),
      agent,
      message: generate(),
      confidence: getConf(),
      timestamp: Date.now(),
    });
  }

  return analyses;
}

function getPrimaryStrategy(regime: string): string {
  const map: Record<string, string> = {
    trending: "Trend Following + Momentum",
    ranging: "Mean Reversion + Grid",
    volatile: "Scalping + ATR Volatility",
    calm: "VWAP + Swing Trading",
  };
  return map[regime] || "Multi-estrategia adaptativa";
}

export async function generateAnalysis(): Promise<AIAnalysis[]> {
  if (ollamaAvailable && ollamaChecked) {
    const portfolio = getPortfolioState();
    const prompt = `Eres un analista cuantitativo de un hedge fund. Analiza este portafolio y da una recomendación breve (máx 100 palabras):

Capital: $${portfolio.equity.toFixed(2)}
PnL: $${portfolio.totalPnl.toFixed(2)} (${portfolio.totalPnlPercent.toFixed(2)}%)
Operaciones: ${portfolio.totalTrades} (${portfolio.winningTrades} ganadas, ${portfolio.losingTrades} perdidas)
Win Rate: ${portfolio.winRate.toFixed(1)}%
Drawdown: ${portfolio.currentDrawdown.toFixed(1)}%`;

    const response = await queryOllama(prompt);
    if (response) {
      return [{
        id: generateId(),
        agent: "strategy",
        message: response.trim(),
        confidence: randomBetween(0.75, 0.95),
        timestamp: Date.now(),
      }];
    }
  }

  return generateProceduralAnalysis();
}

export function generateTerminalMessages(): TerminalMessage[] {
  const messages: TerminalMessage[] = [];
  const market = getMarketState();
  const portfolio = getPortfolioState();
  const regime = getMarketRegime();

  const templates: { module: TerminalMessage["module"]; level: TerminalMessage["level"]; text: string }[] = [
    { module: "AI", level: "info", text: `[ANALYSIS] ${regime === "trending" ? "Tendencia alcista confirmada en múltiples activos" : regime === "volatile" ? "Volatilidad elevada — ajustando stops" : "Mercado en rango — estrategia mean reversion activa"}` },
    { module: "RISK", level: portfolio.currentDrawdown > 10 ? "warning" : "success", text: portfolio.currentDrawdown > 10 ? `[WARNING] Drawdown actual: ${portfolio.currentDrawdown.toFixed(1)}%. Considerar reducir exposición` : `[OK] Riesgo controlado. Drawdown: ${portfolio.currentDrawdown.toFixed(1)}%. Exposición: ${(portfolio.exposure * 100).toFixed(1)}%` },
    { module: "EXECUTION", level: "success", text: `[EXEC] Escaneando ${Object.keys(market.prices).length} activos — ${portfolio.openPositions} posiciones abiertas` },
    { module: "NEWS", level: "info", text: `[FEED] ${market.fearGreed > 70 ? "Sentimiento de codicia extrema detectado" : market.fearGreed < 30 ? "Miedo extremo en el mercado — posible oportunidad" : "Sentimiento neutral — operando con normalidad"}` },
    { module: "PORTFOLIO", level: "info", text: `[BALANCE] Equity: $${portfolio.equity.toFixed(2)} | PnL: ${portfolio.totalPnl >= 0 ? "+" : ""}$${portfolio.totalPnl.toFixed(2)} (${portfolio.totalPnlPercent >= 0 ? "+" : ""}${portfolio.totalPnlPercent.toFixed(2)}%)` },
    { module: "SYSTEM", level: "system", text: `[SYS] Tick actualizado — ${new Date().toLocaleTimeString()}` },
    { module: "MARKET", level: market.sentiment > 0.6 ? "success" : "info", text: market.sentiment > 0.6 ? `[MARKET] Sentimiento: ${(market.sentiment * 100).toFixed(0)}/100 — Alcista` : `[MARKET] Sentimiento: ${(market.sentiment * 100).toFixed(0)}/100 — ${market.sentiment > 0.4 ? "Neutral" : "Bajista"}` },
  ];

  const selected = templates.filter(() => Math.random() > 0.3);
  for (const { module, level, text } of selected) {
    messages.push({
      id: generateId(),
      module,
      message: text,
      level,
      timestamp: Date.now(),
    });
  }

  return messages;
}
