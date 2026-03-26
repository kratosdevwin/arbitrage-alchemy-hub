import { motion } from "framer-motion";
import { ArrowRight, TrendingUp, Shield, Clock } from "lucide-react";
import mascot from "@/assets/mascot.png";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ backgroundImage: `url(${heroBg})`, backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-background/80" />
      <div className="container mx-auto px-6 relative z-10 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block gradient-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full mb-6 tracking-widest uppercase">
              Next-Gen Crypto Arbitrage
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Profit From{" "}
              <span className="gradient-text neon-text">Price Gaps</span>{" "}
              Across Exchanges
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-lg mb-8 leading-relaxed">
              Time Pays is the automated crypto arbitrage platform that detects and executes profitable trades across 50+ exchanges in milliseconds.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a
                href="#simulation"
                className="gradient-primary px-8 py-3.5 rounded-lg font-bold text-primary-foreground hover-neon flex items-center gap-2 text-sm"
              >
                Launch Simulator <ArrowRight size={18} />
              </a>
              <a
                href="#about"
                className="glass px-8 py-3.5 rounded-lg font-bold text-foreground hover-neon flex items-center gap-2 text-sm border border-primary/20"
              >
                Learn More
              </a>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: TrendingUp, label: "Avg. ROI", value: "12.4%" },
                { icon: Shield, label: "Secured", value: "$2.1B+" },
                { icon: Clock, label: "Exec. Time", value: "<50ms" },
              ].map((stat) => (
                <div key={stat.label} className="card-glow p-4 text-center">
                  <stat.icon className="text-primary mx-auto mb-2" size={20} />
                  <div className="text-xl font-bold font-display gradient-text">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-3xl opacity-20 gradient-primary" />
              <img
                src={mascot}
                alt="Time Pays Mascot"
                width={450}
                height={450}
                className="relative z-10 animate-float drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
