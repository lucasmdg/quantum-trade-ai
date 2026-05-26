"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { useEngineStore } from "@/store/engine-store";
import { formatCurrency } from "@/lib/utils";
import { Filter, Check } from "lucide-react";

export default function HistoryPage() {
  const trades = useEngineStore(s => s.trades);
  const [sideFilter, setSideFilter] = useState<"all" | "long" | "short">("all");
  const [pnlFilter, setPnlFilter] = useState<"all" | "win" | "loss">("all");

  const filtered = trades.filter(t => {
    if (sideFilter !== "all" && t.side !== sideFilter) return false;
    if (pnlFilter === "win" && (!t.pnl || t.pnl < 0)) return false;
    if (pnlFilter === "loss" && (!t.pnl || t.pnl >= 0)) return false;
    return true;
  });

  const wins = trades.filter(t => t.pnl && t.pnl > 0).length;
  const losses = trades.filter(t => t.pnl && t.pnl < 0).length;
  const winRate = (wins + losses) > 0 ? (wins / (wins + losses)) * 100 : 0;
  const totalPnl = trades.reduce((s, t) => s + (t.pnl || 0), 0);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Trade History</h1>
      <div className="grid grid-cols-3 gap-4 text-[11px]">
        <Card><CardContent className="py-3 text-center"><div className="text-lg font-bold text-accent">{trades.length}</div><div className="text-dim">Total Trades</div></CardContent></Card>
        <Card><CardContent className="py-3 text-center"><div className="text-lg font-bold text-green">{wins}</div><div className="text-dim">Wins ({winRate.toFixed(0)}%)</div></CardContent></Card>
        <Card><CardContent className="py-3 text-center"><div className="text-lg font-bold text-red">{losses}</div><div className="text-dim">Losses</div></CardContent></Card>
      </div>
      <div className="flex items-center gap-2">
        <Filter size={14} className="text-dim" />
          {(["all", "long", "short"] as const).map(s => (
          <Button key={s} size="sm" variant={sideFilter === s ? "default" : "outline"} onClick={() => setSideFilter(s)} className="text-[10px]">
            {s === "all" ? "All" : s === "long" ? "Long" : "Short"} {sideFilter === s && <Check size={10} />}
          </Button>
        ))}
        <div className="w-px h-5 bg-border" />
        {(["all", "win", "loss"] as const).map(p => (
          <Button key={p} size="sm" variant={pnlFilter === p ? p === "win" ? "green" : p === "loss" ? "red" : "default" : "outline"} onClick={() => setPnlFilter(p)} className="text-[10px]">
            {p === "all" ? "All" : p === "win" ? "Wins" : "Losses"} {pnlFilter === p && <Check size={10} />}
          </Button>
        ))}
      </div>
      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[60vh] px-4">
            <div className="space-y-1 py-1">
              {filtered.length === 0 && <p className="text-[11px] text-dim py-8 text-center">No trades match filters</p>}
              {[...filtered].reverse().map((t, i) => (
                <div key={i} className="flex items-center justify-between py-2 text-[11px] border-b border-border/20">
                  <div>
                  <div className="font-semibold">{t.symbol}</div>
                  <div className="text-[10px] text-dim">{new Date(t.openedAt || Date.now()).toLocaleString()} · {t.quantity.toFixed(4)} @ {t.entryPrice.toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <Badge variant={t.side === "long" ? "green" : "red"}>{t.side.toUpperCase()}</Badge>
                    <div className={`text-[10px] mt-0.5 ${t.pnl && t.pnl >= 0 ? "text-green" : t.pnl && t.pnl < 0 ? "text-red" : "text-dim"}`}>{t.pnl ? `${t.pnl >= 0 ? "+" : ""}${formatCurrency(t.pnl)}` : "—"}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
