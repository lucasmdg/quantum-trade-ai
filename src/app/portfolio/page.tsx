"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEngineStore } from "@/store/engine-store";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { TrendingUp, TrendingDown, DollarSign, Target, Shield } from "lucide-react";

export default function PortfolioPage() {
  const p = useEngineStore(s => s.portfolio);
  const r = useEngineStore(s => s.riskMetrics);
  const positions = useEngineStore(s => s.positions);
  const trades = useEngineStore(s => s.trades);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Portfolio</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard icon={DollarSign} label="Balance" value={formatCurrency(p.balance)} sub={`Equity: ${formatCurrency(p.equity)}`} color="text-accent" />
        <MetricCard icon={p.totalPnl >= 0 ? TrendingUp : TrendingDown} label="P&L" value={formatCurrency(p.totalPnl)} sub={formatPercent(p.totalPnlPercent)} color={p.totalPnl >= 0 ? "text-green" : "text-red"} />
        <MetricCard icon={Target} label="Sharpe" value={r.sharpeRatio.toFixed(2)} sub={`Sortino: ${r.sortinoRatio.toFixed(2)}`} color={r.sharpeRatio >= 1.5 ? "text-green" : "text-amber"} />
        <MetricCard icon={Shield} label="Drawdown" value={`${p.currentDrawdown.toFixed(1)}%`} sub={`Max: ${r.maxDrawdown.toFixed(1)}%`} color={p.currentDrawdown > 10 ? "text-red" : "text-amber"} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Open Positions</CardTitle></CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-64 px-4">
              <div className="space-y-1 py-1">
                {positions.length === 0 && <p className="text-[11px] text-dim py-4 text-center">No open positions</p>}
                {positions.map((pos, i) => (
                  <div key={i} className="flex items-center justify-between py-2 text-[11px] border-b border-border/20">
                    <div>
                      <div className="font-semibold">{pos.symbol}</div>
                      <div className="text-[10px] text-dim">{pos.side} · {pos.quantity.toFixed(4)} · Entry: ${pos.entryPrice.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <div className={`font-mono ${pos.pnl >= 0 ? "text-green" : "text-red"}`}>{formatCurrency(pos.pnl)}</div>
                      <Badge variant={pos.pnl >= 0 ? "green" : "red"}>{pos.pnlPercent >= 0 ? "+" : ""}{pos.pnlPercent.toFixed(2)}%</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Trade History</CardTitle></CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-64 px-4">
              <div className="space-y-1 py-1">
                {trades.length === 0 && <p className="text-[11px] text-dim py-4 text-center">No trades yet</p>}
                {[...trades].reverse().slice(0, 30).map((t, i) => (
                  <div key={i} className="flex items-center justify-between py-1.5 text-[11px] border-b border-border/20">
                    <div>
                      <div className="font-semibold">{t.symbol}</div>
                      <div className="text-[10px] text-dim">{t.side} @ {t.entryPrice.toFixed(2)}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant={t.side === "long" ? "green" : "red"}>{t.side.toUpperCase()}</Badge>
                      <div className={`text-[10px] mt-0.5 ${t.pnl && t.pnl >= 0 ? "text-green" : t.pnl && t.pnl < 0 ? "text-red" : "text-dim"}`}>{t.pnl ? formatCurrency(t.pnl) : "—"}</div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Risk Details</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px]">
            <RiskItem label="Sharpe" value={r.sharpeRatio.toFixed(2)} progress={Math.min(r.sharpeRatio / 3 * 100, 100)} color={r.sharpeRatio >= 1.5 ? "var(--color-green)" : "var(--color-amber)"} />
            <RiskItem label="Sortino" value={r.sortinoRatio.toFixed(2)} progress={Math.min(r.sortinoRatio / 2 * 100, 100)} color={r.sortinoRatio >= 1 ? "var(--color-green)" : "var(--color-amber)"} />
            <RiskItem label="VaR 95%" value={`${(r.var_95 / 100).toFixed(1)}%`} progress={Math.min(Math.abs(r.var_95) / 500 * 100, 100)} color={Math.abs(r.var_95) > 500 ? "var(--color-red)" : Math.abs(r.var_95) > 200 ? "var(--color-amber)" : "var(--color-green)"} />
            <RiskItem label="Kelly" value={`${(r.kellyFraction * 100).toFixed(1)}%`} progress={Math.max(0, Math.min(r.kellyFraction * 100 * 5, 100))} color={r.kellyFraction > 0 ? "var(--color-green)" : "var(--color-red)"} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string; sub: string; color: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 py-4">
        <Icon size={20} className={color} />
        <div>
          <div className={`text-base font-bold number-font ${color}`}>{value}</div>
          <div className="text-[10px] text-dim">{label}</div>
          <div className="text-[10px] text-dim">{sub}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function RiskItem({ label, value, progress, color }: { label: string; value: string; progress: number; color: string }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono text-dim">{label}</span>
        <span className="font-semibold font-mono" style={{ color }}>{value}</span>
      </div>
      <Progress value={progress} indicatorColor={color} />
    </div>
  );
}
