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
  Clock, ChevronRight, Copy, Share2
} from "lucide-react";
import logo from "@/assets/logo-timepays.png";

interface Profile {
  full_name: string | null;
  email: string | null;
  referral_code: string;
  referred_by: string | null;
}

const Dashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [totalReferrals, setTotalReferrals] = useState(0);
  const [directReferrals, setDirectReferrals] = useState(0);
  const [networkDepth, setNetworkDepth] = useState(0);
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

  // Mock data for transactions (would come from a real transactions table)
  const recentTransactions = [
    { id: 1, type: "bonus", description: "Level 1 Referral Bonus", amount: "+$12.50", time: "2 hours ago", positive: true },
    { id: 2, type: "bonus", description: "Level 2 Network Bonus", amount: "+$3.25", time: "5 hours ago", positive: true },
    { id: 3, type: "bonus", description: "Level 1 Referral Bonus", amount: "+$8.00", time: "1 day ago", positive: true },
    { id: 4, type: "bonus", description: "Level 3 Network Bonus", amount: "+$1.80", time: "2 days ago", positive: true },
    { id: 5, type: "bonus", description: "Level 1 Referral Bonus", amount: "+$15.00", time: "3 days ago", positive: true },
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

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Welcome */}
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold gradient-text">
              Welcome, {profile?.full_name || profile?.email || "User"}
            </h1>
            <p className="text-muted-foreground mt-1">Your earnings overview and activity</p>
          </div>

          {/* Earnings Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass border-border/30 overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                    <DollarSign size={20} className="text-primary-foreground" />
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                    <ArrowUpRight size={12} /> +12%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Today's Earnings</p>
                <p className="text-2xl font-display font-bold mt-1">$40.55</p>
              </CardContent>
            </Card>

            <Card className="glass border-border/30 overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center">
                    <Wallet size={20} className="text-secondary-foreground" />
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border-0">
                    <ArrowUpRight size={12} /> +8%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">Current Balance</p>
                <p className="text-2xl font-display font-bold mt-1">$1,250.80</p>
              </CardContent>
            </Card>

            <Card className="glass border-border/30 overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <Network size={20} className="text-cyan-400" />
                  </div>
                  <span className="text-xs text-muted-foreground">{totalReferrals} members</span>
                </div>
                <p className="text-sm text-muted-foreground">Network Balance</p>
                <p className="text-2xl font-display font-bold mt-1">$4,820.00</p>
              </CardContent>
            </Card>

            <Card className="glass border-border/30 overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                    <TrendingUp size={20} className="text-purple-400" />
                  </div>
                  <span className="text-xs text-muted-foreground">Depth {networkDepth}/5</span>
                </div>
                <p className="text-sm text-muted-foreground">Total Earnings</p>
                <p className="text-2xl font-display font-bold mt-1">$3,420.55</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions + Referral Link */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="glass border-border/30">
              <CardHeader>
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
                    <Users size={14} /> View Network
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Code: <span className="font-mono text-primary font-bold">{profile?.referral_code}</span>
                </p>
              </CardContent>
            </Card>

            {/* Network Summary */}
            <Card className="glass border-border/30">
              <CardHeader>
                <CardTitle className="font-display text-lg flex items-center gap-2">
                  <Users size={18} className="text-secondary" /> Network Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { level: 1, pct: "10%", count: directReferrals, color: "bg-primary" },
                    { level: 2, pct: "5%", count: 0, color: "bg-secondary" },
                    { level: 3, pct: "3%", count: 0, color: "bg-cyan-500" },
                    { level: 4, pct: "2%", count: 0, color: "bg-purple-500" },
                    { level: 5, pct: "1%", count: 0, color: "bg-pink-500" },
                  ].map((item) => (
                    <div key={item.level} className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full ${item.color}`} />
                      <span className="text-sm text-muted-foreground flex-1">Level {item.level}</span>
                      <Badge variant="outline" className="text-xs">{item.pct}</Badge>
                      <span className="text-sm font-bold w-8 text-right">{item.count}</span>
                    </div>
                  ))}
                </div>
                <Button
                  onClick={() => navigate("/referrals")}
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4 text-primary"
                >
                  View Full Network <ChevronRight size={14} />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Transactions */}
          <Card className="glass border-border/30">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Clock size={18} className="text-primary" /> Recent Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransactions.map((tx) => (
                  <div
                    key={tx.id}
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
                  </div>
                ))}
              </div>
              {recentTransactions.length === 0 && (
                <div className="text-center py-8">
                  <Clock size={40} className="text-muted-foreground mx-auto mb-3 opacity-30" />
                  <p className="text-muted-foreground">No transactions yet</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
