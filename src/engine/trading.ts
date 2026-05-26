import { ASSETS, STRATEGIES } from "@/lib/constants";
import { randomBetween } from "@/lib/utils";
import type { TradeOrder, StrategyName, PriceTick } from "@/types";
import { openPosition } from "./portfolio";
import { getPortfolioState } from "./portfolio";

let strategyWeights: Partial<Record<StrategyName, number>> = {};
let marketRegime: "trending" | "ranging" | "volatile" | "calm" = "ranging";
let lastStrategyChange = Date.now();

const STRATEGY_WEIGHTS: Record<string, StrategyName[]> = {
  trending: ["trend_following", "momentum", "ema_cross", "smart_money"],
  ranging: ["mean_reversion", "grid", "bbounce", "rsi_reversal"],
  volatile: ["scalping", "atr_volatility", "liquidity_grab", "wyckoff"],
  calm: ["vwap", "arbitrage", "macd_cross", "swing"],
};

export function analyzeRegime(prices: Record<string, PriceTick>): void {
  const btc = prices["BTC/USD"];
  if (!btc) return;
  const vol = Math.abs(btc.changePercent);
  if (vol > 3) marketRegime = "volatile";
  else if (vol > 1) marketRegime = "trending";
  else if (Math.random() < 0.3) marketRegime = "ranging";
  else marketRegime = "calm";

  if (Date.now() - lastStrategyChange > 60000) {
    lastStrategyChange = Date.now();
  }
}

function generateSignal(symbol: string, price: number): {
  shouldTrade: boolean; side: "long" | "short"; strategy: StrategyName;
  confidence: number; reasoning: string;
} | null {
  if (Math.random() > 0.15) return null;
  const strategies = STRATEGY_WEIGHTS[marketRegime];
  const strategy = strategies[Math.floor(Math.random() * strategies.length)];
  const confidence = Math.min(randomBetween(0.3, 0.85) * (marketRegime === "trending" ? 1.15 : 1), 0.95);
  const side = Math.random() > 0.48 ? "long" : "short";

  const reasonings: Record<string, string[]> = {
    scalping: ["Micro-estructura alcista detectada", "Order book desbalanceado", "Flujo agresivo comprador"],
    swing: ["Estructura 4H alcista", "Acumulación en zona de valor", "Patrón de continuación"],
    mean_reversion: [`RSI en sobreventa (${Math.floor(randomBetween(20, 35))})`, "Desviación Bollinger 2σ", "Rechazo en soporte"],
    momentum: ["Momentum confirmado", "Volumen +40%", "Aceleración de precio"],
    trend_following: ["Tendencia multi-timeframe", "EMA alcista", "Higher high + higher low"],
    grid: ["Rango óptimo detectado", "Volatilidad reducida"],
    vwap: ["Precio bajo VWAP", "Reversión a media probable"],
    rsi_reversal: [`RSI 14 en ${Math.floor(randomBetween(25, 30))}`, "Divergencia alcista"],
    macd_cross: ["MACD cruce alcista", "Histograma en expansión"],
    bbounce: ["Bollinger lower band touch", "Rebote probable"],
    ema_cross: ["EMA 9 > EMA 21", "Cruce alcista confirmado"],
    smart_money: ["Order block alcista", "Liquidez acumulada", "Flujo institucional"],
    liquidity_grab: ["Liquidity grab en mínimos", "Reversión desde zona clave"],
    wyckoff: ["Acumulación Wyckoff", "Spring confirmado"],
    atr_volatility: ["ATR expandido", "Volatilidad favorable"],
  };
  const reasons = reasonings[strategy] || [`Señal de ${strategy}`];
  const reasoning = reasons[Math.floor(Math.random() * reasons.length)];
  return { shouldTrade: true, side, strategy, confidence, reasoning };
}

export function evaluateTrading(prices: Record<string, PriceTick>): TradeOrder[] {
  const newTrades: TradeOrder[] = [];
  if (Object.keys(prices).length === 0) return newTrades;
  analyzeRegime(prices);

  const state = getPortfolioState();
  const maxPositions = state.equity > 50000 ? 12 : state.equity > 25000 ? 8 : 5;
  const currentPositions = state.openPositions;
  if (currentPositions >= maxPositions) return newTrades;

  const candidates = ASSETS.filter(() => Math.random() > 0.4).sort(() => Math.random() - 0.5).slice(0, 3);
  for (const asset of candidates) {
    const price = prices[asset.symbol]?.price;
    if (!price) continue;
    if (currentPositions + newTrades.length >= maxPositions) break;
    const signal = generateSignal(asset.symbol, price);
    if (!signal || !signal.shouldTrade) continue;
    const riskPerTrade = state.equity * randomBetween(0.01, 0.05);
    const quantity = riskPerTrade / price;
    const order = openPosition(asset.symbol, signal.side, quantity, price, signal.strategy, signal.confidence, signal.reasoning);
    if (order) newTrades.push(order);
  }
  return newTrades;
}

export function getMarketRegime() { return marketRegime; }
