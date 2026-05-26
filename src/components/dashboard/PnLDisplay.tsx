"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEngineStore } from "@/store/engine-store";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

export default function PnLDisplay() {
  const { totalPnl, totalPnlPercent } = useEngineStore(s => s.portfolio);
  const positive = totalPnl >= 0;
  return (
    <Card>
      <CardHeader><CardTitle>P&L Total</CardTitle></CardHeader>
      <CardContent>
        <div className={`flex items-center gap-2 ${positive ? "text-green" : "text-red"}`}>
          {positive ? <TrendingUp size={24} /> : totalPnl < 0 ? <TrendingDown size={24} /> : <Minus size={24} />}
          <div>
            <div className="text-lg font-bold">{formatCurrency(totalPnl)}</div>
            <div className="text-[11px] opacity-80">{formatPercent(totalPnlPercent)}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
