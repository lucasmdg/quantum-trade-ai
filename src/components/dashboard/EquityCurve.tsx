"use client";

import { useMemo } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEngineStore } from "@/store/engine-store";
import { formatCurrency } from "@/lib/utils";

export default function EquityCurve() {
  const { portfolio } = useEngineStore();
  const { equityHistory } = portfolio;

  const data = useMemo(() => {
    const hist = equityHistory.length > 0 ? equityHistory : [{ time: Date.now(), value: 10000 }];
    return hist.map((h) => ({
      time: new Date(h.time).toLocaleTimeString(),
      value: Number(h.value.toFixed(2)),
    }));
  }, [equityHistory.length, equityHistory[equityHistory.length - 1]?.value]);

  const isUp = data.length >= 2 && data[data.length - 1].value >= data[0].value;

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Equity Curve</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="equityGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isUp ? "#00FF88" : "#FF3355"} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={isUp ? "#00FF88" : "#FF3355"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#606080" }} axisLine={false} tickLine={false} />
              <YAxis
                tick={{ fontSize: 10, fill: "#606080" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                domain={["auto", "auto"]}
              />
              <Tooltip
                contentStyle={{
                  background: "#1A1A28",
                  border: "1px solid #2A2A3A",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value: any) => [formatCurrency(Number(value)), "Equity"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={isUp ? "#00FF88" : "#FF3355"}
                strokeWidth={2}
                fill="url(#equityGrad)"
                dot={false}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
