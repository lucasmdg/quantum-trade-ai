"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutDashboard, Briefcase, BarChart3, History, Settings, Menu, X, ChevronRight, Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/portfolio", label: "Portfolio", icon: Briefcase },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/history", label: "Historial", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button onClick={() => setMobileOpen(true)} className="fixed top-3 left-3 z-50 lg:hidden bg-surface border border-border rounded-lg p-2 text-dim hover:text-text">
        <Menu size={18} />
      </button>
      <AnimatePresence>
        {mobileOpen && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setMobileOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden" />}
      </AnimatePresence>
      <aside className={cn("fixed left-0 top-0 z-50 h-full w-56 glass-panel border-r border-border flex flex-col transition-transform duration-300 lg:translate-x-0", mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <Link href="/" className="flex items-center gap-2">
            <Brain size={20} className="text-accent" />
            <span className="text-sm font-semibold">{APP_NAME}</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-dim hover:text-text"><X size={16} /></button>
        </div>
        <nav className="flex-1 p-2 space-y-1">
          {navItems.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 group", active ? "bg-accent/10 text-accent border border-accent/20" : "text-dim hover:text-text hover:bg-elevated border border-transparent")}>
                <item.icon size={15} /> <span>{item.label}</span>
                {active && <ChevronRight size={12} className="ml-auto text-accent" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2 px-2 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green animate-pulse-slow" />
            <span className="text-[10px] text-dim font-mono">Sistema Activo</span>
          </div>
        </div>
      </aside>
    </>
  );
}
