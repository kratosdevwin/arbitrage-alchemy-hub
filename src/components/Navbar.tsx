import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import logo from "@/assets/logo-timepays.png";

const navLinks = [
  { label: "About", href: "#about" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Simulation", href: "#simulation" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Team", href: "#team" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/30"
    >
      <div className="container mx-auto flex items-center justify-between py-3 px-6">
        <a href="#" className="flex items-center gap-3">
          <img src={logo} alt="Time Pays" className="h-10 w-auto" />
          <span className="gradient-text font-display text-xl font-bold">Time Pays</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-muted-foreground hover:text-primary transition-colors duration-300 text-sm font-medium tracking-wide"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#simulation"
            className="gradient-primary px-5 py-2 rounded-lg text-sm font-bold text-primary-foreground hover-neon"
          >
            Try Simulator
          </a>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="md:hidden glass border-t border-border/30 px-6 pb-4"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-3 text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
