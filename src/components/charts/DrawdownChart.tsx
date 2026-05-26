"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEngineStore } from "@/store/engine-store";

export default function DrawdownChart() {
  const { portfolio } = useEngineStore();

  const data = useMemo(() => {
    if (portfolio.equityHistory.length < 2) return [{ name: "Start", dd: 0 }];
    let peak = portfolio.equityHistory[0].value;
    return portfolio.equityHistory.map((h) => {
      if (h.value > peak) peak = h.value;
      const dd = peak > 0 ? ((peak - h.value) / peak) * 100 : 0;
      return {
        name: new Date(h.time).toLocaleTimeString(),
        dd: Number(dd.toFixed(2)),
      };
    });
  }, [portfolio.equityHistory]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Drawdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="ddGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF3355" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#FF3355" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Tooltip
                contentStyle={{
                  background: "#1A1A28",
                  border: "1px solid #2A2A3A",
                  borderRadius: 8,
                  fontSize: 11,
                }}
                formatter={(value: any) => [`${Number(value).toFixed(2)}%`, "Drawdown"]}
              />
              <Area
                type="monotone"
                dataKey="dd"
                stroke="#FF3355"
                strokeWidth={1.5}
                fill="url(#ddGrad)"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
