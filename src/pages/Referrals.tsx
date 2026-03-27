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
  Users, Copy, Home, Award, Share2, ChevronRight, LayoutDashboard
} from "lucide-react";
import logo from "@/assets/logo-timepays.png";

interface Profile {
  full_name: string | null;
  email: string | null;
  referral_code: string;
  referred_by: string | null;
}

interface Referral {
  id: string;
  referred_id: string;
  level: number;
  bonus_percentage: number;
  created_at: string;
  referred_profile?: {
    full_name: string | null;
    email: string | null;
  };
}

const LEVEL_COLORS = [
  "bg-primary text-primary-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-cyan-500 text-white",
  "bg-purple-500 text-white",
  "bg-pink-500 text-white",
];

const LEVEL_LABELS = ["Level 1 — 10%", "Level 2 — 5%", "Level 3 — 3%", "Level 4 — 2%", "Level 5 — 1%"];

const Referrals = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
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
      supabase.from("referrals").select("*").eq("referrer_id", user.id).order("level", { ascending: true }),
    ]);

    if (profileRes.data) setProfile(profileRes.data);

    if (referralsRes.data) {
      const referredIds = referralsRes.data.map((r) => r.referred_id);
      if (referredIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name, email")
          .in("user_id", referredIds);

        const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) || []);
        const enriched = referralsRes.data.map((r) => ({
          ...r,
          referred_profile: profileMap.get(r.referred_id) || undefined,
        }));
        setReferrals(enriched);
      } else {
        setReferrals([]);
      }
    }

    setLoading(false);
  };

  const copyReferralLink = () => {
    if (!profile) return;
    const link = `${window.location.origin}/auth?ref=${profile.referral_code}`;
    navigator.clipboard.writeText(link);
    toast({ title: "Copied!", description: "Referral link copied to clipboard" });
  };

  const copyReferralCode = () => {
    if (!profile) return;
    navigator.clipboard.writeText(profile.referral_code);
    toast({ title: "Copied!", description: "Referral code copied to clipboard" });
  };

  const referralsByLevel = [1, 2, 3, 4, 5].map((level) => ({
    level,
    referrals: referrals.filter((r) => r.level === level),
  }));

  const totalReferrals = referrals.length;
  const directReferrals = referrals.filter((r) => r.level === 1).length;

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
              <LayoutDashboard size={16} /> Dashboard
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <Home size={16} /> Home
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="mb-8">
            <h1 className="font-display text-3xl font-bold gradient-text">Referral Network</h1>
            <p className="text-muted-foreground mt-1">Manage your referrals and grow your network</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass border-border/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Users size={24} className="text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Referrals</p>
                    <p className="text-2xl font-display font-bold">{totalReferrals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass border-border/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center">
                    <Award size={24} className="text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Direct Referrals</p>
                    <p className="text-2xl font-display font-bold">{directReferrals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass border-border/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                    <Share2 size={24} className="text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Network Depth</p>
                    <p className="text-2xl font-display font-bold">
                      {referralsByLevel.filter((l) => l.referrals.length > 0).length} / 5
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral Link */}
          <Card className="glass border-border/30 mb-8">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Share2 size={20} className="text-primary" /> Your Referral Link
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 bg-muted/50 rounded-lg px-4 py-3 font-mono text-sm text-foreground break-all">
                  {profile ? `${window.location.origin}/auth?ref=${profile.referral_code}` : "..."}
                </div>
                <div className="flex gap-2">
                  <Button onClick={copyReferralLink} className="gradient-primary hover-neon">
                    <Copy size={16} /> Copy Link
                  </Button>
                  <Button onClick={copyReferralCode} variant="outline">
                    <Copy size={16} /> Code
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Your code: <span className="font-mono text-primary font-bold">{profile?.referral_code}</span>
              </p>
            </CardContent>
          </Card>

          {/* Bonus Structure */}
          <Card className="glass border-border/30 mb-8">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Award size={20} className="text-secondary" /> Bonus Structure (5 Levels)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                {[
                  { level: 1, pct: "10%", color: "from-primary to-primary/70" },
                  { level: 2, pct: "5%", color: "from-secondary to-secondary/70" },
                  { level: 3, pct: "3%", color: "from-cyan-500 to-cyan-500/70" },
                  { level: 4, pct: "2%", color: "from-purple-500 to-purple-500/70" },
                  { level: 5, pct: "1%", color: "from-pink-500 to-pink-500/70" },
                ].map((item) => (
                  <div key={item.level} className={`bg-gradient-to-br ${item.color} rounded-xl p-4 text-center`}>
                    <p className="text-xs opacity-80">Level {item.level}</p>
                    <p className="text-2xl font-display font-bold">{item.pct}</p>
                    <p className="text-xs opacity-80">Bonus</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Referrals by Level */}
          <Card className="glass border-border/30">
            <CardHeader>
              <CardTitle className="font-display flex items-center gap-2">
                <Users size={20} className="text-primary" /> Your Referral Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              {totalReferrals === 0 ? (
                <div className="text-center py-12">
                  <Users size={48} className="text-muted-foreground mx-auto mb-4 opacity-30" />
                  <p className="text-muted-foreground">No referrals yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Share your referral link to start building your network</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {referralsByLevel.map(({ level, referrals: levelRefs }) => (
                    <div key={level}>
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={LEVEL_COLORS[level - 1]}>{LEVEL_LABELS[level - 1]}</Badge>
                        <span className="text-sm text-muted-foreground">
                          ({levelRefs.length} {levelRefs.length === 1 ? "referral" : "referrals"})
                        </span>
                      </div>
                      {levelRefs.length > 0 ? (
                        <div className="space-y-2 ml-4">
                          {levelRefs.map((ref) => (
                            <div key={ref.id} className="flex items-center gap-3 bg-muted/30 rounded-lg px-4 py-3">
                              <ChevronRight size={14} className="text-muted-foreground" />
                              <div className="flex-1">
                                <p className="text-sm font-medium">{ref.referred_profile?.full_name || "User"}</p>
                                <p className="text-xs text-muted-foreground">
                                  {ref.referred_profile?.email || ref.referred_id.slice(0, 8) + "..."}
                                </p>
                              </div>
                              <Badge variant="outline" className="text-xs">{ref.bonus_percentage}% bonus</Badge>
                              <span className="text-xs text-muted-foreground">
                                {new Date(ref.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground ml-4">No referrals at this level</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Referrals;
