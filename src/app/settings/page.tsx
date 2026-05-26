"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSettingsStore } from "@/store/settings-store";
import { useEngineStore } from "@/store/engine-store";
import { ASSETS, STRATEGIES } from "@/lib/constants";
import { RefreshCw, RotateCcw } from "lucide-react";
import type { SimulationSpeed, RiskLevel } from "@/types";

export default function SettingsPage() {
  const settings = useSettingsStore();
  const { initEngine } = useEngineStore();

  const riskColors: Record<RiskLevel, string> = {
    conservative: "text-green",
    moderate: "text-amber",
    aggressive: "text-red",
    insane: "text-purple",
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-6 space-y-6 max-w-4xl mx-auto w-full">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-semibold mb-1">Settings</h1>
          <p className="text-xs text-dim">Configuración del bot de trading simulado</p>
        </motion.div>

        <Card>
          <CardHeader>
            <CardTitle>Capital & Risk</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-xs text-dim mb-1.5 block">Initial Capital (USD)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={settings.initialCapital}
                  onChange={(e) => settings.setInitialCapital(Number(e.target.value))}
                  className="bg-elevated border border-border rounded-lg px-3 py-2 text-sm font-mono w-40 text-text focus:outline-none focus:border-accent"
                  min={1000}
                  max={10000000}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    initEngine(settings.initialCapital);
                  }}
                  className="text-[11px]"
                >
                  <RefreshCw size={12} /> Apply
                </Button>
              </div>
            </div>

            <div>
              <label className="text-xs text-dim mb-1.5 block">Risk Level</label>
              <div className="flex gap-2">
                {(["conservative", "moderate", "aggressive", "insane"] as RiskLevel[]).map((level) => (
                  <button
                    key={level}
                    onClick={() => settings.setRiskLevel(level)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all capitalize ${
                      settings.riskLevel === level
                        ? `${riskColors[level]} bg-elevated border-accent/30`
                        : "text-dim border-border hover:text-text"
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-dim mb-1.5 block">Simulation Speed</label>
              <div className="flex gap-2">
                {([0.5, 1, 2, 5, 10] as SimulationSpeed[]).map((s) => (
                  <button
                    key={s}
                    onClick={() => settings.setSimulationSpeed(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-all ${
                      settings.simulationSpeed === s
                        ? "text-accent bg-elevated border-accent/30"
                        : "text-dim border-border hover:text-text"
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Strategies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              {STRATEGIES.map((s) => (
                <button
                  key={s.name}
                  onClick={() => settings.toggleStrategy(s.name)}
                  className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                    settings.enabledStrategies.includes(s.name)
                      ? "bg-accent-dim border-accent/20 text-accent"
                      : "bg-elevated border-border text-dim hover:text-text"
                  }`}
                >
                  <div className="font-medium">{s.label}</div>
                  <div className="text-[10px] opacity-60 mt-0.5">{s.description}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bot Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              {(["auto", "manual"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => settings.setBotMode(mode)}
                  className={`flex-1 p-3 rounded-lg border text-xs font-medium capitalize transition-all ${
                    settings.botMode === mode
                      ? "bg-accent-dim border-accent/20 text-accent"
                      : "bg-elevated border-border text-dim"
                  }`}
                >
                  {mode === "auto" ? "🤖 Auto — Simulación continua" : "👆 Manual — Tick a tick"}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Favorite Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1.5">
              {ASSETS.slice(0, 20).map((a) => {
                const isFav = settings.favoriteAssets.includes(a.symbol);
                return (
                  <button
                    key={a.symbol}
                    onClick={() => settings.toggleFavoriteAsset(a.symbol)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-all ${
                      isFav ? "bg-accent-dim border-accent/20 text-accent" : "bg-elevated border-border text-dim hover:text-text"
                    }`}
                  >
                    {a.symbol}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-2 justify-end">
          <Button variant="outline" onClick={settings.resetToDefaults} className="text-xs">
            <RotateCcw size={12} /> Reset to Defaults
          </Button>
        </div>
      </div>
    </div>
  );
}
