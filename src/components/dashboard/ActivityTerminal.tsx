"use client";
import { useEngineStore } from "@/store/engine-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal } from "lucide-react";

export default function ActivityTerminal() {
  const messages = useEngineStore(s => s.terminalMessages);
  return (
    <Card>
      <CardHeader><CardTitle><Terminal size={14} className="inline mr-1 text-accent" /> Terminal</CardTitle></CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-40 px-4">
          <div className="space-y-0.5 py-1">
            {messages.length === 0 && <p className="text-[11px] text-dim font-mono">Waiting for signals…</p>}
            {[...messages].reverse().map((msg, i) => (
              <div key={i} className="text-[11px] font-mono leading-relaxed">
                <span className={`${msg.level === "success" ? "text-green" : msg.level === "warning" ? "text-amber" : msg.level === "error" ? "text-red" : "text-dim"}`}>
                  {msg.module === "EXECUTION" ? ">" : msg.level === "warning" ? "!" : msg.level === "error" ? "✗" : "$"} {msg.message}
                </span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
