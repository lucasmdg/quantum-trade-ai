"use client";
import { useEngineStore } from "@/store/engine-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Newspaper } from "lucide-react";

export default function NewsFeed() {
  const news = useEngineStore(s => s.news);
  return (
    <Card>
      <CardHeader><CardTitle><Newspaper size={14} className="inline mr-1 text-accent" /> News</CardTitle></CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-32 px-4">
          <div className="space-y-1 py-1">
            {news.length === 0 && <p className="text-[11px] text-dim">No news yet…</p>}
            {[...news].reverse().slice(0, 20).map((item, i) => (
              <div key={i} className="text-[11px] py-1 leading-relaxed border-b border-border/30 last:border-0">
                <span className={`font-mono ${item.sentiment === "bullish" ? "text-green" : item.sentiment === "bearish" ? "text-red" : "text-amber"}`}>
                  {item.sentiment === "bullish" ? "▲" : item.sentiment === "bearish" ? "▼" : "◆"}
                </span>{" "}
                <span className="text-dim">{item.headline}</span>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
