import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown, ChevronRight, User, Users, Award
} from "lucide-react";

interface ReferralNode {
  id: string;
  name: string;
  email: string;
  level: number;
  bonus: number;
  date: string;
  children: ReferralNode[];
}

interface ReferralTreeNodeProps {
  node: ReferralNode;
  isLast: boolean;
  depth: number;
}

const LEVEL_COLORS = [
  "border-primary bg-primary/10 text-primary",
  "border-secondary bg-secondary/10 text-secondary",
  "border-cyan-500 bg-cyan-500/10 text-cyan-400",
  "border-purple-500 bg-purple-500/10 text-purple-400",
  "border-pink-500 bg-pink-500/10 text-pink-400",
];

const LEVEL_LINE_COLORS = [
  "bg-primary/40",
  "bg-secondary/40",
  "bg-cyan-500/40",
  "bg-purple-500/40",
  "bg-pink-500/40",
];

const LEVEL_DOT_COLORS = [
  "bg-primary",
  "bg-secondary",
  "bg-cyan-500",
  "bg-purple-500",
  "bg-pink-500",
];

const ReferralTreeNode = ({ node, isLast, depth }: ReferralTreeNodeProps) => {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children.length > 0;
  const levelIdx = Math.min(node.level - 1, 4);

  return (
    <div className="relative">
      {/* Vertical connector line from parent */}
      {depth > 0 && (
        <div
          className={`absolute left-[-24px] top-0 w-[2px] ${LEVEL_LINE_COLORS[Math.min(depth - 1, 4)]} ${
            isLast ? "h-[28px]" : "h-full"
          }`}
        />
      )}

      {/* Horizontal connector line */}
      {depth > 0 && (
        <div
          className={`absolute left-[-24px] top-[28px] h-[2px] w-[24px] ${LEVEL_LINE_COLORS[Math.min(depth - 1, 4)]}`}
        />
      )}

      {/* Node */}
      <div className="relative mb-2">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: depth * 0.05 }}
          className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all duration-200 hover:shadow-lg ${
            LEVEL_COLORS[levelIdx]
          } ${hasChildren ? "hover:border-opacity-100" : ""}`}
          onClick={() => hasChildren && setExpanded(!expanded)}
        >
          {/* Expand icon */}
          <div className="w-5 flex-shrink-0">
            {hasChildren ? (
              <motion.div
                animate={{ rotate: expanded ? 0 : -90 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} className="opacity-60" />
              </motion.div>
            ) : (
              <div className={`h-2 w-2 rounded-full mx-auto ${LEVEL_DOT_COLORS[levelIdx]}`} />
            )}
          </div>

          {/* Avatar */}
          <div className={`h-9 w-9 rounded-full flex items-center justify-center border ${LEVEL_COLORS[levelIdx]}`}>
            <User size={16} />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-foreground">{node.name}</p>
            <p className="text-xs text-muted-foreground truncate">{node.email}</p>
          </div>

          {/* Level badge */}
          <Badge variant="outline" className="text-xs flex-shrink-0">
            L{node.level} · {node.bonus}%
          </Badge>

          {/* Children count */}
          {hasChildren && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground flex-shrink-0">
              <Users size={12} />
              <span>{node.children.length}</span>
            </div>
          )}
        </motion.div>

        {/* Children */}
        <AnimatePresence>
          {expanded && hasChildren && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="ml-10 mt-2 relative">
                {node.children.map((child, idx) => (
                  <ReferralTreeNode
                    key={child.id}
                    node={child}
                    isLast={idx === node.children.length - 1}
                    depth={depth + 1}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

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

interface ReferralTreeProps {
  referrals: Referral[];
  userName: string;
  userEmail: string;
}

// Build a tree from flat referral data
// Since we don't have parent-child info beyond levels, we group by level
// and create a hierarchical structure
const buildTree = (
  referrals: Referral[],
  userName: string,
  userEmail: string
): ReferralNode => {
  const level1 = referrals.filter((r) => r.level === 1);
  const level2 = referrals.filter((r) => r.level === 2);
  const level3 = referrals.filter((r) => r.level === 3);
  const level4 = referrals.filter((r) => r.level === 4);
  const level5 = referrals.filter((r) => r.level === 5);

  // Distribute deeper levels across their parents for tree visualization
  const distributeChildren = (parents: Referral[], children: Referral[]): Map<string, Referral[]> => {
    const map = new Map<string, Referral[]>();
    parents.forEach((p) => map.set(p.referred_id, []));
    children.forEach((c, idx) => {
      const parentKeys = [...map.keys()];
      if (parentKeys.length > 0) {
        const parentKey = parentKeys[idx % parentKeys.length];
        map.get(parentKey)!.push(c);
      }
    });
    return map;
  };

  const l4ByL3 = distributeChildren(level3, level4);
  const l5ByL4 = distributeChildren(level4, level5);

  const makeNode = (r: Referral, children: ReferralNode[]): ReferralNode => ({
    id: r.id,
    name: r.referred_profile?.full_name || "User",
    email: r.referred_profile?.email || r.referred_id.slice(0, 8) + "...",
    level: r.level,
    bonus: r.bonus_percentage,
    date: new Date(r.created_at).toLocaleDateString(),
    children,
  });

  // Build from bottom up
  const l5Nodes = level5.map((r) => makeNode(r, []));
  const l4Nodes = level4.map((r) => {
    const l5Children = (l5ByL4.get(r.referred_id) || []).map((c) =>
      l5Nodes.find((n) => n.id === c.id) || makeNode(c, [])
    );
    return makeNode(r, l5Children);
  });

  const l3ByL2 = distributeChildren(level2, level3);
  const l3Nodes = level3.map((r) => {
    const l4Children = (l4ByL3.get(r.referred_id) || []).map((c) =>
      l4Nodes.find((n) => n.id === c.id) || makeNode(c, [])
    );
    return makeNode(r, l4Children);
  });

  const l2ByL1 = distributeChildren(level1, level2);
  const l2Nodes = level2.map((r) => {
    const l3Children = (l3ByL2.get(r.referred_id) || []).map((c) =>
      l3Nodes.find((n) => n.id === c.id) || makeNode(c, [])
    );
    return makeNode(r, l3Children);
  });

  const l1Nodes = level1.map((r) => {
    const l2Children = (l2ByL1.get(r.referred_id) || []).map((c) =>
      l2Nodes.find((n) => n.id === c.id) || makeNode(c, [])
    );
    return makeNode(r, l2Children);
  });

  return {
    id: "root",
    name: userName,
    email: userEmail,
    level: 0,
    bonus: 0,
    date: "",
    children: l1Nodes,
  };
};

const ReferralTree = ({ referrals, userName, userEmail }: ReferralTreeProps) => {
  const tree = buildTree(referrals, userName, userEmail);

  if (referrals.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="h-20 w-20 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
          <Users size={32} className="text-muted-foreground opacity-40" />
        </div>
        <p className="text-muted-foreground font-medium">No referrals yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Share your referral link to start building your tree
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-6">
        {[
          { level: 1, pct: "10%", color: "bg-primary" },
          { level: 2, pct: "5%", color: "bg-secondary" },
          { level: 3, pct: "3%", color: "bg-cyan-500" },
          { level: 4, pct: "2%", color: "bg-purple-500" },
          { level: 5, pct: "1%", color: "bg-pink-500" },
        ].map((item) => (
          <div key={item.level} className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
            <span>Level {item.level} ({item.pct})</span>
          </div>
        ))}
      </div>

      {/* Root node (You) */}
      <div className="mb-4">
        <div className="flex items-center gap-3 rounded-xl border-2 border-primary bg-primary/5 px-5 py-4">
          <div className="h-11 w-11 rounded-full gradient-primary flex items-center justify-center">
            <Award size={20} className="text-primary-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-semibold text-foreground">{tree.name}</p>
            <p className="text-xs text-muted-foreground">{tree.email}</p>
          </div>
          <Badge className="gradient-primary text-primary-foreground">You</Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users size={14} />
            <span>{referrals.length} total</span>
          </div>
        </div>
      </div>

      {/* Tree */}
      <div className="ml-6 relative">
        {/* Vertical line from root */}
        <div className="absolute left-[-24px] top-0 w-[2px] bg-primary/40 h-full" />
        {tree.children.map((child, idx) => (
          <ReferralTreeNode
            key={child.id}
            node={child}
            isLast={idx === tree.children.length - 1}
            depth={1}
          />
        ))}
      </div>
    </div>
  );
};

export default ReferralTree;
