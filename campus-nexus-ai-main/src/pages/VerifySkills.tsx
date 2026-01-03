import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, CheckCircle2, XCircle, ArrowRight, RotateCcw, Lock, Bell, Clock, RotateCcwIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ScoreRing } from "@/components/ui/score-ring";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const skills = ["React.js", "Python", "Machine Learning", "Data Structures", "System Design", "UI/UX Design", "Node.js", "TypeScript", "SQL", "AWS"];

// Define technical verification stages
enum TechnicalStage {
  Beginner = "beginner",
  Intermediate = "intermediate",
  Advanced = "advanced",
  Veteran = "veteran"
}

// Define communication verification levels
enum CommunicationLevel {
  UnderstandEasily = "understand_easily",
  Speak = "speak",
  Fluent = "fluent"
}

// Define question sets for technical verification stages
const getTechnicalQuestionsByStage = (stage: TechnicalStage) => {
  const baseQuestions = {
    "beginner": [
      "What is this skill?",
      "Can you name some basic concepts?",
      "Where might this skill be used?",
      "What does this skill help with?",
      "Can you give an example of this skill in use?",
      "What are the main benefits?",
      "What are common applications?",
      "How is this skill typically used?",
      "What would be a simple example?"
    ],
    "intermediate": [
      "What are the basic syntax elements?",
      "How do you implement a simple function?",
      "What are common mistakes to avoid?",
      "What are the core components?",
      "How would you set up a basic project?",
      "What are the essential tools?",
      "What are common use cases?",
      "How do you handle basic errors?",
      "What are the main advantages?"
    ],
    "advanced": [
      "How would you implement this in a real project?",
      "What are the tradeoffs of different approaches?",
      "How do you optimize basic implementations?",
      "What are common challenges?",
      "How would you structure a complex solution?",
      "What are the best practices?",
      "How do you handle performance issues?",
      "What are common anti-patterns?",
      "How would you debug a complex issue?"
    ],
    "veteran": [
      "How would you architect a scalable solution?",
      "What are the performance optimization techniques?",
      "How do you handle edge cases?",
      "What are the advanced patterns?",
      "How do you ensure security?",
      "What are the latest industry trends?",
      "How do you optimize for large-scale applications?",
      "What are the potential failure points?",
      "How do you ensure maintainability?"
    ]
  };

  return baseQuestions[stage];
};

// Define question sets for communication levels
const getCommunicationQuestionsByLevel = (level: CommunicationLevel) => {
  const baseQuestions = {
    "understand_easily": [
      "Can you understand basic instructions?",
      "How do you approach simple conversations?",
      "What strategies do you use to clarify simple points?",
      "How do you ask for help when needed?",
      "Can you follow simple explanations?",
      "How do you confirm understanding?",
      "What do you do when you don't understand?",
      "How do you participate in group discussions?",
      "Can you express basic needs clearly?"
    ],
    "speak": [
      "How do you express complex ideas?",
      "What strategies do you use to explain concepts?",
      "How do you handle disagreements in conversation?",
      "Can you lead a discussion?",
      "How do you adapt your communication for different audiences?",
      "What techniques do you use to be more persuasive?",
      "How do you handle difficult conversations?",
      "Can you present your ideas confidently?",
      "How do you ensure your message is understood?"
    ],
    "fluent": [
      "How do you communicate complex technical concepts?",
      "What strategies do you use for cross-cultural communication?",
      "How do you handle high-stakes negotiations?",
      "Can you influence others through communication?",
      "How do you handle crisis communication?",
      "What techniques do you use to inspire others?",
      "How do you communicate vision and strategy?",
      "Can you adapt communication in real-time based on feedback?",
      "How do you handle communication under pressure?"
    ]
  };

  return baseQuestions[level];
};

// Define email challenge scenarios
const emailScenarios = [
  "Write an email to your team about a project deadline extension",
  "Compose a professional email to a potential mentor requesting advice",
  "Draft an email to a professor requesting an assignment extension",
  "Write an email to a client explaining a project delay",
  "Compose an email to your manager about a new idea"
];

// Define video intro prompts
const videoPrompts = [
  "Introduce yourself and your career goals in 1 minute",
  "Explain a technical concept in simple terms",
  "Describe a challenge you overcame and what you learned",
  "Share your motivation for joining the tech industry",
  "Explain your approach to teamwork and collaboration"
];

