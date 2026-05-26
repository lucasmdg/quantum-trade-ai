import type { NewsItem } from "@/types";
import { generateId, randomBetween, weightedRandom } from "@/lib/utils";
import { ASSETS, CRYPTO_SYMBOLS, INDEX_SYMBOLS } from "@/lib/constants";
import { setNewsImpact } from "./market";

const newsTemplates: {
  headline: string;
  summary: string;
  sentiment: NewsItem["sentiment"];
  impact: NewsItem["impact"];
  assetFilter: (a: typeof ASSETS[0]) => boolean;
}[] = [
  {
    headline: "Fed mantiene tipos en ${rate}% — mercado reacciona con ${reaction}",
    summary: "La Reserva Federal mantiene los tipos de interés sin cambios, en línea con lo esperado por el mercado. ${detail}",
    sentiment: "bullish", impact: "high",
    assetFilter: (a) => a.class === "index" || a.symbol === "EUR/USD",
  },
  {
    headline: "Bitcoin supera resistencia de ${price} — analistas esperan continuación",
    summary: "Bitcoin rompe por encima de la resistencia clave de ${price} con volumen creciente. Momentum positivo en cripto.",
    sentiment: "bullish", impact: "medium",
    assetFilter: (a) => a.class === "crypto",
  },
  {
    headline: "Inflación ${direction} sorprende a mercados — ${reaction} generalizado",
    summary: "Los datos de inflación publicados hoy muestran una ${direction} inesperada, provocando ${reaction} en los mercados globales.",
    sentiment: "neutral", impact: "high",
    assetFilter: (a) => true,
  },
  {
    headline: "Flash crash en ${asset} — volatilidad intradiaria extrema",
    summary: "Movimiento violento en ${asset} durante la sesión asiática. Se investigan posibles causas.",
    sentiment: "bearish", impact: "high",
    assetFilter: (a) => a.class === "crypto",
  },
  {
    headline: "ETF de ${asset} registra entradas récord de ${amount}",
    summary: "Los flujos institucionales hacia ETFs de ${asset} alcanzan máximos históricos, señal de adopción creciente.",
    sentiment: "bullish", impact: "medium",
    assetFilter: (a) => a.class === "crypto",
  },
  {
    headline: "UE anuncia nuevo marco regulatorio para ${sector}",
    summary: "La Unión Europea presenta un nuevo marco regulatorio que ${effect} el sector de ${sector}.",
    sentiment: "neutral", impact: "medium",
    assetFilter: (a) => a.class === "crypto" || a.class === "stock",
  },
  {
    headline: "${company} reporta resultados ${beatMiss} estimaciones",
    summary: "Los resultados trimestrales de ${company} ${beatMiss} las estimaciones del consenso. ${detail}",
    sentiment: "bullish", impact: "medium",
    assetFilter: (a) => a.class === "stock",
  },
  {
    headline: "Petróleo ${direction2} por tensiones geopolíticas en ${region}",
    summary: "El crudo ${direction2} tras escalada de tensiones en ${region}, afectando cadenas de suministro globales.",
    sentiment: "bearish", impact: "medium",
    assetFilter: (a) => a.class === "commodity" || a.class === "index",
  },
  {
    headline: "Dominancia de BTC ${direction} — altcoins ${altAction}",
    summary: "La dominancia de Bitcoin ${direction} mientras las altcoins ${altAction} frente al mercado general.",
    sentiment: "neutral", impact: "low",
    assetFilter: (a) => a.class === "crypto",
  },
  {
    headline: "Corrección técnica en índices americanos — ${percent}% de caída",
    summary: "Los principales índices estadounidenses corrigen tras ${reason}. Los inversores esperan la próxima sesión.",
    sentiment: "bearish", impact: "high",
    assetFilter: (a) => a.class === "index",
  },
  {
    headline: "Adopción masiva: ${country} integra blockchain en ${sector}",
    summary: "${country} anuncia la integración de tecnología blockchain en ${sector}, impulsando el sentimiento del mercado.",
    sentiment: "bullish", impact: "low",
    assetFilter: (a) => a.class === "crypto",
  },
  {
    headline: "Volatilidad expandida — todos los activos en ${color}",
    summary: "La volatilidad implícita se expande significativamente. Se recomienda ajustar gestión de riesgo.",
    sentiment: "neutral", impact: "medium",
    assetFilter: (a) => true,
  },
];

