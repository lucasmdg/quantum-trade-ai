export type AssetClass = "crypto" | "forex" | "index" | "commodity" | "bond" | "rate" | "stock";

export interface Asset {
  symbol: string;
  name: string;
  class: AssetClass;
  sector?: string;
  decimals: number;
}

export interface PriceTick {
  symbol: string;
  price: number;
  open: number;
  high: number;
  low: number;
  volume: number;
  change: number;
  changePercent: number;
  timestamp: number;
}

export type OrderSide = "long" | "short";
export type OrderStatus = "open" | "closed" | "pending" | "canceled" | "liquidated";
export type OrderType = "market" | "limit" | "stop";
export type StrategyName =
  | "scalping" | "swing" | "mean_reversion" | "momentum"
  | "trend_following" | "grid" | "arbitrage" | "vwap"
  | "rsi_reversal" | "macd_cross" | "bbounce"
  | "ema_cross" | "smart_money" | "liquidity_grab"
  | "wyckoff" | "atr_volatility";

export interface TradeOrder {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderType;
  status: OrderStatus;
  entryPrice: number;
  exitPrice?: number;
  quantity: number;
  leverage: number;
  stopLoss?: number;
  takeProfit?: number;
  trailingStop?: number;
  pnl?: number;
  pnlPercent?: number;
  strategy: StrategyName;
  confidence: number;
  reasoning: string;
  openedAt: number;
  closedAt?: number;
  fees: number;
}

export interface PortfolioState {
  balance: number;
  equity: number;
  initialCapital: number;
  totalPnl: number;
  totalPnlPercent: number;
  dailyPnl: number;
  weeklyPnl: number;
  monthlyPnl: number;
  yearlyPnl: number;
  openPositions: number;
  totalTrades: number;
  winningTrades: number;
  losingTrades: number;
  winRate: number;
  sharpeRatio: number;
  maxDrawdown: number;
  currentDrawdown: number;
  exposure: number;
  marginUsed: number;
  availableMargin: number;
  dailyReturns: number[];
  equityHistory: { time: number; value: number }[];
  trades: TradeOrder[];
}

export interface Position {
  symbol: string;
  side: OrderSide;
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
  leverage: number;
  stopLoss: number;
  takeProfit: number;
  strategy: StrategyName;
  openedAt: number;
}

export interface RiskMetrics {
  var_95: number;
  var_99: number;
  sharpeRatio: number;
  sortinoRatio: number;
  maxDrawdown: number;
  currentDrawdown: number;
  volatility: number;
  beta: number;
  alpha: number;
  kellyFraction: number;
  riskScore: number;
  exposure: number;
  concentrationRisk: number;
  circuitBreakerActive: boolean;
}

export interface NewsItem {
  id: string;
  headline: string;
  summary: string;
  source: string;
  sentiment: "bullish" | "bearish" | "neutral";
  impact: "low" | "medium" | "high" | "extreme";
  symbols: string[];
  timestamp: number;
  fake: boolean;
}

export interface MacroEvent {
  id: string;
  name: string;
  type: "flash_crash" | "breakout" | "fomo" | "liquidation" | "news_spike" | "volatility_expansion" | "trend_reversal" | "macro_shock" | "correction" | "rally";
  severity: number;
  description: string;
  timestamp: number;
  affected: string[];
  impact: {
    priceChange: number;
    volatilityMultiplier: number;
    sentimentShift: number;
    duration: number;
  };
}

export interface AIAnalysis {
  id: string;
  agent: "risk" | "macro" | "sentiment" | "execution" | "portfolio" | "strategy";
  message: string;
  confidence: number;
  timestamp: number;
}

export interface TerminalMessage {
  id: string;
  module: "AI" | "RISK" | "EXECUTION" | "NEWS" | "PORTFOLIO" | "SYSTEM" | "MARKET";
  message: string;
  level: "info" | "success" | "warning" | "error" | "system";
  timestamp: number;
}

export type SimulationSpeed = 0.5 | 1 | 2 | 5 | 10;
export type RiskLevel = "conservative" | "moderate" | "aggressive" | "insane";
export type BotMode = "auto" | "manual";

export interface SettingsState {
  initialCapital: number;
  riskLevel: RiskLevel;
  simulationSpeed: SimulationSpeed;
  botMode: BotMode;
  enabledStrategies: StrategyName[];
  favoriteAssets: string[];
  soundEnabled: boolean;
  darkMode: boolean;
}

export interface MarketState {
  prices: Record<string, PriceTick>;
  history: Record<string, PriceTick[]>;
  volatility: Record<string, number>;
  sentiment: number;
  fearGreed: number;
  btcDominance: number;
  correlations: Record<string, number>;
  lastUpdate: number;
}
