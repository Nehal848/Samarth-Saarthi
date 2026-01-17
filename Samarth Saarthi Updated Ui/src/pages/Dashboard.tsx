import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BadgeCheck, Target, ArrowLeftRight, Sparkles, TrendingUp, Coins, Calendar, Trophy, GitBranch, Code, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState, useRef } from "react";
import LearningCurve from "@/components/ui/learning-curve";

// Define types
type SkillDataPoint = {
  date: string;
  level: number;
  skill: string;
};

type VerifiedBadgeData = {
  id: string;
  skill: string;
  score: number;
  confidence: "high" | "medium" | "low";
  verifiedAt: string;
};

type Milestone = {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "project" | "contest" | "certification" | "achievement";
  skill?: string;
  externalLink?: string;
};

// Define the learning curve data type
type ExternalContribution = {
  id: string;
  date: string;
  platform: "github" | "leetcode" | "codechef" | "hackerrank";
  type: "commit" | "pull_request" | "contest" | "problem_solved" | "repository" | "streak";
  title: string;
  description: string;
  skill: string;
  details: {
    commits?: number;
    streak?: number;
    difficulty?: "easy" | "medium" | "hard" | "expert";
    rating?: number;
    repo?: string;
  };
};

type LearningCurveData = {
  skills: string[];
  overallData: SkillDataPoint[];
  skillData: Record<string, SkillDataPoint[]>;
  milestones: Milestone[];
  externalContributions: ExternalContribution[];
  verifiedBadges?: VerifiedBadgeData[];
};

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Initialize with mock data to avoid undefined state
  const [learningCurveData, setLearningCurveData] = useState<LearningCurveData | null>(null);

  // Ref to track if component is mounted
  const isMountedRef = useRef(true);

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
    else if (user?.role === "alumni") navigate("/alumni-portal");
  }, [isAuthenticated, user?.role, navigate]);

  // Cleanup function to set isMountedRef to false when component unmounts
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Hydrate from localStorage
  useEffect(() => {
    const LEARNING_JOURNEY_KEY = "user_learning_journey";
    const savedJourney = localStorage.getItem(LEARNING_JOURNEY_KEY);

    if (savedJourney) {
      try {
        const parsedData = JSON.parse(savedJourney);
        console.log("📊 Dashboard Hydrated:", parsedData);
        if (isMountedRef.current) {
          setLearningCurveData(parsedData);
        }
      } catch (e) {
        console.error("Failed to parse learning journey data", e);
      }
    } else {
      // Initialize with empty state if no data exists
      if (isMountedRef.current) {
        setLearningCurveData({
          skills: [],
          overallData: [],
          skillData: {},
          milestones: [],
          externalContributions: [],
          verifiedBadges: []
        });
      }
    }
  }, []);

  if (!user) return null;

  const quickActions = [
    { icon: BadgeCheck, label: "Verify a Skill", desc: "Take an AI interview", path: "/verify-skills", color: "from-primary to-purple-500" },
    { icon: Target, label: "Post a Bounty", desc: "Create a micro-task", path: "/bounty-board", color: "from-accent to-success" },
    { icon: ArrowLeftRight, label: "Request Skill Swap", desc: "Teach & learn", path: "/skill-swap", color: "from-warning to-orange-500" },
  ];

  return (
    <PageWrapper className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] h-full shadow-card hover:shadow-card-hover transition-all duration-300 premium-border">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="relative">
                    <Avatar className="w-20 h-20 ring-2 ring-[hsl(var(--primary))] mb-4">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {/* Add Alpine gradient ring for Executor role */}
                    {user.skillDNA === 'Executor' && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gradient-to-br from-[#FCA311] to-[#F77F00] flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-foreground" />
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{user.skillDNA}</Badge>
                    <Badge variant="outline" className="capitalize">{user.role}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 w-full mt-6">
                    <div className="p-3 rounded-xl bg-karma/10 border border-[hsl(var(--on-surface-variant))]">
                      <TrendingUp className="w-5 h-5 text-karma mx-auto mb-1" />
                      <p className="text-2xl font-bold text-karma">{user.trustScore}</p>
                      <p className="text-xs text-muted-foreground">Trust</p>
                    </div>
                    <div className="p-3 rounded-xl bg-credits/10 border border-[hsl(var(--on-surface-variant))]">
                      <Coins className="w-5 h-5 text-credits mx-auto mb-1" />
                      <p className="text-2xl font-bold text-credits">{(user.nexusCredits ?? 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Nexus</p>
                    </div>
                    <div className="p-3 rounded-xl bg-[hsl(var(--alpha-credits))]/10 border border-[hsl(var(--on-surface-variant))]">
                      <Coins className="w-5 h-5 text-[hsl(var(--alpha-credits))] mx-auto mb-1" />
                      <p className="text-2xl font-bold text-[hsl(var(--alpha-credits))]">{(user.alphaCredits ?? 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Alpha</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI-Verified Badges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
            <Card className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] h-full shadow-card hover:shadow-card-hover transition-all duration-300 premium-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI-Verified Badges
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate("/verify-skills")}>Verify New Skill</Button>
              </CardHeader>
              <CardContent>
                {((learningCurveData?.verifiedBadges?.length ?? 0) > 0 || (user.verifiedBadges?.length ?? 0) > 0) ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Unique badges combined from localStorage and Firestore */}
                    {(() => {
                      const allBadges = [
                        ...(learningCurveData?.verifiedBadges ?? []),
                        ...(user.verifiedBadges ?? [])
                      ];
                      const seen = new Set();
                      const uniqueBadges = allBadges.filter(b => {
                        const duplicate = seen.has(b.skill);
                        seen.add(b.skill);
                        return !duplicate;
                      });
                      return uniqueBadges.map((badge) => (
                        <VerifiedBadge
                          key={badge.id}
                          skill={badge.skill}
                          score={badge.score}
                          confidence={badge.confidence as any || "high"}
                          verifiedAt={badge.verifiedAt}
                          animate
                        />
                      ));
                    })()}
                  </div>
                ) : (
                  <EmptyState icon={BadgeCheck} title="No verified skills yet" description="Start your first Lightning Interview to earn AI-verified badges" actionLabel="Verify a Skill" onAction={() => navigate("/verify-skills")} />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <motion.div key={action.label} whileHover={{ y: -4 }} className="cursor-pointer" onClick={() => navigate(action.path)}>
                  <Card className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] hover:shadow-card-hover transition-all duration-300 premium-border">
                    <CardContent className="pt-6 flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0`}>
                        <action.icon className="w-6 h-6 text-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{action.label}</h4>
                        <p className="text-sm text-muted-foreground">{action.desc}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Learning Curve & Project Timeline - Added after existing content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          {learningCurveData && (learningCurveData.skills.length > 0 || learningCurveData.overallData.length > 0) ? (
            <LearningCurve
              skills={learningCurveData.skills}
              overallData={learningCurveData.overallData}
              skillData={learningCurveData.skillData}
              milestones={learningCurveData.milestones}
              externalContributions={learningCurveData.externalContributions}
            />
          ) : (
            <Card className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] h-[500px] flex items-center justify-center shadow-card premium-border">
              <div className="text-center p-6">
                <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2">Build Your Learning Journey</h3>
                <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                  Experience a visual map of your growth. Verify a skill or complete challenges to see your progress bloom.
                </p>
                <Button onClick={() => navigate("/verify-skills")}>
                  Verify a Skill to start your learning journey
                </Button>
              </div>
            </Card>
          )}
        </motion.div>

        {/* Recent Activity - Added after Learning Curve */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-6"
        >
          <Card className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] shadow-card premium-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                    <Trophy className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium">Completed React.js verification</p>
                    <p className="text-sm text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <GitBranch className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Started Python learning path</p>
                    <p className="text-sm text-muted-foreground">1 week ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center flex-shrink-0">
                    <Code className="w-5 h-5 text-warning" />
                  </div>
                  <div>
                    <p className="font-medium">Contributed to open source project</p>
                    <p className="text-sm text-muted-foreground">2 weeks ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}