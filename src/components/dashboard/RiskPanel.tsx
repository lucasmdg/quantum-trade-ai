"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useEngineStore } from "@/store/engine-store";
import { formatCurrency, formatPercent } from "@/lib/utils";

export default function RiskPanel() {
  const { riskMetrics } = useEngineStore();

  const riskColor = riskMetrics.riskScore > 0.6 ? "#FF3355" : riskMetrics.riskScore > 0.3 ? "#FFAA00" : "#00FF88";
  const riskLabel = riskMetrics.riskScore > 0.6 ? "High Risk" : riskMetrics.riskScore > 0.3 ? "Moderate" : "Low Risk";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Risk Metrics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-dim">Risk Score</span>
            <span className="font-mono font-semibold" style={{ color: riskColor }}>
              {(riskMetrics.riskScore * 100).toFixed(0)}% — {riskLabel}
            </span>
          </div>
          <Progress value={riskMetrics.riskScore * 100} indicatorColor={riskColor} className="h-2" />
        </div>

        {riskMetrics.circuitBreakerActive && (
          <div className="bg-red-dim border border-red/20 rounded-lg px-3 py-2 text-[11px] text-red font-mono">
            ⚠ CIRCUIT BREAKER ACTIVE — Reducing exposure
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 text-xs">
          {[
            { label: "VaR 95%", value: formatCurrency(riskMetrics.var_95), color: "text-dim" },
            { label: "VaR 99%", value: formatCurrency(riskMetrics.var_99), color: "text-dim" },
            { label: "Sharpe", value: riskMetrics.sharpeRatio.toFixed(2), color: riskMetrics.sharpeRatio > 1 ? "text-green" : "text-amber" },
            { label: "Sortino", value: riskMetrics.sortinoRatio.toFixed(2), color: riskMetrics.sortinoRatio > 1 ? "text-green" : "text-amber" },
            { label: "Max DD", value: formatPercent(riskMetrics.maxDrawdown), color: riskMetrics.maxDrawdown > 20 ? "text-red" : "text-dim" },
            { label: "Volatility", value: riskMetrics.volatility.toFixed(2) + "%", color: riskMetrics.volatility > 5 ? "text-amber" : "text-dim" },
            { label: "Beta", value: riskMetrics.beta.toFixed(2), color: "text-dim" },
            { label: "Alpha", value: riskMetrics.alpha.toFixed(2), color: riskMetrics.alpha > 0 ? "text-green" : "text-red" },
            { label: "Kelly %", value: (riskMetrics.kellyFraction * 100).toFixed(1) + "%", color: "text-dim" },
            { label: "Exposure", value: (riskMetrics.exposure * 100).toFixed(1) + "%", color: riskMetrics.exposure > 0.8 ? "text-red" : "text-dim" },
          ].map((m) => (
            <div key={m.label} className="flex justify-between py-1 border-b border-border/30">
              <span className="text-dim">{m.label}</span>
              <span className={`font-mono font-medium ${m.color}`}>{m.value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
