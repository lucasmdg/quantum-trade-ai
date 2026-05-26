"use client";

import { useEngineStore } from "@/store/engine-store";
import { useSettingsStore } from "@/store/settings-store";
import { Button } from "@/components/ui/button";
import { Play, Square, Clock, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function Header() {
  const { running, startEngine, stopEngine, portfolio } = useEngineStore();
  const { simulationSpeed, setSimulationSpeed } = useSettingsStore();

  return (
    <header className="sticky top-0 z-30 glass-panel border-b border-border px-4 lg:px-6 py-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Button
              size="sm"
              variant={running ? "red" : "green"}
              onClick={running ? stopEngine : startEngine}
              className="text-[11px]"
            >
              {running ? <Square size={12} /> : <Play size={12} />}
              {running ? "STOP" : "START"}
            </Button>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-dim">
            <Clock size={12} />
            {[0.5, 1, 2, 5, 10].map((s) => (
              <button
                key={s}
                onClick={() => setSimulationSpeed(s as typeof simulationSpeed)}
                className={`px-1.5 py-0.5 rounded font-mono transition-colors ${
                  simulationSpeed === s ? "text-accent bg-accent/10" : "hover:text-text"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs number-font">
          <div className="text-right">
            <div className="text-[10px] text-dim font-mono">EQUITY</div>
            <div className="font-semibold">{formatCurrency(portfolio.equity)}</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-dim font-mono">PNL</div>
            <div className={`font-semibold flex items-center gap-1 ${portfolio.totalPnl >= 0 ? "text-green" : "text-red"}`}>
              {portfolio.totalPnl >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
              {formatPercent(portfolio.totalPnlPercent)}
            </div>
          </div>
          <div className="text-right hide-mobile">
            <div className="text-[10px] text-dim font-mono">DRAWDOWN</div>
            <div className={`font-semibold ${portfolio.currentDrawdown > 10 ? "text-red" : "text-dim"}`}>
              {portfolio.currentDrawdown.toFixed(1)}%
            </div>
          </div>
          <div className="text-right hide-mobile">
            <div className="text-[10px] text-dim font-mono">POSICIONES</div>
            <div className="font-semibold text-accent">{portfolio.openPositions}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
