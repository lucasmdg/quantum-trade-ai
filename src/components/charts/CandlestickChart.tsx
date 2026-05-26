"use client";

import { useRef, useEffect, useMemo } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEngineStore } from "@/store/engine-store";
import { getPriceHistory } from "@/engine/market";

// Simplified candlestick using div bars (avoids heavy tradingview dependency at render time)
export default function CandlestickChart() {
  const { prices, tickCount } = useEngineStore();
  const symbol = "BTC/USD";
  const tick = prices[symbol];

  const history = useMemo(() => {
    return getPriceHistory(symbol, 60);
  }, [tickCount, tick?.price]);

  if (history.length < 2) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{symbol} — Price Action</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] flex items-center justify-center text-xs text-dim">
            Waiting for data...
          </div>
        </CardContent>
      </Card>
    );
  }

  const prices_arr = history.map((h) => h.price);
  const min = Math.min(...prices_arr);
  const max = Math.max(...prices_arr);
  const range = max - min || 1;

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>{symbol} — Price Action</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] flex items-end gap-[2px]">
          {history.map((h, i) => {
            const isUp = h.price >= h.open;
            const height = ((h.price - min) / range) * 100;
            return (
              <div
                key={i}
                className="flex-1 rounded-sm transition-all duration-200 cursor-pointer relative group"
                style={{
                  height: `${Math.max(height, 2)}%`,
                  background: isUp ? "var(--color-green)" : "var(--color-red)",
                  opacity: 0.8,
                }}
              >
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-elevated border border-border rounded px-2 py-1 text-[10px] whitespace-nowrap z-10">
                  ${h.price.toFixed(0)} | Vol: {(h.volume / 1000).toFixed(0)}K
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-between text-[10px] text-dim mt-1">
          <span>${min.toFixed(0)}</span>
          <span className="font-semibold text-text">${prices[symbol]?.price.toFixed(0) || "—"}</span>
          <span>${max.toFixed(0)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
