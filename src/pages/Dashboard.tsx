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
  Users, LogOut, Home, TrendingUp, DollarSign,
  Wallet, Network, ArrowUpRight, ArrowDownRight,
  Clock, ChevronRight, Copy, Share2, BarChart3,
  Calendar, Target, Zap, PieChart, Activity
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from "recharts";
import logo from "@/assets/logo-timepays.png";

interface Profile {
  full_name: string | null;
  email: string | null;
  referral_code: string;
  referred_by: string | null;
}

// Mock chart data
const earningsChartData = [
  { day: "Mon", earnings: 12.5 },
  { day: "Tue", earnings: 18.3 },
  { day: "Wed", earnings: 8.7 },
  { day: "Thu", earnings: 25.1 },
  { day: "Fri", earnings: 32.0 },
  { day: "Sat", earnings: 22.4 },
  { day: "Sun", earnings: 40.55 },
];

const networkGrowthData = [
  { week: "W1", members: 2 },
  { week: "W2", members: 5 },
  { week: "W3", members: 8 },
  { week: "W4", members: 12 },
  { week: "W5", members: 18 },
  { week: "W6", members: 24 },
];

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [directReferrals, setDirectReferrals] = useState(0);
  const [networkDepth, setNetworkDepth] = useState(0);
  const [levelCounts, setLevelCounts] = useState<number[]>([0, 0, 0, 0, 0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    const [profileRes, referralsRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      supabase.from("referrals").select("*").eq("referrer_id", user.id),
    ]);

    if (profileRes.data) setProfile(profileRes.data);

    if (referralsRes.data) {
      setTotalReferrals(referralsRes.data.length);
      setDirectReferrals(referralsRes.data.filter((r) => r.level === 1).length);
      const levels = new Set(referralsRes.data.map((r) => r.level));
      setNetworkDepth(levels.size);
      const counts = [1, 2, 3, 4, 5].map(
        (l) => referralsRes.data.filter((r) => r.level === l).length
      );
      setLevelCounts(counts);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  const copyReferralLink = () => {
    if (!profile) return;
    const link = `${window.location.origin}/auth?ref=${profile.referral_code}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Copied!", description: "Referral link copied to clipboard" });
  };

  const recentTransactions = [
    { id: 1, description: "Level 1 Referral Bonus", amount: "+$12.50", time: "2 hours ago", positive: true },
    { id: 2, description: "Level 2 Network Bonus", amount: "+$3.25", time: "5 hours ago", positive: true },
    { id: 3, description: "Level 1 Referral Bonus", amount: "+$8.00", time: "1 day ago", positive: true },
    { id: 4, description: "Level 3 Network Bonus", amount: "+$1.80", time: "2 days ago", positive: true },
    { id: 5, description: "Level 1 Referral Bonus", amount: "+$15.00", time: "3 days ago", positive: true },
    { id: 6, description: "Level 4 Network Bonus", amount: "+$0.95", time: "4 days ago", positive: true },
    { id: 7, description: "Level 2 Network Bonus", amount: "+$4.20", time: "5 days ago", positive: true },
  ];

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
            <Button variant="ghost" size="sm" onClick={() => navigate("/investments")}>
              <DollarSign size={16} /> Investimentos
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
          {/* Welcome */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="font-display text-3xl font-bold gradient-text">
                Welcome, {profile?.full_name || profile?.email || "User"}
              </h1>
              <p className="text-muted-foreground mt-1">Your earnings overview and activity</p>
            </div>
            <div className="flex items-center gap-2 mt-4 sm:mt-0">
              <Badge variant="outline" className="text-xs">
                <Calendar size={12} className="mr-1" />
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
              </Badge>
            </div>
          </div>

          {/* Main Earnings Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <Card className="glass border-border/30 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 gradient-primary opacity-10 rounded-bl-full" />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-11 w-11 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                      <DollarSign size={22} className="text-primary-foreground" />
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                      <ArrowUpRight size={10} className="mr-0.5" /> +12%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Today's Earnings</p>
                  <p className="text-3xl font-display font-bold mt-1">$40.55</p>
                  <p className="text-xs text-muted-foreground mt-1">vs $36.20 yesterday</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="glass border-border/30 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-secondary opacity-10 rounded-bl-full" />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-11 w-11 rounded-xl bg-secondary flex items-center justify-center shadow-lg">
                      <Wallet size={22} className="text-secondary-foreground" />
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-0 text-xs">
                      <ArrowUpRight size={10} className="mr-0.5" /> +8%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Balance</p>
                  <p className="text-3xl font-display font-bold mt-1">$1,250.80</p>
                  <p className="text-xs text-muted-foreground mt-1">Available for withdrawal</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
              <Card className="glass border-border/30 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500 opacity-10 rounded-bl-full" />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-11 w-11 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                      <Network size={22} className="text-cyan-400" />
                    </div>
                    <span className="text-xs text-muted-foreground">{totalReferrals} members</span>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Network Balance</p>
                  <p className="text-3xl font-display font-bold mt-1">$4,820.00</p>
                  <p className="text-xs text-muted-foreground mt-1">Total network volume</p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <Card className="glass border-border/30 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500 opacity-10 rounded-bl-full" />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-11 w-11 rounded-xl bg-purple-500/20 flex items-center justify-center">
                      <TrendingUp size={22} className="text-purple-400" />
                    </div>
                    <span className="text-xs text-muted-foreground">Depth {networkDepth}/5</span>
                  </div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Total Earnings</p>
                  <p className="text-3xl font-display font-bold mt-1">$3,420.55</p>
                  <p className="text-xs text-muted-foreground mt-1">All-time accumulated</p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="glass border-border/30">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <BarChart3 size={18} className="text-primary" /> Weekly Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={earningsChartData}>
                      <defs>
                        <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(215, 90%, 55%)" stopOpacity={0.4} />
                          <stop offset="100%" stopColor="hsl(215, 90%, 55%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
                      <XAxis dataKey="day" stroke="hsl(220, 12%, 55%)" fontSize={12} />
                      <YAxis stroke="hsl(220, 12%, 55%)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(220, 22%, 10%)",
                          border: "1px solid hsl(220, 18%, 18%)",
                          borderRadius: "8px",
                          color: "hsl(210, 20%, 92%)",
                        }}
                        formatter={(value: number) => [`$${value.toFixed(2)}`, "Earnings"]}
                      />
                      <Area
                        type="monotone"
                        dataKey="earnings"
                        stroke="hsl(215, 90%, 55%)"
                        strokeWidth={2}
                        fill="url(#earningsGrad)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-border/30">
              <CardHeader className="pb-2">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Activity size={18} className="text-secondary" /> Network Growth
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={networkGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 18%, 18%)" />
                      <XAxis dataKey="week" stroke="hsl(220, 12%, 55%)" fontSize={12} />
                      <YAxis stroke="hsl(220, 12%, 55%)" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(220, 22%, 10%)",
                          border: "1px solid hsl(220, 18%, 18%)",
                          borderRadius: "8px",
                          color: "hsl(210, 20%, 92%)",
                        }}
                      />
                      <Bar dataKey="members" fill="hsl(45, 95%, 55%)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Share + Network Summary + Goals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Share */}
            <Card className="glass border-border/30">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Share2 size={18} className="text-primary" /> Quick Share
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted/50 rounded-lg px-4 py-3 font-mono text-xs text-foreground break-all mb-3">
                  {profile ? `${window.location.origin}/auth?ref=${profile.referral_code}` : "..."}
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyReferralLink} className="gradient-primary hover-neon flex-1" size="sm">
                    <Copy size={14} /> Copy Link
                  </Button>
                  <Button onClick={() => navigate("/referrals")} variant="outline" size="sm" className="flex-1">
                    <Users size={14} /> View Tree
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Code: <span className="font-mono text-primary font-bold">{profile?.referral_code}</span>
                </p>
              </CardContent>
            </Card>

            {/* Network Summary */}
            <Card className="glass border-border/30">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <PieChart size={18} className="text-secondary" /> Network by Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { level: 1, pct: "10%", color: "bg-primary" },
                    { level: 2, pct: "5%", color: "bg-secondary" },
                    { level: 3, pct: "3%", color: "bg-cyan-500" },
                    { level: 4, pct: "2%", color: "bg-purple-500" },
                    { level: 5, pct: "1%", color: "bg-pink-500" },
                  ].map((item, idx) => (
                    <div key={item.level} className="flex items-center gap-3">
                      <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                      <span className="text-sm text-muted-foreground flex-1">Level {item.level}</span>
                      <Badge variant="outline" className="text-xs">{item.pct}</Badge>
                      <span className="text-sm font-bold w-8 text-right">{levelCounts[idx]}</span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => navigate("/referrals")}
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4 text-primary"
                >
                  View Referral Tree <ChevronRight size={14} />
                </Button>
              </CardContent>
            </Card>

            {/* Goals / Milestones */}
            <Card className="glass border-border/30">
              <CardHeader className="pb-3">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Target size={18} className="text-cyan-400" /> Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { label: "First Referral", target: 1, current: directReferrals, icon: Zap },
                    { label: "10 Direct Referrals", target: 10, current: directReferrals, icon: Users },
                    { label: "50 Total Network", target: 50, current: totalReferrals, icon: Network },
                    { label: "$1,000 Earnings", target: 1000, current: 420, icon: DollarSign },
                  ].map((goal) => {
                    const progress = Math.min(100, (goal.current / goal.target) * 100);
                    const completed = progress >= 100;
                    return (
                      <div key={goal.label}>
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <goal.icon size={14} className={completed ? "text-emerald-400" : "text-muted-foreground"} />
                            <span className="text-xs font-medium">{goal.label}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {goal.current}/{goal.target}
                          </span>
                        </div>
                        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            className={`h-full rounded-full ${completed ? "bg-emerald-500" : "gradient-primary"}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="glass border-border/30">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Clock size={18} className="text-primary" /> Recent Transactions
                </CardTitle>
                <Badge variant="outline" className="text-xs">{recentTransactions.length} total</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {recentTransactions.map((tx) => (
                  <motion.div
                    key={tx.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: tx.id * 0.03 }}
                    className="flex items-center gap-4 bg-muted/30 rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${
                      tx.positive ? "bg-emerald-500/20" : "bg-red-500/20"
                    }`}>
                      {tx.positive ? (
                        <ArrowUpRight size={16} className="text-emerald-400" />
                      ) : (
                        <ArrowDownRight size={16} className="text-red-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">{tx.time}</p>
                    </div>
                    <span className={`text-sm font-bold ${
                      tx.positive ? "text-emerald-400" : "text-red-400"
                    }`}>
                      {tx.amount}
                    </span>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
