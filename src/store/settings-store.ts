import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SettingsState, StrategyName } from "@/types";
import { DEFAULT_CAPITAL, STRATEGIES } from "@/lib/constants";

interface SettingsStore extends SettingsState {
  setInitialCapital: (v: number) => void;
  setRiskLevel: (v: SettingsState["riskLevel"]) => void;
  setSimulationSpeed: (v: SettingsState["simulationSpeed"]) => void;
  setBotMode: (v: SettingsState["botMode"]) => void;
  toggleStrategy: (name: StrategyName) => void;
  toggleFavoriteAsset: (symbol: string) => void;
  setSoundEnabled: (v: boolean) => void;
  resetToDefaults: () => void;
}

const defaults: SettingsState = {
  initialCapital: DEFAULT_CAPITAL, riskLevel: "moderate", simulationSpeed: 1,
  botMode: "auto", enabledStrategies: STRATEGIES.map(s => s.name),
  favoriteAssets: ["BTC/USD", "ETH/USD", "SOL/USD"], soundEnabled: false, darkMode: true,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaults,
      setInitialCapital: (v) => set({ initialCapital: v }),
      setRiskLevel: (v) => set({ riskLevel: v }),
      setSimulationSpeed: (v) => set({ simulationSpeed: v }),
      setBotMode: (v) => set({ botMode: v }),
      toggleStrategy: (name) => set((s) => ({
        enabledStrategies: s.enabledStrategies.includes(name)
          ? s.enabledStrategies.filter(n => n !== name)
          : [...s.enabledStrategies, name],
      })),
      toggleFavoriteAsset: (symbol) => set((s) => ({
        favoriteAssets: s.favoriteAssets.includes(symbol)
          ? s.favoriteAssets.filter(a => a !== symbol)
          : [...s.favoriteAssets, symbol],
      })),
      setSoundEnabled: (v) => set({ soundEnabled: v }),
      resetToDefaults: () => set(defaults),
    }),
    { name: "quantum-trade-settings" },
  ),
);
