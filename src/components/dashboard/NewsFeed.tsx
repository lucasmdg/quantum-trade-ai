"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEngineStore } from "@/store/engine-store";
import { formatTime } from "@/lib/utils";
import { generateNews } from "@/engine/news";
import { generateId } from "@/lib/utils";

const impactBadge: Record<string, "green" | "red" | "amber" | "accent"> = {
  low: "accent",
  medium: "amber",
  high: "red",
  extreme: "red",
};

export default function NewsFeed() {
  const { tickCount, news, prices } = useEngineStore();

  const syntheticNews = useMemo(() => {
    if (news.length === 0) {
      return Array.from({ length: 5 }, () => generateNews());
    }
    return news;
  }, [tickCount % 10 === 0 ? tickCount : 0, news]);

  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>News Feed</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[280px]">
          <div className="p-3 space-y-2">
            <AnimatePresence>
              {syntheticNews.slice(-15).reverse().map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="glass-panel-accent rounded-lg p-3 space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant={impactBadge[item.impact] || "accent"}>
                        {item.impact}
                      </Badge>
                      <Badge variant={item.sentiment === "bullish" ? "green" : item.sentiment === "bearish" ? "red" : "default"}>
                        {item.sentiment}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-dim">
                      <span>{item.source}</span>
                      <span>•</span>
                      <span>{formatTime(item.timestamp)}</span>
                    </div>
                  </div>
                  <p className="text-xs font-medium leading-snug">{item.headline}</p>
                  <p className="text-[10px] text-dim leading-relaxed line-clamp-2">{item.summary}</p>
                  <div className="flex gap-1 flex-wrap pt-1">
                    {item.symbols.slice(0, 3).map((s) => (
                      <span key={s} className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-elevated border border-border text-dim">
                        {s}
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
