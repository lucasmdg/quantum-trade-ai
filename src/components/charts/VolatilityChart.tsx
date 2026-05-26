"use client";
import { useMemo, useRef } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEngineStore } from "@/store/engine-store";

export default function VolatilityChart() {
  const prices = useEngineStore(s => s.prices);
  const tickCount = useEngineStore(s => s.tickCount);
  const btc = prices["BTC/USD"];
  const historyRef = useRef<number[]>([]);

  if (btc) {
    historyRef.current.push(btc.price);
    if (historyRef.current.length > 500) historyRef.current.shift();
  }

  const data = useMemo(() => {
    const h = historyRef.current;
    const vols: { t: number; v: number }[] = [];
    for (let i = 20; i < h.length; i++) {
      const slice = h.slice(i - 20, i);
      const mean = slice.reduce((a, b) => a + b, 0) / slice.length;
      const variance = slice.reduce((a, b) => a + (b - mean) ** 2, 0) / slice.length;
      vols.push({ t: i, v: Math.sqrt(variance) / mean * 100 });
    }
    return vols;
  }, [tickCount]);

  if (data.length < 2) return <Card className="h-48 flex items-center justify-center"><p className="text-[11px] text-dim">Waiting for data…</p></Card>;

  return (
    <Card>
      <CardHeader><CardTitle>BTC Volatility (20-bar)</CardTitle></CardHeader>
      <CardContent>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs><linearGradient id="volGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-amber)" stopOpacity={0.2}/><stop offset="100%" stopColor="var(--color-amber)" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="t" hide />
              <YAxis domain={["auto", "auto"]} hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="v" stroke="var(--color-amber)" strokeWidth={1.5} fill="url(#volGrad)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return <div className="glass-panel px-2 py-1 text-[11px] border border-border"><span className="text-amber">{payload[0].value.toFixed(2)}%</span></div>;
}
