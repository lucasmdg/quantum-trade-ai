"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useEngineStore } from "@/store/engine-store";
import { formatCurrency, formatPercent, formatTime } from "@/lib/utils";

export default function OpenPositions() {
  const { positions } = useEngineStore();

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Open Positions ({positions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {positions.length === 0 ? (
          <p className="text-xs text-dim text-center py-8">No hay posiciones abiertas</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-dim border-b border-border">
                  <th className="text-left font-mono font-normal pb-2 pr-3">Symbol</th>
                  <th className="text-left font-mono font-normal pb-2 pr-3">Side</th>
                  <th className="text-right font-mono font-normal pb-2 pr-3">Entry</th>
                  <th className="text-right font-mono font-normal pb-2 pr-3">Current</th>
                  <th className="text-right font-mono font-normal pb-2 pr-3">PnL</th>
                  <th className="text-right font-mono font-normal pb-2 pr-3 hidden sm:table-cell">Leverage</th>
                  <th className="text-right font-mono font-normal pb-2 pr-3 hidden md:table-cell">Strategy</th>
                  <th className="text-right font-mono font-normal pb-2 hidden md:table-cell">Time</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((pos, i) => (
                  <tr key={`${pos.symbol}-${pos.openedAt}`} className="border-b border-border/50 animate-fade-in">
                    <td className="py-2.5 pr-3 font-medium">{pos.symbol}</td>
                    <td className="py-2.5 pr-3">
                      <Badge variant={pos.side === "long" ? "green" : "red"}>
                        {pos.side.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="py-2.5 pr-3 text-right font-mono number-font">{formatCurrency(pos.entryPrice)}</td>
                    <td className="py-2.5 pr-3 text-right font-mono number-font">{formatCurrency(pos.currentPrice)}</td>
                    <td className={`py-2.5 pr-3 text-right font-mono number-font ${pos.pnl >= 0 ? "text-green" : "text-red"}`}>
                      {formatCurrency(pos.pnl)}
                      <span className="text-[10px] ml-1">({formatPercent(pos.pnlPercent)})</span>
                    </td>
                    <td className="py-2.5 pr-3 text-right hidden sm:table-cell">{pos.leverage}x</td>
                    <td className="py-2.5 pr-3 text-right hidden md:table-cell">
                      <Badge variant="accent">{pos.strategy.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</Badge>
                    </td>
                    <td className="py-2.5 text-right text-dim hidden md:table-cell">{formatTime(pos.openedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
