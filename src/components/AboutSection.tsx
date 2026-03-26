import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { RefreshCw, Globe, BarChart3, Cpu, Layers, Lock } from "lucide-react";

const features = [
  {
    icon: RefreshCw,
    title: "Cross-Exchange Arbitrage",
    desc: "Buy low on one exchange, sell high on another. Our bot monitors price discrepancies across 50+ exchanges in real-time.",
  },
  {
    icon: Globe,
    title: "Triangular Arbitrage",
    desc: "Exploit price differences between three currency pairs within a single exchange. BTC→ETH→USDT→BTC loops executed instantly.",
  },
  {
    icon: BarChart3,
    title: "Statistical Arbitrage",
    desc: "Machine learning models identify mean-reversion patterns and correlated asset pairs for high-probability trades.",
  },
  {
    icon: Cpu,
    title: "Flash Loan Arbitrage",
    desc: "Leverage DeFi flash loans for zero-capital arbitrage on decentralized exchanges. Borrow, trade, and repay in one transaction.",
  },
  {
    icon: Layers,
    title: "Spatial Arbitrage",
    desc: "Capitalize on regional price differences. Crypto prices vary between countries due to regulations, demand, and liquidity.",
  },
  {
    icon: Lock,
    title: "Futures vs Spot",
    desc: "Profit from the basis spread between futures contracts and spot prices. Low-risk strategy with predictable returns.",
  },
];

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-24 relative" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-bold tracking-widest uppercase">What Is Crypto Arbitrage?</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6">
            Exploit <span className="gradient-text">Market Inefficiencies</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Crypto arbitrage is the practice of taking advantage of price differences for the same asset across different markets. Our platform automates this process with cutting-edge algorithms.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="card-glow p-6 group"
            >
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:shadow-lg group-hover:shadow-primary/20 transition-shadow">
                <f.icon className="text-primary-foreground" size={22} />
              </div>
              <h3 className="text-lg font-bold mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
