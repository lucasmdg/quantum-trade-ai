"use client";

import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import MarketTicker from "@/components/dashboard/MarketTicker";
import EquityCurve from "@/components/dashboard/EquityCurve";
import PortfolioAllocation from "@/components/dashboard/PortfolioAllocation";
import OpenPositions from "@/components/dashboard/OpenPositions";
import ActivityTerminal from "@/components/dashboard/ActivityTerminal";
import SentimentGauge from "@/components/dashboard/SentimentGauge";
import RiskPanel from "@/components/dashboard/RiskPanel";
import PnLDisplay from "@/components/dashboard/PnLDisplay";
import AIAnalysis from "@/components/dashboard/AIAnalysis";
import NewsFeed from "@/components/dashboard/NewsFeed";
import CandlestickChart from "@/components/charts/CandlestickChart";
import DrawdownChart from "@/components/charts/DrawdownChart";
import VolatilityChart from "@/components/charts/VolatilityChart";
import { useEngineStore } from "@/store/engine-store";
import { useSettingsStore } from "@/store/settings-store";

export default function Dashboard() {
  const { initialized, initEngine, startEngine } = useEngineStore();
  const { initialCapital } = useSettingsStore();

  useEffect(() => {
    if (!initialized) {
      initEngine(initialCapital);
    }
  }, [initialized, initEngine, initialCapital]);

  useEffect(() => {
    if (initialized) {
      startEngine();
    }
  }, [initialized, startEngine]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-4 lg:p-6 space-y-4">
          <MarketTicker />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <PnLDisplay />
            <SentimentGauge />
            <RiskPanel />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <EquityCurve />
            <PortfolioAllocation />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <CandlestickChart />
            <DrawdownChart />
            <VolatilityChart />
          </div>

          <OpenPositions />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <ActivityTerminal />
            <AIAnalysis />
          </div>

          <NewsFeed />
        </main>
      </div>
    </div>
  );
}
