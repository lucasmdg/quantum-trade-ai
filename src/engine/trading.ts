import { ASSETS, STRATEGIES, CRYPTO_SYMBOLS, INDEX_SYMBOLS } from "@/lib/constants";
import { randomBetween, weightedRandom, generateId } from "@/lib/utils";
import type { TradeOrder, StrategyName, PriceTick } from "@/types";
import { getPrice } from "./market";
import { openPosition, closePosition, getPositions, getPortfolioState } from "./portfolio";

let strategyWeights: Partial<Record<StrategyName, number>> = {};
let marketRegime: "trending" | "ranging" | "volatile" | "calm" = "ranging";
let lastStrategyChange = Date.now();
let tradeCount = 0;

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
    const candidates = STRATEGY_WEIGHTS[marketRegime];
    const primary = candidates[Math.floor(Math.random() * candidates.length)];
    strategyWeights = {};
    for (const s of STRATEGIES.map((s) => s.name)) {
      strategyWeights[s] = candidates.includes(s) ? randomBetween(3, 8) : randomBetween(0.5, 2);
    }
    lastStrategyChange = Date.now();
  }
}

function generateSignal(symbol: string, price: number): {
  shouldTrade: boolean;
  side: "long" | "short";
  strategy: StrategyName;
  confidence: number;
  reasoning: string;
} | null {
  const asset = ASSETS.find((a) => a.symbol === symbol);
  if (!asset) return null;

  if (Math.random() > 0.15) return null;

  const strategies = STRATEGY_WEIGHTS[marketRegime];
  const strategy = strategies[Math.floor(Math.random() * strategies.length)];

  const baseConfidence = randomBetween(0.3, 0.85);
  const vol = Math.abs((price - (asset.decimals ? price : 0)) / price);
  const confidence = baseConfidence * (vol > 0.02 ? 1.2 : 1) * (marketRegime === "trending" ? 1.15 : 1);
  const side = Math.random() > 0.48 ? "long" : "short";

  const reasonings: Record<string, string[]> = {
    scalping: [`Micro-estructura alcista en ${symbol}`, `Flujo de órdenes agresivo detectado`, `Desequilibrio en order book`],
    swing: [`Estructura de mercado alcista en timeframe 4H`, `Acumulación institucional en zona de valor`, `Patrón de continuación`],
    mean_reversion: [`RSI en zona de sobreventa (${Math.floor(randomBetween(20, 35))})`, `Desviación de 2σ en Bollinger`, `Rechazo en soporte clave`],
    momentum: [`Momentum alcista confirmado`, `Volumen creciendo un ${Math.floor(randomBetween(30, 80))}%`, `Aceleración en precio`],
    trend_following: [`Tendencia alcista en múltiples timeframes`, `EMA 50 cruzando al alza`, `Higher high + higher low`],
    grid: [`Rango establecido entre ${formatPrice(price * 0.95)} - ${formatPrice(price * 1.05)}`, `Volatilidad reducida, óptimo para grid`],
    arbitrage: [`Diferencia de precio del ${randomBetween(0.1, 0.5).toFixed(2)}% entre exchanges`, `Oportunidad de arbitraje detectada`],
    vwap: [`Precio por debajo de VWAP en sesión`, `Reversión hacia media ponderada probable`],
    rsi_reversal: [`RSI 14 en ${Math.floor(randomBetween(25, 30))}, divergencia alcista`, `Sobreventa extrema`],
    macd_cross: [`MACD cruzando al alza`, `Histograma MACD en expansión positiva`],
    bbounce: [`Precio tocando banda inferior de Bollinger`, `Rebote probabilístico alto`],
    ema_cross: [`EMA 9 cruzando EMA 21 al alza`, `Medias móviles alineadas bullish`],
    smart_money: [`Liquidez acumulada en zona de compras`, `Order blocks alcistas identificados`, `Citinial flow detectado`],
    liquidity_grab: [`Captura de liquidez en mínimos anteriores`, `Reversión desde zona de alta liquidez`],
    wyckoff: [`Fase de acumulación Wyckoff completada`, `Spring alcista confirmado`],
    atr_volatility: [`ATR expandido, volatilidad favorable`, `Stop loss ajustado por ATR`],
  };

  const reasons = reasonings[strategy] || [`Señal de ${strategy} generada para ${symbol}`];
  const reasoning = reasons[Math.floor(Math.random() * reasons.length)];

  return { shouldTrade: true, side, strategy, confidence: Math.min(confidence, 0.95), reasoning };
}

function formatPrice(p: number): string {
  return p > 1000 ? `$${p.toFixed(0)}` : p > 1 ? `$${p.toFixed(2)}` : `$${p.toFixed(4)}`;
}

export function evaluateTrading(prices: Record<string, PriceTick>): TradeOrder[] {
  const newTrades: TradeOrder[] = [];
  if (Object.keys(prices).length === 0) return newTrades;

  tradeCount++;
  analyzeRegime(prices);

  const state = getPortfolioState();
  const maxPositions = state.equity > 50000 ? 12 : state.equity > 25000 ? 8 : 5;
  const currentPositions = getPositions().length;

  if (currentPositions >= maxPositions) return newTrades;

  const tradeable = ASSETS.filter(() => Math.random() > 0.4);
  const shuffle = tradeable.sort(() => Math.random() - 0.5);
  const candidates = shuffle.slice(0, 3);

  for (const asset of candidates) {
    const price = prices[asset.symbol]?.price;
    if (!price) continue;
    if (currentPositions + newTrades.length >= maxPositions) break;

    const signal = generateSignal(asset.symbol, price);
    if (!signal || !signal.shouldTrade) continue;

    const riskPerTrade = state.equity * randomBetween(0.01, 0.05);
    const quantity = riskPerTrade / price;

    const order = openPosition(
      asset.symbol,
      signal.side,
      quantity,
      price,
      signal.strategy,
      signal.confidence,
      signal.reasoning,
    );
    if (order) newTrades.push(order);
  }

  return newTrades;
}

export function getMarketRegime() {
  return marketRegime;
}
