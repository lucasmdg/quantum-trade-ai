import type { RiskMetrics, Position } from "@/types";
import { getPortfolioState, getPositions } from "./portfolio";
import { clamp } from "@/lib/utils";

export function calculateRiskMetrics(): RiskMetrics {
  const state = getPortfolioState();
  const positions = getPositions();
  const dailyReturns = state.dailyReturns;
  const avgRet = dailyReturns.length > 0 ? dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length : 0;
  const variance = dailyReturns.length > 1
    ? dailyReturns.reduce((a, b) => a + (b - avgRet) ** 2, 0) / dailyReturns.length
    : 0.0001;
  const std = Math.sqrt(variance);

  const negativeReturns = dailyReturns.filter(r => r < 0);
  const downsideVariance = negativeReturns.length > 0
    ? negativeReturns.reduce((a, b) => a + b ** 2, 0) / negativeReturns.length
    : 0.0001;

  const concentration = positions.length > 0
    ? Math.max(...positions.map(p => Math.abs(p.pnlPercent))) / 100
    : 0;
  const winRate = state.winRate / 100 || 0.5;
  const kelly = winRate - (1 - winRate);

  return {
    var_95: -1.645 * std * Math.sqrt(state.equity),
    var_99: -2.326 * std * Math.sqrt(state.equity),
    sharpeRatio: std > 0 ? (avgRet / std) * Math.sqrt(252) : 0,
    sortinoRatio: Math.sqrt(downsideVariance) > 0 ? (avgRet / Math.sqrt(downsideVariance)) * Math.sqrt(252) : 0,
    maxDrawdown: state.maxDrawdown,
    currentDrawdown: state.currentDrawdown,
    volatility: std * 100,
    beta: 0.85 + Math.random() * 0.3,
    alpha: (std > 0 ? (avgRet / std) * Math.sqrt(252) : 0) > 1 ? 2 + Math.random() * 5 : -3 + Math.random() * 5,
    kellyFraction: clamp(kelly, 0, 0.5),
    riskScore: clamp(
      (state.currentDrawdown / 30) * 0.3 + (1 - (std > 0 ? (avgRet / std) * Math.sqrt(252) : 0) / 5) * 0.3 + state.exposure * 0.2 + concentration * 0.1,
      0, 1,
    ),
    exposure: state.exposure,
    concentrationRisk: concentration,
    circuitBreakerActive: state.currentDrawdown > 25 || state.exposure > 0.9,
  };
}

export function evaluatePositionRisk(pos: Position) {
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
