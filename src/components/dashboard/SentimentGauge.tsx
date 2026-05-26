"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEngineStore } from "@/store/engine-store";

export default function SentimentGauge() {
  const sentiment = useEngineStore(s => s.sentiment);
  const fearGreed = useEngineStore(s => s.fearGreed);
  const pct = (fearGreed / 100) * 100;
  const label = pct >= 70 ? "Greed" : pct >= 40 ? "Neutral" : "Fear";
  const color = pct >= 70 ? "var(--color-green)" : pct >= 40 ? "var(--color-amber)" : "var(--color-red)";
  return (
    <Card>
      <CardHeader><CardTitle>Fear & Greed</CardTitle></CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-24 h-24">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-elevated)" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none" stroke={color} strokeWidth="8" strokeDasharray={`${(pct/100)*251.2} 251.2`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold" style={{ color }}>{fearGreed}</span>
            </div>
          </div>
          <span className="text-[11px] text-dim font-mono">{label}</span>
        </div>
      </CardContent>
    </Card>
  );
}
