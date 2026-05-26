"use client";
import EquityCurve from "@/components/dashboard/EquityCurve";
import PnLDisplay from "@/components/dashboard/PnLDisplay";
import SentimentGauge from "@/components/dashboard/SentimentGauge";
import RiskPanel from "@/components/dashboard/RiskPanel";
import AIAnalysis from "@/components/dashboard/AIAnalysis";
import NewsFeed from "@/components/dashboard/NewsFeed";
import MarketTicker from "@/components/dashboard/MarketTicker";
import OpenPositions from "@/components/dashboard/OpenPositions";
import ActivityTerminal from "@/components/dashboard/ActivityTerminal";
import PortfolioAllocation from "@/components/dashboard/PortfolioAllocation";
import CandlestickChart from "@/components/charts/CandlestickChart";
import VolatilityChart from "@/components/charts/VolatilityChart";

export default function DashboardPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-min">
      <div className="col-span-1 md:col-span-2 lg:col-span-2"><EquityCurve /></div>
      <PnLDisplay />
      <SentimentGauge />
      <RiskPanel />
      <div className="col-span-1 md:col-span-2"><CandlestickChart /></div>
      <div className="col-span-1 md:col-span-2 lg:col-span-2"><AIAnalysis /></div>
      <MarketTicker />
      <NewsFeed />
      <OpenPositions />
      <div className="col-span-1 md:col-span-1"><PortfolioAllocation /></div>
      <VolatilityChart />
      <div className="col-span-1 md:col-span-2 lg:col-span-4"><ActivityTerminal /></div>
    </div>
  );
}
