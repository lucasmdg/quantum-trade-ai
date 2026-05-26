"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useEngineStore } from "@/store/engine-store";
import { formatCurrency, formatPercent, formatTime, formatDate } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";

export default function PortfolioPage() {
  const { portfolio, positions, trades } = useEngineStore();

  const closedTrades = useMemo(() => trades.filter((t) => t.status === "closed").reverse(), [trades]);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6 space-y-6 max-w-6xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-semibold mb-1">Portfolio</h1>
          <p className="text-xs text-dim">Visión completa de tu cartera y rendimiento</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Balance", value: formatCurrency(portfolio.balance) },
            { label: "Equity", value: formatCurrency(portfolio.equity), up: portfolio.totalPnl >= 0 },
            { label: "Total PnL", value: formatCurrency(portfolio.totalPnl), up: portfolio.totalPnl >= 0 },
            { label: "Total Trades", value: portfolio.totalTrades.toString() },
          ].map((m) => (
            <Card key={m.label}>
              <CardContent className="p-4">
                <div className="text-[10px] text-dim font-mono mb-1">{m.label}</div>
                <div className={`text-lg font-semibold font-mono number-font ${m.up !== undefined ? (m.up ? "text-green" : "text-red") : ""}`}>
                  {m.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Win Rate", value: `${portfolio.winRate.toFixed(1)}%`, up: portfolio.winRate > 50 },
            { label: "Max Drawdown", value: `${portfolio.maxDrawdown.toFixed(1)}%`, up: false },
            { label: "Sharpe Ratio", value: portfolio.sharpeRatio.toFixed(2), up: portfolio.sharpeRatio > 1 },
            { label: "Open Positions", value: portfolio.openPositions.toString() },
          ].map((m) => (
            <Card key={m.label}>
              <CardContent className="p-4">
                <div className="text-[10px] text-dim font-mono mb-1">{m.label}</div>
                <div className={`text-lg font-semibold font-mono number-font ${m.up !== undefined ? (m.up ? "text-green" : "text-red") : "text-text"}`}>
                  {m.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            {positions.length === 0 ? (
              <p className="text-xs text-dim text-center py-8">No hay posiciones abiertas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-dim border-b border-border">
                      <th className="text-left pb-2 pr-3 font-mono font-normal">Symbol</th>
                      <th className="text-left pb-2 pr-3 font-mono font-normal">Side</th>
                      <th className="text-right pb-2 pr-3 font-mono font-normal">Entry</th>
                      <th className="text-right pb-2 pr-3 font-mono font-normal">Current</th>
                      <th className="text-right pb-2 pr-3 font-mono font-normal">PnL</th>
                      <th className="text-right pb-2 pr-3 font-mono font-normal hidden sm:table-cell">Strategy</th>
                      <th className="text-right pb-2 font-mono font-normal hidden md:table-cell">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {positions.map((pos) => {
                      const duration = Math.floor((Date.now() - pos.openedAt) / 60000);
                      return (
                        <tr key={`${pos.symbol}-${pos.openedAt}`} className="border-b border-border/30">
                          <td className="py-3 pr-3 font-medium">{pos.symbol}</td>
                          <td className="py-3 pr-3">
                            <Badge variant={pos.side === "long" ? "green" : "red"}>{pos.side.toUpperCase()}</Badge>
                          </td>
                          <td className="py-3 pr-3 text-right font-mono number-font">{formatCurrency(pos.entryPrice)}</td>
                          <td className="py-3 pr-3 text-right font-mono number-font">{formatCurrency(pos.currentPrice)}</td>
                          <td className={`py-3 pr-3 text-right font-mono number-font ${pos.pnl >= 0 ? "text-green" : "text-red"}`}>
                            {formatCurrency(pos.pnl)}
                          </td>
                          <td className="py-3 pr-3 text-right hidden sm:table-cell">
                            <Badge variant="accent">{pos.strategy.replace(/_/g, " ")}</Badge>
                          </td>
                          <td className="py-3 text-right text-dim hidden md:table-cell">{duration}m</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Trade History ({closedTrades.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {closedTrades.length === 0 ? (
              <p className="text-xs text-dim text-center py-8">No hay operaciones cerradas aún</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-dim border-b border-border">
                      <th className="text-left pb-2 pr-3 font-mono font-normal">Symbol</th>
                      <th className="text-left pb-2 pr-3 font-mono font-normal">Side</th>
                      <th className="text-right pb-2 pr-3 font-mono font-normal">Entry</th>
                      <th className="text-right pb-2 pr-3 font-mono font-normal">Exit</th>
                      <th className="text-right pb-2 pr-3 font-mono font-normal">PnL</th>
                      <th className="text-right pb-2 pr-3 font-mono font-normal hidden sm:table-cell">Strategy</th>
                      <th className="text-right pb-2 pr-3 font-mono font-normal hidden md:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {closedTrades.slice(0, 50).map((t) => (
                      <tr key={t.id} className="border-b border-border/30">
                        <td className="py-2.5 pr-3 font-medium">{t.symbol}</td>
                        <td className="py-2.5 pr-3">
                          <Badge variant={t.side === "long" ? "green" : "red"}>{t.side.toUpperCase()}</Badge>
                        </td>
                        <td className="py-2.5 pr-3 text-right font-mono number-font">{formatCurrency(t.entryPrice)}</td>
                        <td className="py-2.5 pr-3 text-right font-mono number-font">{t.exitPrice ? formatCurrency(t.exitPrice) : "—"}</td>
                        <td className={`py-2.5 pr-3 text-right font-mono number-font ${t.pnl && t.pnl >= 0 ? "text-green" : "text-red"}`}>
                          {t.pnl ? formatCurrency(t.pnl) : "—"}
                        </td>
                        <td className="py-2.5 pr-3 text-right hidden sm:table-cell">
                          <Badge variant="accent">{t.strategy.replace(/_/g, " ")}</Badge>
                        </td>
                        <td className="py-2.5 text-right text-dim hidden md:table-cell">
                          {t.closedAt ? formatDate(t.closedAt) : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
