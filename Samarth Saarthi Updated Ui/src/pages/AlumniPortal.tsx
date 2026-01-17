import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Search, Filter, Star, BadgeCheck, Target, ArrowLeftRight, Calendar, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ScoreRing } from "@/components/ui/score-ring";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const mockStudents = [
  { id: "1", name: "Alex Chen", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", email: "alex.chen@example.com", whatsapp: "+1234567890", skillDNA: "Executor", avgScore: 88, trustScore: 847, communicationLevel: "Fluent", badges: 4, bounties: 12, swaps: 8 },
  { id: "2", name: "Jordan Lee", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan", email: "jordan.lee@example.com", whatsapp: "+1987654321", skillDNA: "Architect", avgScore: 92, trustScore: 923, communicationLevel: "Fluent", badges: 6, bounties: 18, swaps: 15 },
  { id: "3", name: "Sam Patel", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam", email: "sam.patel@example.com", whatsapp: "+15556789012", skillDNA: "Researcher", avgScore: 85, trustScore: 756, communicationLevel: "Conversational", badges: 5, bounties: 9, swaps: 11 },
  { id: "4", name: "Casey Kim", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Casey", email: "casey.kim@example.com", whatsapp: "+14445556666", skillDNA: "Executor", avgScore: 79, trustScore: 634, communicationLevel: "Basic", badges: 3, bounties: 7, swaps: 5 },
];

export default function AlumniPortal() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [minScore, setMinScore] = useState([70]);
  const [trustScoreFilter, setTrustScoreFilter] = useState<string>("all");
  const [communicationLevelFilter, setCommunicationLevelFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<typeof mockStudents[0] | null>(null);
  const [showStudentDetails, setShowStudentDetails] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
    else if (user?.role !== "alumni") navigate("/dashboard");
  }, [isAuthenticated, user?.role, navigate]);

  return (
    <PageWrapper className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground"><Users className="w-6 h-6 text-primary" />Alumni Portal</h1>
            <p className="text-muted-foreground">Discover verified talent. High signal, zero noise.</p>
          </div>
          <Badge variant="outline" className="text-muted-foreground border-[hsl(var(--border)/0.3)]">Read-only access</Badge>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Filters */}
          <Card className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] hover:shadow-card-hover transition-all duration-300 premium-border premium-card h-fit">
            <CardHeader><CardTitle className="text-base flex items-center gap-2 text-foreground"><Filter className="w-4 h-4 text-primary" />Filters</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />
                  <Input 
                    placeholder="Name or skill..." 
                    className="pl-9 bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.3)] rounded-lg focus:ring-2 focus:ring-[#6AA2E0]/30 focus:border-[#6AA2E0]" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <label className="text-sm font-medium text-foreground">Min AI Score: {minScore[0]}%</label>
                <Slider value={minScore} onValueChange={setMinScore} max={100} min={50} step={5} />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Trust Score</label>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant={trustScoreFilter === "top2" ? "secondary" : "outline"}
                    className="justify-start border-[hsl(var(--border)/0.3)]"
                    onClick={() => setTrustScoreFilter("top2")}
                  >
                    Top 2%
                  </Button>
                  <Button 
                    variant={trustScoreFilter === "top5" ? "secondary" : "outline"}
                    className="justify-start border-[hsl(var(--border)/0.3)]"
                    onClick={() => setTrustScoreFilter("top5")}
                  >
                    Top 5%
                  </Button>
                  <Button 
                    variant={trustScoreFilter === "top10" ? "secondary" : "outline"}
                    className="justify-start border-[hsl(var(--border)/0.3)]"
                    onClick={() => setTrustScoreFilter("top10")}
                  >
                    Top 10%
                  </Button>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Communication Level</label>
                <div className="flex flex-col gap-2">
                  <Button 
                    variant={communicationLevelFilter === "fluent" ? "secondary" : "outline"}
                    className="justify-start border-[hsl(var(--border)/0.3)]"
                    onClick={() => setCommunicationLevelFilter("fluent")}
                  >
                    Fluent
                  </Button>
                  <Button 
                    variant={communicationLevelFilter === "conversational" ? "secondary" : "outline"}
                    className="justify-start border-[hsl(var(--border)/0.3)]"
                    onClick={() => setCommunicationLevelFilter("conversational")}
                  >
                    Conversational
                  </Button>
                  <Button 
                    variant={communicationLevelFilter === "basic" ? "secondary" : "outline"}
                    className="justify-start border-[hsl(var(--border)/0.3)]"
                    onClick={() => setCommunicationLevelFilter("basic")}
                  >
                    Basic
                  </Button>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                className="w-full border-[#FCA311] text-primary hover:bg-[#FCA311]/10"
                onClick={() => {
                  setTrustScoreFilter("all");
                  setCommunicationLevelFilter("all");
                  setSearchQuery("");
                  setMinScore([70]);
                }}
              >
                Reset Filters
              </Button>
            </CardContent>
          </Card>

          {/* Students List */}
          <div className="lg:col-span-3 space-y-4">
            {mockStudents
              .filter((s) => {
                // Apply all filters
                const matchesSearch = searchQuery === "" || 
                  s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  s.skillDNA.toLowerCase().includes(searchQuery.toLowerCase());
                
                const matchesScore = s.avgScore >= minScore[0];
                
                let matchesTrustScore = true;
                if (trustScoreFilter === "top2") {
                  matchesTrustScore = s.trustScore >= 900; // Assuming top 2% have high scores
                } else if (trustScoreFilter === "top5") {
                  matchesTrustScore = s.trustScore >= 800; // Assuming top 5% have high scores
                } else if (trustScoreFilter === "top10") {
                  matchesTrustScore = s.trustScore >= 700; // Assuming top 10% have high scores
                }
                
                let matchesCommunication = true;
                if (communicationLevelFilter === "fluent") {
                  matchesCommunication = s.communicationLevel === "Fluent";
                } else if (communicationLevelFilter === "conversational") {
                  matchesCommunication = s.communicationLevel === "Conversational";
                } else if (communicationLevelFilter === "basic") {
                  matchesCommunication = s.communicationLevel === "Basic";
                }
                
                return matchesSearch && matchesScore && matchesTrustScore && matchesCommunication;
              })
              .map((student, i) => (
                <motion.div key={student.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <Card 
                    className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] hover:shadow-card-hover transition-all duration-300 premium-border premium-card cursor-pointer"
                    onClick={() => {
                      setSelectedStudent(student);
                      setShowStudentDetails(true);
                    }}
                  >
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        <Avatar className="w-16 h-16 ring-2 ring-primary/20"><AvatarImage src={student.avatar} /><AvatarFallback>{student.name.charAt(0)}</AvatarFallback></Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1"><h3 className="font-semibold text-lg text-foreground">{student.name}</h3><Badge variant="secondary">{student.skillDNA}</Badge></div>
                          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1 text-muted-foreground"><Star className="w-4 h-4 text-primary" />{student.trustScore} Trust</span>
                            <span className="flex items-center gap-1 text-muted-foreground"><BadgeCheck className="w-4 h-4 text-primary" />{student.badges} badges</span>
                            <span className="flex items-center gap-1 text-muted-foreground"><Target className="w-4 h-4 text-primary" />{student.bounties} bounties</span>
                            <span className="flex items-center gap-1 text-muted-foreground"><ArrowLeftRight className="w-4 h-4 text-primary" />{student.swaps} swaps</span>
                            <span className="flex items-center gap-1 text-muted-foreground"><BadgeCheck className="w-4 h-4 text-primary" />{student.communicationLevel}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <ScoreRing score={student.avgScore} size="sm" />
                          <Dialog>
                            <DialogTrigger asChild><Button className="bg-[#FCA311] hover:bg-[#e0920f] text-foreground shadow-card hover:shadow-card-hover transition-all duration-300" onClick={(e) => {
                              e.stopPropagation();
                              setSelectedStudent(student);
                            }}><Calendar className="w-4 h-4 mr-2" />Schedule Meet</Button></DialogTrigger>
                            <DialogContent>
                              <DialogHeader><DialogTitle className="text-foreground">Schedule Meeting with {selectedStudent?.name}</DialogTitle></DialogHeader>
                              <div className="space-y-4 pt-4">
                                <div className="flex items-center gap-4 p-4 rounded-xl bg-[hsl(var(--card))]/50 border border-[hsl(var(--border)/0.3)] premium-glass">
                                  <Avatar className="w-12 h-12">
                                    <AvatarImage src={selectedStudent?.avatar} />
                                  </Avatar>
                                  <div>
                                    <p className="font-semibold text-foreground">{selectedStudent?.name}</p>
                                    <Badge variant="secondary">{selectedStudent?.skillDNA}</Badge>
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div className="p-3 rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] premium-glass">
                                    <p className="text-sm font-medium mb-1 text-foreground">Email Address</p>
                                    <p className="text-sm text-muted-foreground">{selectedStudent?.email}</p>
                                  </div>
                                  <div className="p-3 rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] premium-glass">
                                    <p className="text-sm font-medium mb-1 text-foreground">WhatsApp</p>
                                    <p className="text-sm text-muted-foreground">{selectedStudent?.whatsapp}</p>
                                    <p className="text-xs text-primary mt-1">(Hidden unless approved)</p>
                                  </div>
                                </div>
                                <div className="p-4 rounded-xl border border-dashed border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))]/50 text-center premium-glass">
                                  <Calendar className="w-8 h-8 mx-auto mb-2 text-foreground" />
                                  <p className="text-sm text-muted-foreground mb-3">Calendar integration coming soon</p>
                                  <Button variant="outline" className="gap-2 border-[hsl(var(--border)/0.3)] text-foreground">
                                    <ExternalLink className="w-4 h-4" />Open Google Meet</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            }
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}