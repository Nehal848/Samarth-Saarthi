import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Plus, Star, Clock, Video, Filter, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface LearningSession {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  skill: string;
  teacherLevel: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  duration: string;
  trustScore: number;
  alphaCredits: number;
  skillLevel: "Beginner" | "Intermediate" | "Advanced";
}

const mockLearningSessions: LearningSession[] = [
  { id: "1", user: { name: "Jamie Rodriguez", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie" }, skill: "Python", teacherLevel: "Advanced", duration: "1 hour", trustScore: 4.8, alphaCredits: 25, skillLevel: "Intermediate" },
  { id: "2", user: { name: "Taylor Kim", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Taylor" }, skill: "UI/UX Design", teacherLevel: "Expert", duration: "45 min", trustScore: 4.9, alphaCredits: 20, skillLevel: "Beginner" },
  { id: "3", user: { name: "Morgan Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Morgan" }, skill: "Machine Learning", teacherLevel: "Expert", duration: "1 hour", trustScore: 4.7, alphaCredits: 35, skillLevel: "Advanced" },
];

const skills = ["React.js", "Python", "Machine Learning", "UI/UX Design", "Data Science", "Node.js", "TypeScript"];

export default function Learning() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [learnSkill, setLearnSkill] = useState("");
  const [duration, setDuration] = useState("");
  const [skillLevel, setSkillLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Beginner");
  const [alphaCredits, setAlphaCredits] = useState<number>(15);
  
  const calculateAlphaCredits = (duration: string, level: "Beginner" | "Intermediate" | "Advanced") => {
    const durationNum = parseInt(duration);
    let baseCredits = 10; // Base credits
    
    // Adjust base credits based on skill level
    if (level === "Intermediate") baseCredits = 20;
    else if (level === "Advanced") baseCredits = 30;
    
    // Adjust credits based on duration
    const durationMultiplier = durationNum / 30; // 30 min as base
    const calculatedCredits = Math.round(baseCredits * durationMultiplier);
    
    setAlphaCredits(calculatedCredits);
  };

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
    else if (user?.role === "alumni") navigate("/alumni-portal");
  }, [isAuthenticated, user?.role, navigate]);
  
  const handlePostLearning = () => {
    // In a real app, this would make an API call to create the learning session
    // For now, we'll just show a success message
    console.log(`Posted learning session: learning ${learnSkill}, duration ${duration}, skill level ${skillLevel}, alphaCredits ${alphaCredits}`);
    
    // Reset form
    setLearnSkill("");
    setDuration("");
    setSkillLevel("Beginner");
    setAlphaCredits(15);
    
    // Show success toast
    // toast.success(`Successfully posted learning session for ${alphaCredits} α!`);
  };

  return (
    <PageWrapper className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground"><GraduationCap className="w-6 h-6 text-primary" />Learning Marketplace</h1>
            <p className="text-muted-foreground">Learn from experts. Share your knowledge.</p>

          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-[#FCA311] text-primary hover:bg-[#FCA311]/10"><Filter className="w-4 h-4 mr-2" />Filter</Button>
            <Dialog>
              <DialogTrigger asChild><Button className="bg-[#FCA311] hover:bg-[#e0920f] text-foreground shadow-card hover:shadow-card-hover transition-all duration-300"><Plus className="w-4 h-4 mr-2" />Wanna Teach</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle className="text-foreground">Create Learning Session</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2"><label className="text-sm font-medium text-foreground">I Want to Learn</label><Select value={learnSkill} onValueChange={setLearnSkill}><SelectTrigger><SelectValue placeholder="Select skill..." /></SelectTrigger><SelectContent>{skills.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-foreground">Session Duration</label><Select value={duration} onValueChange={(value) => { setDuration(value); calculateAlphaCredits(value, skillLevel); }}><SelectTrigger><SelectValue placeholder="Select duration..." /></SelectTrigger><SelectContent><SelectItem value="30">30 minutes</SelectItem><SelectItem value="45">45 minutes</SelectItem><SelectItem value="60">1 hour</SelectItem></SelectContent></Select></div>
                  <div className="space-y-2"><label className="text-sm font-medium text-foreground">Skill Level</label><Select value={skillLevel} onValueChange={(value: "Beginner" | "Intermediate" | "Advanced") => { setSkillLevel(value); calculateAlphaCredits(duration, value); }}><SelectTrigger><SelectValue placeholder="Select skill level..." /></SelectTrigger><SelectContent><SelectItem value="Beginner">Beginner</SelectItem><SelectItem value="Intermediate">Intermediate</SelectItem><SelectItem value="Advanced">Advanced</SelectItem></SelectContent></Select></div>
                  <div className="p-4 bg-[hsl(var(--card))]/50 border border-[hsl(var(--border)/0.3)] rounded-xl premium-glass">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-foreground">Session Cost:</span>
                      <div className="flex items-center gap-1 text-[hsl(var(--alpha-credits))] font-semibold">
                        <Coins className="w-4 h-4" />{alphaCredits} α
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Earned by teaching • Spent by learning</p>
                  </div>
                  <Button className="w-full bg-[#FCA311] hover:bg-[#e0920f] text-foreground shadow-card hover:shadow-card-hover transition-all duration-300" disabled={!learnSkill || !duration} onClick={handlePostLearning}>Post Learning Session</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockLearningSessions.map((session, i) => (
            <motion.div key={session.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <Card className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] hover:shadow-card-hover transition-all duration-300 premium-border premium-card">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar><AvatarImage src={session.user.avatar} /><AvatarFallback>{session.user.name.charAt(0)}</AvatarFallback></Avatar>
                    <div><p className="font-medium text-foreground">{session.user.name}</p><div className="flex items-center gap-1 text-sm text-muted-foreground"><Star className="w-3 h-3 text-primary fill-[#6AA2E0]" />{session.trustScore}</div></div>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary" className="bg-[#FCA311]/10 text-primary border-[#FCA311]/30">Teaching: {session.skill}</Badge>
                    <Badge variant="outline" className="text-xs flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      {session.teacherLevel} Teacher
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="w-4 h-4" />{session.duration}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                        <Coins className="w-4 h-4" />{session.alphaCredits} α
                      </div>
                    </div>
                    <Button size="sm" className="bg-[#FCA311] hover:bg-[#e0920f] text-foreground shadow-card hover:shadow-card-hover transition-all duration-300">Join Session</Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Active Session Placeholder */}
        <Card className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] hover:shadow-card-hover transition-all duration-300 premium-border premium-card mt-8">
          <CardHeader><CardTitle className="flex items-center gap-2 text-foreground"><Video className="w-5 h-5 text-primary" />Active Session</CardTitle></CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No active sessions. Accept a swap to get started!</p>
            <Badge variant="outline" className="border-[hsl(var(--border)/0.3)]">Session will appear here with Google Meet link</Badge>
          </CardContent>
        </Card>
        
        {/* Completed Sessions with Feedback */}
        <Card className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] hover:shadow-card-hover transition-all duration-300 premium-border premium-card mt-8">
          <CardHeader><CardTitle className="flex items-center gap-2 text-foreground">Completed Sessions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-[hsl(var(--border)/0.3)] rounded-xl bg-[hsl(var(--card))]/50 premium-glass">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-foreground">Python to React.js Swap</h4>
                    <p className="text-sm text-muted-foreground">with Jamie Rodriguez</p>
                  </div>
                  <Badge variant="outline" className="text-primary border-[#FCA311]/30 bg-[#FCA311]/10">Completed</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-foreground">Teacher Quality</h5>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-foreground">Match Quality</h5>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < 5 ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-foreground">AI Content Rating</h5>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-4 h-4 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageWrapper>
  );
}
