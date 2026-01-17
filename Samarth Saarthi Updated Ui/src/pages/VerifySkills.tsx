import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, CheckCircle2, XCircle, ArrowRight, RotateCcw, Lock, Bell, Clock, RotateCcwIcon, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { ScoreRing } from "@/components/ui/score-ring";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { evaluateFullInterview } from "@/lib/geminiService";



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

type VerifiedBadgeData = {
  id: string;
  skill: string;
  score: number;
  confidence: "high" | "medium" | "low";
  verifiedAt: string;
};

type LearningCurveData = {
  skills: string[];
  overallData: SkillDataPoint[];
  skillData: Record<string, SkillDataPoint[]>;
  milestones: Milestone[];
  externalContributions: ExternalContribution[];
  verifiedBadges: VerifiedBadgeData[];
};

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
const LEARNING_JOURNEY_KEY = "user_learning_journey";

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
  const [selectedSkillForInterview, setSelectedSkillForInterview] = useState<{ skill: string, type: 'technical' | 'communication' } | null>(null);
  const navigate = useNavigate();

  // Gemini AI evaluation states
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [answerScores, setAnswerScores] = useState<number[]>([]);
  const [answerFeedback, setAnswerFeedback] = useState<string[]>([]);

  const handleEvaluationResult = async (score: number, feedback: string, type: 'technical' | 'communication') => {
    // 1. Prepare new data points
    const currentDate = new Date().toISOString();
    const dateFormatted = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    const newPoint: SkillDataPoint = {
      date: dateFormatted,
      level: Number((score / 20).toFixed(1)), // Normalize 0-100 score to 0-5 level
      skill: type === 'technical' ? selectedSkill : 'communication'
    };

    const overallPoint: SkillDataPoint = {
      date: dateFormatted,
      level: Number((score / 20).toFixed(1)),
      skill: "overall"
    };

    const skillName = type === 'technical' ? selectedSkill : 'Communication';

    const newBadge: VerifiedBadgeData = {
      id: `${skillName}-${Date.now()}`,
      skill: skillName,
      score: score,
      confidence: "high",
      verifiedAt: currentDate
    };

    // 2. Load existing data from localStorage
    const existingDataRaw = localStorage.getItem(LEARNING_JOURNEY_KEY);
    let journeyData: LearningCurveData;

    const defaultData: LearningCurveData = {
      skills: [],
      overallData: [],
      skillData: {},
      milestones: [],
      externalContributions: [],
      verifiedBadges: []
    };

    try {
      journeyData = existingDataRaw ? JSON.parse(existingDataRaw) : defaultData;
      // Ensure all required fields exist
      journeyData.overallData = journeyData.overallData || [];
      journeyData.skillData = journeyData.skillData || {};
      journeyData.skills = journeyData.skills || [];
      journeyData.verifiedBadges = journeyData.verifiedBadges || [];
    } catch (e) {
      console.error("Error parsing user_learning_journey", e);
      journeyData = defaultData;
    }

    // 3. Update structure
    // Append new SkillDataPoint to overallData
    journeyData.overallData.push(overallPoint);

    // Update skill-specific data
    const skillKey = type === 'technical' ? selectedSkill : 'communication';
    if (!journeyData.skillData[skillKey]) {
      journeyData.skillData[skillKey] = [];
    }
    journeyData.skillData[skillKey].push(newPoint);

    // Update skills list
    if (!journeyData.skills.includes(skillKey)) {
      journeyData.skills.push(skillKey);
    }

    // Add verifiedBadge (replace old badge for same skill)
    journeyData.verifiedBadges = journeyData.verifiedBadges.filter(b => b.skill !== selectedSkill);
    journeyData.verifiedBadges.push(newBadge);

    // 4. Save to localStorage
    localStorage.setItem(LEARNING_JOURNEY_KEY, JSON.stringify(journeyData));
    console.log("📍 Saved to localStorage:", LEARNING_JOURNEY_KEY, journeyData);

    // 5. Trigger Firebase Cloud Function (Task 3)
    try {
      const { functions } = await import("@/lib/firebase");
      const { httpsCallable } = await import("firebase/functions");
      const saveBadge = httpsCallable(functions, 'save_verified_badge');
      await saveBadge({
        skill: selectedSkill,
        score: score,
        confidence: "high",
        type: type
      });
      console.log("🔥 Successfully synced with Firebase");
    } catch (err) {
      console.error("❌ Firebase sync failed:", err);
      // We don't block the UI if Firebase sync fails, as per requirements
    }
  };

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
      setAnswerScores([]);
      setAnswerFeedback([]);
      simulateTyping();
    }
  };

  const simulateTyping = () => {
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 1500);
  };



  const submitAnswer = async () => {
    if (!answer.trim()) return;

    console.log("🟢 submitAnswer CALLED");



    const userAnswer = answer;
    const updatedAnswers = [...answers, userAnswer];
    setAnswers(updatedAnswers);
    setAnswer("");

    // TECHNICAL INTERVIEW
    if (step === "technical") {

      // 👉 NOT LAST QUESTION
      if (currentQuestion < 8) {
        setCurrentQuestion(q => q + 1);
        simulateTyping();
        return;
      }

      // 👉 LAST QUESTION — ONLY PLACE Gemini runs
      console.log("🟡 About to call evaluateFullInterview");

      setIsEvaluating(true);

      try {
        const response = await fetch("http://127.0.0.1:8000/evaluate-interview", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            skill: selectedSkill,
            type: "technical",
            questions,
            answers: updatedAnswers,
          }),
        });

        if (!response.ok) {
          throw new Error("Backend evaluation failed");
        }

        const finalResult = await response.json();


        console.log("🟢 Gemini returned result", finalResult);

        setTechnicalScore(finalResult.score);
        setPassed(
          finalResult.score >=
          (currentTechnicalStage === TechnicalStage.Beginner ? 50 : 70)
        );
        setAnswerFeedback([finalResult.feedback]);

        // Persist the result
        await handleEvaluationResult(finalResult.score, finalResult.feedback, 'technical');

      } catch (err) {
        console.error("❌ Gemini failed", err);
        setAnswerFeedback(["Gemini evaluation failed."]);
      }

      setIsEvaluating(false);
      console.log("✅ setIsEvaluating(false) called");

      setStep("result");
      return;
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
    setAnswerScores([]);
    setAnswerFeedback([]);
    setIsEvaluating(false);
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

  // Automatic navigation removed to prevent race conditions. 
  // User navigates manually via "Go to Dashboard" button.

  return (
    <PageWrapper className="bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#FCA311] to-[#F77F00] flex items-center justify-center mx-auto mb-4 premium-glass shadow-card">
            <Sparkles className="w-8 h-8 text-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">AI Lightning Interview</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">Assess and verify your skills with AI-powered interviews. Track your progress and achievements.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Section A: Technical Skills */}
          <Card className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] hover:shadow-card-hover transition-all duration-300 premium-border premium-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Sparkles className="w-5 h-5 text-primary" />
                Technical Skills
              </CardTitle>
              <p className="text-sm text-muted-foreground">Verify your technical expertise through staged challenges</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Select a skill to verify</label>
                    <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                      <SelectTrigger className="rounded-lg"><SelectValue placeholder="Choose a skill..." /></SelectTrigger>
                      <SelectContent>{skills.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-foreground">{selectedSkill || 'No skill selected'}</h3>
                      <p className="text-sm text-muted-foreground">Current verified level</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-primary">{currentTechnicalStage ? currentTechnicalStage.charAt(0).toUpperCase() + currentTechnicalStage.slice(1) : 'Not verified'}</p>
                      <p className="text-sm text-muted-foreground">Badge earned</p>
                    </div>
                  </div>

                  {currentTechnicalStage && (
                    <div className="pt-2">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="text-muted-foreground">Stage {technicalStages.findIndex(stage => stage.id === currentTechnicalStage) + 1}/4</span>
                      </div>
                      <Progress value={((technicalStages.findIndex(stage => stage.id === currentTechnicalStage) + 1) / 4) * 100} className="h-2 rounded-full" />
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => setSelectedSkillForInterview({ skill: selectedSkill, type: 'technical' })}
                  className="w-full rounded-xl bg-[#FCA311] hover:bg-[#e0920f] text-foreground shadow-card hover:shadow-card-hover transition-all duration-300"
                  disabled={!selectedSkill}
                >
                  {currentTechnicalStage ? 'Improve Skill' : 'Verify Skill'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Section B: Communication Skills */}
          <Card className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] hover:shadow-card-hover transition-all duration-300 premium-border premium-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Sparkles className="w-5 h-5 text-primary" />
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
                          className={`flex items-center justify-between p-3 rounded-xl border ${isAchieved ? 'bg-[#FCA311]/10 border-[#FCA311]/30' : 'bg-[hsl(var(--card))]/50 border-[hsl(var(--border)/0.3)]'}`}
                        >
                          <div className="flex items-center gap-2">
                            {isAchieved ? (
                              <CheckCircle2 className="w-5 h-5 text-primary" />
                            ) : isCurrent ? (
                              <div className="w-5 h-5 rounded-full bg-[#FCA311] flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-[hsl(var(--card))]"></div>
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full border border-[hsl(var(--border)/0.3)]"></div>
                            )}
                            <span className="font-medium text-foreground">{level.label}</span>
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
                  onClick={() => setSelectedSkillForInterview({ skill: selectedSkill, type: 'communication' })}
                  className="w-full rounded-xl bg-[#FCA311] hover:bg-[#e0920f] text-foreground shadow-card hover:shadow-card-hover transition-all duration-300"
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
            <div className="bg-[hsl(var(--card))] rounded-xl p-6 max-w-2xl w-full border border-[hsl(var(--border)/0.3)] shadow-card max-h-[90vh] overflow-y-auto premium-glass">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-foreground">Technical Verification</h3>
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
                  <label className="text-sm font-medium mb-3 block text-foreground">Technical Verification</label>
                  <div className="grid grid-cols-2 gap-3">
                    {technicalStages.map((stage) => (
                      <motion.div
                        key={stage.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentTechnicalStage(stage.id as TechnicalStage)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${currentTechnicalStage === stage.id
                          ? "border-[#6AA2E0] bg-[#FCA311]/10"
                          : "border-[hsl(var(--border)/0.3)] hover:border-[#6AA2E0]/50"
                          }`}
                      >
                        <div className="font-medium flex items-center gap-2 text-foreground">
                          {stage.label}
                          <span className="text-xs bg-[#FCA311]/10 text-primary px-2 py-0.5 rounded-full">
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
                    className="rounded-xl border-[#FCA311] text-primary hover:bg-[#FCA311]/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="rounded-xl bg-[#FCA311] hover:bg-[#e0920f] text-foreground shadow-card hover:shadow-card-hover transition-all duration-300"
                    onClick={() => {
                      // Start the interview with the selected skill and stage
                      setStep('technical');
                      setAnswers([]);
                      setAnswerScores([]);
                      setAnswerFeedback([]);
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
            <div className="bg-[hsl(var(--card))] rounded-xl p-6 max-w-2xl w-full border border-[hsl(var(--border)/0.3)] shadow-card max-h-[90vh] overflow-y-auto premium-glass">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-foreground">Communication Verification</h3>
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
                  <label className="text-sm font-medium mb-3 block text-foreground">Communication Level</label>
                  <div className="grid grid-cols-3 gap-2">
                    {communicationLevels.map((level) => (
                      <motion.div
                        key={level.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCurrentCommunicationLevel(level.id as CommunicationLevel)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all text-center ${currentCommunicationLevel === level.id
                          ? "border-[#6AA2E0] bg-[#FCA311]/10"
                          : "border-[hsl(var(--border)/0.3)] hover:border-[#6AA2E0]/50"
                          }`}
                      >
                        <div className="font-medium text-sm text-foreground">{level.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSkillForInterview(null)}
                    className="rounded-xl border-[#FCA311] text-primary hover:bg-[#FCA311]/10"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="rounded-xl bg-[#FCA311] hover:bg-[#e0920f] text-foreground shadow-card hover:shadow-card-hover transition-all duration-300"
                    onClick={() => {
                      // Start the interview with the selected skill and level
                      setStep('communication');
                      setAnswers([]);
                      setAnswerScores([]);
                      setAnswerFeedback([]);
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
              <Card className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] hover:shadow-card-hover transition-all duration-300 premium-border premium-card">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      <span className="font-semibold text-foreground">{selectedSkill} {step === 'technical' ? 'Technical' : 'Communication'} Verification</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {step === 'technical'
                        ? `Stage: ${currentTechnicalStage} · Question ${currentQuestion + 1} / 9`
                        : `Level: ${currentCommunicationLevel} · Question ${currentQuestion + 1} / 15`}
                    </span>
                  </div>
                  <Progress value={((currentQuestion + 1) / (step === 'technical' ? 9 : 15)) * 100} className="h-2 rounded-full" />
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
                    className="flex-grow overflow-y-auto max-h-[300px] space-y-4 p-4 rounded-xl bg-[hsl(var(--card))]/50 border border-[hsl(var(--border)/0.3)] premium-glass"
                  >
                    {answers.map((a, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FCA311] to-[#F77F00] flex items-center justify-center flex-shrink-0 premium-glass">
                            <Sparkles className="w-4 h-4 text-foreground" />
                          </div>
                          <div className="p-3 rounded-xl bg-[#FCA311]/10 max-w-[80%]">
                            <p className="text-sm text-foreground">{step === 'technical' ? questions[i] : communicationQuestions[i]}</p>
                          </div>
                        </div>
                        <div className="flex gap-3 justify-end">
                          <div className="p-3 rounded-xl bg-[#3F778C]/10 max-w-[80%]">
                            <p className="text-sm text-muted-foreground">{a}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping ? (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FCA311] to-[#F77F00] flex items-center justify-center premium-glass">
                          <Sparkles className="w-4 h-4 text-foreground" />
                        </div>
                        <div className="p-3 rounded-xl bg-[#FCA311]/10">
                          <div className="flex gap-1">
                            <span className="typing-dot pulse-glow" />
                            <span className="typing-dot pulse-glow" />
                            <span className="typing-dot pulse-glow" />
                          </div>
                        </div>
                      </div>
                    ) : answers.length <= currentQuestion && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FCA311] to-[#F77F00] flex items-center justify-center flex-shrink-0 premium-glass">
                          <Sparkles className="w-4 h-4 text-foreground" />
                        </div>
                        <div className="p-3 rounded-xl bg-[#FCA311]/10 max-w-[80%]">
                          <p className="text-sm text-foreground">{step === 'technical' ? questions[currentQuestion] : communicationQuestions[currentQuestion]}</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {isEvaluating && (
                    <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#FCA311]/10 border border-[#FCA311]/30">
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-foreground">Gemini AI is evaluating your answer...</span>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <div className="flex flex-col w-full">
                      <label className="text-sm text-foreground mb-1">Your answer</label>
                      <Input
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Type your answer..."
                        onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
                        disabled={isTyping || isEvaluating}
                        className="rounded-xl py-5 px-4 bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.3)] shadow-sm focus:ring-2 focus:ring-[#6AA2E0]/30 focus:border-[#6AA2E0]"
                      />
                    </div>
                    <Button
                      onClick={submitAnswer}
                      disabled={!answer.trim() || isTyping || isEvaluating}
                      className="rounded-xl bg-[#FCA311] hover:bg-[#e0920f] text-foreground px-4 shadow-card hover:shadow-card-hover transition-all duration-300"
                    >
                      {isEvaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
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
                        className="rounded-xl bg-[#FCA311] hover:bg-[#e0920f] text-foreground shadow-card hover:shadow-card-hover transition-all duration-300"
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

                          // Persist the result
                          handleEvaluationResult(calculatedScore, "Communication verified successfully.", 'communication');
                        }}
                        className="rounded-xl bg-[#FCA311] hover:bg-[#e0920f] text-foreground shadow-card hover:shadow-card-hover transition-all duration-300"
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
              <Card className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] hover:shadow-card-hover transition-all duration-300 premium-border premium-card text-center">
                <CardContent className="pt-8 pb-8 space-y-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${passed ? "bg-success/20" : "bg-destructive/20"
                      }`}
                  >
                    {passed ? <CheckCircle2 className="w-12 h-12 text-success" /> : <XCircle className="w-12 h-12 text-destructive" />}
                  </motion.div>

                  <div>
                    <h2 className="text-3xl font-bold mb-2 text-foreground">
                      {passed ? "Skill successfully verified" : "Skill not verified yet"}
                    </h2>
                    <p className="text-muted-foreground">
                      {passed
                        ? `You've earned the ${selectedSkill} badge!`
                        : "You can retake this interview after 15 days to reflect your updated skill level."}
                    </p>
                  </div>

                  {/* ✅ FINAL GEMINI RESULT */}
                  <div className="mt-4 space-y-2">
                    <p className="text-lg font-bold text-foreground">
                      📊 Score: {technicalScore ?? communicationScore}
                    </p>

                    <p className="text-muted-foreground">
                      💡 {answerFeedback[0]}
                    </p>
                  </div>
                  <div className="space-y-4">
                    {/* Technical Verification Results */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                        <Sparkles className="w-4 h-4 text-primary" />
                        Technical Verification
                      </h3>
                      <ScoreRing score={technicalScore || 70} size="md" />
                      <div className="text-sm text-muted-foreground">
                        <p>Stage: {currentTechnicalStage?.charAt(0).toUpperCase() + currentTechnicalStage?.slice(1)}</p>
                        <p>Minimum Required Score (Min.): {currentTechnicalStage === TechnicalStage.Beginner ? '50%' : '70%'}</p>
                      </div>

                      {/* Detailed Statistics */}
                      {answerScores.length > 0 && (
                        <div className="mt-4 p-4 rounded-xl bg-[hsl(var(--card))]/50 border border-[hsl(var(--border)/0.3)] text-left">
                          <h4 className="font-semibold text-sm text-foreground mb-3">📊 Performance Breakdown</h4>
                          <div className="grid grid-cols-2 gap-3 text-xs">
                            <div className="p-2 rounded-lg bg-[#FCA311]/10">
                              <p className="text-muted-foreground">Questions Answered</p>
                              <p className="text-lg font-bold text-foreground">{answerScores.length}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-[#FCA311]/10">
                              <p className="text-muted-foreground">Correct Answers</p>
                              <p className="text-lg font-bold text-foreground">{answerScores.filter(s => s >= 70).length}</p>
                            </div>
                            <div className="p-2 rounded-lg bg-[#FCA311]/10">
                              <p className="text-muted-foreground">Average Score</p>
                              <p className="text-lg font-bold text-foreground">{technicalScore}%</p>
                            </div>
                            <div className="p-2 rounded-lg bg-[#FCA311]/10">
                              <p className="text-muted-foreground">Highest Score</p>
                              <p className="text-lg font-bold text-foreground">{Math.max(...answerScores)}%</p>
                            </div>
                          </div>

                          {/* Individual Question Scores */}
                          <div className="mt-4">
                            <h5 className="font-semibold text-xs text-foreground mb-2">Individual Question Scores:</h5>
                            <div className="space-y-2 max-h-48 overflow-y-auto">
                              {answerScores.map((score, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.1)]">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-medium text-muted-foreground">Q{idx + 1}</span>
                                    {score >= 70 ? (
                                      <CheckCircle2 className="w-3 h-3 text-success" />
                                    ) : (
                                      <XCircle className="w-3 h-3 text-destructive" />
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="w-16 h-1.5 bg-[hsl(var(--border)/0.3)] rounded-full overflow-hidden">
                                      <div
                                        className={`h-full ${score >= 70 ? 'bg-success' : 'bg-destructive'}`}
                                        style={{ width: `${score}%` }}
                                      />
                                    </div>
                                    <span className={`text-xs font-bold ${score >= 70 ? 'text-success' : 'text-destructive'}`}>
                                      {score}%
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* AI Feedback Summary */}
                          {answerFeedback.length > 0 && (
                            <div className="mt-4">
                              <h5 className="font-semibold text-xs text-foreground mb-2">🤖 AI Feedback Highlights:</h5>
                              <div className="space-y-2 max-h-32 overflow-y-auto">
                                {answerFeedback.slice(0, 3).map((feedback, idx) => (
                                  <div key={idx} className="p-2 rounded-lg bg-[#FCA311]/5 border border-[#FCA311]/20">
                                    <p className="text-xs text-muted-foreground">
                                      <span className="font-semibold text-foreground">Q{idx + 1}:</span> {feedback}
                                    </p>
                                  </div>
                                ))}
                                {answerFeedback.length > 3 && (
                                  <p className="text-xs text-muted-foreground italic">+ {answerFeedback.length - 3} more feedback items</p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Communication Verification Results */}
                    {currentCommunicationLevel && (
                      <div className="space-y-2 pt-4 border-t border-[hsl(var(--border)/0.3)]">
                        <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                          <Sparkles className="w-4 h-4 text-primary" />
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
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--card))] border border-[#FCA311]/30 shadow-sm text-primary premium-glass"
                    >
                      <Sparkles className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Verified by Gemini AI</span>
                    </motion.div>
                  )}

                  {/* Retest lock UI when score is below 80 */}
                  {!passed && (
                    <div className="pt-4 space-y-4">
                      <div className="flex items-center justify-center gap-2 text-primary">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm text-muted-foreground">Retest available after 15 days</span>
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
                          <span className="text-sm text-muted-foreground">Automated reminders will prompt you every 15 days to re-verify this skill.</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Keeps skill profiles accurate and up-to-date.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 justify-center pt-4">
                    <Button variant="outline" onClick={() => navigate("/dashboard")} className="rounded-xl border-[#FCA311] text-primary hover:bg-[#FCA311]/10">
                      Go to Dashboard
                    </Button>
                    <Button onClick={handleResultAction} className="rounded-xl bg-[#FCA311] hover:bg-[#e0920f] text-foreground shadow-card hover:shadow-card-hover transition-all duration-300">
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
              className="bg-[hsl(var(--card))] rounded-xl p-6 max-w-md w-full border border-[hsl(var(--border)/0.3)] shadow-card premium-glass"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-foreground">Improve Your Skills</h3>
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
                  className="w-full rounded-xl bg-[#FCA311] hover:bg-[#e0920f] text-foreground shadow-card hover:shadow-card-hover transition-all duration-300"
                  onClick={() => handleImprovementOption(true)}
                >
                  Yes, Show Me Suggestions
                </Button>
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-[#FCA311] text-primary hover:bg-[#FCA311]/10"
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