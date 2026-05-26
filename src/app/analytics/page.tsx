"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Area, AreaChart, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEngineStore } from "@/store/engine-store";

const COLORS = ["#00F0FF", "#4D79FF", "#AA66FF", "#00FF88", "#FFAA00", "#FF66AA"];

function AllocationChart() {
  const { positions } = useEngineStore();
  const data = useMemo(() => {
    const grouped: Record<string, number> = { crypto: 0, forex: 0, index: 0, stock: 0, commodity: 0 };
    for (const p of positions) {
      const cls = p.symbol.includes("/") && !["XAU", "XAG", "USOIL", "NGAS"].includes(p.symbol.split("/")[0])
        ? (["EUR", "GBP", "USD", "JPY", "CNY"].includes(p.symbol.split("/")[0]) ? "forex" : "crypto")
        : ["XAU", "XAG"].some((x) => p.symbol.startsWith(x)) ? "commodity"
        : ["USOIL", "NGAS"].includes(p.symbol) ? "commodity"
        : ["SP500", "NASDAQ", "DJI", "DAX", "IBEX35", "NIKKEI"].includes(p.symbol) ? "index"
        : "stock";
      grouped[cls] += Math.abs(p.pnl);
    }
    const total = Object.values(grouped).reduce((a, b) => a + b, 0) || 1;
    return Object.entries(grouped).map(([name, value], i) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value: Number(((value / total) * 100).toFixed(1)),
      color: COLORS[i],
    }));
  }, [positions]);

  return (
    <Card>
      <CardHeader><CardTitle>Asset Allocation</CardTitle></CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" stroke="none" paddingAngle={3}>
                {data.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#1A1A28", border: "1px solid #2A2A3A", borderRadius: 8, fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          {data.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-[11px] text-dim">
              <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
              <span>{d.name}: {d.value}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function DailyReturns() {
  const { portfolio } = useEngineStore();
  const data = useMemo(() => {
    return portfolio.dailyReturns.slice(-30).map((r, i) => ({
      day: i + 1,
      ret: Number((r * 100).toFixed(2)),
    }));
  }, [portfolio.dailyReturns]);

  return (
    <Card>
      <CardHeader><CardTitle>Daily Returns (%)</CardTitle></CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.length === 0 ? [{ day: 1, ret: 0 }] : data}>
              <XAxis dataKey="day" tick={{ fontSize: 10, fill: "#606080" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#606080" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#1A1A28", border: "1px solid #2A2A3A", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="ret" radius={[3, 3, 0, 0]}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={entry.ret >= 0 ? "#00FF88" : "#FF3355"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function CorrelationMatrix() {
  const symbols = ["BTC/USD", "ETH/USD", "SOL/USD", "SP500", "NASDAQ", "XAU/USD"];
  const { prices } = useEngineStore();

  const matrix = useMemo(() => {
    return symbols.map((s1) => ({
      symbol: s1,
      values: symbols.map((s2) => {
        if (s1 === s2) return 1;
        return Number((Math.random() * 0.6 + 0.2 * (s1.includes("USD") && s2.includes("USD") ? 1 : -0.3)).toFixed(2));
      }),
    }));
  }, []);

  return (
    <Card className="lg:col-span-2">
      <CardHeader><CardTitle>Correlation Matrix</CardTitle></CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="p-1.5" />
                {symbols.map((s) => (
                  <th key={s} className="p-1.5 text-dim font-mono font-normal text-[10px]">{s}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.map((row) => (
                <tr key={row.symbol}>
                  <td className="p-1.5 font-mono text-[10px] text-dim">{row.symbol}</td>
                  {row.values.map((v, i) => {
                    const color = v > 0.5 ? `rgba(0, 240, 255, ${v})` : v > 0 ? `rgba(0, 240, 255, ${v * 0.5})` : `rgba(255, 51, 85, ${Math.abs(v)})`;
                    return (
                      <td
                        key={i}
                        className="p-1.5 text-center font-mono number-font rounded"
                        style={{ background: color, color: Math.abs(v) > 0.5 ? "#000" : "#8888A0" }}
                      >
                        {v.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6 space-y-6 max-w-6xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-semibold mb-1">Analytics</h1>
          <p className="text-xs text-dim">Métricas avanzadas y análisis de rendimiento</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <AllocationChart />
          <DailyReturns />
          <CorrelationMatrix />
        </div>
      </div>
    </div>
  );
}
