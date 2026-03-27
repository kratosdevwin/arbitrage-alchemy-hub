import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import ReferralTree from "@/components/ReferralTree";
import {
  Users, Copy, Home, Award, Share2, LayoutDashboard, GitBranch
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

const Referrals = () => {
  const { user, loading: authLoading } = useAuth();
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
            <p className="text-muted-foreground mt-1">Your unilevel referral tree</p>
          </div>

          {/* Stats Row */}
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
                    <p className="text-sm text-muted-foreground">Direct (Level 1)</p>
                    <p className="text-2xl font-display font-bold">{directReferrals}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass border-border/30">
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center">
                    <GitBranch size={24} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Levels</p>
                    <p className="text-2xl font-display font-bold">
                      {new Set(referrals.map((r) => r.level)).size} / 5
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Referral Link */}
          <Card className="glass border-border/30 mb-8">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <Share2 size={18} className="text-primary" /> Your Referral Link
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
                Code: <span className="font-mono text-primary font-bold">{profile?.referral_code}</span>
              </p>
            </CardContent>
          </Card>

          {/* Referral Tree */}
          <Card className="glass border-border/30">
            <CardHeader>
              <CardTitle className="font-display text-lg flex items-center gap-2">
                <GitBranch size={18} className="text-primary" /> Referral Tree
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReferralTree
                referrals={referrals}
                userName={profile?.full_name || profile?.email || "You"}
                userEmail={profile?.email || ""}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Referrals;
