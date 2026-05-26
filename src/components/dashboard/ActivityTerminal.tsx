"use client";

import { useRef, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEngineStore } from "@/store/engine-store";
import { formatTime, generateId } from "@/lib/utils";
import { MODULE_COLORS, LEVEL_COLORS } from "@/lib/constants";
import type { TerminalMessage } from "@/types";
import { getMarketState } from "@/engine/market";
import { getPortfolioState } from "@/engine/portfolio";

function generateStartupMessages(): TerminalMessage[] {
  return [
    { id: generateId(), module: "SYSTEM", message: "QuantumTrade AI v1.0.0 — Inicializando sistema...", level: "system", timestamp: Date.now() - 5000 },
    { id: generateId(), module: "AI", message: "[ENGINE] Motor de simulación cuantitativa cargado", level: "info", timestamp: Date.now() - 4500 },
    { id: generateId(), module: "RISK", message: "[CONFIG] Risk parameters: moderate | Max drawdown: 25% | Kelly: enabled", level: "success", timestamp: Date.now() - 4000 },
    { id: generateId(), module: "SYSTEM", message: "[MARKET] 40+ activos cargados | Crypto | Forex | Indices | Commodities | Stocks", level: "system", timestamp: Date.now() - 3500 },
    { id: generateId(), module: "AI", message: "[OLLAMA] No local model detected — using procedural AI engine", level: "warning", timestamp: Date.now() - 3000 },
    { id: generateId(), module: "EXECUTION", message: "[READY] Estrategias: Scalping, Swing, Momentum, Mean Reversion, Grid, VWAP + 10 más", level: "success", timestamp: Date.now() - 2500 },
    { id: generateId(), module: "PORTFOLIO", message: "[BALANCE] Capital inicial: $10,000.00 USD | Sistema listo para operar", level: "info", timestamp: Date.now() - 2000 },
    { id: generateId(), module: "SYSTEM", message: "[STATUS] Simulación en modo automático | Escaneando mercados...", level: "system", timestamp: Date.now() - 1500 },
    { id: generateId(), module: "SYSTEM", message: "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━", level: "system", timestamp: Date.now() - 1000 },
  ];
}

export default function ActivityTerminal() {
  const { terminalMessages, running } = useEngineStore();
  const viewportRef = useRef<HTMLDivElement>(null);
  const allMessages = [...generateStartupMessages(), ...terminalMessages.slice(-150)];

  useEffect(() => {
    if (viewportRef.current) {
      const el = viewportRef.current;
      el.scrollTop = el.scrollHeight;
    }
  }, [terminalMessages.length]);

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Activity Terminal</CardTitle>
        <div className="flex items-center gap-1.5">
          <div className={`w-1.5 h-1.5 rounded-full ${running ? "bg-green animate-pulse-slow" : "bg-red"}`} />
          <span className="text-[10px] font-mono text-dim">{running ? "LIVE" : "STOPPED"}</span>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[280px] terminal-scanline">
          <div ref={viewportRef} className="p-3 space-y-0.5 overflow-auto h-full">
            {allMessages.map((msg) => (
              <div
                key={msg.id}
                className="flex items-start gap-2 text-[11px] leading-5 font-mono"
              >
                <span className="text-[10px] text-dim w-16 flex-shrink-0 opacity-60 number-font">
                  {formatTime(msg.timestamp)}
                </span>
                <span
                  className="font-semibold flex-shrink-0"
                  style={{ color: MODULE_COLORS[msg.module] || "#666" }}
                >
                  [{msg.module}]
                </span>
                <span style={{ color: LEVEL_COLORS[msg.level] || "#8B949E" }}>
                  {msg.message}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
