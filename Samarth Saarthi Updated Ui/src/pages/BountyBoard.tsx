import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Target, Plus, Coins, Upload, CheckCircle2, Clock, XCircle, Filter, User, Eye, Check, X, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Submission {
  id: string;
  userId: string;
  userName: string;
  proof: string;
  notes: string;
  status: 'pending' | 'ai_approved' | 'ai_rejected' | 'selected' | 'unselected';
  aiFeedback?: string;
  selectedReason?: string;
  participationCredits?: number;
  tip?: number;
}

interface Bounty {
  id: string;
  title: string;
  description: string;
  reward: number;
  status: 'open' | 'in_progress' | 'completed';
  postedBy: string;
  applications?: number;
  submissions?: Submission[];
}

const mockBounties: Bounty[] = [
  { 
    id: "1", 
    title: "Build a REST API endpoint", 
    description: "Create a simple CRUD API using Node.js and Express", 
    reward: 150, 
    status: "open",
    postedBy: "1",
    applications: 5,
    submissions: [
      { id: "s1", userId: "2", userName: "Taylor Kim", proof: "api-endpoint-code.zip", notes: "Implemented all CRUD operations with proper error handling", status: "selected", selectedReason: "Clean code, good error handling, comprehensive tests", participationCredits: 0, tip: 25 },
      { id: "s2", userId: "3", userName: "Morgan Chen", proof: "crud-api.zip", notes: "Basic CRUD functionality implemented", status: "unselected", aiFeedback: "Good implementation but missing error handling", participationCredits: 30 },
      { id: "s3", userId: "4", userName: "Jordan Lee", proof: "express-api.zip", notes: "Simple API but lacks authentication", status: "ai_rejected", aiFeedback: "Implementation incomplete, missing auth and tests" }
    ]
  },
  { 
    id: "2", 
    title: "Design a landing page mockup", 
    description: "Create a Figma mockup for a SaaS product landing page", 
    reward: 200, 
    status: "open",
    postedBy: "1",
    applications: 8,
    submissions: [
      { id: "s4", userId: "5", userName: "Casey Smith", proof: "landing-mockup.fig", notes: "Modern design with great UX", status: "ai_approved" },
      { id: "s5", userId: "6", userName: "Riley Jones", proof: "saas-landing.fig", notes: "Clean layout but needs more visual hierarchy", status: "pending" }
    ]
  },
  { 
    id: "3", 
    title: "Fix CSS responsive issues", 
    description: "Debug and fix mobile responsiveness issues on dashboard", 
    reward: 75, 
    status: "in_progress",
    postedBy: "1",
    applications: 3,
    submissions: [
      { id: "s6", userId: "7", userName: "Alex Morgan", proof: "responsive-fixes.zip", notes: "Fixed all mobile issues with flexbox", status: "selected", selectedReason: "Fixed all reported issues efficiently", participationCredits: 0 }
    ]
  },
  { 
    id: "4", 
    title: "Write unit tests", 
    description: "Add Jest unit tests for authentication module", 
    reward: 100, 
    status: "completed",
    postedBy: "1",
    applications: 4,
    submissions: [
      { id: "s7", userId: "8", userName: "Jamie Wilson", proof: "auth-tests.zip", notes: "Comprehensive test coverage for auth module", status: "selected", selectedReason: "Excellent test coverage and edge cases", participationCredits: 0, tip: 50 }
    ]
  },
];

const statusColors = { open: "bg-success/10 text-success border-success/20", in_progress: "bg-warning/10 text-warning border-warning/20", completed: "bg-muted text-foreground border-border" };
const statusIcons = { open: CheckCircle2, in_progress: Clock, completed: CheckCircle2 };

const submissionStatusColors = {
  pending: "bg-warning/10 text-warning border-warning/20",
  ai_approved: "bg-success/10 text-success border-success/20",
  ai_rejected: "bg-destructive/10 text-destructive border-destructive/20",
  selected: "bg-primary/10 text-primary border-primary/20",
  unselected: "bg-muted text-foreground border-border"
};

const submissionStatusIcons = {
  pending: Clock,
  ai_approved: CheckCircle2,
  ai_rejected: XCircle,
  selected: Check,
  unselected: X
};

