import { Zap, Github, Twitter, MessageCircle } from "lucide-react";

const FooterSection = () => {
  return (
    <footer className="border-t border-border py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div>
            <a href="#" className="flex items-center gap-2 font-display text-xl font-bold mb-4">
              <Zap className="text-primary" size={24} />
              <span className="gradient-text">ArbitrageX</span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The most advanced crypto arbitrage platform. Automated, secure, and profitable.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-primary transition-colors">Features</a></li>
              <li><a href="#simulation" className="hover:text-primary transition-colors">Simulator</a></li>
              <li><a href="#roadmap" className="hover:text-primary transition-colors">Roadmap</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">API Docs</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#team" className="hover:text-primary transition-colors">Team</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Risk Disclosure</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2026 ArbitrageX. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Twitter size={18} /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><Github size={18} /></a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors"><MessageCircle size={18} /></a>
          </div>
        </div>

        <p className="text-xs text-muted-foreground/50 text-center mt-8">
          Disclaimer: Crypto arbitrage involves financial risk. Past performance does not guarantee future results. This platform is for educational and informational purposes. Always do your own research.
        </p>
      </div>
    </footer>
  );
};

export default FooterSection;
