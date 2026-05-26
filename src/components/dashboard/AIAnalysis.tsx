"use client";
import { useEngineStore } from "@/store/engine-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Sparkles } from "lucide-react";

export default function AIAnalysis() {
  const analysis = useEngineStore(s => s.analysis);
  const latest = analysis?.[analysis.length - 1];
  return (
    <Card>
      <CardHeader><CardTitle><Brain size={14} className="inline mr-1 text-accent" /> AI Analysis</CardTitle></CardHeader>
      <CardContent>
        {latest ? (
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <Sparkles size={12} className="text-amber" />
              <span className="text-[11px] font-semibold text-amber capitalize">{latest.agent}</span>
            </div>
            <p className="text-[11px] text-text leading-relaxed">{latest.message}</p>
            <div className="flex items-center gap-2 text-[10px] text-dim font-mono">
              <span>confianza: {(latest.confidence * 100).toFixed(0)}%</span>
            </div>
          </div>
        ) : (
          <p className="text-[11px] text-dim">Awaiting AI analysis…</p>
        )}
      </CardContent>
    </Card>
  );
}
