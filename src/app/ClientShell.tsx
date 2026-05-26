"use client";
import { useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useEngineStore } from "@/store/engine-store";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  const initEngine = useEngineStore(s => s.initEngine);
  const startEngine = useEngineStore(s => s.startEngine);
  const initialized = useEngineStore(s => s.initialized);

  useEffect(() => {
    if (!initialized) {
      initEngine();
      const t = setTimeout(() => startEngine(), 100);
      return () => clearTimeout(t);
    }
  }, [initEngine, startEngine, initialized]);

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-56">
        <Header />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
