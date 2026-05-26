"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useEngineStore } from "@/store/engine-store";

export default function SentimentGauge() {
  const { fearGreed, sentiment } = useEngineStore();

  const fgLabel = fearGreed > 75 ? "Extreme Greed" : fearGreed > 55 ? "Greed" : fearGreed > 45 ? "Neutral" : fearGreed > 25 ? "Fear" : "Extreme Fear";
  const fgColor = fearGreed > 55 ? "#00FF88" : fearGreed > 45 ? "#FFAA00" : "#FF3355";
  const sentLabel = sentiment > 0.6 ? "Bullish" : sentiment > 0.4 ? "Neutral" : "Bearish";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Market Sentiment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-dim">Fear & Greed</span>
            <span className="font-semibold font-mono" style={{ color: fgColor }}>{fearGreed.toFixed(0)} — {fgLabel}</span>
          </div>
          <Progress value={fearGreed} indicatorColor={fgColor} className="h-2" />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-dim">Sentiment</span>
            <span className={`font-semibold font-mono ${sentiment > 0.6 ? "text-green" : sentiment > 0.4 ? "text-amber" : "text-red"}`}>
              {(sentiment * 100).toFixed(0)}% — {sentLabel}
            </span>
          </div>
          <Progress value={sentiment * 100} indicatorColor={sentiment > 0.6 ? "#00FF88" : sentiment > 0.4 ? "#FFAA00" : "#FF3355"} className="h-2" />
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {[
            { label: "Bearish", active: sentiment < 0.4 },
            { label: "Neutral", active: sentiment >= 0.4 && sentiment <= 0.6 },
            { label: "Bullish", active: sentiment > 0.6 },
          ].map((t) => (
            <div
              key={t.label}
              className={`text-center py-1.5 rounded-lg text-[10px] font-mono transition-all ${
                t.active ? "bg-elevated border border-accent/20 text-accent" : "text-dim border border-transparent"
              }`}
            >
              {t.label}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
