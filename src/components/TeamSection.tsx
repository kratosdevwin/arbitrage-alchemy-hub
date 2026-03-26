import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Linkedin, Twitter } from "lucide-react";

const team = [
  {
    name: "Alexander Volkov",
    role: "CEO & Co-Founder",
    bio: "Ex-Goldman Sachs quant trader. 15+ years in algorithmic trading and fintech. Led $200M+ in trading operations.",
    avatar: "AV",
    color: "from-primary to-cyan",
  },
  {
    name: "Sarah Chen",
    role: "CTO & Co-Founder",
    bio: "Former engineering lead at Coinbase. Expert in high-frequency trading systems and distributed architecture.",
    avatar: "SC",
    color: "from-secondary to-purple",
  },
  {
    name: "Marcus Thompson",
    role: "Chief Operating Officer",
    bio: "Previously VP of Operations at Binance. Scaled operations across 40+ markets globally.",
    avatar: "MT",
    color: "from-purple to-primary",
  },
  {
    name: "Dr. Elena Petrova",
    role: "Head of AI & Research",
    bio: "PhD in Computational Finance from MIT. Published 20+ papers on ML applications in quantitative finance.",
    avatar: "EP",
    color: "from-cyan to-primary",
  },
  {
    name: "James Okafor",
    role: "Head of Security",
    bio: "Ex-NSA cybersecurity specialist. Built security infrastructure for 3 Fortune 500 fintech companies.",
    avatar: "JO",
    color: "from-primary to-purple",
  },
  {
    name: "Lisa Park",
    role: "VP of Product",
    bio: "Former product lead at Stripe. Expert in building user-centric financial products that scale.",
    avatar: "LP",
    color: "from-secondary to-primary",
  },
  {
    name: "David Kim",
    role: "Head of Business Development",
    bio: "Built partnerships with 100+ exchanges. Previously at Circle and Chainalysis driving enterprise adoption.",
    avatar: "DK",
    color: "from-purple to-cyan",
  },
  {
    name: "Rachel Nguyen",
    role: "Head of Marketing",
    bio: "Led growth at 3 crypto unicorns. Expert in community building, content strategy, and brand development.",
    avatar: "RN",
    color: "from-primary to-secondary",
  },
  {
    name: "Carlos Rivera",
    role: "Lead Backend Engineer",
    bio: "Architected low-latency systems processing 10M+ messages/sec. Rust & Go specialist. Ex-Jump Trading.",
    avatar: "CR",
    color: "from-cyan to-purple",
  },
  {
    name: "Emma Watson",
    role: "Lead Frontend Engineer",
    bio: "Built real-time trading dashboards used by 500K+ traders. React/TypeScript expert. Ex-TradingView.",
    avatar: "EW",
    color: "from-secondary to-cyan",
  },
  {
    name: "Omar Hassan",
    role: "Blockchain Lead",
    bio: "Core contributor to Ethereum and Polygon. Smart contract auditor. Built DeFi protocols with $500M+ TVL.",
    avatar: "OH",
    color: "from-purple to-primary",
  },
  {
    name: "Jessica Taylor",
    role: "Head of Compliance",
    bio: "Former regulatory advisor at SEC. Expert in crypto compliance across US, EU, and APAC markets.",
    avatar: "JT",
    color: "from-primary to-cyan",
  },
];

const TeamSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="team" className="py-24 bg-muted/30" ref={ref}>
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-16"
        >
          <span className="text-primary text-sm font-bold tracking-widest uppercase">People</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-3 mb-6">
            Meet The <span className="gradient-text">Team</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            World-class engineers, traders, and researchers building the future of crypto arbitrage.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {team.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.05 }}
              className="card-glow p-6 text-center group"
            >
              <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center mx-auto mb-4 text-lg font-bold font-display text-primary-foreground group-hover:scale-110 transition-transform`}>
                {t.avatar}
              </div>
              <h3 className="font-bold text-sm">{t.name}</h3>
              <p className="text-xs text-primary font-medium mb-2">{t.role}</p>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4">{t.bio}</p>
              <div className="flex justify-center gap-3">
                <button className="text-muted-foreground hover:text-primary transition-colors">
                  <Linkedin size={16} />
                </button>
                <button className="text-muted-foreground hover:text-secondary transition-colors">
                  <Twitter size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
