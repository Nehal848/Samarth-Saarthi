import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BadgeCheck, Target, ArrowLeftRight, Sparkles, TrendingUp, 
  Coins, Calendar, Trophy, GitBranch, Code, Award 
} from "lucide-react";
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
import { db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

// --- TYPES ---
type SkillDataPoint = { date: string; level: number; skill: string; };

type Milestone = {
  id: string; date: string; title: string; description: string;
  type: "project" | "contest" | "certification" | "achievement";
  skill?: string; externalLink?: string;
};

type ExternalContribution = {
  id: string; date: string; platform: "github" | "leetcode" | "codechef" | "hackerrank";
  type: "commit" | "pull_request" | "contest" | "problem_solved" | "repository" | "streak";
  title: string; description: string; skill: string;
  details: { commits?: number; streak?: number; difficulty?: "easy" | "medium" | "hard"; rating?: number; repo?: string; };
};

type LearningCurveData = {
  skills: string[];
  overallData: SkillDataPoint[];
  skillData: Record<string, SkillDataPoint[]>;
  milestones: Milestone[];
  externalContributions: ExternalContribution[];
};

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMountedRef = useRef(true);

  // 1. LIVE USER STATE: Isme Firestore ka real-time data store hoga
  const [liveUser, setLiveUser] = useState<any>(null);
  const [learningCurveData, setLearningCurveData] = useState<LearningCurveData | null>(null);

  // AUTH CHECK
  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
    else if (user?.role === "alumni") navigate("/alumni-portal");
  }, [isAuthenticated, user?.role, navigate]);

  // FIRESTORE REAL-TIME LISTENER
  useEffect(() => {
    if (!user?.id) return;

    // Listen to profile changes (Credits, Trust Score, Badges)
    const unsubscribe = onSnapshot(doc(db, "users", user.id), (snapshot) => {
      if (snapshot.exists()) {
        setLiveUser(snapshot.data());
      }
    });

    return () => {
      unsubscribe();
      isMountedRef.current = false;
    };
  }, [user?.id]);

  // MOCK DATA FOR GRAPH (Keep this for the cool UI)
  useEffect(() => {
    const mockData: LearningCurveData = {
      skills: ["React", "Python", "Machine Learning", "Data Structures"],
      overallData: [
        { date: "Jan", level: 1.5, skill: "overall" },
        { date: "Feb", level: 2.0, skill: "overall" },
        { date: "Mar", level: 2.8, skill: "overall" },
        { date: "Apr", level: 4.8, skill: "overall" }
      ],
      skillData: {
        "React": [{ date: "Jan", level: 1.0, skill: "React" }, { date: "Apr", level: 4.8, skill: "React" }],
        "Python": [{ date: "Jan", level: 1.2, skill: "Python" }, { date: "Apr", level: 4.7, skill: "Python" }]
      },
      milestones: [
        { id: "1", date: "Mar 2024", title: "First React Project", description: "Built with Firebase", type: "project", skill: "React" }
      ],
      externalContributions: [
        { id: "1", date: "Feb 2024", platform: "github", type: "commit", title: "Auth Fix", description: "Fixed login bug", skill: "React", details: { commits: 5, repo: "nexus-app" } }
      ]
    };
    if (isMountedRef.current) setLearningCurveData(mockData);
  }, []);

  // Show Loading while Firestore data is fetching
  if (!liveUser) return <div className="h-screen flex items-center justify-center">Initialising Warrior Protocol...</div>;

  const quickActions = [
    { icon: BadgeCheck, label: "Verify a Skill", desc: "Take an AI interview", path: "/verify-skills", color: "from-primary to-purple-500" },
    { icon: Target, label: "Post a Bounty", desc: "Create a micro-task", path: "/bounty-board", color: "from-accent to-success" },
    { icon: ArrowLeftRight, label: "Request Skill Swap", desc: "Teach & learn", path: "/skill-swap", color: "from-warning to-orange-500" },
  ];

  return (
    <PageWrapper className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* PROFILE CARD - Uses liveUser */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="glass-card h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-20 h-20 ring-4 ring-primary/20 mb-4">
                    <AvatarImage src={liveUser.avatar || user?.avatar} />
                    <AvatarFallback>{liveUser.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{liveUser.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{liveUser.skillDNA || "Recruit"}</Badge>
                    <Badge variant="outline" className="capitalize">{liveUser.role}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 w-full mt-6">
                    <div className="p-3 rounded-xl bg-karma/10 border border-karma/20 text-center">
                      <TrendingUp className="w-5 h-5 text-karma mx-auto mb-1" />
                      <p className="text-2xl font-bold text-karma">{liveUser.trustScore || 0}</p>
                      <p className="text-xs text-muted-foreground">Trust Score</p>
                    </div>
                    <div className="p-3 rounded-xl bg-credits/10 border border-credits/20">
                      <Coins className="w-5 h-5 text-credits mx-auto mb-1" />
                      <div className="flex justify-around">
                        <div>
                          <p className="text-xl font-bold text-credits">{liveUser.nexusCredits || 0}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">Nexus</p>
                        </div>
                        <div>
                          <p className="text-xl font-bold text-amber-500">{liveUser.alphaCredits || 0}</p>
                          <p className="text-[10px] text-muted-foreground uppercase">Alpha</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI-VERIFIED BADGES - Uses liveUser.verifiedBadges */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2">
            <Card className="glass-card h-full">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  AI-Verified Badges
                </CardTitle>
                <Button variant="outline" size="sm" onClick={() => navigate("/verify-skills")}>Verify New Skill</Button>
              </CardHeader>
              <CardContent>
                {liveUser.verifiedBadges && liveUser.verifiedBadges.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {liveUser.verifiedBadges.map((badge: any, i: number) => (
                      <VerifiedBadge key={i} {...badge} animate />
                    ))}
                  </div>
                ) : (
                  <EmptyState 
                    icon={BadgeCheck} 
                    title="No verified skills yet" 
                    description="Start your first Lightning Interview to earn AI-verified badges" 
                    actionLabel="Verify a Skill" 
                    onAction={() => navigate("/verify-skills")} 
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* QUICK ACTIONS */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-3">
            <h3 className="text-lg font-semibold mb-4 text-white/80">Nexus Quick Actions</h3>
            <div className="grid md:grid-cols-3 gap-4">
              {quickActions.map((action) => (
                <motion.div key={action.label} whileHover={{ y: -4 }} className="cursor-pointer" onClick={() => navigate(action.path)}>
                  <Card className="glass-card hover:shadow-card-hover transition-all border-2 hover:border-primary/30">
                    <CardContent className="pt-6 flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center flex-shrink-0`}>
                        <action.icon className="w-6 h-6 text-white" />
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

        {/* LEARNING CURVE SECTION */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-8">
          {learningCurveData && (
            <LearningCurve 
              skills={learningCurveData.skills}
              overallData={learningCurveData.overallData}
              skillData={learningCurveData.skillData}
              milestones={learningCurveData.milestones}
              externalContributions={learningCurveData.externalContributions}
            />
          )}
        </motion.div>

        {/* ACTIVITY FEED */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-6">
          <Card className="glass-card">
            <CardHeader><CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" />Recent Activity</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ActivityItem icon={Trophy} color="text-success" title="Joined Nexus Network" time="Just Now" />
                <ActivityItem icon={GitBranch} color="text-primary" title="Profile Synchronized" time="1 min ago" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </PageWrapper>
  );
}

// Reusable Activity Item
function ActivityItem({ icon: Icon, color, title, time }: any) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors border border-white/5">
      <div className={`w-10 h-10 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div><p className="font-medium">{title}</p><p className="text-sm text-muted-foreground">{time}</p></div>
    </div>
  );
}