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
let eventTimer = 0;

const CORRELATION_GROUPS: Record<string, string[]> = {
  crypto: ["BTC/USD", "ETH/USD", "SOL/USD", "XRP/USD", "ADA/USD", "BNB/USD", "AVAX/USD", "DOGE/USD", "LINK/USD", "LTC/USD", "PEPE/USD", "SHIB/USD", "TON/USD", "SUI/USD", "APT/USD"],
  forex: ["EUR/USD", "USD/JPY", "GBP/USD", "USD/CNY"],
  indices: ["SP500", "NASDAQ", "DJI", "DAX", "IBEX35", "NIKKEI"],
  commodities: ["XAU/USD", "XAG/USD", "USOIL", "NGAS"],
  bonds: ["US10Y"],
  rates: ["EURIBOR", "FEDRATE"],
  tech: ["AAPL", "NVDA", "MSFT", "META", "AMZN", "GOOGL"],
};

export function getMarketState() {
  return { prices, volatilities, sentiment, fearGreed, btcDominance, globalVolatility, activeEvent };
}

export function getPriceHistory(symbol: string, limit = 100): PriceTick[] {
  return (history[symbol] || []).slice(-limit);
}

export function getAllHistory(): HistoryMap {
  return history;
}

export function getPrice(symbol: string): number {
  return prices[symbol] ?? 0;
}

function applyEventImpact() {
  if (!activeEvent) return;
  const e = activeEvent;
  globalVolatility = e.impact.volatilityMultiplier;
  for (const sym of e.affected) {
    if (prices[sym] !== undefined) {
      prices[sym] *= (1 + e.impact.priceChange * randomBetween(0.8, 1.2));
    }
  }
  sentiment = clamp(sentiment + e.impact.sentimentShift * randomBetween(0.5, 1.5), 0, 1);
  e.impact.duration--;
  if (e.impact.duration <= 0) {
    activeEvent = null;
    globalVolatility = 1;
  }
}

function correlatedMove(symbol: string, baseChange: number): number {
  for (const [, members] of Object.entries(CORRELATION_GROUPS)) {
    if (members.includes(symbol)) {
      const groupFactor = randomBetween(0.6, 1);
      return baseChange * groupFactor;
    }
  }
  return baseChange;
}

