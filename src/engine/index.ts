import { marketTick, generateMacroEvent, triggerMacroEvent, getPrice } from "./market";
import { initializeCapital, updatePositions, recordDailyReturn, getPortfolioState } from "./portfolio";
import { evaluateTrading, getMarketRegime } from "./trading";
import { generateNews } from "./news";
import { generateAnalysis, generateTerminalMessages, setOllamaAvailable } from "./ai";
import type { PriceTick, NewsItem, AIAnalysis } from "@/types";
import { DEFAULT_CAPITAL } from "@/lib/constants";

type Listener = () => void;
const listeners = new Set<Listener>();
let running = false;
let tickTimeout: ReturnType<typeof setTimeout> | null = null;
let speed = 1000;
let lastPrices: Record<string, PriceTick> = {};
let lastNewsTime = Date.now();

export function subscribe(listener: Listener) { listeners.add(listener); return () => listeners.delete(listener); }
function notify() { listeners.forEach(l => l()); }

export function setSpeed(multiplier: number) {
  speed = Math.max(100, 2000 / multiplier);
  if (running) { stop(); start(); }
}

export function init(capital = DEFAULT_CAPITAL) {
  initializeCapital(capital);
  if (typeof window !== "undefined") {
    fetch("http://localhost:11434/api/tags", { signal: AbortSignal.timeout(2000) })
      .then(r => setOllamaAvailable(r.ok))
      .catch(() => setOllamaAvailable(false));
  }
}

export function getLastPrices() { return lastPrices; }

export function tick() {
  const ticks = marketTick();
  for (const t of ticks) lastPrices[t.symbol] = t;
  updatePositions(lastPrices);
  evaluateTrading(lastPrices);
  const terminalMessages = generateTerminalMessages();
  const now = Date.now();
  let newsItems: NewsItem[] = [];
  if (now - lastNewsTime > 8000 + Math.random() * 12000) { newsItems = [generateNews()]; lastNewsTime = now; }
  if (Math.random() < 0.01) { recordDailyReturn(getPortfolioState().totalPnlPercent / 100); }
  return { ticks, trades: [], terminalMessages, news: newsItems, analyses: [] as AIAnalysis[] };
}

export function start() {
  if (running) return;
  running = true;
  const loop = () => {
    if (!running) return;
    tick();
    notify();
    generateAnalysis().then(() => notify());
    tickTimeout = setTimeout(loop, speed);
  };
  loop();
}

export function stop() { running = false; if (tickTimeout) { clearTimeout(tickTimeout); tickTimeout = null; } }
export function isRunning() { return running; }
export function setCapital(capital: number) { initializeCapital(capital); notify(); }
