import type { PortfolioState, TradeOrder, Position, PriceTick } from "@/types";

let state: PortfolioState = {
  balance: 10_000, equity: 10_000, initialCapital: 10_000,
  totalPnl: 0, totalPnlPercent: 0, dailyPnl: 0, weeklyPnl: 0, monthlyPnl: 0, yearlyPnl: 0,
  openPositions: 0, totalTrades: 0, winningTrades: 0, losingTrades: 0, winRate: 0,
  sharpeRatio: 0, maxDrawdown: 0, currentDrawdown: 0, exposure: 0, marginUsed: 0, availableMargin: 0,
  dailyReturns: [], equityHistory: [{ time: Date.now(), value: 10000 }], trades: [],
};

let positions: Map<string, Position> = new Map();

export function getPortfolioState(): PortfolioState { return { ...state }; }
export function getPositions(): Position[] { return Array.from(positions.values()); }

export function initializeCapital(capital: number) {
  state.initialCapital = capital; state.balance = capital; state.equity = capital;
  state.equityHistory = [{ time: Date.now(), value: capital }];
}

export function openPosition(
  symbol: string, side: "long" | "short", quantity: number, price: number,
  strategy: TradeOrder["strategy"], confidence: number, reasoning: string,
): TradeOrder | null {
  const cost = quantity * price;
  const margin = cost * 0.1;
  if (margin > state.availableMargin) return null;
  state.balance -= margin; state.marginUsed += margin;
  state.availableMargin = state.equity - state.marginUsed;
  state.openPositions = positions.size + 1;

  const stopLoss = side === "long" ? price * 0.95 : price * 1.05;
  const takeProfit = side === "long" ? price * 1.15 : price * 0.85;
  const pos: Position = {
    symbol, side, quantity, entryPrice: price, currentPrice: price,
    pnl: 0, pnlPercent: 0, leverage: 10, stopLoss, takeProfit, strategy, openedAt: Date.now(),
  };
  positions.set(`${symbol}-${side}-${Date.now()}`, pos);

  const order: TradeOrder = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    symbol, side, type: "market", status: "open", entryPrice: price, quantity,
    leverage: 10, stopLoss, takeProfit, strategy, confidence, reasoning,
    openedAt: Date.now(), fees: cost * 0.001,
  };
  state.totalTrades++; state.trades.push(order);
  return order;
}

export function closePosition(pos: Position, exitPrice: number): TradeOrder | null {
  const pnlRaw = pos.side === "long"
    ? (exitPrice - pos.entryPrice) * pos.quantity
    : (pos.entryPrice - exitPrice) * pos.quantity;
  const pnl = pnlRaw * pos.leverage;

  const margin = pos.quantity * pos.entryPrice * 0.1;
  state.balance += margin + pnl;
  state.marginUsed -= margin;
  state.totalPnl += pnl;
  state.totalPnlPercent = (state.equity - state.initialCapital) / state.initialCapital * 100;
  state.equity = state.balance;
  state.availableMargin = state.equity - state.marginUsed;
  state.openPositions = positions.size - 1;

  if (pnl > 0) state.winningTrades++; else state.losingTrades++;
  state.winRate = state.totalTrades > 0 ? (state.winningTrades / state.totalTrades) * 100 : 0;

  const order = state.trades.find(t => t.symbol === pos.symbol && t.status === "open" && t.entryPrice === pos.entryPrice);
  if (order) { order.status = "closed"; order.exitPrice = exitPrice; order.pnl = pnl; order.closedAt = Date.now(); }

  positions.delete(`${pos.symbol}-${pos.side}-${pos.openedAt}`);
  const dd = calculateDrawdown();
  state.currentDrawdown = dd;
  if (dd > state.maxDrawdown) state.maxDrawdown = dd;
  state.equityHistory.push({ time: Date.now(), value: state.equity });
  state.dailyPnl += pnl; state.weeklyPnl += pnl; state.monthlyPnl += pnl; state.yearlyPnl += pnl;
  state.sharpeRatio = calculateSharpe();
  return order || null;
}

export function updatePositions(prices: Record<string, PriceTick>) {
  let totalUnrealizedPnl = 0; let totalExposure = 0;
  for (const [, pos] of positions) {
    const tick = prices[pos.symbol];
    if (!tick) continue;
    pos.currentPrice = tick.price;
    const rawPnl = pos.side === "long"
      ? (tick.price - pos.entryPrice) * pos.quantity
      : (pos.entryPrice - tick.price) * pos.quantity;
    pos.pnl = rawPnl * pos.leverage;
    pos.pnlPercent = ((tick.price - pos.entryPrice) / pos.entryPrice) * 100 * pos.leverage;
    totalUnrealizedPnl += pos.pnl;
    totalExposure += pos.quantity * tick.price;

    if ((pos.side === "long" && tick.price <= pos.stopLoss) || (pos.side === "long" && tick.price >= pos.takeProfit) ||
        (pos.side === "short" && tick.price >= pos.stopLoss) || (pos.side === "short" && tick.price <= pos.takeProfit)) {
      closePosition(pos, tick.price);
    }
  }
  state.equity = state.balance + totalUnrealizedPnl;
  state.exposure = totalExposure / (state.equity || 1);
  state.availableMargin = state.equity - state.marginUsed;
  state.currentDrawdown = calculateDrawdown();
  if (state.currentDrawdown > state.maxDrawdown) state.maxDrawdown = state.currentDrawdown;
}

function calculateDrawdown(): number {
  if (state.equityHistory.length < 2) return 0;
  const peak = Math.max(...state.equityHistory.map(e => e.value));
  return peak > 0 ? ((peak - state.equity) / peak) * 100 : 0;
}

function calculateSharpe(): number {
  if (state.dailyReturns.length < 5) return 1.5;
  const avg = state.dailyReturns.reduce((a, b) => a + b, 0) / state.dailyReturns.length;
  const variance = state.dailyReturns.reduce((a, b) => a + (b - avg) ** 2, 0) / state.dailyReturns.length;
  const std = Math.sqrt(variance);
  return std > 0 ? (avg / std) * Math.sqrt(252) : 0;
}

export function recordDailyReturn(ret: number) {
  state.dailyReturns.push(ret);
  if (state.dailyReturns.length > 365) state.dailyReturns.shift();
}
