import type { RiskMetrics, Position, PortfolioState } from "@/types";
import { getPortfolioState, getPositions } from "./portfolio";
import { ASSETS } from "@/lib/constants";
import { clamp } from "@/lib/utils";

export function calculateRiskMetrics(): RiskMetrics {
  const state = getPortfolioState();
  const positions = getPositions();

  const dailyReturns = state.dailyReturns;
  const avgRet = dailyReturns.length > 0
    ? dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length
    : 0;
  const variance = dailyReturns.length > 1
    ? dailyReturns.reduce((a, b) => a + (b - avgRet) ** 2, 0) / dailyReturns.length
    : 0.0001;
  const std = Math.sqrt(variance);

  const var_95 = -1.645 * std * Math.sqrt(state.equity);
  const var_99 = -2.326 * std * Math.sqrt(state.equity);
  const sharpeRatio = std > 0 ? (avgRet / std) * Math.sqrt(252) : 0;

  const negativeReturns = dailyReturns.filter((r) => r < 0);
  const downsideVariance = negativeReturns.length > 0
    ? negativeReturns.reduce((a, b) => a + b ** 2, 0) / negativeReturns.length
    : 0.0001;
  const downsideStd = Math.sqrt(downsideVariance);
  const sortinoRatio = downsideStd > 0 ? (avgRet / downsideStd) * Math.sqrt(252) : 0;

  const concentration = positions.length > 0
    ? Math.max(...positions.map((p) => Math.abs(p.pnlPercent))) / 100
    : 0;

  const winRate = state.winRate / 100 || 0.5;
  const avgWin = state.winningTrades > 0 ? state.totalPnl * winRate / state.winningTrades : 0;
  const avgLoss = state.losingTrades > 0 ? state.totalPnl * (1 - winRate) / state.losingTrades : 0;
  const kelly = avgLoss !== 0 ? (winRate - (1 - winRate) / (Math.abs(avgWin / avgLoss) || 1)) : 0;

  const circuitBreaker = state.currentDrawdown > 25 || state.exposure > 0.9;

  const riskScore = clamp(
    (state.currentDrawdown / 30) * 0.3 +
    (1 - sharpeRatio / 5) * 0.3 +
    (state.exposure) * 0.2 +
    concentration * 0.1 +
    (circuitBreaker ? 0.2 : 0),
    0, 1,
  );

  const assetSectors = [...new Set(positions.map((p) => {
    const a = ASSETS.find((a2) => a2.symbol === p.symbol);
    return a?.class || "unknown";
  }))];
  const sectorRisk = assetSectors.length <= 1 ? 0.5 : 0;

  return {
    var_95,
    var_99,
    sharpeRatio,
    sortinoRatio,
    maxDrawdown: state.maxDrawdown,
    currentDrawdown: state.currentDrawdown,
    volatility: std * 100,
    beta: 0.85 + Math.random() * 0.3,
    alpha: sharpeRatio > 1 ? randomAround(2, 5) : randomAround(-3, 2),
    kellyFraction: clamp(kelly, 0, 0.5),
    riskScore: clamp(riskScore + sectorRisk, 0, 1),
    exposure: state.exposure,
    concentrationRisk: concentration,
    circuitBreakerActive: circuitBreaker,
  };
}

function randomAround(lo: number, hi: number): number {
  return lo + Math.random() * (hi - lo);
}

export function evaluatePositionRisk(pos: Position): {
  stopLossHit: boolean;
  takeProfitHit: boolean;
  trailingStopHit: boolean;
} {
  const result = { stopLossHit: false, takeProfitHit: false, trailingStopHit: false };

  if (pos.side === "long") {
    if (pos.currentPrice <= pos.stopLoss) result.stopLossHit = true;
    if (pos.currentPrice >= pos.takeProfit) result.takeProfitHit = true;
  } else {
    if (pos.currentPrice >= pos.stopLoss) result.stopLossHit = true;
    if (pos.currentPrice <= pos.takeProfit) result.takeProfitHit = true;
  }

  return result;
}

export function shouldReduceExposure(): boolean {
  const state = getPortfolioState();
  return state.exposure > 0.8 || state.currentDrawdown > 20;
}

export function calculatePositionSize(equity: number, riskPercent: number, entryPrice: number, stopPrice: number): number {
  const riskAmount = equity * riskPercent;
  const priceRisk = Math.abs(entryPrice - stopPrice);
  return priceRisk > 0 ? riskAmount / priceRisk : 0;
}
