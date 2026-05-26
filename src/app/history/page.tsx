"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEngineStore } from "@/store/engine-store";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import { Download, Search } from "lucide-react";

export default function HistoryPage() {
  const { trades } = useEngineStore();
  const [filter, setFilter] = useState<string>("all");

  const closedTrades = useMemo(
    () => trades.filter((t) => t.status === "closed").reverse(),
    [trades],
  );

  const filtered = useMemo(() => {
    if (filter === "all") return closedTrades;
    if (filter === "win") return closedTrades.filter((t) => t.pnl && t.pnl > 0);
    if (filter === "loss") return closedTrades.filter((t) => t.pnl && t.pnl <= 0);
    return closedTrades;
  }, [closedTrades, filter]);

  const stats = useMemo(() => {
    const wins = closedTrades.filter((t) => t.pnl && t.pnl > 0).length;
    const losses = closedTrades.filter((t) => t.pnl && t.pnl <= 0).length;
    const totalPnl = closedTrades.reduce((s, t) => s + (t.pnl || 0), 0);
    return { wins, losses, total: closedTrades.length, totalPnl };
  }, [closedTrades]);

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6 space-y-6 max-w-6xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-semibold mb-1">Trade History</h1>
          <p className="text-xs text-dim">Historial completo de operaciones ejecutadas</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-[10px] text-dim font-mono">Total Trades</div>
              <div className="text-xl font-bold font-mono number-font">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-[10px] text-dim font-mono">Winning</div>
              <div className="text-xl font-bold text-green font-mono number-font">{stats.wins}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-[10px] text-dim font-mono">Losing</div>
              <div className="text-xl font-bold text-red font-mono number-font">{stats.losses}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center gap-2">
          {[
            { key: "all", label: "All" },
            { key: "win", label: "Wins" },
            { key: "loss", label: "Losses" },
          ].map((f) => (
            <Button
              key={f.key}
              size="sm"
              variant={filter === f.key ? "default" : "ghost"}
              onClick={() => setFilter(f.key)}
              className="text-[11px]"
            >
              {f.label}
            </Button>
          ))}
          <div className="flex-1" />
          <Button size="sm" variant="outline" className="text-[11px]">
            <Download size={12} />
            Export CSV
          </Button>
        </div>

        <Card>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <p className="text-xs text-dim text-center py-12">No trades match the selected filter.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-dim border-b border-border">
                      <th className="text-left p-3 font-mono font-normal">Date</th>
                      <th className="text-left p-3 font-mono font-normal">Symbol</th>
                      <th className="text-left p-3 font-mono font-normal">Side</th>
                      <th className="text-right p-3 font-mono font-normal">Entry</th>
                      <th className="text-right p-3 font-mono font-normal">Exit</th>
                      <th className="text-right p-3 font-mono font-normal">PnL</th>
                      <th className="text-right p-3 font-mono font-normal hidden sm:table-cell">Strategy</th>
                      <th className="text-right p-3 font-mono font-normal hidden md:table-cell">Confidence</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((t) => (
                      <tr key={t.id} className="border-b border-border/20 hover:bg-elevated/30 transition-colors">
                        <td className="p-3 text-dim">{t.closedAt ? formatDate(t.closedAt) : "—"}</td>
                        <td className="p-3 font-medium">{t.symbol}</td>
                        <td className="p-3">
                          <Badge variant={t.side === "long" ? "green" : "red"}>{t.side.toUpperCase()}</Badge>
                        </td>
                        <td className="p-3 text-right font-mono number-font">{formatCurrency(t.entryPrice)}</td>
                        <td className="p-3 text-right font-mono number-font">{t.exitPrice ? formatCurrency(t.exitPrice) : "—"}</td>
                        <td className={`p-3 text-right font-mono number-font ${t.pnl && t.pnl >= 0 ? "text-green" : "text-red"}`}>
                          {t.pnl ? `${t.pnl >= 0 ? "+" : ""}${formatCurrency(t.pnl)}` : "—"}
                        </td>
                        <td className="p-3 text-right hidden sm:table-cell">
                          <Badge variant="accent">{t.strategy.replace(/_/g, " ").slice(0, 12)}</Badge>
                        </td>
                        <td className="p-3 text-right text-dim font-mono hidden md:table-cell">
                          {(t.confidence * 100).toFixed(0)}%
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
