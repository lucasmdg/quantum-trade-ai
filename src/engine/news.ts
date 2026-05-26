import type { NewsItem } from "@/types";
import { generateId, randomBetween } from "@/lib/utils";
import { ASSETS } from "@/lib/constants";
import { setNewsImpact } from "./market";

const newsTemplates: {
  headline: string; summary: string; sentiment: NewsItem["sentiment"];
  impact: NewsItem["impact"]; assetFilter: (a: typeof ASSETS[0]) => boolean;
}[] = [
  { headline: "Fed mantiene tipos en ${rate}% — mercado reacciona con ${reaction}", summary: "La Reserva Federal mantiene los tipos de interés sin cambios. ${detail}", sentiment: "bullish", impact: "high", assetFilter: (a) => a.class === "index" || a.symbol === "EUR/USD" },
  { headline: "Bitcoin supera resistencia de ${price} — analistas esperan continuación", summary: "Bitcoin rompe resistencia de ${price} con volumen creciente. Momentum positivo.", sentiment: "bullish", impact: "medium", assetFilter: (a) => a.class === "crypto" },
  { headline: "Inflación ${direction} sorprende a mercados — ${reaction} generalizado", summary: "Datos de inflación muestran una ${direction} inesperada, provocando ${reaction}.", sentiment: "neutral", impact: "high", assetFilter: (a) => true },
  { headline: "Flash crash en ${asset} — volatilidad intradiaria extrema", summary: "Movimiento violento en ${asset} durante sesión asiática.", sentiment: "bearish", impact: "high", assetFilter: (a) => a.class === "crypto" },
  { headline: "ETF de ${asset} registra entradas récord de ${amount}", summary: "Flujos institucionales hacia ETFs de ${asset} alcanzan máximos históricos.", sentiment: "bullish", impact: "medium", assetFilter: (a) => a.class === "crypto" },
  { headline: "UE anuncia nuevo marco regulatorio para ${sector}", summary: "La UE presenta nuevo marco regulatorio que ${effect} el sector.", sentiment: "neutral", impact: "medium", assetFilter: (a) => a.class === "crypto" || a.class === "stock" },
  { headline: "${company} reporta resultados ${beatMiss} estimaciones", summary: "Resultados trimestrales ${beatMiss} estimaciones del consenso. ${detail}", sentiment: "bullish", impact: "medium", assetFilter: (a) => a.class === "stock" },
  { headline: "Petróleo ${direction2} por tensiones geopolíticas en ${region}", summary: "El crudo ${direction2} tras escalada de tensiones en ${region}.", sentiment: "bearish", impact: "medium", assetFilter: (a) => a.class === "commodity" || a.class === "index" },
  { headline: "Dominancia de BTC ${direction} — altcoins ${altAction}", summary: "La dominancia de Bitcoin ${direction} mientras altcoins ${altAction}.", sentiment: "neutral", impact: "low", assetFilter: (a) => a.class === "crypto" },
  { headline: "Corrección técnica en índices — ${percent}% de caída", summary: "Índices estadounidenses corrigen tras ${reason}.", sentiment: "bearish", impact: "high", assetFilter: (a) => a.class === "index" },
  { headline: "${country} integra blockchain en ${sector}", summary: "${country} anuncia integración de blockchain en ${sector}.", sentiment: "bullish", impact: "low", assetFilter: (a) => a.class === "crypto" },
  { headline: "Volatilidad expandida — todos los activos en ${color}", summary: "Volatilidad implícita se expande. Ajustar gestión de riesgo.", sentiment: "neutral", impact: "medium", assetFilter: (a) => true },
];

const sources = ["Bloomberg", "Reuters", "CoinDesk", "Financial Times", "CNBC", "WSJ"];

function fillTemplate(tpl: string, ctx: Record<string, string>): string {
  return tpl.replace(/\${(\w+)}/g, (_, k) => ctx[k] ?? k);
}

export function generateNews(): NewsItem {
  const template = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
  const candidates = ASSETS.filter(template.assetFilter);
  const primary = candidates.length > 0 ? candidates[Math.floor(Math.random() * candidates.length)] : ASSETS[0];

  const ctx: Record<string, string> = {
    rate: `${Math.floor(randomBetween(3, 6))}.${Math.floor(randomBetween(0, 9))}%`,
    reaction: Math.random() > 0.5 ? "optimismo" : "ventas",
    price: `$${Math.floor(randomBetween(1000, 100000)).toLocaleString()}`,
    direction: Math.random() > 0.5 ? "alcista" : "bajista",
    direction2: Math.random() > 0.5 ? "sube" : "baja",
    asset: primary.symbol,
    amount: `${randomBetween(100, 5000).toFixed(0)}M USD`,
    sector: Math.random() > 0.5 ? "criptoactivos" : "tecnología",
    effect: Math.random() > 0.5 ? "favorece" : "regula",
    company: ["Apple", "Nvidia", "Tesla", "Microsoft", "Meta"][Math.floor(Math.random() * 5)],
    beatMiss: Math.random() > 0.5 ? "superan" : "no alcanzan",
    region: ["Oriente Medio", "Europa", "Asia"][Math.floor(Math.random() * 3)],
    altAction: Math.random() > 0.5 ? "ganan terreno" : "pierden tracción",
    percent: randomBetween(1, 5).toFixed(1),
    reason: Math.random() > 0.5 ? "toma de ganancias" : "datos débiles",
    country: ["Japón", "Singapur", "Suiza", "UAE"][Math.floor(Math.random() * 4)],
    color: Math.random() > 0.5 ? "verde" : "rojo",
    detail: `Analistas recomiendan ${Math.random() > 0.5 ? "mantener" : "reducir exposición"}.`,
  };

  const sentiment = template.sentiment === "neutral"
    ? (Math.random() > 0.5 ? "bullish" : "bearish") as "bullish" | "bearish"
    : template.sentiment;

  const symbols = candidates.slice(0, Math.floor(randomBetween(1, 4))).map(a => a.symbol);
  const news: NewsItem = {
    id: generateId(), headline: fillTemplate(template.headline, ctx),
    summary: fillTemplate(template.summary, ctx),
    source: sources[Math.floor(Math.random() * sources.length)],
    sentiment: sentiment as "bullish" | "bearish" | "neutral",
    impact: template.impact, symbols, timestamp: Date.now(), fake: true,
  };
  if (Math.random() < 0.3) setNewsImpact(news);
  return news;
}
