import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Repeat, Triangle, Brain, Flame, Globe2, TrendingDown } from "lucide-react";

const models = [
  {
    icon: Repeat,
    name: "Cross-Exchange",
    risk: "Low",
    avgReturn: "0.1% - 0.5%",
    frequency: "High",
    capital: "$5,000+",
    desc: "The most straightforward form. Buy on exchange A where price is lower, sell on exchange B where price is higher.",
    example: "Buy 1 ETH at $3,200 on Binance → Sell at $3,218 on Coinbase → Profit: $18 minus ~$4 fees = $14 net",
  },
  {
    icon: Triangle,
    name: "Triangular",
    risk: "Low-Medium",
    avgReturn: "0.05% - 0.3%",
    frequency: "Very High",
    capital: "$10,000+",
    desc: "Trade between three pairs on the same exchange exploiting rate inconsistencies.",
    example: "BTC→ETH→USDT→BTC: Start with 1 BTC ($67K) → 20.9 ETH → 67,150 USDT → 1.002 BTC → Profit: 0.002 BTC ($134)",
  },
  {
    icon: Brain,
    name: "Statistical (ML)",
    risk: "Medium",
    avgReturn: "0.5% - 2%",
    frequency: "Medium",
    capital: "$25,000+",
    desc: "Machine learning identifies correlated pairs that temporarily diverge, betting on reversion to the mean.",
    example: "SOL/ETH ratio drops 2σ below mean → Long SOL, Short ETH → Ratio reverts → Close both → Profit: 1.2%",
  },
  {
    icon: Flame,
    name: "Flash Loan (DeFi)",
    risk: "Low",
    avgReturn: "0.2% - 1%",
    frequency: "Medium",
    capital: "$0 (borrowed)",
    desc: "Borrow, arbitrage, and repay in a single atomic transaction on-chain. Zero capital required.",
    example: "Flash borrow 100 ETH → Swap on Uniswap at $3,200 → Swap back on SushiSwap at $3,215 → Repay loan + fee → Net: $142",
  },
  {
    icon: Globe2,
    name: "Spatial (P2P)",
    risk: "Medium-High",
    avgReturn: "1% - 5%",
    frequency: "Low",
    capital: "$1,000+",
    desc: "Buy crypto at lower prices in one region, sell in another where demand/regulation creates premium.",
    example: "BTC trades at $67,000 globally → $69,500 in Argentina (due to capital controls) → Premium: ~3.7%",
  },
  {
    icon: TrendingDown,
    name: "Futures Basis",
    risk: "Low",
    avgReturn: "0.5% - 3%",
    frequency: "Low",
    capital: "$15,000+",
    desc: "Exploit the spread between spot price and futures contracts. Cash-and-carry trade with predictable returns.",
    example: "Spot BTC: $67,000 → Dec Futures: $68,200 → Buy spot + Short futures → Earn $1,200 basis (1.79% in 3 months)",
  },
];

const ModelsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-6" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-secondary text-sm font-bold tracking-widest uppercase">Strategies</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6">
            Arbitrage <span className="gradient-text">Models & Examples</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each model has its own risk profile, capital requirements, and expected returns. We support all of them.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          {models.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className="card-glow p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center shrink-0">
                  <m.icon className="text-primary-foreground" size={22} />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{m.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{m.desc}</p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: "Risk", value: m.risk },
                  { label: "Return", value: m.avgReturn },
                  { label: "Frequency", value: m.frequency },
                  { label: "Min Capital", value: m.capital },
                ].map((s) => (
                  <div key={s.label} className="bg-muted/60 rounded-lg p-2 text-center">
                    <p className="text-xs text-muted-foreground">{s.label}</p>
                    <p className="text-xs font-bold text-foreground mt-0.5">{s.value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-muted/40 rounded-lg p-3 border-l-2 border-primary/50">
                <p className="text-xs text-muted-foreground"><span className="text-primary font-bold">Example:</span> {m.example}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ModelsSection;
