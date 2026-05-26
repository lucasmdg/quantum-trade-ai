"use client";
import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEngineStore } from "@/store/engine-store";

export default function DrawdownChart() {
  const portfolio = useEngineStore(s => s.portfolio);
  const data = useMemo(() => {
    const eq = portfolio.equityHistory;
    if (eq.length < 2) return [];
    let peak = eq[0].value;
    return eq.map((e, i) => {
      if (e.value > peak) peak = e.value;
      const dd = peak > 0 ? ((peak - e.value) / peak) * 100 : 0;
      return { t: i, v: -dd };
    });
  }, [portfolio.equityHistory]);

  if (data.length < 2) return <Card className="h-48 flex items-center justify-center"><p className="text-[11px] text-dim">Waiting for data…</p></Card>;

  return (
    <Card>
      <CardHeader><CardTitle>Drawdown</CardTitle></CardHeader>
      <CardContent>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <defs><linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--color-red)" stopOpacity={0.2}/><stop offset="100%" stopColor="var(--color-red)" stopOpacity={0}/></linearGradient></defs>
              <XAxis dataKey="t" hide />
              <YAxis domain={["auto", 0]} hide />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="v" stroke="var(--color-red)" strokeWidth={1.5} fill="url(#ddGrad)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return <div className="glass-panel px-2 py-1 text-[11px] border border-border"><span className="text-red">{Math.abs(payload[0].value).toFixed(2)}%</span></div>;
}
