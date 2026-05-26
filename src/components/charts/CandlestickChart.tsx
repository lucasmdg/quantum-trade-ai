"use client";
import { useMemo, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEngineStore } from "@/store/engine-store";
import { formatCurrency } from "@/lib/utils";

export default function CandlestickChart() {
  const prices = useEngineStore(s => s.prices);
  const tickCount = useEngineStore(s => s.tickCount);
  const [asset, setAsset] = useState("BTC/USD");
  const ticker = prices[asset];

  const data = useMemo(() => {
    if (!ticker) return [];
    const arr: { t: number; v: number }[] = [];
    for (let i = 0; i < Math.min(tickCount, 100); i++) {
      const mult = 1 + (Math.sin(i * 0.1) * 0.02) + (Math.cos(i * 0.05) * 0.01);
      arr.push({ t: i, v: ticker.price * mult });
    }
    return arr;
  }, [ticker?.price, tickCount]);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>{asset}</CardTitle>
        <select value={asset} onChange={e => setAsset(e.target.value)} className="bg-elevated border border-border rounded px-2 py-0.5 text-[11px] font-mono text-text">
          {Object.keys(prices).map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          {data.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <XAxis dataKey="t" hide />
                <YAxis domain={["auto", "auto"]} hide />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="v" fill="var(--color-accent)" opacity={0.6} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-full text-[11px] text-dim">Waiting for price data…</div>}
        </div>
      </CardContent>
    </Card>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return <div className="glass-panel px-2 py-1 text-[11px] border border-border"><span className="text-accent">{formatCurrency(payload[0].value)}</span><span className="text-dim ml-1">tick {label}</span></div>;
}
