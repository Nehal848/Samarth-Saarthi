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

  // Simulate loading learning curve data
  useEffect(() => {
    // In a real app, this would come from an API
    const mockData: LearningCurveData = {
      skills: ["React", "Python", "Machine Learning", "Data Structures"],
      overallData: [
        { date: "Jan 2024", level: 1.5, skill: "overall" },
        { date: "Feb 2024", level: 2.0, skill: "overall" },
        { date: "Mar 2024", level: 2.5, skill: "overall" },
        { date: "Apr 2024", level: 2.8, skill: "overall" },
        { date: "May 2024", level: 3.2, skill: "overall" },
        { date: "Jun 2024", level: 3.5, skill: "overall" },
        { date: "Jul 2024", level: 3.8, skill: "overall" },
        { date: "Aug 2024", level: 4.0, skill: "overall" },
        { date: "Sep 2024", level: 4.2, skill: "overall" },
        { date: "Oct 2024", level: 4.4, skill: "overall" },
        { date: "Nov 2024", level: 4.6, skill: "overall" },
        { date: "Dec 2024", level: 4.8, skill: "overall" }
      ],
      skillData: {
        "React": [
          { date: "Jan 2024", level: 1.0, skill: "React" },
          { date: "Feb 2024", level: 1.5, skill: "React" },
          { date: "Mar 2024", level: 2.0, skill: "React" },
          { date: "Apr 2024", level: 2.5, skill: "React" },
          { date: "May 2024", level: 3.0, skill: "React" },
          { date: "Jun 2024", level: 3.5, skill: "React" },
          { date: "Jul 2024", level: 3.8, skill: "React" },
          { date: "Aug 2024", level: 4.0, skill: "React" },
          { date: "Sep 2024", level: 4.2, skill: "React" },
          { date: "Oct 2024", level: 4.4, skill: "React" },
          { date: "Nov 2024", level: 4.6, skill: "React" },
          { date: "Dec 2024", level: 4.8, skill: "React" }
        ],
        "Python": [
          { date: "Jan 2024", level: 1.2, skill: "Python" },
          { date: "Feb 2024", level: 1.8, skill: "Python" },
          { date: "Mar 2024", level: 2.3, skill: "Python" },
          { date: "Apr 2024", level: 2.7, skill: "Python" },
          { date: "May 2024", level: 3.1, skill: "Python" },
          { date: "Jun 2024", level: 3.4, skill: "Python" },
          { date: "Jul 2024", level: 3.7, skill: "Python" },
          { date: "Aug 2024", level: 3.9, skill: "Python" },
          { date: "Sep 2024", level: 4.1, skill: "Python" },
          { date: "Oct 2024", level: 4.3, skill: "Python" },
          { date: "Nov 2024", level: 4.5, skill: "Python" },
          { date: "Dec 2024", level: 4.7, skill: "Python" }
        ]
      },
      milestones: [
        {
          id: "1",
          date: "Mar 2024",
          title: "First React Project",
          description: "Completed a full-stack e-commerce application using React and Node.js",
          type: "project",
          skill: "React",
          externalLink: "https://github.com/example/react-project"
        },
        {
          id: "2",
          date: "May 2024",
          title: "LeetCode Contest",
          description: "Achieved top 10% in weekly LeetCode contest #345",
          type: "contest",
          skill: "Data Structures",
          externalLink: "https://leetcode.com/contest"
        },
        {
          id: "3",
          date: "Jul 2024",
          title: "AWS Certification",
          description: "Earned AWS Cloud Practitioner certification",
          type: "certification",
          skill: "AWS"
        },
        {
          id: "4",
          date: "Sep 2024",
          title: "Open Source Contribution",
          description: "Contributed to popular React UI library",
          type: "project",
          skill: "React",
          externalLink: "https://github.com/example/ui-library"
        },
        {
          id: "5",
          date: "Nov 2024",
          title: "Machine Learning Project",
          description: "Built a sentiment analysis model with 92% accuracy",
          type: "project",
          skill: "Machine Learning",
          externalLink: "https://github.com/example/ml-project"
        }
      ],
      externalContributions: [
        {
          id: "1",
          date: "Feb 2024",
          platform: "github",
          type: "commit",
          title: "Initial commit",
          description: "Created initial project structure for React app",
          skill: "React",
          details: {
            commits: 1,
            repo: "react-project"
          }
        },
        {
          id: "2",
          date: "Mar 2024",
          platform: "leetcode",
          type: "problem_solved",
          title: "Two Sum",
          description: "Solved Two Sum problem",
          skill: "Data Structures",
          details: {
            difficulty: "easy"
          }
        },
        {
          id: "3",
          date: "Apr 2024",
          platform: "github",
          type: "pull_request",
          title: "Feature: Add authentication",
          description: "Implemented user authentication",
          skill: "React",
          details: {
            repo: "react-project"
          }
        },
        {
          id: "4",
          date: "Jun 2024",
          platform: "codechef",
          type: "contest",
          title: "June Challenge",
          description: "Participated in June coding challenge",
          skill: "Algorithms",
          details: {
            rating: 1650
          }
        },
        {
          id: "5",
          date: "Aug 2024",
          platform: "github",
          type: "streak",
          title: "10-day streak",
          description: "10 consecutive days of commits",
          skill: "Python",
          details: {
            streak: 10
          }
        }
      ]
    };

    // Only update state if component is still mounted
    if (isMountedRef.current) {
      setLearningCurveData(mockData);
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
            <Card className="glass-card h-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-20 h-20 ring-4 ring-primary/20 mb-4">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-bold">{user.name}</h2>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary">{user.skillDNA}</Badge>
                    <Badge variant="outline" className="capitalize">{user.role}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 w-full mt-6">
                    <div className="p-3 rounded-xl bg-karma/10 border border-karma/20">
                      <TrendingUp className="w-5 h-5 text-karma mx-auto mb-1" />
                      <p className="text-2xl font-bold text-karma">{user.trustScore}</p>
                      <p className="text-xs text-muted-foreground">Trust Score</p>
                    </div>
                    <div className="p-3 rounded-xl bg-credits/10 border border-credits/20">
                      <Coins className="w-5 h-5 text-credits mx-auto mb-1" />
                      <div className="flex gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-credits">{user.nexusCredits.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Nexus</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-[hsl(var(--alpha-credits))]">{user.alphaCredits.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Alpha</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* AI-Verified Badges */}
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
                {user.verifiedBadges.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {user.verifiedBadges.map((badge, i) => (
                      <VerifiedBadge key={badge.id} skill={badge.skill} score={badge.score} confidence={badge.confidence} verifiedAt={badge.verifiedAt} animate />
                    ))}
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

        {/* Learning Curve & Project Timeline - Added after existing content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          {learningCurveData ? (
            <LearningCurve 
              skills={learningCurveData.skills}
              overallData={learningCurveData.overallData}
              skillData={learningCurveData.skillData}
              milestones={learningCurveData.milestones}
              externalContributions={learningCurveData.externalContributions}
            />
          ) : (
            <Card className="glass-card h-[500px] flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <p className="text-muted-foreground">Loading your learning journey...</p>
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
          <Card className="glass-card">
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