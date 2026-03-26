import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Rocket, Bot, Smartphone, Globe, Shield, Coins } from "lucide-react";

const phases = [
  {
    icon: Rocket,
    phase: "Phase 1",
    quarter: "Q1 2026",
    title: "Foundation & Launch",
    status: "completed" as const,
    items: [
      "Core arbitrage engine development",
      "Integration with top 10 exchanges (Binance, Coinbase, Kraken, etc.)",
      "Cross-exchange arbitrage module",
      "Real-time price monitoring dashboard",
      "Security audit & penetration testing",
      "Beta launch with 500 early adopters",
    ],
  },
  {
    icon: Bot,
    phase: "Phase 2",
    quarter: "Q2 2026",
    title: "AI & Advanced Strategies",
    status: "active" as const,
    items: [
      "Triangular arbitrage algorithm",
      "ML-based statistical arbitrage module",
      "Automated risk management system",
      "Integration with 30+ additional exchanges",
      "Advanced backtesting engine",
      "Public launch & onboarding",
    ],
  },
  {
    icon: Smartphone,
    phase: "Phase 3",
    quarter: "Q3 2026",
    title: "Mobile & DeFi",
    status: "upcoming" as const,
    items: [
      "iOS & Android mobile app",
      "Flash loan arbitrage on Ethereum, BSC, Polygon",
      "DEX aggregator integration",
      "Push notifications for opportunities",
      "Social trading & copy strategies",
      "Portfolio analytics dashboard",
    ],
  },
  {
    icon: Globe,
    phase: "Phase 4",
    quarter: "Q4 2026",
    title: "Global Expansion",
    status: "upcoming" as const,
    items: [
      "Spatial arbitrage P2P module",
      "Fiat on/off ramp integrations",
      "Multi-language support (20+ languages)",
      "Institutional-grade API access",
      "Regional exchange partnerships",
      "Compliance & regulatory framework",
    ],
  },
  {
    icon: Shield,
    phase: "Phase 5",
    quarter: "Q1 2027",
    title: "Enterprise & Security",
    status: "upcoming" as const,
    items: [
      "Enterprise white-label solution",
      "Hardware security module (HSM) integration",
      "SOC 2 Type II certification",
      "Custom strategy builder (no-code)",
      "Advanced reporting & tax tools",
      "Dedicated account management",
    ],
  },
  {
    icon: Coins,
    phase: "Phase 6",
    quarter: "Q2 2027",
    title: "Token & DAO",
    status: "upcoming" as const,
    items: [
      "TPAY utility token launch",
      "Governance DAO for platform decisions",
      "Staking rewards for token holders",
      "Revenue sharing program",
      "Decentralized strategy marketplace",
      "Community grants program",
    ],
  },
];

const statusColors = {
  completed: "border-primary bg-primary/10",
  active: "border-secondary bg-secondary/10",
  upcoming: "border-border bg-muted/30",
};

const statusBadge = {
  completed: "gradient-primary text-primary-foreground",
  active: "gradient-purple text-accent-foreground",
  upcoming: "bg-muted text-muted-foreground",
};

const RoadmapSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="roadmap" className="py-24" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-bold tracking-widest uppercase">Vision</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6">
            Product <span className="gradient-text">Roadmap</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our ambitious plan to build the world's most comprehensive crypto arbitrage platform.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {phases.map((p, i) => (
            <motion.div
              key={p.phase}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1 }}
              className={`card-glow p-6 border-l-4 ${statusColors[p.status]}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <p.icon className="text-primary" size={20} />
                  <div>
                    <p className="font-display text-xs text-muted-foreground">{p.phase} · {p.quarter}</p>
                    <h3 className="font-bold">{p.title}</h3>
                  </div>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${statusBadge[p.status]}`}>
                  {p.status === "completed" ? "Done" : p.status === "active" ? "In Progress" : "Upcoming"}
                </span>
              </div>
              <ul className="space-y-2">
                {p.items.map((item) => (
                  <li key={item} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${p.status === "completed" ? "bg-primary" : p.status === "active" ? "bg-secondary" : "bg-muted-foreground/40"}`} />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoadmapSection;
