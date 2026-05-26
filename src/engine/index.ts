import { marketTick, generateMacroEvent, triggerMacroEvent, getPrice } from "./market";
import { initializeCapital, updatePositions, recordDailyReturn, getPortfolioState, getPositions } from "./portfolio";
import { evaluateTrading, getMarketRegime } from "./trading";
import { generateNews } from "./news";
import { generateAnalysis, generateTerminalMessages, isOllamaAvailable, setOllamaAvailable } from "./ai";
import { calculateRiskMetrics } from "./risk";
import type { TerminalMessage, NewsItem, AIAnalysis, PriceTick, TradeOrder } from "@/types";
import { DEFAULT_CAPITAL } from "@/lib/constants";

type Listener = () => void;

const listeners = new Set<Listener>();
let running = false;
let tickInterval: ReturnType<typeof setInterval> | null = null;
let speed = 1000;
let lastPrices: Record<string, PriceTick> = {};
let lastNewsTime = Date.now();
let lastAnalysisTime = Date.now();

export function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function notify() {
  listeners.forEach((l) => l());
}

export function setSpeed(multiplier: number) {
  speed = Math.max(100, 2000 / multiplier);
  if (running) {
    stop();
    start();
  }
}

export function init(capital = DEFAULT_CAPITAL) {
  initializeCapital(capital);

  if (typeof window !== "undefined") {
    checkOllama();
  }
}

async function checkOllama() {
  try {
    const res = await fetch("http://localhost:11434/api/tags", { signal: AbortSignal.timeout(2000) });
    setOllamaAvailable(res.ok);
  } catch {
    setOllamaAvailable(false);
  }
}

export function getLastPrices() {
  return lastPrices;
}

export function tick() {
  const ticks = marketTick();
  for (const t of ticks) {
    lastPrices[t.symbol] = t;
  }

  updatePositions(lastPrices);

  const newTrades = evaluateTrading(lastPrices);
  const terminalMessages = generateTerminalMessages();

  const now = Date.now();
  let newsItems: NewsItem[] = [];
  let analyses: AIAnalysis[] = [];

  if (now - lastNewsTime > 8000 + Math.random() * 12000) {
    newsItems = [generateNews()];
    lastNewsTime = now;
  }

  if (now - lastAnalysisTime > 15000 + Math.random() * 15000) {
    generateAnalysis().then((a) => {
      analyses = a;
      notify();
    });
    lastAnalysisTime = now;
  }

  // Daily return tracking (~each 100 ticks = 1 day)
  if (Math.random() < 0.01) {
    const state = getPortfolioState();
    recordDailyReturn(state.totalPnlPercent / 100);
  }

  return { ticks: [...ticks], trades: newTrades, terminalMessages, news: newsItems, analyses };
}

export function start() {
  if (running) return;
  running = true;

  const loop = () => {
    if (!running) return;
    tick();
    notify();
    tickInterval = setTimeout(loop, speed);
  };

  loop();
}

export function stop() {
  running = false;
  if (tickInterval) {
    clearTimeout(tickInterval);
    tickInterval = null;
  }
}

export function isRunning() {
  return running;
}

export function setCapital(capital: number) {
  initializeCapital(capital);
  notify();
}
