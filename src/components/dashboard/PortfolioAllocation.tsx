"use client";

import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEngineStore } from "@/store/engine-store";
import { ASSETS } from "@/lib/constants";

const COLORS = ["#00F0FF", "#4D79FF", "#AA66FF", "#00FF88", "#FFAA00", "#FF66AA", "#FF3355", "#66FFCC"];

export default function PortfolioAllocation() {
  const { positions } = useEngineStore();

  const data = useMemo(() => {
    const grouped: Record<string, number> = {};
    for (const pos of positions) {
      const asset = ASSETS.find((a) => a.symbol === pos.symbol);
      const sector = asset?.class || "other";
      grouped[sector] = (grouped[sector] || 0) + Math.abs(pos.pnl);
    }

    return Object.entries(grouped).map(([name, value], i) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Math.abs(value) || 1,
      color: COLORS[i % COLORS.length],
    }));
  }, [positions]);

  if (data.length === 0) {
    data.push({ name: "Cash", value: 100, color: "#00F0FF" });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={78}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: "#1A1A28",
                  border: "1px solid #2A2A3A",
                  borderRadius: 8,
                  fontSize: 12,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-[10px] text-dim">
              <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
              <span>{d.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
