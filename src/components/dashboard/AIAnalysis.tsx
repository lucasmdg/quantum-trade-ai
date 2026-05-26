"use client";

import { useMemo, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEngineStore } from "@/store/engine-store";
import { formatTime } from "@/lib/utils";
import { Brain, Shield, Globe, MessageSquare, Briefcase, LineChart, Sparkles } from "lucide-react";
import type { AIAnalysis } from "@/types";

const agentConfig: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  risk: { label: "Risk AI", icon: <Shield size={12} />, color: "#FFAA00" },
  macro: { label: "Macro AI", icon: <Globe size={12} />, color: "#4D79FF" },
  sentiment: { label: "Sentiment AI", icon: <MessageSquare size={12} />, color: "#AA66FF" },
  execution: { label: "Execution AI", icon: <LineChart size={12} />, color: "#00FF88" },
  portfolio: { label: "Portfolio AI", icon: <Briefcase size={12} />, color: "#FF66AA" },
  strategy: { label: "Strategy AI", icon: <Brain size={12} />, color: "#00F0FF" },
};

function AgentInspector({ analysis }: { analysis: AIAnalysis[] }) {
  const [active, setActive] = useState<string>(analysis[0]?.id || "");

  const current = analysis.find((a) => a.id === active) || analysis[0];
  const config = current ? agentConfig[current.agent] : null;

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5 flex-wrap">
        {analysis.map((a) => {
          const cfg = agentConfig[a.agent];
          return (
            <button
              key={a.id}
              onClick={() => setActive(a.id)}
              className={`flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono transition-all ${
                active === a.id
                  ? "bg-elevated border border-accent/20 text-text"
                  : "text-dim hover:text-text border border-transparent"
              }`}
            >
              <span style={{ color: cfg?.color }}>{cfg?.icon}</span>
              {cfg?.label}
            </button>
          );
        })}
      </div>

      {current && config && (
        <div className="glass-panel rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-semibold" style={{ color: config.color }}>
                {config.icon}
                {config.label}
              </span>
              <Badge variant={current.confidence > 0.8 ? "green" : current.confidence > 0.5 ? "amber" : "red"}>
                {(current.confidence * 100).toFixed(0)}%
              </Badge>
            </div>
            <span className="text-[10px] text-dim">{formatTime(current.timestamp)}</span>
          </div>
          <p className="text-xs leading-relaxed text-text/80">{current.message}</p>
        </div>
      )}
    </div>
  );
}

export default function AIAnalysis() {
  const { analysis } = useEngineStore();
  const [mode, setMode] = useState<"feed" | "inspect">("inspect");

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-accent" />
            AI Analysis
          </CardTitle>
          <div className="flex gap-1">
            {(["feed", "inspect"] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-2 py-0.5 text-[10px] font-mono rounded transition-colors ${
                  mode === m ? "bg-accent/10 text-accent" : "text-dim hover:text-text"
                }`}
              >
                {m === "feed" ? "Feed" : "Inspect"}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {analysis.length === 0 ? (
          <p className="text-xs text-dim text-center py-8">Esperando análisis de IA...</p>
        ) : mode === "feed" ? (
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {analysis.map((a) => {
                const cfg = agentConfig[a.agent];
                return (
                  <div key={a.id} className="flex items-start gap-2 text-[11px]">
                    <span className="flex items-center gap-1 font-semibold flex-shrink-0" style={{ color: cfg?.color }}>
                      {cfg?.icon}
                      {cfg?.label}
                    </span>
                    <span className="text-text/70">{a.message}</span>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        ) : (
          <AgentInspector analysis={analysis} />
        )}
      </CardContent>
    </Card>
  );
}
