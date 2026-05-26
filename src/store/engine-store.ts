import { create } from "zustand";
import type { PriceTick, TradeOrder, TerminalMessage, NewsItem, AIAnalysis, PortfolioState, RiskMetrics } from "@/types";
import { init, start, stop, setSpeed, subscribe, getLastPrices } from "@/engine";
import { getPortfolioState, getPositions } from "@/engine/portfolio";
import { calculateRiskMetrics } from "@/engine/risk";
import { getMarketState } from "@/engine/market";
import { getMarketRegime } from "@/engine/trading";
import { generateTerminalMessages } from "@/engine/ai";
import { generateNews } from "@/engine/news";
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
}

export const useEngineStore = create<EngineStore>((set, get) => {
  let msgBuf: TerminalMessage[] = [];
  let newsBuf: NewsItem[] = [];
  let analysisBuf: AIAnalysis[] = [];

  return {
    initialized: false, running: false, prices: {}, portfolio: getPortfolioState(),
    positions: [], riskMetrics: calculateRiskMetrics(), terminalMessages: [],
    news: [], analysis: [], trades: [], sentiment: 0.5, fearGreed: 55,
    btcDominance: 54.2, regime: "ranging", tickCount: 0,

    initEngine: (capital = DEFAULT_CAPITAL) => {
      init(capital);
      subscribe(() => {
        const store = get();
        if (!store.initialized) set({ initialized: true });
        const state = getPortfolioState();
        const m = getMarketState();
        if (Math.random() < 0.4) { msgBuf.push(...generateTerminalMessages()); if (msgBuf.length > 200) msgBuf = msgBuf.slice(-100); }
        if (Math.random() < 0.05) { newsBuf.push(generateNews()); if (newsBuf.length > 50) newsBuf.shift(); }
        if (Math.random() < 0.15) {
          import("@/engine/ai").then(({ generateAnalysis }) => generateAnalysis().then(a => { analysisBuf.push(...a); if (analysisBuf.length > 20) analysisBuf = analysisBuf.slice(-10); }));
        }
        set({
          prices: { ...getLastPrices() }, portfolio: { ...state },
          positions: [...getPositions()], riskMetrics: { ...calculateRiskMetrics() },
          sentiment: m.sentiment, fearGreed: m.fearGreed, btcDominance: m.btcDominance,
          regime: getMarketRegime(), tickCount: store.tickCount + 1,
          trades: [...state.trades], terminalMessages: [...msgBuf], news: [...newsBuf],
          analysis: [...analysisBuf],
        });
      });
      set({ initialized: true });
    },

    startEngine: () => { start(); set({ running: true }); },
    stopEngine: () => { stop(); set({ running: false }); },
    setSimSpeed: (mult: number) => { setSpeed(mult); },
  };
});
