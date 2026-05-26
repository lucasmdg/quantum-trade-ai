"use client";

import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEngineStore } from "@/store/engine-store";
import { getMarketState } from "@/engine/market";

export default function VolatilityChart() {
  const { tickCount, prices } = useEngineStore();

  const data = useMemo(() => {
    const btc = prices["BTC/USD"];
    if (!btc) return [{ name: "Now", vol: 0 }];
    const vol = Math.abs(btc.changePercent) * 2 + 1;
    return Array.from({ length: 20 }, (_, i) => ({
      name: `${i * 5}s`,
      vol: vol * (0.5 + Math.random() * 0.5),
    }));
  }, [tickCount]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Volatility (ATR)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Tooltip
                contentStyle={{
                  background: "#1A1A28",
                  border: "1px solid #2A2A3A",
                  borderRadius: 8,
                  fontSize: 11,
                }}
                formatter={(value: any) => [`${Number(value).toFixed(2)}%`, "Vol"]}
              />
              <Line
                type="monotone"
                dataKey="vol"
                stroke="#FFAA00"
                strokeWidth={1.5}
                dot={false}
                strokeDasharray="3 3"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