const sources = ["Bloomberg", "Reuters", "CoinDesk", "Financial Times", "CNBC", "CryptoPanic", "WSJ", "Cointelegraph", "The Block", "CoinTelegraph", "Decrypt", "Unchained"];

function fillTemplate(tpl: string, ctx: Record<string, string>): string {
  return tpl.replace(/\${(\w+)}/g, (_, k) => ctx[k] ?? k);
}

export function generateNews(): NewsItem {
  const template = newsTemplates[Math.floor(Math.random() * newsTemplates.length)];
  const candidates = ASSETS.filter(template.assetFilter);
  const primary = candidates.length > 0
    ? candidates[Math.floor(Math.random() * candidates.length)]
    : ASSETS[Math.floor(Math.random() * ASSETS.length)];

  const price = Math.floor(randomBetween(1000, 100000));
  const rate = Math.floor(randomBetween(3, 6));
  const direction = Math.random() > 0.5 ? "alcista" : "bajista";
  const direction2 = Math.random() > 0.5 ? "sube" : "baja";
  const reaction = Math.random() > 0.5 ? "optimismo generalizado" : "ventas generalizadas";
  const amount = `${randomBetween(100, 5000).toFixed(0)}M USD`;
  const sector = Math.random() > 0.5 ? "criptoactivos" : "tecnología";
  const effect = Math.random() > 0.5 ? "favorece la innovación" : "aumenta la claridad legal";
  const company = ["Apple", "Nvidia", "Tesla", "Microsoft", "Meta", "Amazon", "Google"][Math.floor(Math.random() * 7)];
  const beatMiss = Math.random() > 0.5 ? "superan" : "no alcanzan";
  const region = ["Oriente Medio", "Europa del Este", "Asia-Pacifico", "Latinoamérica"][Math.floor(Math.random() * 4)];
  const altAction = Math.random() > 0.5 ? "ganan terreno" : "pierden tracción";
  const percent = randomBetween(1, 5).toFixed(1);
  const reason = Math.random() > 0.5 ? "toma de ganancias" : "datos macroeconómicos débiles";
  const country = ["Japón", "Singapur", "Suiza", "UAE", "Reino Unido"][Math.floor(Math.random() * 5)];
  const color = Math.random() > 0.5 ? "verde" : "rojo";
  const detail = `Analistas recomiendan ${Math.random() > 0.5 ? "mantener posiciones" : "reducir exposición"}.`;

  const ctx: Record<string, string> = {
    rate: `${rate}.${Math.floor(randomBetween(0, 9))}%`,
    reaction,
    price: `$${price.toLocaleString()}`,
    direction2: direction2,
    direction: direction,
    asset: primary.symbol,
    amount,
    sector,
    effect,
    company,
    beatMiss,
    region,
    altAction,
    percent,
    reason,
    country,
    color,
    detail,
  };

  const headline = fillTemplate(template.headline, ctx);
  const summary = fillTemplate(template.summary, ctx);

  const sentiment = template.sentiment === "neutral"
    ? (Math.random() > 0.5 ? "bullish" : "bearish") as "bullish" | "bearish"
    : template.sentiment;

  const symbols = candidates.slice(0, Math.floor(randomBetween(1, 4))).map((a) => a.symbol);

  const news: NewsItem = {
    id: generateId(),
    headline,
    summary,
    source: sources[Math.floor(Math.random() * sources.length)],
    sentiment: sentiment as "bullish" | "bearish" | "neutral",
    impact: template.impact,
    symbols,
    timestamp: Date.now(),
    fake: true,
  };

  if (Math.random() < 0.3) {
    setNewsImpact(news);
  }

  return news;
}

export function generateBatchNews(count: number): NewsItem[] {
  return Array.from({ length: count }, () => generateNews());
}
