import type { Asset, StrategyName } from "@/types";

export const APP_NAME = "QuantumTrade AI";
export const APP_TAGLINE = "Simulación Cuantitativa de Trading Algorítmico";
export const APP_DESCRIPTION = "Plataforma de simulación de trading con IA — 100% paper trading, 0% riesgo real.";

export const DEFAULT_CAPITAL = 10_000;
export const DEFAULT_RISK_LEVEL = "moderate" as const;
export const DEFAULT_SIMULATION_SPEED = 1 as const;

export const STRATEGIES: { name: StrategyName; label: string; description: string }[] = [
  { name: "scalping", label: "Scalping", description: "Operaciones rápidas de micro-movimientos" },
  { name: "swing", label: "Swing Trading", description: "Capturar movimientos de varios días" },
  { name: "mean_reversion", label: "Mean Reversion", description: "Comprar en sobreventa, vender en sobrecompra" },
  { name: "momentum", label: "Momentum", description: "Seguir la tendencia dominante" },
  { name: "trend_following", label: "Trend Following", description: "Montarse en tendencias establecidas" },
  { name: "grid", label: "Grid Trading", description: "Órdenes escalonadas en rango de precios" },
  { name: "arbitrage", label: "Arbitraje", description: "Explotar diferencias de precio entre pares" },
  { name: "vwap", label: "VWAP", description: "Operar basado en volumen ponderado" },
  { name: "rsi_reversal", label: "RSI Reversal", description: "Reversiones basadas en RSI extremo" },
  { name: "macd_cross", label: "MACD Cross", description: "Cruces de MACD como señal" },
  { name: "bbounce", label: "Bollinger Bounce", description: "Rebotes en bandas de Bollinger" },
  { name: "ema_cross", label: "EMA Cross", description: "Cruces de medias móviles" },
  { name: "smart_money", label: "Smart Money", description: "Conceptos de flujo institucional" },
  { name: "liquidity_grab", label: "Liquidity Grab", description: "Captura de liquidez en zonas clave" },
  { name: "wyckoff", label: "Wyckoff", description: "Acumulación y distribución Wyckoff" },
  { name: "atr_volatility", label: "ATR Volatility", description: "Ajuste por volatilidad ATR" },
];

export const ASSETS: Asset[] = [
  { symbol: "BTC/USD", name: "Bitcoin", class: "crypto", decimals: 0 },
  { symbol: "ETH/USD", name: "Ethereum", class: "crypto", decimals: 0 },
  { symbol: "SOL/USD", name: "Solana", class: "crypto", decimals: 2 },
  { symbol: "XRP/USD", name: "XRP", class: "crypto", decimals: 4 },
  { symbol: "ADA/USD", name: "Cardano", class: "crypto", decimals: 4 },
  { symbol: "BNB/USD", name: "BNB", class: "crypto", decimals: 1 },
  { symbol: "AVAX/USD", name: "Avalanche", class: "crypto", decimals: 2 },
  { symbol: "DOGE/USD", name: "Dogecoin", class: "crypto", decimals: 4 },
  { symbol: "LINK/USD", name: "Chainlink", class: "crypto", decimals: 2 },
  { symbol: "LTC/USD", name: "Litecoin", class: "crypto", decimals: 2 },
  { symbol: "PEPE/USD", name: "PEPE", class: "crypto", decimals: 8 },
  { symbol: "SHIB/USD", name: "Shiba Inu", class: "crypto", decimals: 8 },
  { symbol: "TON/USD", name: "TON", class: "crypto", decimals: 2 },
  { symbol: "SUI/USD", name: "Sui", class: "crypto", decimals: 2 },
  { symbol: "APT/USD", name: "Aptos", class: "crypto", decimals: 2 },
  { symbol: "EUR/USD", name: "Euro/Dólar", class: "forex", decimals: 4 },
  { symbol: "USD/JPY", name: "Dólar/Yen", class: "forex", decimals: 2 },
  { symbol: "GBP/USD", name: "Libra/Dólar", class: "forex", decimals: 4 },
  { symbol: "USD/CNY", name: "Dólar/Yuan", class: "forex", decimals: 4 },
  { symbol: "SP500", name: "S&P 500", class: "index", decimals: 0 },
  { symbol: "NASDAQ", name: "Nasdaq", class: "index", decimals: 0 },
  { symbol: "DJI", name: "Dow Jones", class: "index", decimals: 0 },
  { symbol: "DAX", name: "DAX", class: "index", decimals: 0 },
  { symbol: "IBEX35", name: "IBEX 35", class: "index", decimals: 0 },
  { symbol: "NIKKEI", name: "Nikkei 225", class: "index", decimals: 0 },
  { symbol: "XAU/USD", name: "Oro", class: "commodity", decimals: 2 },
  { symbol: "XAG/USD", name: "Plata", class: "commodity", decimals: 3 },
  { symbol: "USOIL", name: "Petróleo WTI", class: "commodity", decimals: 2 },
  { symbol: "NGAS", name: "Gas Natural", class: "commodity", decimals: 3 },
  { symbol: "US10Y", name: "Bono US 10Y", class: "bond", decimals: 3 },
  { symbol: "EURIBOR", name: "Euríbor", class: "rate", decimals: 3 },
  { symbol: "FEDRATE", name: "Fed Rate", class: "rate", decimals: 2 },
  { symbol: "AAPL", name: "Apple", class: "stock", sector: "tech", decimals: 2 },
  { symbol: "NVDA", name: "Nvidia", class: "stock", sector: "tech", decimals: 2 },
  { symbol: "TSLA", name: "Tesla", class: "stock", sector: "auto", decimals: 2 },
  { symbol: "MSFT", name: "Microsoft", class: "stock", sector: "tech", decimals: 2 },
  { symbol: "META", name: "Meta", class: "stock", sector: "tech", decimals: 2 },
  { symbol: "AMZN", name: "Amazon", class: "stock", sector: "tech", decimals: 2 },
  { symbol: "GOOGL", name: "Google", class: "stock", sector: "tech", decimals: 2 },
];

