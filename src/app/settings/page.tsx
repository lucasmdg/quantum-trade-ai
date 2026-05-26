"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/settings-store";
import { STRATEGIES } from "@/lib/constants";
import { RotateCcw } from "lucide-react";

export default function SettingsPage() {
  const { initialCapital, setInitialCapital, riskLevel, setRiskLevel, simulationSpeed, setSimulationSpeed, botMode, setBotMode, enabledStrategies, toggleStrategy, soundEnabled, setSoundEnabled, resetToDefaults } = useSettingsStore();

  return (
    <div className="space-y-4 max-w-2xl">
      <h1 className="text-lg font-semibold">Settings</h1>

      <Card>
        <CardHeader><CardTitle>Capital</CardTitle></CardHeader>
        <CardContent>
          <input type="number" value={initialCapital} onChange={e => setInitialCapital(Number(e.target.value))} className="w-full bg-elevated border border-border rounded-lg px-3 py-2 text-sm font-mono text-text" min={100} step={100} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Risk Level</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          {(["conservative", "moderate", "aggressive"] as const).map(r => (
            <Button key={r} variant={riskLevel === r ? "default" : "outline"} size="sm" onClick={() => setRiskLevel(r)} className="capitalize">{r}</Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Simulation Speed</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          {([0.5, 1, 2, 5, 10] as const).map(s => (
            <Button key={s} variant={simulationSpeed === s ? "default" : "outline"} size="sm" onClick={() => setSimulationSpeed(s)}>{s}x</Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Bot Mode</CardTitle></CardHeader>
        <CardContent className="flex gap-2">
          {(["auto", "semi", "manual"] as const).map(m => (
            <Button key={m} variant={botMode === m ? "default" : "outline"} size="sm" onClick={() => setBotMode(m)} className="capitalize">{m === "semi" ? "Semi-Auto" : m}</Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Strategies</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {STRATEGIES.map(s => (
            <Button key={s.name} variant={enabledStrategies.includes(s.name) ? "green" : "outline"} size="sm" onClick={() => toggleStrategy(s.name)} className="justify-start text-[11px]">
              {enabledStrategies.includes(s.name) && <span className="w-1.5 h-1.5 rounded-full bg-green" />}
              {s.name.replace(/([A-Z])/g, " $1").trim()}
            </Button>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Sound</CardTitle></CardHeader>
        <CardContent>
          <Button variant={soundEnabled ? "default" : "outline"} size="sm" onClick={() => setSoundEnabled(!soundEnabled)}>{soundEnabled ? "Enabled" : "Disabled"}</Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-4">
          <Button variant="destructive" size="sm" onClick={resetToDefaults} className="w-full"><RotateCcw size={14} /> Reset to Defaults</Button>
        </CardContent>
      </Card>
    </div>
  );
}
