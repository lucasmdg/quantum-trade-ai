# QuantumTrade AI

Plataforma web de simulación de bot de trading algorítmico impulsado por IA.

> ⚠️ **Aviso Legal**: Esta plataforma es una simulación ficticia de trading con IA construida exclusivamente con fines educativos y de portafolio. **No se ejecutan operaciones reales. No se proporciona asesoramiento financiero.** Todo el capital, operaciones y rendimiento son ficticios.

---

## Demo

> [!NOTE]
> La plataforma se inicia automáticamente al cargar la página — el bot comienza a operar inmediatamente.

## Stack

| Capa       | Tecnologías |
|------------|-------------|
| Frontend   | Next.js 15+, React 19, TypeScript, TailwindCSS v4 |
| Animaciones | Framer Motion |
| Charts     | Recharts, TradingView Lightweight Charts |
| Estado     | Zustand (persistencia localStorage) |
| UI         | Componentes propios estilo Shadcn/UI + Lucide Icons |
| Backend    | API Routes de Next.js |
| IA Local   | Ollama (Llama 3, Mistral, DeepSeek, Gemma) con fallback procedural |
| Persistencia | localStorage / IndexedDB |

## Arquitectura

```
src/
├── app/           # App Router (dashboard, portfolio, analytics, history, settings)
│   └── api/ai/    # Proxy a Ollama local
├── components/
│   ├── ui/        # Botones, cards, badges, progress, scroll-area
│   ├── layout/    # Sidebar, header
│   ├── dashboard/ # EquityCurve, PnLDisplay, SentimentGauge, RiskPanel, etc.
│   └── charts/    # Candlestick, Drawdown, Volatility
├── engine/        # Core simulation (market, trading, portfolio, risk, news, ai)
├── store/         # Zustand stores (engine, settings)
├── lib/           # Constants, utils
├── types/         # TypeScript interfaces
└── data/          # Static data
```

## Funcionalidades

### Dashboard
- **Equity Curve** — Evolución del capital en tiempo real (Recharts AreaChart)
- **Portfolio Allocation** — Distribución por clase de activo (PieChart)
- **Open Positions** — Tabla de posiciones abiertas con PnL en vivo
- **Activity Terminal** — Consola estilo hacker con logs de todos los módulos
- **Market Ticker** — Cotizaciones en scrolling horizontal
- **Sentiment Gauge** — Fear & Greed Index + Sentiment score
- **Risk Panel** — VaR, Sharpe, Sortino, Drawdown, Kelly, exposición
- **PnL Display** — Métricas de rendimiento con contadores animados
- **AI Analysis** — Análisis multi-agente con modo Feed + Inspector
- **Candlestick Chart** — Price action de BTC/USD
- **Drawdown Chart** — Evolución del drawdown
- **Volatility Chart** — Volatilidad ATR
- **News Feed** — Noticias sintéticas generadas proceduralmente

### Motor de Simulación
- **MarketDataSimulator** — Generación procedural OHLCV, random walk, correlaciones, 40+ activos
- **TradingEngine** — 16 estrategias (scalping, swing, momentum, mean reversion, trend following, grid, arbitraje, VWAP, RSI, MACD, Bollinger, EMA, Smart Money, Wyckoff, ATR)
- **RiskEngine** — Position sizing (Kelly), VaR, drawdown, circuit breakers, score de riesgo
- **PortfolioManager** — Balance, equity, PnL, drawdown, Sharpe, historial
- **NewsEngine** — Noticias sintéticas con impacto en mercado, 12+ plantillas
- **EventSystem** — Flash crash, breakout, FOMO, liquidation, macro shocks
- **AIEngine** — Integración Ollama opcional + análisis procedural de respaldo

### Activos
- 15 criptomonedas (BTC, ETH, SOL, XRP, ADA, BNB, AVAX, DOGE, LINK, LTC, PEPE, SHIB, TON, SUI, APT)
- 4 pares forex (EUR/USD, USD/JPY, GBP/USD, USD/CNY)
- 6 índices (S&P 500, Nasdaq, Dow Jones, DAX, IBEX 35, Nikkei)
- 4 commodities (Oro, Plata, Petróleo, Gas Natural)
- 1 bono (US10Y)
- 3 tipos de interés (Euríbor, Fed Rate, ECB)
- 7 acciones (Apple, Nvidia, Tesla, Microsoft, Meta, Amazon, Google)

### Páginas
| Ruta        | Descripción |
|-------------|-------------|
| `/`         | Dashboard principal con todos los widgets |
| `/portfolio` | Visión detallada de cartera, posiciones, historial de trades |
| `/analytics` | Métricas avanzadas, correlaciones, returns, allocation |
| `/history`  | Historial completo de operaciones con filtros |
| `/settings` | Configuración: capital, riesgo, velocidad, estrategias, activos favoritos |

## Instalación

```bash
# Clonar
git clone https://github.com/lucasmdg/quantum-trade-ai.git
cd quantum-trade-ai

# Instalar dependencias
npm install

# Iniciar en desarrollo
npm run dev

# Build producción
npm run build

# Iniciar producción
npm start
```

## IA Local (Opcional)

Si tienes Ollama instalado:

```bash
# Instalar Ollama
# https://ollama.com

# Descargar modelo
ollama pull llama3

# Asegurar que Ollama corre en localhost:11434
```

La plataforma detecta automáticamente Ollama al iniciar. Si no está disponible, usa el motor procedural de respaldo.

## Despliegue

### GitHub Pages
```bash
npm run build
# Subir la carpeta out/ a gh-pages
```

### Vercel / Netlify
Conectar repositorio → build command: `npm run build` → output: `out/`

## Variables de Entorno

```env
# Opcional — solo si Ollama corre en puerto diferente
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama3
```

## Disclaimer Legal

```
ESTA PLATAFORMA ES UNA SIMULACIÓN FICTICIA DE TRADING CON IA.

- No se ejecutan órdenes reales en ningún mercado financiero.
- No se conecta a brokers, exchanges o APIs de trading real.
- Todo el capital, operaciones, rendimiento y análisis son ficticios.
- No constituye asesoramiento financiero de ningún tipo.
- Creada exclusivamente con fines educativos y de portafolio.

QuantumTrade AI no se hace responsable de pérdidas financieras
derivadas del uso de este software.
```

## Roadmap

- [x] Dashboard principal con todos los widgets
- [x] Motor de simulación de mercados (40+ activos)
- [x] 16 estrategias de trading algorítmico
- [x] Sistema de riesgo institucional (VaR, Sharpe, Kelly)
- [x] Feed de noticias sintéticas con impacto en mercado
- [x] IA multi-agente (Risk, Macro, Sentiment, Execution, Portfolio, Strategy)
- [x] Integración Ollama opcional
- [x] Persistencia en localStorage
- [x] Panel de configuración completo
- [ ] TradingView Lightweight Charts (candlestick real)
- [ ] Sonidos ambientales de trading
- [ ] Modo oscuro / claro
- [ ] Exportar historial a CSV
- [ ] Simulación multi-timeframe
- [ ] Respaldo en IndexedDB
- [ ] Tests unitarios del motor de simulación

## Licencia

MIT
