import { ASSETS, INITIAL_PRICES } from "@/lib/constants";
import { randomBetween, clamp, generateId } from "@/lib/utils";
import type { PriceTick, MacroEvent, NewsItem } from "@/types";

type PriceMap = Record<string, number>;
type HistoryMap = Record<string, PriceTick[]>;

let prices: PriceMap = { ...INITIAL_PRICES };
let history: HistoryMap = {};
let volatilities: Record<string, number> = {};
let trends: Record<string, number> = {};
let sentiment = 0.5;
let btcDominance = 54.2;
let fearGreed = 55;
let globalVolatility = 1;
let tickCount = 0;
let activeEvent: MacroEvent | null = null;

const CORRELATION_GROUPS: Record<string, string[]> = {
  crypto: ["BTC/USD", "ETH/USD", "SOL/USD", "XRP/USD", "ADA/USD", "BNB/USD", "AVAX/USD", "DOGE/USD", "LINK/USD", "LTC/USD", "PEPE/USD", "SHIB/USD", "TON/USD", "SUI/USD", "APT/USD"],
  forex: ["EUR/USD", "USD/JPY", "GBP/USD", "USD/CNY"],
  indices: ["SP500", "NASDAQ", "DJI", "DAX", "IBEX35", "NIKKEI"],
  commodities: ["XAU/USD", "XAG/USD", "USOIL", "NGAS"],
  tech: ["AAPL", "NVDA", "MSFT", "META", "AMZN", "GOOGL"],
};

export function getMarketState() {
  return { prices, volatilities, sentiment, fearGreed, btcDominance, globalVolatility, activeEvent };
}
export function getPriceHistory(symbol: string, limit = 100): PriceTick[] {
  return (history[symbol] || []).slice(-limit);
}
export function getAllHistory(): HistoryMap { return history; }
export function getPrice(symbol: string): number { return prices[symbol] ?? 0; }

function applyEventImpact() {
  if (!activeEvent) return;
  const e = activeEvent;
  globalVolatility = e.impact.volatilityMultiplier;
  for (const sym of e.affected) {
    if (prices[sym] !== undefined) prices[sym] *= (1 + e.impact.priceChange * randomBetween(0.8, 1.2));
  }
  sentiment = clamp(sentiment + e.impact.sentimentShift * randomBetween(0.5, 1.5), 0, 1);
  e.impact.duration--;
  if (e.impact.duration <= 0) { activeEvent = null; globalVolatility = 1; }
}

function correlatedMove(symbol: string, baseChange: number): number {
  for (const [, members] of Object.entries(CORRELATION_GROUPS)) {
    if (members.includes(symbol)) return baseChange * randomBetween(0.6, 1);
  }
  return baseChange;
}

export function setNewsImpact(news: NewsItem) {
  const impactMultiplier = news.impact === "extreme" ? 3 : news.impact === "high" ? 1.5 : news.impact === "medium" ? 0.8 : 0.2;
  const sentimentDir = news.sentiment === "bullish" ? 1 : news.sentiment === "bearish" ? -1 : 0;
  sentiment = clamp(sentiment + sentimentDir * 0.08 * impactMultiplier, 0, 1);
  for (const sym of news.symbols) {
    if (prices[sym] !== undefined) prices[sym] *= (1 + sentimentDir * randomBetween(0.01, 0.04) * impactMultiplier);
  }
}