export default function BountyBoard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState("");
  
  // For submission form
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submissionNotes, setSubmissionNotes] = useState("");
  
  // For tip functionality
  const [tipAmount, setTipAmount] = useState<number>(0);
  const [showTipDialog, setShowTipDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [selectedBounty, setSelectedBounty] = useState<Bounty | null>(null);

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
    else if (user?.role === "alumni") navigate("/alumni-portal");
  }, [isAuthenticated, user?.role, navigate]);
  
  const handleSubmitProof = (bountyId: string) => {
    // In a real app, this would submit to an API
    console.log(`Submitting proof for bounty ${bountyId}:`, { proofFile, submissionNotes });
    
    // Reset form
    setProofFile(null);
    setSubmissionNotes("");
    
    // Show success message
    // toast.success("Proof submitted successfully! Awaiting AI audit.");
  };
  
  const handleGiveTip = () => {
    if (!selectedSubmission || !selectedBounty || !user) return;
    
    // In a real app, this would make an API call to give a tip
    console.log(`Giving tip of ${tipAmount} to submission ${selectedSubmission.id} for bounty ${selectedBounty.id}`);
    
    // Update the submission with the tip
    // This would update the state in a real implementation
    
    setShowTipDialog(false);
    setTipAmount(0);
    setSelectedSubmission(null);
    setSelectedBounty(null);
    
    // Show success message
    // toast.success(`Tip of ${tipAmount} credits sent successfully!`);
  };

  return (
    <PageWrapper className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2"><Target className="w-6 h-6 text-primary" />Bounty Board</h1>
            <p className="text-foreground">Complete tasks, earn credits. Every submission AI-verified.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-2" />Filter</Button>
            <Dialog>
              <DialogTrigger asChild><Button className="gradient-bg text-foreground"><Plus className="w-4 h-4 mr-2" />Post Bounty</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Post a Bounty</DialogTitle></DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2"><label className="text-sm font-medium">Title</label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Build a login page" /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Description</label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the task..." rows={3} /></div>
                  <div className="space-y-2"><label className="text-sm font-medium">Reward (Credits)</label><Input type="number" value={reward} onChange={(e) => setReward(e.target.value)} placeholder="100" /></div>
                  <Button className="w-full gradient-bg text-foreground" disabled={!title || !description || !reward}>Post Bounty</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {mockBounties.map((bounty, i) => {
            const StatusIcon = statusIcons[bounty.status as keyof typeof statusIcons];
            return (
              <motion.div key={bounty.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] hover:shadow-card-hover transition-all duration-300 premium-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="font-semibold">{bounty.title}</h3>
                      <Badge className={statusColors[bounty.status as keyof typeof statusColors]}><StatusIcon className="w-3 h-3 mr-1" />{bounty.status.replace("_", " ")}</Badge>
                    </div>
                    <p className="text-sm text-foreground mb-4">{bounty.description}</p>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-credits font-semibold"><Coins className="w-4 h-4" />{bounty.reward} credits</div>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <User className="w-4 h-4" />
                        <span>{bounty.applications || 0} applications</span>
                      </div>
                    </div>
                    {bounty.status === "open" && (
                      <div className="mb-4">
                        <div className="flex items-center gap-1 text-sm text-foreground">
                          <User className="w-4 h-4" />
                          <span>{bounty.submissions?.length || 0} submissions</span>
                        </div>
                      </div>
                    )}
                    {bounty.status === "open" && (
                      <Dialog>
                        <DialogTrigger asChild><Button size="sm" className="rounded-full bg-gradient-to-r from-[#FCA311] to-[#F77F00] text-foreground w-full">Submit Proof</Button></DialogTrigger>
                        <DialogContent>
                          <DialogHeader><DialogTitle>Submit Proof of Work</DialogTitle></DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div 
                              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:bg-muted/20 transition-colors"
                              onClick={() => document.getElementById('proof-upload')?.click()}
                            >
                              <Upload className="w-8 h-8 mx-auto mb-2 text-foreground" />
                              <p className="text-sm text-foreground">
                                {proofFile ? proofFile.name : 'Drop files here or click to upload'}
                              </p>
                              <input 
                                id="proof-upload" 
                                type="file" 
                                className="hidden" 
                                onChange={(e) => e.target.files?.[0] && setProofFile(e.target.files[0])}
                              />
                            </div>
                            <Textarea 
                              placeholder="Add detailed notes about your implementation..." 
                              rows={4}
                              value={submissionNotes}
                              onChange={(e) => setSubmissionNotes(e.target.value)}
                            />
                            <p className="text-xs text-foreground flex items-center gap-2">
                              <Eye className="w-3 h-3" />
                              Proof will undergo AI Vision audit before requester approval.
                            </p>
                            <Button 
                              className="w-full rounded-full bg-gradient-to-r from-[#FCA311] to-[#F77F00] text-foreground" 
                              onClick={() => handleSubmitProof(bounty.id)}
                            >
                              Submit for AI Audit
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Verification Status Section */}
        <Card className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] mt-8 shadow-card premium-border">
          <CardHeader><CardTitle>Your Submissions</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockBounties.flatMap(bounty => 
                (bounty.submissions || [])
                  .filter(sub => sub.userId === user?.id)
                  .map(sub => {
                    const SubStatusIcon = submissionStatusIcons[sub.status as keyof typeof submissionStatusIcons];
                    return (
                      <div key={sub.id} className="p-4 border border-[hsl(var(--border)/0.2)] rounded-2xl bg-[hsl(var(--surface)/0.2)] gradient-border">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium">{bounty.title}</h4>
                            <p className="text-sm text-foreground">Submission by {sub.userName}</p>
                          </div>
                          <Badge variant="outline" className={submissionStatusColors[sub.status as keyof typeof submissionStatusColors]}>
                            <SubStatusIcon className="w-3 h-3 mr-1" />{sub.status.replace("_", " ")}
                          </Badge>
                        </div>
                        
                        <div className="text-sm mb-2">
                          <p className="font-medium">Notes:</p>
                          <p className="text-foreground">{sub.notes}</p>
                        </div>
                        
                        {sub.status === 'selected' && (
                          <div className="mb-3 p-3 bg-success/10 rounded-lg border border-success/20">
                            <div className="flex items-center gap-2 mb-1">
                              <CheckCircle2 className="w-4 h-4 text-success" />
                              <span className="font-medium text-success">Selected!</span>
                            </div>
                            <p className="text-sm">{sub.selectedReason || 'Your submission was selected as the best solution.'}</p>
                            {sub.tip && (
                              <p className="text-sm mt-1">+{sub.tip} tip from requester</p>
                            )}
                          </div>
                        )}
                        
                        {sub.status === 'unselected' && sub.aiFeedback && (
                          <div className="mb-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
                            <div className="flex items-center gap-2 mb-1">
                              <X className="w-4 h-4 text-warning" />
                              <span className="font-medium text-warning">Not Selected</span>
                            </div>
                            <p className="text-sm">{sub.aiFeedback}</p>
                            <p className="text-sm mt-1 text-success">+{sub.participationCredits || 0} participation credits awarded</p>
                          </div>
                        )}
                        
                        {sub.status === 'ai_approved' && (
                          <div className="mb-3 p-3 bg-warning/10 rounded-lg border border-warning/20">
                            <div className="flex items-center gap-2 mb-1">
                              <Eye className="w-4 h-4 text-warning" />
                              <span className="font-medium text-warning">AI Approved</span>
                            </div>
                            <p className="text-sm">Passed AI verification. Awaiting final approval from requester.</p>
                          </div>
                        )}
                        
                        {sub.status === 'ai_rejected' && sub.aiFeedback && (
                          <div className="mb-3 p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                            <div className="flex items-center gap-2 mb-1">
                              <XCircle className="w-4 h-4 text-destructive" />
                              <span className="font-medium text-destructive">AI Rejected</span>
                            </div>
                            <p className="text-sm">{sub.aiFeedback}</p>
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center pt-2 border-t border-border">
                          <span className="text-xs text-foreground">Submitted: Today</span>
                          <div className="flex gap-2">
                            {sub.status === 'selected' && (
                              <Button size="sm" variant="outline">
                                <Upload className="w-4 h-4 mr-1" />
                                Download
                              </Button>
                            )}
                            {sub.status === 'ai_approved' && (
                              <Button size="sm" variant="outline">
                                <ThumbsUp className="w-4 h-4 mr-1" />
                                Approve
                              </Button>
                            )}
                            {sub.status === 'ai_approved' && (
                              <Button size="sm" variant="outline">
                                <ThumbsDown className="w-4 h-4 mr-1" />
                                Reject
                              </Button>
                            )}
                            {(sub.status === 'ai_approved' || sub.status === 'selected') && user?.id === bounty.postedBy && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  setSelectedSubmission(sub);
                                  setSelectedBounty(bounty);
                                  setTipAmount(Math.floor(bounty.reward * 0.5)); // Default to 50%
                                  setShowTipDialog(true);
                                }}
                              >
                                <Coins className="w-4 h-4 mr-1" />
                                Tip
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Tip Dialog */}
        <Dialog open={showTipDialog} onOpenChange={setShowTipDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Give a Tip</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <p className="text-sm text-foreground mb-2">Reward exceptional work with a tip</p>
                <div className="flex items-center gap-2">
                  <Input 
                    type="number" 
                    value={tipAmount}
                    onChange={(e) => setTipAmount(Math.min(parseInt(e.target.value) || 0, Math.floor((selectedBounty?.reward || 0) * 0.5)))}
                    max={Math.floor((selectedBounty?.reward || 0) * 0.5)}
                    min="0"
                  />
                  <span className="text-sm text-foreground">max {Math.floor((selectedBounty?.reward || 0) * 0.5)} credits</span>
                </div>
                <p className="text-xs text-foreground mt-2">
                  Tip comes from your own credits and can be up to 50% of the bounty reward
                </p>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  className="flex-1" 
                  variant="outline" 
                  onClick={() => setShowTipDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  className="flex-1 gradient-bg text-foreground" 
                  onClick={handleGiveTip}
                >
                  Send Tip
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageWrapper>
  );
}