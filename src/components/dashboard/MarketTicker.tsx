"use client";

import { useMemo } from "react";
import { useEngineStore } from "@/store/engine-store";

export default function MarketTicker() {
  const { prices } = useEngineStore();

  const entries = useMemo(() => {
    const symbols = ["BTC/USD", "ETH/USD", "SOL/USD", "XRP/USD", "SP500", "NASDAQ", "EUR/USD", "XAU/USD", "USOIL", "AAPL", "NVDA", "TSLA", "MSFT", "BNB/USD", "ADA/USD", "DOGE/USD", "LINK/USD", "AVAX/USD"];
    return symbols
      .filter((s) => prices[s])
      .map((s) => ({
        symbol: s,
        price: prices[s].price,
        change: prices[s].changePercent,
      }));
  }, [prices]);

  if (entries.length === 0) return null;

  const doubled = [...entries, ...entries, ...entries];

  return (
    <div className="col-span-full glass-panel rounded-xl overflow-hidden border border-border h-9">
      <div className="relative flex items-center h-full overflow-hidden">
        <div className="animate-ticker flex items-center gap-6 whitespace-nowrap" style={{ width: "max-content" }}>
          {doubled.map((e, i) => (
            <div key={`${e.symbol}-${i}`} className="inline-flex items-center gap-2 text-xs">
              <span className="font-semibold text-text">{e.symbol}</span>
              <span className="font-mono number-font tabular-nums text-dim">
                {e.price.toFixed(e.price < 1 ? 4 : e.price < 10 ? 3 : e.price < 1000 ? 2 : 0)}
              </span>
              <span className={`font-mono text-[10px] ${e.change >= 0 ? "text-green" : "text-red"}`}>
                {e.change >= 0 ? "+" : ""}{e.change.toFixed(2)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
