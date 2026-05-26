"use client";
import { useMemo } from "react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEngineStore } from "@/store/engine-store";
import { formatPercent } from "@/lib/utils";

const COLORS = ["#00F0FF", "#4D79FF", "#0066FF", "#A78BFA", "#34D399", "#FBBF24", "#F472B6", "#FB923C"];

export default function AnalyticsPage() {
  const prices = useEngineStore(s => s.prices);
  const portfolio = useEngineStore(s => s.portfolio);
  const positions = useEngineStore(s => s.positions);
  const regime = useEngineStore(s => s.regime);

  const allocData = useMemo(() => positions.map(p => ({ name: p.symbol, value: Math.abs(p.quantity * p.currentPrice) })), [positions]);
  const dailyReturns = useMemo(() => {
    const eq = portfolio.equityHistory;
    const rets: { t: number; v: number }[] = [];
    for (let i = 1; i < eq.length; i++) {
      rets.push({ t: i, v: ((eq[i].value - eq[i - 1].value) / eq[i - 1].value) * 100 });
    }
    return rets;
  }, [portfolio.equityHistory]);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-semibold">Analytics</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle>Allocation</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              {allocData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={allocData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" isAnimationActive={false}>
                      {allocData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              ) : <p className="text-[11px] text-dim text-center pt-24">No data</p>}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Daily Returns</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64">
              {dailyReturns.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dailyReturns.slice(-50)} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <XAxis dataKey="t" hide />
                    <YAxis domain={["auto", "auto"]} hide />
                    <Tooltip />
                    <Bar dataKey="v" isAnimationActive={false}>
                      {dailyReturns.slice(-50).map((entry, i) => (
                        <Cell key={i} fill={entry.v >= 0 ? "var(--color-green)" : "var(--color-red)"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : <p className="text-[11px] text-dim text-center pt-24">Waiting for data</p>}
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader><CardTitle>Market Correlation</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {Object.entries(prices).slice(0, 8).map(([sym, p]) => (
              <div key={sym} className="bg-elevated rounded-lg p-3 border border-border">
                <div className="text-[11px] font-semibold mb-1">{sym.replace("/", "")}</div>
                <div className="text-[11px] font-mono">{p.price.toFixed(sym.startsWith("BTC") ? 0 : 2)}</div>
                <div className={`text-[10px] ${p.changePercent >= 0 ? "text-green" : "text-red"}`}>{p.changePercent >= 0 ? "+" : ""}{p.changePercent.toFixed(2)}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle>Market Regime</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${regime === "bullish" ? "bg-green" : regime === "bearish" ? "bg-red" : "bg-amber"}`} />
            <span className="text-sm font-semibold capitalize">{regime}</span>
            <span className="text-[11px] text-dim">Detected regime — strategies adapt automatically</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