export function setNewsImpact(news: NewsItem) {
  const impactMultiplier = news.impact === "extreme" ? 3 : news.impact === "high" ? 1.5 : news.impact === "medium" ? 0.8 : 0.2;
  const sentimentDir = news.sentiment === "bullish" ? 1 : news.sentiment === "bearish" ? -1 : 0;
  sentiment = clamp(sentiment + sentimentDir * 0.08 * impactMultiplier, 0, 1);

  for (const sym of news.symbols) {
    if (prices[sym] !== undefined) {
      const shock = sentimentDir * randomBetween(0.01, 0.04) * impactMultiplier;
      prices[sym] *= (1 + shock);
    }
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
  for (let i = 0; i < eventTypes.length; i++) {
    r -= weights[i];
    if (r <= 0) { type = eventTypes[i]; break; }
  }

  const severity = randomBetween(0.3, 1);
  const isBullish = Math.random() > 0.45;
  const magnitude = severity * randomBetween(0.02, 0.08);
  const priceChange = (isBullish ? 1 : -1) * magnitude;
  const volMultiplier = 1 + severity * randomBetween(0.5, 2);
  const duration = Math.floor(severity * randomBetween(3, 15));

  const events: Record<string, { description: string; affected: string[] }> = {
    flash_crash: { description: "Flash Crash repentino detectado en mercados", affected: ["BTC/USD", "ETH/USD", "SOL/USD", "SP500", "NASDAQ"] },
    breakout: { description: "Breakout alcista confirmado con volumen elevado", affected: ["BTC/USD", "SOL/USD", "NVDA", "TSLA"] },
    fomo: { description: "FOMO masivo empuja precios al alza", affected: ["BTC/USD", "ETH/USD", "PEPE/USD", "DOGE/USD"] },
    liquidation: { description: "Cascada de liquidaciones en cadena", affected: ["BTC/USD", "ETH/USD", "SOL/USD", "AVAX/USD"] },
    news_spike: { description: "Noticia macro impacta mercados globales", affected: ["EUR/USD", "SP500", "XAU/USD", "US10Y"] },
    volatility_expansion: { description: "Expansión de volatilidad en todos los activos", affected: ASSETS.map(a => a.symbol).filter(s => Math.random() > 0.5) },
    trend_reversal: { description: "Reversión de tendencia en criptoactivos", affected: ["BTC/USD", "ETH/USD", "SOL/USD", "ADA/USD"] },
    macro_shock: { description: "Shock macroeconómico global", affected: ["SP500", "NASDAQ", "DJI", "DAX", "EUR/USD", "USOIL"] },
    correction: { description: "Corrección técnica del -5% en índices", affected: ["SP500", "NASDAQ", "DJI", "DAX", "IBEX35", "NIKKEI"] },
    rally: { description: "Rally generalizado por optimismo económico", affected: ["SP500", "NASDAQ", "DJI", "BTC/USD", "ETH/USD"] },
  };

  const e = events[type];
  return {
    id: generateId(),
    name: type.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
    type,
    severity,
    description: e.description,
    timestamp: Date.now(),
    affected: e.affected,
    impact: { priceChange, volatilityMultiplier: volMultiplier, sentimentShift: isBullish ? 0.1 : -0.1, duration },
  };
}

export function triggerMacroEvent(event: MacroEvent) {
  activeEvent = event;
}

export function marketTick(): PriceTick[] {
  tickCount++;
  eventTimer++;

  if (Math.random() < 0.005 && !activeEvent) {
    const event = generateMacroEvent();
    if (event) { activeEvent = event; }
  }
  if (activeEvent) applyEventImpact();

  const ticks: PriceTick[] = [];
  for (const asset of ASSETS) {
    const sym = asset.symbol;
    const current = prices[sym];
    if (current === undefined) continue;

    if (!volatilities[sym]) volatilities[sym] = randomBetween(0.001, 0.015);
    if (!trends[sym]) trends[sym] = randomBetween(-0.0005, 0.0005);

    const baseVol = volatilities[sym];
    const trend = trends[sym];
    const noise = randomBetween(-1, 1);
    const momentum = (tickCount % 20 === 0) ? randomBetween(-0.005, 0.005) : 0;
    const change = (baseVol * noise + trend + momentum) * globalVolatility;
    const correlated = correlatedMove(sym, change);

    prices[sym] = current * (1 + correlated);

    const assetClass = asset.class;
    const clsVol = assetClass === "crypto" ? 0.06 : assetClass === "stock" ? 0.03 : 0.02;
    volatilities[sym] = clamp(volatilities[sym] + randomBetween(-0.002, 0.002) * globalVolatility, 0.0005, clsVol);
    trends[sym] = clamp(trends[sym] + randomBetween(-0.0003, 0.0003), -0.003, 0.003);

    const open = current;
    const high = Math.max(open, prices[sym] * (1 + Math.abs(correlated) * 1.5));
    const low = Math.min(open, prices[sym] * (1 - Math.abs(correlated) * 1.5));
    const volume = randomBetween(1000, 100000) * (1 + Math.abs(correlated) * 10);

    const tick: PriceTick = {
      symbol: sym,
      price: prices[sym],
      open,
      high,
      low,
      volume: Math.floor(volume),
      change: prices[sym] - open,
      changePercent: ((prices[sym] - open) / open) * 100,
      timestamp: Date.now(),
    };

    if (!history[sym]) history[sym] = [];
    history[sym].push(tick);
    if (history[sym].length > 500) history[sym].shift();

    ticks.push(tick);
  }

  btcDominance += randomBetween(-0.2, 0.2);
  btcDominance = clamp(btcDominance, 45, 65);
  fearGreed = clamp(fearGreed + randomBetween(-3, 3), 10, 95);
  sentiment = clamp(sentiment + randomBetween(-0.03, 0.03), 0, 1);

  if (globalVolatility > 1 && Math.random() < 0.1) {
    globalVolatility = clamp(globalVolatility - randomBetween(0.05, 0.2), 1, 5);
  }

  return ticks;
}
