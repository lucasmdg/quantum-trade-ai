import { create } from "zustand";
import type { PriceTick, TradeOrder, TerminalMessage, NewsItem, AIAnalysis, PortfolioState, RiskMetrics } from "@/types";
import { init, start, stop, setSpeed, tick, subscribe, getLastPrices } from "@/engine";
import { getPortfolioState, getPositions } from "@/engine/portfolio";
import { calculateRiskMetrics } from "@/engine/risk";
import { getMarketState } from "@/engine/market";
import { getMarketRegime } from "@/engine/trading";
import { DEFAULT_CAPITAL } from "@/lib/constants";

interface EngineStore {
  initialized: boolean;
  running: boolean;
  prices: Record<string, PriceTick>;
  portfolio: PortfolioState;
  positions: ReturnType<typeof getPositions>;
  riskMetrics: RiskMetrics;
  terminalMessages: TerminalMessage[];
  news: NewsItem[];
  analysis: AIAnalysis[];
  trades: TradeOrder[];
  sentiment: number;
  fearGreed: number;
  btcDominance: number;
  regime: string;
  tickCount: number;

  initEngine: (capital?: number) => void;
  startEngine: () => void;
  stopEngine: () => void;
  setSimSpeed: (mult: number) => void;
  manualTick: () => void;
}

export const useEngineStore = create<EngineStore>((set, get) => {
  let messages: TerminalMessage[] = [];
  let newsItems: NewsItem[] = [];
  let analyses: AIAnalysis[] = [];
  let count = 0;

  return {
    initialized: false,
    running: false,
    prices: {},
    portfolio: getPortfolioState(),
    positions: [],
    riskMetrics: calculateRiskMetrics(),
    terminalMessages: [],
    news: [],
    analysis: [],
    trades: [],
    sentiment: 0.5,
    fearGreed: 55,
    btcDominance: 54.2,
    regime: "ranging",
    tickCount: 0,

      initEngine: (capital = DEFAULT_CAPITAL) => {
        init(capital);
        subscribe(() => {
          count++;
          const store = get();
          if (!store.initialized) set({ initialized: true });

          const state = getPortfolioState();
          const marketState = getMarketState();

          set({
            prices: { ...getLastPrices() },
            portfolio: { ...state },
            positions: [...getPositions()],
            riskMetrics: { ...calculateRiskMetrics() },
            sentiment: marketState.sentiment,
            fearGreed: marketState.fearGreed,
            btcDominance: marketState.btcDominance,
            regime: getMarketRegime(),
            tickCount: count,
            trades: [...state.trades],
          });
        });
        set({ initialized: true });
      },

    startEngine: () => {
      start();
      set({ running: true });
    },

    stopEngine: () => {
      stop();
      set({ running: false });
    },

    setSimSpeed: (mult: number) => {
      setSpeed(mult);
    },

    manualTick: () => {
      const result = tick();
      set({
        prices: { ...getLastPrices() },
        portfolio: { ...getPortfolioState() },
        positions: [...getPositions()],
        riskMetrics: { ...calculateRiskMetrics() },
        tickCount: get().tickCount + 1,
      });
    },
  };
});
