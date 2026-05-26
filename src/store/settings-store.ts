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

const defaultSettings: SettingsState = {
  initialCapital: DEFAULT_CAPITAL,
  riskLevel: "moderate",
  simulationSpeed: 1,
  botMode: "auto",
  enabledStrategies: STRATEGIES.map((s) => s.name),
  favoriteAssets: ["BTC/USD", "ETH/USD", "SOL/USD"],
  soundEnabled: false,
  darkMode: true,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...defaultSettings,

      setInitialCapital: (v) => set({ initialCapital: v }),
      setRiskLevel: (v) => set({ riskLevel: v }),
      setSimulationSpeed: (v) => set({ simulationSpeed: v }),
      setBotMode: (v) => set({ botMode: v }),
      toggleStrategy: (name) =>
        set((s) => {
          const has = s.enabledStrategies.includes(name);
          return {
            enabledStrategies: has
              ? s.enabledStrategies.filter((n) => n !== name)
              : [...s.enabledStrategies, name],
          };
        }),
      toggleFavoriteAsset: (symbol) =>
        set((s) => {
          const has = s.favoriteAssets.includes(symbol);
          return {
            favoriteAssets: has
              ? s.favoriteAssets.filter((a) => a !== symbol)
              : [...s.favoriteAssets, symbol],
          };
        }),
      setSoundEnabled: (v) => set({ soundEnabled: v }),
      resetToDefaults: () => set(defaultSettings),
    }),
    { name: "quantum-trade-settings" },
  ),
);