export const CRYPTO_SYMBOLS = ASSETS.filter((a) => a.class === "crypto").map((a) => a.symbol);
export const FOREX_SYMBOLS = ASSETS.filter((a) => a.class === "forex").map((a) => a.symbol);
export const INDEX_SYMBOLS = ASSETS.filter((a) => a.class === "index").map((a) => a.symbol);
export const COMMODITY_SYMBOLS = ASSETS.filter((a) => a.class === "commodity").map((a) => a.symbol);

export const MODULE_COLORS = {
  AI: "#00F0FF",
  RISK: "#FFAA00",
  EXECUTION: "#00FF88",
  NEWS: "#AA66FF",
  PORTFOLIO: "#FF66AA",
  SYSTEM: "#666666",
  MARKET: "#4D79FF",
} as const;

export const LEVEL_COLORS = {
  info: "#8B949E",
  success: "#00FF88",
  warning: "#FFAA00",
  error: "#FF3355",
  system: "#666666",
} as const;

export const INITIAL_PRICES: Record<string, number> = {
  "BTC/USD": 67200, "ETH/USD": 3450, "SOL/USD": 142.50, "XRP/USD": 0.6210,
  "ADA/USD": 0.4520, "BNB/USD": 578.20, "AVAX/USD": 35.80, "DOGE/USD": 0.0820,
  "LINK/USD": 14.75, "LTC/USD": 72.40, "PEPE/USD": 0.00000125, "SHIB/USD": 0.0000225,
  "TON/USD": 5.85, "SUI/USD": 1.95, "APT/USD": 8.72,
  "EUR/USD": 1.0825, "USD/JPY": 151.30, "GBP/USD": 1.2650, "USD/CNY": 7.2450,
  "SP500": 5210, "NASDAQ": 18350, "DJI": 38750, "DAX": 18120, "IBEX35": 11250, "NIKKEI": 39200,
  "XAU/USD": 2350.50, "XAG/USD": 28.45, "USOIL": 82.75, "NGAS": 2.15,
  "US10Y": 4.325, "EURIBOR": 3.685, "FEDRATE": 5.50,
  "AAPL": 178.50, "NVDA": 875.20, "TSLA": 245.80, "MSFT": 425.15, "META": 510.30,
  "AMZN": 188.45, "GOOGL": 175.60,
};
