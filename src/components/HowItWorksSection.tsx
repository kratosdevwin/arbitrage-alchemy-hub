import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Search, Zap, ArrowRightLeft, Wallet } from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Scan Markets",
    desc: "Our algorithms continuously scan 50+ exchanges, monitoring thousands of trading pairs for price discrepancies in real-time.",
  },
  {
    icon: Zap,
    step: "02",
    title: "Detect Opportunity",
    desc: "When a profitable gap is found (factoring in fees, slippage, and transfer times), the system flags it instantly.",
  },
  {
    icon: ArrowRightLeft,
    step: "03",
    title: "Execute Trade",
    desc: "Simultaneous buy and sell orders are placed across exchanges within milliseconds, locking in the spread.",
  },
  {
    icon: Wallet,
    step: "04",
    title: "Secure Profit",
    desc: "Profits are automatically calculated, fees deducted, and net gains deposited into your wallet. Full transparency.",
  },
];

const HowItWorksSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="how-it-works" className="py-24 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-secondary text-sm font-bold tracking-widest uppercase">Process</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6">
            How <span className="gradient-text">Arbitrage</span> Works
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <motion.div
              key={s.step}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.15 }}
              className="card-glow p-6 relative group"
            >
              <span className="text-6xl font-display font-bold text-primary/10 absolute top-4 right-4 group-hover:text-primary/20 transition-colors">
                {s.step}
              </span>
              <div className="w-12 h-12 rounded-lg gradient-purple flex items-center justify-center mb-4">
                <s.icon className="text-accent-foreground" size={22} />
              </div>
              <h3 className="text-lg font-bold mb-2">{s.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Example Box */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6 }}
          className="mt-16 card-glow p-8"
        >
          <h3 className="text-xl font-bold mb-4 gradient-text">Real-World Example</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="space-y-2">
              <p className="text-muted-foreground font-medium">Exchange A (Binance)</p>
              <p className="text-2xl font-display font-bold text-foreground">BTC = $67,420</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground font-medium">Exchange B (Kraken)</p>
              <p className="text-2xl font-display font-bold text-foreground">BTC = $67,580</p>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground font-medium">Profit (after fees)</p>
              <p className="text-2xl font-display font-bold text-primary neon-text">+$112.40</p>
              <p className="text-xs text-muted-foreground">0.17% spread · ~$48 in fees · Net: $112.40 per BTC</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
