"use client";
import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEngineStore } from "@/store/engine-store";

const COLORS = ["#00F0FF", "#4D79FF", "#0066FF", "#A78BFA", "#34D399", "#FBBF24", "#F472B6", "#FB923C"];

export default function PortfolioAllocation() {
  const positions = useEngineStore(s => s.positions);
  const data = useMemo(() => positions.map(p => ({ name: p.symbol, value: Math.abs(p.quantity * p.currentPrice) })), [positions]);

  if (data.length === 0) return <Card className="h-48 flex items-center justify-center"><p className="text-[11px] text-dim">No open positions</p></Card>;

  return (
    <Card>
      <CardHeader><CardTitle>Allocation</CardTitle></CardHeader>
      <CardContent>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={2} dataKey="value" isAnimationActive={false}>
                {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-1 mt-1">
          {data.map((entry, i) => (
            <div key={i} className="flex items-center gap-1 text-[10px] text-dim font-mono">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
              {entry.name}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  return <div className="glass-panel px-2 py-1 text-[11px] border border-border text-text">{payload[0].name}: ${payload[0].value.toFixed(2)}</div>;
}
