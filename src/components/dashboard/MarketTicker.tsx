"use client";
import { useEngineStore } from "@/store/engine-store";
import { useSettingsStore } from "@/store/settings-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function MarketTicker() {
  const prices = useEngineStore(s => s.prices);
  const favorites = useSettingsStore(s => s.favoriteAssets);
  return (
    <Card>
      <CardHeader><CardTitle>Ticker</CardTitle></CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-44 px-4">
          <div className="space-y-0.5 py-1">
            {favorites.map((sym) => {
              const p = prices[sym];
              if (!p) return null;
              return (
                <div key={sym} className="flex items-center justify-between py-1 text-[11px] border-b border-border/20 last:border-0">
                  <span className="font-semibold">{sym.replace("/", "")}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">{p.price.toFixed(sym.startsWith("BTC") ? 0 : 2)}</span>
                    <Badge variant={p.changePercent >= 0 ? "green" : "red"}>{p.changePercent >= 0 ? "+" : ""}{p.changePercent.toFixed(2)}%</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