type Step = "select" | "technical" | "communication" | "email" | "video" | "result";
type VerifySkillsState = {
  step: Step;
  selectedSkill: string;
  currentTechnicalStage: TechnicalStage | null;
  currentCommunicationLevel: CommunicationLevel | null;
  currentQuestion: number;
  currentSet: number;
  answers: string[];
  technicalScores: { [key in TechnicalStage]?: number };
  communicationScores: { [key in CommunicationLevel]?: number };
  emailScore: number | null;
  videoScore: number | null;
  passed: boolean;
  retestLocked: boolean;
  isInitialized: boolean;
  communicationVerified: boolean;
  emailChallengeCompleted: boolean;
  videoIntroCompleted: boolean;
  technicalScore: number | null;
  communicationScore: number | null;
};

const VERIFY_SKILLS_STATE_KEY = "samarthSaarthiVerifySkillsState";

export default function VerifySkills() {
  const { user, isAuthenticated } = useAuth();
  const [step, setStep] = useState<Step>("select");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [currentTechnicalStage, setCurrentTechnicalStage] = useState<TechnicalStage | null>(null);
  const [currentCommunicationLevel, setCurrentCommunicationLevel] = useState<CommunicationLevel | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [answer, setAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [passed, setPassed] = useState(true);
  const [technicalScore, setTechnicalScore] = useState<number | null>(null);
  const [communicationScore, setCommunicationScore] = useState<number | null>(null);
  const [retestLocked, setRetestLocked] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [showImprovementPopup, setShowImprovementPopup] = useState(false);
  const [selectedSkillForInterview, setSelectedSkillForInterview] = useState<{skill: string, type: 'technical' | 'communication'} | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
    else if (user?.role === "alumni") navigate("/alumni-portal");
  }, [isAuthenticated, user?.role, navigate]);

  // Get questions based on current technical stage
  const questions = currentTechnicalStage ? getTechnicalQuestionsByStage(currentTechnicalStage) : [];
  
  // Get communication questions based on current level
  const communicationQuestions = currentCommunicationLevel ? getCommunicationQuestionsByLevel(currentCommunicationLevel) : [];
  
  // Get current email scenario
  const emailScenario = emailScenarios[0]; // Use first scenario for now
  
  // Get current video prompt
  const videoPrompt = videoPrompts[0]; // Use first prompt for now

  // Load state from localStorage when component mounts
  useEffect(() => {
    const savedState = localStorage.getItem(VERIFY_SKILLS_STATE_KEY);
    if (savedState) {
      try {
        const parsedState: VerifySkillsState = JSON.parse(savedState);
        setStep(parsedState.step);
        setSelectedSkill(parsedState.selectedSkill);
        setCurrentTechnicalStage(parsedState.currentTechnicalStage);
        setCurrentCommunicationLevel(parsedState.currentCommunicationLevel);
        setCurrentQuestion(parsedState.currentQuestion);
        setCurrentSet(parsedState.currentSet);
        setAnswers(parsedState.answers);
        setPassed(parsedState.passed);
        setRetestLocked(parsedState.retestLocked);
        setTechnicalScore(parsedState.technicalScore);
        setCommunicationScore(parsedState.communicationScore);
        setIsInitialized(true);
      } catch (error) {
        console.error("Error loading verify skills state:", error);
        // If there's an error loading the state, clear it
        localStorage.removeItem(VERIFY_SKILLS_STATE_KEY);
        // Set a default skill
        setSelectedSkill(skills[0]);
        setIsInitialized(true);
      }
    } else {
      // Set a default skill if no saved state
      setSelectedSkill(skills[0]);
      setIsInitialized(true);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      const stateToSave: VerifySkillsState = {
        step,
        selectedSkill,
        currentTechnicalStage,
        currentCommunicationLevel,
        currentQuestion,
        currentSet,
        answers,
        technicalScores: {},
        communicationScores: {},
        emailScore: null,
        videoScore: null,
        passed,
        retestLocked,
        isInitialized: true,
        communicationVerified: false,
        emailChallengeCompleted: false,
        videoIntroCompleted: false,
        technicalScore,
        communicationScore
      };
      localStorage.setItem(VERIFY_SKILLS_STATE_KEY, JSON.stringify(stateToSave));
    }
  }, [step, selectedSkill, currentTechnicalStage, currentCommunicationLevel, currentQuestion, currentSet, answers, passed, retestLocked, isInitialized, technicalScore, communicationScore]);

  const startInterview = () => {
    if (selectedSkill) {
      setCurrentTechnicalStage(TechnicalStage.Beginner);
      setStep("technical");
      setCurrentQuestion(0);
      setCurrentSet(1);
      setAnswers([]);
      simulateTyping();
    }
  };

  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1500);
  };

  const submitAnswer = () => {
    if (!answer.trim()) return;
    setAnswers([...answers, answer]);
    setAnswer("");
    
    // Handle technical verification
    if (step === "technical") {
      // Calculate which question we're on (9 questions per stage)
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < 9) {
        // Update set number
        if (nextQuestion % 3 === 0) {
          setCurrentSet(prev => prev + 1);
        }
        setCurrentQuestion(nextQuestion);
        simulateTyping();
      } else {
        // Calculate score (random for now, but in real implementation would be based on answers)
        const calculatedScore = 70; // Set to 70 to test communication part
        setTechnicalScore(calculatedScore);
        
        // Determine if passed based on current stage threshold
        let threshold = 70; // Default threshold for intermediate, advanced, veteran
        if (currentTechnicalStage === TechnicalStage.Beginner) {
          threshold = 50;
        }
        
        const stagePassed = calculatedScore >= threshold;
        setPassed(stagePassed);
        
        if (stagePassed) {
          // Move to next technical stage if available
          const stageOrder = [TechnicalStage.Beginner, TechnicalStage.Intermediate, TechnicalStage.Advanced, TechnicalStage.Veteran];
          const currentIndex = stageOrder.indexOf(currentTechnicalStage!);
          
          if (currentIndex < stageOrder.length - 1) {
            // Move to next stage
            setCurrentTechnicalStage(stageOrder[currentIndex + 1]);
            setCurrentQuestion(0);
            setCurrentSet(1);
            setAnswers([]);
            simulateTyping();
          } else {
            // All technical stages completed - move to communication if selected, otherwise result
            if (currentCommunicationLevel) {
              setStep("communication");
              setCurrentQuestion(0);
              setCurrentSet(1);
              setAnswers([]);
              simulateTyping();
            } else {
              // If no communication level selected, set overall result based only on technical score
              setPassed(stagePassed);
              setStep("result");
            }
          }
        } else {
          // Stage not passed - show result
          // Log retest lock information to console if score is below threshold
          console.log("SKILL_RETEST_LOCKED", {
            SKILL: selectedSkill,
            STAGE: currentTechnicalStage,
            LAST_SCORE: calculatedScore,
            RETEST_AFTER: "15_DAYS"
          });
          setRetestLocked(true);
          setStep("result");
        }
      }
    } 
    // Handle communication verification
    else if (step === "communication") {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < 15) {
        setCurrentQuestion(nextQuestion);
        simulateTyping();
      } else {
        // Calculate communication score
        const calculatedScore = 75; // Random score between 60-100
        setCommunicationScore(calculatedScore);
        
        // Check if passed (70% threshold for communication)
        const communicationPassed = calculatedScore >= 70;
        setCommunicationScore(calculatedScore);
        
        // Calculate overall pass status - both technical and communication must pass
        const overallPassed = (technicalScore || 70) >= 70 && communicationPassed;
        setPassed(overallPassed);
        
        // Move to result
        setStep("result");
      }
    }
  };

  const reset = () => {
    // Clear the saved state
    localStorage.removeItem(VERIFY_SKILLS_STATE_KEY);
    
    // Reset local state
    setStep("select");
    setSelectedSkill("");
    setCurrentTechnicalStage(null);
    setCurrentCommunicationLevel(null);
    setCurrentQuestion(0);
    setCurrentSet(1);
    setAnswers([]);
    setAnswer("");
    setPassed(true);
    setRetestLocked(false);
    setShowImprovementPopup(false);
    setIsInitialized(true);
  };

  const handleResultAction = () => {
    if (passed) {
      // If passed, just reset
      reset();
    } else {
      // If not passed, show the improvement popup
      setShowImprovementPopup(true);
    }
  };

  const handleImprovementOption = (option: boolean) => {
    setShowImprovementPopup(false);
    
    if (option) {
      // If user wants improvement suggestions, redirect to premium flow
      // For now, just reset
      reset();
    } else {
      // If user doesn't want improvement suggestions, hide the skill for 15 days
      // For now, just reset
      reset();
    }
  };

  // Technical stage options
  const technicalStages = [
    { id: TechnicalStage.Beginner, label: "Beginner", description: "Basic understanding, some practice", threshold: 50 },
    { id: TechnicalStage.Intermediate, label: "Intermediate", description: "Used in projects, moderate confidence", threshold: 70 },
    { id: TechnicalStage.Advanced, label: "Advanced", description: "Strong fundamentals + real experience", threshold: 70 },
    { id: TechnicalStage.Veteran, label: "Veteran", description: "Expert level, industry ready", threshold: 70 }
  ];
  
  // Communication level options
  const communicationLevels = [
    { id: CommunicationLevel.UnderstandEasily, label: "Understand Easily", description: "Can understand basic instructions and explanations" },
    { id: CommunicationLevel.Speak, label: "Speak", description: "Can express ideas and participate in conversations" },
    { id: CommunicationLevel.Fluent, label: "Fluent", description: "Can communicate complex ideas fluently" }
  ];

  return (
    <PageWrapper className="bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">AI Lightning Interview</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Assess and verify your skills with AI-powered interviews. Track your progress and achievements.</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section A: Technical Skills */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Technical Skills
              </CardTitle>
              <p className="text-sm text-muted-foreground">Verify your technical expertise through staged challenges</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Select a skill to verify</label>
                    <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                      <SelectTrigger><SelectValue placeholder="Choose a skill..." /></SelectTrigger>
                      <SelectContent>{skills.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">{selectedSkill || 'No skill selected'}</h3>
                      <p className="text-sm text-muted-foreground">Current verified level</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{currentTechnicalStage ? currentTechnicalStage.charAt(0).toUpperCase() + currentTechnicalStage.slice(1) : 'Not verified'}</p>
                      <p className="text-sm text-muted-foreground">Badge earned</p>
                    </div>
                  </div>
                  
                  {currentTechnicalStage && (
                    <div className="pt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>Stage {technicalStages.findIndex(stage => stage.id === currentTechnicalStage) + 1}/4</span>
                      </div>
                      <Progress value={((technicalStages.findIndex(stage => stage.id === currentTechnicalStage) + 1) / 4) * 100} className="h-2" />
                    </div>
                  )}
                </div>
                
                <Button 
                  onClick={() => setSelectedSkillForInterview({skill: selectedSkill, type: 'technical'})}
                  className="w-full gradient-bg text-white"
                  disabled={!selectedSkill}
                >
                  {currentTechnicalStage ? 'Improve Skill' : 'Verify Skill'}
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Section B: Communication Skills */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-success" />
                Communication Skills
              </CardTitle>
              <p className="text-sm text-muted-foreground">Assess your communication and soft skills proficiency</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    {communicationLevels.map((level, index) => {
                      const isAchieved = communicationScore !== null && index < 3; // Simplified for demo
                      const isCurrent = currentCommunicationLevel === level.id;
                      
                      return (
                        <div 
                          key={level.id}
                          className={`flex items-center justify-between p-3 rounded-lg ${isAchieved ? 'bg-success/10 border border-success/20' : 'bg-muted/30'}`}
                        >
                          <div className="flex items-center gap-2">
                            {isAchieved ? (
                              <CheckCircle2 className="w-5 h-5 text-success" />
                            ) : isCurrent ? (
                              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-white"></div>
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-border"></div>
                            )}
                            <span className="font-medium">{level.label}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {isAchieved ? 'Achieved' : 'Pending'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                <Button 
                  onClick={() => setSelectedSkillForInterview({skill: selectedSkill, type: 'communication'})}
                  className="w-full gradient-bg text-white"
                  disabled={!selectedSkill}
                >
                  Attempt Communication Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Technical Interview Selection Overlay */}
        {selectedSkillForInterview && selectedSkillForInterview.type === 'technical' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl p-6 max-w-2xl w-full border border-border shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Technical Verification</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedSkillForInterview(null)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">Technical Verification</label>
                  <div className="grid grid-cols-2 gap-3">
                    {technicalStages.map((stage) => (
                      <motion.div
                        key={stage.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentTechnicalStage(stage.id as TechnicalStage)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          currentTechnicalStage === stage.id
                            ? "border-primary bg-primary/10"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-medium flex items-center gap-2">
                          {stage.label}
                          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                            {stage.threshold}%
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{stage.description}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedSkillForInterview(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="gradient-bg text-white"
                    onClick={() => {
                      // Start the interview with the selected skill and stage
                      setStep('technical');
                      setAnswers([]);
                      setCurrentQuestion(0);
                      setCurrentSet(1);
                      simulateTyping();
                      setSelectedSkillForInterview(null);
                    }}
                    disabled={!selectedSkill || !currentTechnicalStage}
                  >
                    Start Interview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Communication Interview Selection Overlay */}
        {selectedSkillForInterview && selectedSkillForInterview.type === 'communication' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl p-6 max-w-2xl w-full border border-border shadow-xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Communication Verification</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedSkillForInterview(null)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-sm font-medium mb-3 block">Communication Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {communicationLevels.map((level) => (
                      <motion.div
                        key={level.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentCommunicationLevel(level.id as CommunicationLevel)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all text-center ${
                          currentCommunicationLevel === level.id
                            ? "border-success bg-success/10"
                            : "border-border hover:border-success/50"
                        }`}
                      >
                        <div className="font-medium text-sm">{level.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedSkillForInterview(null)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="gradient-bg text-white"
                    onClick={() => {
                      // Start the interview with the selected skill and level
                      setStep('communication');
                      setAnswers([]);
                      setCurrentQuestion(0);
                      setCurrentSet(1);
                      simulateTyping();
                      setSelectedSkillForInterview(null);
                    }}
                    disabled={!selectedSkill || !currentCommunicationLevel}
                  >
                    Start Interview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Interview Sections - Only shown when actively in interview */}
        <AnimatePresence mode="wait">
          {(step === "technical" || step === "communication") && (
            <motion.div 
              key={step} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="mt-8"
            >
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="font-semibold">{selectedSkill} {step === 'technical' ? 'Technical' : 'Communication'} Verification</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {step === 'technical' 
                        ? `Stage: ${currentTechnicalStage} · Question ${currentQuestion + 1} / 9` 
                        : `Level: ${currentCommunicationLevel} · Question ${currentQuestion + 1} / 15`}
                    </span>
                  </div>
                  <Progress value={((currentQuestion + 1) / (step === 'technical' ? 9 : 15)) * 100} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    Minimum Required Score (Min.): {step === 'technical' ? (currentTechnicalStage === TechnicalStage.Beginner ? '50%' : '70%') : '70%'}
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                  <div 
                    ref={(el) => {
                      if (el && (step === 'technical' || step === 'communication')) {
                        // Scroll to bottom when element updates
                        requestAnimationFrame(() => {
                          if (el) {
                            el.scrollTop = el.scrollHeight;
                          }
                        });
                      }
                    }}
                    className="flex-grow overflow-y-auto max-h-[300px] space-y-4 p-4 rounded-xl bg-muted/30"
                  >
                    {answers.map((a, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-4 h-4 text-white" />
                          </div>
                          <div className="p-3 rounded-xl bg-primary/10 max-w-[80%]">
                            <p className="text-sm">{step === 'technical' ? questions[i] : communicationQuestions[i]}</p>
                          </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                          <div className="p-3 rounded-xl bg-muted max-w-[80%]">
                            <p className="text-sm">{a}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping ? (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="p-3 rounded-xl bg-primary/10">
                          <div className="flex gap-1">
                            <span className="typing-dot" />
                            <span className="typing-dot" />
                            <span className="typing-dot" />
                          </div>
                        </div>
                      </div>
                    ) : answers.length <= currentQuestion && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <div className="p-3 rounded-xl bg-primary/10 max-w-[80%]">
                          <p className="text-sm">{step === 'technical' ? questions[currentQuestion] : communicationQuestions[currentQuestion]}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Input 
                      value={answer} 
                      onChange={(e) => setAnswer(e.target.value)} 
                      placeholder="Type your answer..." 
                      onKeyDown={(e) => e.key === "Enter" && submitAnswer()} 
                      disabled={isTyping} 
                    />
                    <Button 
                      onClick={submitAnswer} 
                      disabled={!answer.trim() || isTyping} 
                      className="gradient-bg text-white"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                    {step === "technical" && currentQuestion === 8 && ( // Show End Interview button at the last question
                      <Button 
                        onClick={() => {
                          // Move to communication if selected, otherwise go to result
                          if (currentCommunicationLevel) {
                            setStep("communication");
                            setCurrentQuestion(0);
                            setCurrentSet(1);
                            setAnswers([]);
                            simulateTyping();
                          } else {
                            setStep("result");
                          }
                        }}
                        variant="outline"
                      >
                        End Tech Interview
                      </Button>
                    )}
                    {step === "communication" && currentQuestion === 14 && ( // Show End Interview button at the last question
                      <Button 
                        onClick={() => {
                          // Calculate communication score
                          const calculatedScore = 75; // Random score between 60-100
                          setCommunicationScore(calculatedScore);
                          
                          // Check if passed (70% threshold for communication)
                          const communicationPassed = calculatedScore >= 70;
                          setPassed(communicationPassed);
                          
                          // Move to result
                          setStep("result");
                        }}
                        variant="outline"
                      >
                        End Communication Interview
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          
          {step === "result" && (
            <motion.div key="result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <Card className="glass-card text-center">
                <CardContent className="pt-8 pb-8 space-y-6">
                  <motion.div 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    transition={{ type: "spring", delay: 0.2 }} 
                    className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
                      passed ? "bg-success/20" : "bg-destructive/20"
                    }`}
                  >
                    {passed ? <CheckCircle2 className="w-12 h-12 text-success" /> : <XCircle className="w-12 h-12 text-destructive" />}
                  </motion.div>
                  
                  <div>
                    <h2 className="text-3xl font-bold mb-2">
                      {passed ? "Skill successfully verified" : "Skill not verified yet"}
                    </h2>
                    <p className="text-muted-foreground">
                      {passed 
                        ? `You've earned the ${selectedSkill} badge!` 
                        : "You can retake this interview after 15 days to reflect your updated skill level."}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {/* Technical Verification Results */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Technical Verification
                      </h3>
                      <ScoreRing score={technicalScore || 70} size="md" />
                      <div className="text-sm text-muted-foreground">
                        <p>Stage: {currentTechnicalStage?.charAt(0).toUpperCase() + currentTechnicalStage?.slice(1)}</p>
                        <p>Minimum Required Score (Min.): {currentTechnicalStage === TechnicalStage.Beginner ? '50%' : '70%'}</p>
                      </div>
                    </div>
                    
                    {/* Communication Verification Results */}
                    {currentCommunicationLevel && (
                      <div className="space-y-2 pt-4 border-t border-border">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-success" />
                          Communication & Soft Skills
                        </h3>
                        <ScoreRing score={communicationScore || 75} size="md" />
                        <div className="text-sm text-muted-foreground">
                          <p>Level: {currentCommunicationLevel?.replace('_', ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</p>
                          <p>Minimum Required Score (Min.): 70%</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {passed && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      transition={{ delay: 0.5 }} 
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
                    >
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Verified by Gemini AI</span>
                    </motion.div>
                  )}
                  
                  {/* Retest lock UI when score is below 80 */}
                  {!passed && (
                    <div className="pt-4 space-y-4">
                      <div className="flex items-center justify-center gap-2 text-destructive">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm">Retest available after 15 days</span>
                      </div>
                      
                      <div className="relative inline-flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          disabled 
                          className="cursor-not-allowed opacity-50"
                          title="Retest available after 15 days"
                        >
                          <RotateCcwIcon className="w-4 h-4 mr-2" />
                          Retake Interview
                        </Button>
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-foreground text-background text-xs px-2 py-1 rounded whitespace-nowrap">
                          Retest available after 15 days
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Bell className="w-4 h-4" />
                          <span className="text-sm">Automated reminders will prompt you every 15 days to re-verify this skill.</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Keeps skill profiles accurate and up-to-date.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-3 justify-center pt-4">
                    <Button variant="outline" onClick={() => navigate("/dashboard")}>
                      Go to Dashboard
                    </Button>
                    <Button onClick={handleResultAction} className="gradient-bg text-white">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      {passed ? "Verify Another Skill" : "Select Different Skill"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Improvement Popup - shown when score is below 80% */}
      <AnimatePresence>
        {showImprovementPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-card rounded-xl p-6 max-w-md w-full border border-border shadow-xl"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Improve Your Skills</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleImprovementOption(false)}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <p className="text-muted-foreground mb-6">
                Would you like personalized suggestions to improve this skill?
              </p>
              
              <div className="flex flex-col gap-3">
                <Button 
                  className="w-full gradient-bg text-white"
                  onClick={() => handleImprovementOption(true)}
                >
                  Yes, Show Me Suggestions
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => handleImprovementOption(false)}
                >
                  No, Try Again Later
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageWrapper>
  );
  
}