export function generateMacroEvent(): MacroEvent | null {
  const eventTypes: MacroEvent["type"][] = [
    "flash_crash", "breakout", "fomo", "liquidation", "news_spike",
    "volatility_expansion", "trend_reversal", "macro_shock", "correction", "rally"
  ];
  const weights = [3, 8, 6, 4, 10, 7, 5, 3, 5, 6];
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  let type: MacroEvent["type"] = "news_spike";
  for (let i = 0; i < eventTypes.length; i++) { r -= weights[i]; if (r <= 0) { type = eventTypes[i]; break; } }

  const severity = randomBetween(0.3, 1);
  const isBullish = Math.random() > 0.45;
  const magnitude = severity * randomBetween(0.02, 0.08);
  const priceChange = (isBullish ? 1 : -1) * magnitude;
  const volMultiplier = 1 + severity * randomBetween(0.5, 2);
  const duration = Math.floor(severity * randomBetween(3, 15));

  const eventData: Record<string, { affected: string[] }> = {
    flash_crash: { affected: ["BTC/USD", "ETH/USD", "SOL/USD", "SP500", "NASDAQ"] },
    breakout: { affected: ["BTC/USD", "SOL/USD", "NVDA", "TSLA"] },
    fomo: { affected: ["BTC/USD", "ETH/USD", "PEPE/USD", "DOGE/USD"] },
    liquidation: { affected: ["BTC/USD", "ETH/USD", "SOL/USD", "AVAX/USD"] },
    news_spike: { affected: ["EUR/USD", "SP500", "XAU/USD", "US10Y"] },
    volatility_expansion: { affected: ASSETS.map(a => a.symbol).filter(() => Math.random() > 0.5) },
    trend_reversal: { affected: ["BTC/USD", "ETH/USD", "SOL/USD", "ADA/USD"] },
    macro_shock: { affected: ["SP500", "NASDAQ", "DJI", "DAX", "EUR/USD", "USOIL"] },
    correction: { affected: ["SP500", "NASDAQ", "DJI", "DAX", "IBEX35", "NIKKEI"] },
    rally: { affected: ["SP500", "NASDAQ", "DJI", "BTC/USD", "ETH/USD"] },
  };

  const e = eventData[type];
  return {
    id: generateId(),
    name: type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    type, severity,
    description: `${type.replace(/_/g, " ")} detectado en mercados`,
    timestamp: Date.now(),
    affected: e.affected,
    impact: { priceChange, volatilityMultiplier: volMultiplier, sentimentShift: isBullish ? 0.1 : -0.1, duration },
  };
}

export function triggerMacroEvent(event: MacroEvent) { activeEvent = event; }

export function marketTick(): PriceTick[] {
  tickCount++;
  if (Math.random() < 0.005 && !activeEvent) { const event = generateMacroEvent(); if (event) activeEvent = event; }
  if (activeEvent) applyEventImpact();

  const ticks: PriceTick[] = [];
  for (const asset of ASSETS) {
    const sym = asset.symbol;
    const current = prices[sym];
    if (current === undefined) continue;
    if (!volatilities[sym]) volatilities[sym] = randomBetween(0.001, 0.015);
    if (!trends[sym]) trends[sym] = randomBetween(-0.0005, 0.0005);

    const change = (volatilities[sym] * randomBetween(-1, 1) + trends[sym]) * globalVolatility;
    const correlated = correlatedMove(sym, change);
    prices[sym] = current * (1 + correlated);

    const clsVol = asset.class === "crypto" ? 0.06 : asset.class === "stock" ? 0.03 : 0.02;
    volatilities[sym] = clamp(volatilities[sym] + randomBetween(-0.002, 0.002) * globalVolatility, 0.0005, clsVol);
    trends[sym] = clamp(trends[sym] + randomBetween(-0.0003, 0.0003), -0.003, 0.003);

    const tick: PriceTick = {
      symbol: sym, price: prices[sym], open: current,
      high: Math.max(current, prices[sym] * (1 + Math.abs(correlated) * 1.5)),
      low: Math.min(current, prices[sym] * (1 - Math.abs(correlated) * 1.5)),
      volume: Math.floor(randomBetween(1000, 100000) * (1 + Math.abs(correlated) * 10)),
      change: prices[sym] - current,
      changePercent: ((prices[sym] - current) / current) * 100,
      timestamp: Date.now(),
    };
    if (!history[sym]) history[sym] = [];
    history[sym].push(tick);
    if (history[sym].length > 500) history[sym].shift();
    ticks.push(tick);
  }

  btcDominance = clamp(btcDominance + randomBetween(-0.2, 0.2), 45, 65);
  fearGreed = clamp(fearGreed + randomBetween(-3, 3), 10, 95);
  sentiment = clamp(sentiment + randomBetween(-0.03, 0.03), 0, 1);
  if (globalVolatility > 1 && Math.random() < 0.1) globalVolatility = clamp(globalVolatility - randomBetween(0.05, 0.2), 1, 5);
  return ticks;
}
