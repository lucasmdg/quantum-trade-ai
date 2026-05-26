"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEngineStore } from "@/store/engine-store";
import { Progress } from "@/components/ui/progress";

export default function RiskPanel() {
  const r = useEngineStore(s => s.riskMetrics);
  return (
    <Card>
      <CardHeader><CardTitle>Risk Metrics</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <Item label="Sharpe" value={r.sharpeRatio.toFixed(2)} color={r.sharpeRatio >= 1.5 ? "var(--color-green)" : r.sharpeRatio >= 0.5 ? "var(--color-amber)" : "var(--color-red)"} />
        <Item label="Sortino" value={r.sortinoRatio.toFixed(2)} color={r.sortinoRatio >= 1 ? "var(--color-green)" : "var(--color-amber)"} />
        <Item label="VaR (95%)" value={`${(r.var_95 / 100).toFixed(1)}%`} color={Math.abs(r.var_95) > 500 ? "var(--color-red)" : Math.abs(r.var_95) > 200 ? "var(--color-amber)" : "var(--color-green)"} />
        <Item label="Kelly" value={`${(r.kellyFraction * 100).toFixed(1)}%`} color={r.kellyFraction > 0 ? "var(--color-green)" : "var(--color-red)"} />
        <Item label="Drawdown" value={`${r.currentDrawdown.toFixed(1)}%`} color={r.currentDrawdown > 15 ? "var(--color-red)" : r.currentDrawdown > 5 ? "var(--color-amber)" : "var(--color-green)"}>
          <Progress value={r.maxDrawdown > 0 ? (r.currentDrawdown / r.maxDrawdown) * 100 : 0} indicatorColor={r.currentDrawdown > 15 ? "var(--color-red)" : r.currentDrawdown > 5 ? "var(--color-amber)" : "var(--color-green)"} />
        </Item>
      </CardContent>
    </Card>
  );
}

function Item({ label, value, color, children }: { label: string; value: string; color?: string; children?: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-mono text-dim">{label}</span>
        <span className="text-xs font-semibold font-mono" style={{ color }}>{value}</span>
      </div>
      {children}
    </div>
  );
}
