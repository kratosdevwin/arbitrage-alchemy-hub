import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calculator, ArrowRight } from "lucide-react";

const exchanges = ["Binance", "Coinbase", "Kraken", "Bybit", "OKX", "KuCoin"];
const pairs = ["BTC/USDT", "ETH/USDT", "SOL/USDT", "XRP/USDT", "DOGE/USDT"];

const SimulationSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const [investment, setInvestment] = useState(10000);
  const [exchangeA, setExchangeA] = useState("Binance");
  const [exchangeB, setExchangeB] = useState("Kraken");
  const [pair, setPair] = useState("BTC/USDT");
  const [result, setResult] = useState<null | { profit: number; roi: number; fees: number; net: number }>(null);

  const simulate = () => {
    const spread = 0.001 + Math.random() * 0.004; // 0.1% - 0.5%
    const feeRate = 0.001; // 0.1% per side
    const gross = investment * spread;
    const fees = investment * feeRate * 2;
    const net = gross - fees;
    const roi = (net / investment) * 100;
    setResult({ profit: gross, roi, fees, net });
  };

  return (
    <section id="simulation" className="py-24" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-bold tracking-widest uppercase">Interactive</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6">
            Arbitrage <span className="gradient-text">Simulator</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Test different scenarios and see potential returns. Adjust parameters to understand how arbitrage profits work.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto"
        >
          <div className="card-glow p-8">
            <div className="flex items-center gap-3 mb-8">
              <Calculator className="text-primary" size={24} />
              <h3 className="text-xl font-bold">Configure Your Trade</h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Investment Amount (USDT)</label>
                <input
                  type="number"
                  value={investment}
                  onChange={(e) => setInvestment(Number(e.target.value))}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground font-display font-bold focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Trading Pair</label>
                <select
                  value={pair}
                  onChange={(e) => setPair(e.target.value)}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  {pairs.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Buy Exchange</label>
                <select
                  value={exchangeA}
                  onChange={(e) => setExchangeA(e.target.value)}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  {exchanges.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Sell Exchange</label>
                <select
                  value={exchangeB}
                  onChange={(e) => setExchangeB(e.target.value)}
                  className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  {exchanges.map((e) => <option key={e} value={e}>{e}</option>)}
                </select>
              </div>
            </div>

            <button
              onClick={simulate}
              className="w-full gradient-primary py-3.5 rounded-lg font-bold text-primary-foreground hover-neon flex items-center justify-center gap-2"
            >
              Run Simulation <ArrowRight size={18} />
            </button>

            {result && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-8 border-t border-border pt-6"
              >
                <h4 className="text-sm text-muted-foreground mb-4 uppercase tracking-widest">Simulation Results</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-display font-bold gradient-text">${result.profit.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Gross Profit</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-display font-bold text-destructive">${result.fees.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Total Fees</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-display font-bold text-primary neon-text">${result.net.toFixed(2)}</p>
                    <p className="text-xs text-muted-foreground">Net Profit</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-display font-bold text-secondary cyan-glow">{result.roi.toFixed(3)}%</p>
                    <p className="text-xs text-muted-foreground">ROI</p>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
                  <p><strong className="text-foreground">Trade Path:</strong> Buy {pair} on {exchangeA} → Transfer → Sell on {exchangeB}</p>
                  <p className="mt-1"><strong className="text-foreground">Note:</strong> Results include estimated network fees (0.1% per side). Real spreads vary based on market conditions, volume, and timing.</p>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SimulationSection;
