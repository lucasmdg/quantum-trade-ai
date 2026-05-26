"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useEngineStore } from "@/store/engine-store";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { TrendingUp, TrendingDown, Target, Award } from "lucide-react";

export default function PnLDisplay() {
  const { portfolio } = useEngineStore();
  const isUp = portfolio.totalPnl >= 0;

  const metrics = [
    { label: "Total PnL", value: formatCurrency(portfolio.totalPnl), percent: formatPercent(portfolio.totalPnlPercent), isUp, icon: isUp ? TrendingUp : TrendingDown },
    { label: "Daily PnL", value: formatCurrency(portfolio.dailyPnl), percent: formatPercent(portfolio.dailyPnl / (portfolio.equity || 1) * 100), isUp: portfolio.dailyPnl >= 0, icon: TrendingUp },
    { label: "Win Rate", value: `${portfolio.winRate.toFixed(1)}%`, percent: `${portfolio.winningTrades}/${portfolio.totalTrades}`, isUp: portfolio.winRate > 50, icon: Target },
    { label: "Sharpe", value: portfolio.sharpeRatio.toFixed(2), percent: portfolio.sharpeRatio > 1 ? "Good" : "Needs work", isUp: portfolio.sharpeRatio > 1, icon: Award },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m) => (
            <div key={m.label} className="glass-panel-accent rounded-lg p-3">
              <div className="flex items-center gap-1.5 text-[10px] text-dim mb-1">
                <m.icon size={12} className={m.isUp ? "text-green" : "text-red"} />
                {m.label}
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={m.value}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-sm font-semibold font-mono number-font ${m.isUp ? "text-green" : "text-red"}`}
                >
                  {m.value}
                </motion.div>
              </AnimatePresence>
              <div className="text-[10px] text-dim mt-0.5">{m.percent}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
