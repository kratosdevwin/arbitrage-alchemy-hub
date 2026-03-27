import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Users, LogOut, Home, Zap, Crown, Rocket,
  DollarSign, Star, Clock, ChevronRight, Gift,
  TrendingUp, BarChart3, ArrowLeft
} from "lucide-react";
import logo from "@/assets/logo-timepays.png";

interface InvestmentPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  daily_return_pct: number;
  points_reward: number;
  bonus_per_level: number[];
  duration_days: number;
}

interface UserInvestment {
  id: string;
  package_id: string;
  amount: number;
  status: string;
  purchased_at: string;
  expires_at: string | null;
}

const packageIcons: Record<string, typeof Zap> = {
  Starter: Zap,
  Pro: Rocket,
  Elite: Crown,
};

const packageGradients: Record<string, string> = {
  Starter: "from-primary/20 to-primary/5 border-primary/30",
  Pro: "from-secondary/20 to-secondary/5 border-secondary/30",
  Elite: "from-purple-500/20 to-purple-500/5 border-purple-500/30",
};

const packageAccents: Record<string, string> = {
  Starter: "gradient-primary",
  Pro: "bg-secondary",
  Elite: "bg-purple-500",
};

const Investments = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [packages, setPackages] = useState<InvestmentPackage[]>([]);
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [totalPoints, setTotalPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    const [packagesRes, investmentsRes, pointsRes] = await Promise.all([
      supabase.from("investment_packages").select("*").eq("is_active", true).order("price"),
      supabase.from("user_investments").select("*").eq("user_id", user.id).order("purchased_at", { ascending: false }),
      supabase.from("user_points").select("points").eq("user_id", user.id),
    ]);

    if (packagesRes.data) {
      setPackages(packagesRes.data.map(p => ({
        ...p,
        bonus_per_level: Array.isArray(p.bonus_per_level)
          ? (p.bonus_per_level as number[])
          : JSON.parse(p.bonus_per_level as string),
      })));
    }

    if (investmentsRes.data) setInvestments(investmentsRes.data as UserInvestment[]);

    if (pointsRes.data) {
      const total = pointsRes.data.reduce((sum, p) => sum + (p.points || 0), 0);
      setTotalPoints(total);
    }

    setLoading(false);
  };

  const handlePurchase = async (pkg: InvestmentPackage) => {
    if (!user) return;
    setPurchasing(pkg.id);

    try {
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + pkg.duration_days);

      const { error: investError } = await supabase.from("user_investments").insert({
        user_id: user.id,
        package_id: pkg.id,
        amount: pkg.price,
        status: "active",
        expires_at: expiresAt.toISOString(),
      });

      if (investError) throw investError;

      // Add points
      const { error: pointsError } = await supabase.from("user_points").insert({
        user_id: user.id,
        points: pkg.points_reward,
        source: "investment",
        description: `Pacote ${pkg.name} adquirido`,
      });

      if (pointsError) throw pointsError;

      toast({
        title: "Pacote adquirido! 🎉",
        description: `Você adquiriu o pacote ${pkg.name} e ganhou ${pkg.points_reward} pontos!`,
      });

      fetchData();
    } catch (err: any) {
      toast({
        title: "Erro",
        description: err.message || "Erro ao adquirir pacote",
        variant: "destructive",
      });
    } finally {
      setPurchasing(null);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse gradient-text font-display text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="glass border-b border-border/30 sticky top-0 z-50">
        <div className="container mx-auto flex items-center justify-between py-3 px-6">
          <a href="/" className="flex items-center gap-3">
            <img src={logo} alt="Time Pays" className="h-8 w-auto" />
            <span className="gradient-text font-display text-lg font-bold">Time Pays</span>
          </a>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
              <BarChart3 size={16} /> Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/referrals")}>
              <Users size={16} /> Referrals
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <Home size={16} /> Home
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={16} /> Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-7xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold gradient-text">
                Contas de Investimento
              </h1>
              <p className="text-muted-foreground mt-1">
                Escolha um pacote e comece a lucrar com bônus de rede unilevel até 5 níveis
              </p>
            </div>
            <Badge className="bg-secondary/20 text-secondary border-0 mt-4 sm:mt-0 w-fit">
              <Star size={14} className="mr-1" /> {totalPoints} pontos
            </Badge>
          </div>

          {/* Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {packages.map((pkg, idx) => {
              const Icon = packageIcons[pkg.name] || Zap;
              const gradient = packageGradients[pkg.name] || packageGradients.Starter;
              const accent = packageAccents[pkg.name] || packageAccents.Starter;
              const isPopular = pkg.name === "Pro";

              return (
                <motion.div
                  key={pkg.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <Card className={`glass border bg-gradient-to-b ${gradient} relative overflow-hidden h-full flex flex-col`}>
                    {isPopular && (
                      <div className="absolute top-4 right-4">
                        <Badge className="bg-secondary text-secondary-foreground text-xs">
                          Popular
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pb-4">
                      <div className={`h-14 w-14 rounded-2xl ${accent} flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon size={28} className="text-primary-foreground" />
                      </div>
                      <CardTitle className="font-display text-2xl">{pkg.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{pkg.description}</p>
                    </CardHeader>

                    <CardContent className="flex-1 flex flex-col">
                      {/* Price */}
                      <div className="mb-6">
                        <span className="text-4xl font-display font-bold">${pkg.price}</span>
                        <span className="text-muted-foreground text-sm ml-1">/ {pkg.duration_days} dias</span>
                      </div>

                      {/* Features */}
                      <div className="space-y-3 mb-6 flex-1">
                        <div className="flex items-center gap-3">
                          <TrendingUp size={16} className="text-emerald-400" />
                          <span className="text-sm">{pkg.daily_return_pct}% retorno diário</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Gift size={16} className="text-secondary" />
                          <span className="text-sm">{pkg.points_reward} pontos de bônus</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock size={16} className="text-primary" />
                          <span className="text-sm">{pkg.duration_days} dias de duração</span>
                        </div>

                        {/* Unilevel Bonus Breakdown */}
                        <div className="pt-3 border-t border-border/30">
                          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                            Bônus Unilevel por Nível
                          </p>
                          <div className="space-y-1.5">
                            {pkg.bonus_per_level.map((pct, lvl) => (
                              <div key={lvl} className="flex items-center justify-between">
                                <span className="text-xs text-muted-foreground">Nível {lvl + 1}</span>
                                <Badge variant="outline" className="text-xs">{pct}%</Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* CTA */}
                      <Button
                        onClick={() => handlePurchase(pkg)}
                        disabled={purchasing === pkg.id}
                        className={`w-full ${pkg.name === "Elite" ? "bg-purple-500 hover:bg-purple-600" : accent} hover-neon`}
                        size="lg"
                      >
                        {purchasing === pkg.id ? "Processando..." : "Adquirir Pacote"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Active Investments */}
          {investments.length > 0 && (
            <Card className="glass border-border/30">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <DollarSign size={18} className="text-primary" /> Seus Investimentos Ativos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {investments.map((inv) => {
                    const pkg = packages.find(p => p.id === inv.package_id);
                    const isActive = inv.status === "active";
                    return (
                      <motion.div
                        key={inv.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 bg-muted/30 rounded-lg px-4 py-3"
                      >
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${isActive ? "bg-emerald-500/20" : "bg-muted"}`}>
                          <DollarSign size={18} className={isActive ? "text-emerald-400" : "text-muted-foreground"} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{pkg?.name || "Pacote"} — ${inv.amount}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(inv.purchased_at).toLocaleDateString("pt-BR")}
                            {inv.expires_at && ` → ${new Date(inv.expires_at).toLocaleDateString("pt-BR")}`}
                          </p>
                        </div>
                        <Badge className={isActive ? "bg-emerald-500/20 text-emerald-400 border-0" : "bg-muted text-muted-foreground border-0"}>
                          {isActive ? "Ativo" : inv.status}
                        </Badge>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Investments;
