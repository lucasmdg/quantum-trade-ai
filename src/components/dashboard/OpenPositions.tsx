"use client";
import { useEngineStore } from "@/store/engine-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrency } from "@/lib/utils";

export default function OpenPositions() {
  const positions = useEngineStore(s => s.positions);
  return (
    <Card>
      <CardHeader><CardTitle>Positions ({positions.length})</CardTitle></CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-44 px-4">
          <div className="space-y-1 py-1">
            {positions.length === 0 && <p className="text-[11px] text-dim py-4 text-center">No Open Positions</p>}
            {positions.map((pos, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 text-[11px] border-b border-border/20 last:border-0">
                <div>
                  <div className="font-semibold">{pos.symbol}</div>
                  <div className="text-[10px] text-dim">{pos.side} · {pos.quantity.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className={`font-mono ${pos.pnl >= 0 ? "text-green" : "text-red"}`}>{formatCurrency(pos.pnl)}</div>
                  <Badge variant={pos.pnl >= 0 ? "green" : "red"}>{pos.pnlPercent >= 0 ? "+" : ""}{pos.pnlPercent.toFixed(2)}%</Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
