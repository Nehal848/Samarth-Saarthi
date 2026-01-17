import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Lock, 
  Unlock, 
  Brain, 
  BookOpen, 
  Shuffle, 
  Timer, 
  Trophy,
  CheckCircle,
  AlertTriangle,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

// Mock data for aptitude questions
const mockQuestions = [
  {
    id: 1,
    type: "mcq",
    question: "A train 125 m long passes a man, running at 5 km/hr in the same direction in which the train is going, in 10 seconds. The speed of the train is:",
    options: ["45 km/hr", "50 km/hr", "54 km/hr", "55 km/hr"],
    correctAnswer: 1,
    explanationRequired: false
  },
  {
    id: 2,
    type: "logical",
    question: "If all Bloops are Razzies and all Razzies are Loppies, then all Bloops are definitely Loppies.",
    options: ["True", "False", "Cannot be determined"],
    correctAnswer: 0,
    explanationRequired: true
  },
  {
    id: 3,
    type: "reasoning",
    question: "In a certain code, 'TEACHER' is written as 'VGCEIGT'. How is 'CHILDREN' written in that code?",
    options: ["EJKNFTGP", "EJKNEGTP", "EGJKNFTP", "EGJKNFTG"],
    correctAnswer: 0,
    explanationRequired: false
  },
  {
    id: 4,
    type: "mcq",
    question: "The sum of ages of 5 children born at intervals of 3 years each is 50 years. What is the age of the youngest child?",
    options: ["4 years", "5 years", "6 years", "7 years"],
    correctAnswer: 0,
    explanationRequired: false
  },
  {
    id: 5,
    type: "logical",
    question: "Pointing to a photograph of a boy Suresh said, \"He is the son of the only son of my mother.\" How is Suresh related to that boy?",
    options: ["Brother", "Uncle", "Father", "Cousin"],
    correctAnswer: 2,
    explanationRequired: false
  },
  {
    id: 6,
    type: "reasoning",
    question: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?",
    options: ["(1/3)", "(1/8)", "(2/8)", "(1/16)"],
    correctAnswer: 1,
    explanationRequired: false
  },
  {
    id: 7,
    type: "mcq",
    question: "Which word does NOT belong with the others?",
    options: ["rye", "sourdough", "pumpernickel", "loaf"],
    correctAnswer: 0,
    explanationRequired: true
  },
  {
    id: 8,
    type: "logical",
    question: "Five friends are sitting in a row facing south. Jay is to the immediate right of Bob. Tom is to the immediate left of Alice. Alice is between Bob and Smith. Who is sitting in the middle?",
    options: ["Bob", "Alice", "Tom", "Smith"],
    correctAnswer: 1,
    explanationRequired: false
  },
  {
    id: 9,
    type: "reasoning",
    question: "If A + B means A is the brother of B; A - B means A is the sister of B; A x B means A is the father of B; A ÷ B means A is the mother of B, which of the following means M is the nephew of P?",
    options: ["M x N ÷ P", "N ÷ P + M", "P + S x N - M", "M + S x P"],
    correctAnswer: 3,
    explanationRequired: true
  }
];

const chapters = [
  { id: "quantitative", name: "Quantitative Aptitude", topics: ["Percentages", "Probability", "Time & Work", "Profit & Loss"] },
  { id: "logical", name: "Logical Reasoning", topics: ["Puzzles", "Seating Arrangement", "Blood Relations", "Direction Sense"] },
  { id: "verbal", name: "Verbal Ability", topics: ["Reading Comprehension", "Para Jumbles", "Sentence Correction", "Vocabulary"] },
  { id: "data", name: "Data Interpretation", topics: ["Tables", "Graphs", "Charts", "Caselets"] },
  { id: "mixed", name: "Mixed", topics: ["All Topics"] }
];

const levels = [
  { id: "beginner", name: "Beginner", description: "Basic concepts and fundamentals" },
  { id: "intermediate", name: "Intermediate", description: "Moderate logic and reasoning" },
  { id: "advanced", name: "Advanced", description: "Complex problem solving" },
  { id: "veteran", name: "Veteran", description: "Expert-level challenges" },
];

export default function AptitudeLab() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedMode, setSelectedMode] = useState<"chapter" | "general" | null>(null);
  const [selectedChapters, setSelectedChapters] = useState<string[]>([]); // Multi-select for chapters
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes in seconds
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [currentSection, setCurrentSection] = useState(1); // Track current section (1, 2, or 3)
  const [showSelectionModal, setShowSelectionModal] = useState(false); // Control modal visibility

  const requiredCredits = 500;
  const userCredits = user?.alphaCredits || 0;

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
    // Check if user meets unlock criteria
    setIsUnlocked(userCredits >= requiredCredits);
  }, [isAuthenticated, userCredits, navigate]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (selectedMode && timeRemaining > 0 && !showResults) {
      timer = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [selectedMode, timeRemaining, showResults]);

  const handleUnlock = () => {
    // In a real app, this would make an API call to unlock the feature
    console.log("Unlocking Aptitude Lab...");
    setIsUnlocked(true);
  };

  const startTest = () => {
    if (selectedMode) {
      setCurrentQuestionIndex(0);
      setAnswers({});
      setTimeRemaining(1800);
      setShowResults(false);
      setCurrentSection(1); // Reset to first section
    }
  };

  const handleAnswer = (questionId: number, answerIndex: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const submitTest = () => {
    setShowResults(true);
  };

  const restartTest = () => {
    setSelectedLevel(null);
    setSelectedChapters([]);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(1800);
    setShowResults(false);
    setCurrentSection(1);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isUnlocked) {
    return (
      <PageWrapper className="bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <Lock className="w-16 h-16 mx-auto mb-6 text-primary" />
            <h1 className="text-3xl font-bold mb-4 text-foreground">Aptitude & Logic Lab</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Premium assessment module to evaluate your thinking ability, logic, and problem-solving skills.
              Unlock this feature to gain valuable insights into your cognitive abilities.
            </p>
            
            <Card className="max-w-md mx-auto border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  Unlock Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Alpha Credits</span>
                      <span className="text-sm">{userCredits} / {requiredCredits}</span>
                    </div>
                    <Progress value={(userCredits / requiredCredits) * 100} className="h-2" />
                  </div>
                  
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={handleUnlock}
                    disabled={userCredits < requiredCredits}
                  >
                    <Unlock className="w-4 h-4 mr-2" />
                    {userCredits >= requiredCredits ? "Unlock Aptitude Lab" : "Insufficient Credits"}
                  </Button>
                  
                  <Badge variant="secondary" className="w-full justify-center py-2">
                    Premium Feature
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  if (showResults) {
    const correctAnswers = Object.entries(answers).filter(([qid, ans]) => {
      const question = mockQuestions.find(q => q.id === parseInt(qid));
      return question?.correctAnswer === ans;
    }).length;
    
    const score = Math.round((correctAnswers / mockQuestions.length) * 100);
    const isPassed = score >= 70;

    return (
      <PageWrapper className="bg-background">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="mb-8">
              {isPassed ? (
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-success" />
              ) : (
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-warning" />
              )}
              <h1 className="text-3xl font-bold mb-2 text-foreground">
                {isPassed ? "Congratulations!" : "Keep Practicing"}
              </h1>
              <p className="text-muted-foreground">
                {isPassed ? "You've demonstrated strong aptitude skills" : "Review your answers and try again"}
              </p>
            </div>

            <Card className="max-w-md mx-auto mb-8">
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">{score}%</div>
                    <div className="text-sm text-muted-foreground">Overall Score</div>
                  </div>
                  
                  <div className="text-center p-3 bg-muted rounded-lg">
                    <p className="text-sm font-medium">Level: <span className="text-primary capitalize">{selectedLevel}</span></p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-success/10 rounded-lg">
                      <div className="text-2xl font-bold text-success">{correctAnswers}</div>
                      <div className="text-xs text-muted-foreground">Correct</div>
                    </div>
                    <div className="text-center p-3 bg-warning/10 rounded-lg">
                      <div className="text-2xl font-bold text-warning">{mockQuestions.length - correctAnswers}</div>
                      <div className="text-xs text-muted-foreground">Incorrect</div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <Badge variant={isPassed ? "default" : "secondary"}>
                      {isPassed ? "PASSED" : "NEEDS IMPROVEMENT"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setShowResults(false)}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Review Answers
              </Button>
              <Button onClick={() => {
                restartTest();
              }}>
                Take Another Test
              </Button>
            </div>
          </motion.div>
        </div>
      </PageWrapper>
    );
  }

  if (selectedMode && selectedLevel && (selectedMode === 'general' || (selectedMode === 'chapter' && selectedChapters.length > 0)) && currentQuestionIndex < mockQuestions.length) {
    const currentQuestion = mockQuestions[currentQuestionIndex];
    // Calculate current section (1, 2, or 3) based on question index
    const currentSectionNum = Math.floor(currentQuestionIndex / 3) + 1;
    
    return (
      <PageWrapper className="bg-background">
        <div className="container mx-auto px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Question Panel */}
            <div className="lg:col-span-3">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>
                      Question {currentQuestionIndex + 1} of {mockQuestions.length} • Section {currentSectionNum}/3
                    </CardTitle>
                    <Badge variant="secondary">
                      {currentQuestion.type.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <p className="text-lg font-medium text-foreground">
                      {currentQuestion.question}
                    </p>
                    
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <Button
                          key={index}
                          variant={answers[currentQuestion.id] === index ? "default" : "outline"}
                          className="w-full justify-start h-auto py-3 px-4 text-left"
                          onClick={() => handleAnswer(currentQuestion.id, index)}
                        >
                          {String.fromCharCode(65 + index)}. {option}
                        </Button>
                      ))}
                    </div>
                    
                    {currentQuestion.explanationRequired && (
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <strong>Note:</strong> Logic explanation may be asked for selected questions only
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Timer */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Timer className="w-5 h-5 text-primary" />
                    Time Remaining
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-center text-primary">
                    {formatTime(timeRemaining)}
                  </div>
                </CardContent>
              </Card>
              
              {/* Progress */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <Progress 
                      value={((currentQuestionIndex + 1) / mockQuestions.length) * 100} 
                      className="h-2"
                    />
                    <div className="text-center text-sm text-muted-foreground">
                      {currentQuestionIndex + 1} of {mockQuestions.length} questions
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Controls */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    <Button 
                      className="w-full"
                      onClick={() => {
                        if (currentQuestionIndex < mockQuestions.length - 1) {
                          setCurrentQuestionIndex(prev => prev + 1);
                        } else {
                          submitTest();
                        }
                      }}
                    >
                      {currentQuestionIndex < mockQuestions.length - 1 ? "Next Question" : "Submit Test"}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        setSelectedMode(null);
                        setSelectedLevel(null);
                        setSelectedChapters([]);
                        setCurrentQuestionIndex(0);
                        setAnswers({});
                        setTimeRemaining(1800);
                        setShowResults(false);
                        setCurrentSection(1);
                      }}>
                      Exit Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="bg-background">
      <div className="container mx-auto px-4 py-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold mb-4 text-foreground flex items-center justify-center gap-3">
            <Brain className="w-10 h-10 text-primary" />
            Aptitude & Logic Lab
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Evaluate your thinking ability, logic, and problem-solving skills with premium assessments
          </p>
        </motion.div>

        {/* Mode Selection */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all border-2 border-primary/20"
              onClick={() => setSelectedMode("chapter")}
            >
              <CardHeader>
                <BookOpen className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-center">Chapter-Based Aptitude</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-6">
                  Focus on specific topics and chapters to strengthen particular areas
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {chapters.slice(0, 4).map(chapter => (
                    <Badge key={chapter.id} variant="secondary" className="justify-center py-2">
                      {chapter.name}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all border-2 border-primary/20"
              onClick={() => setSelectedMode("general")}
            >
              <CardHeader>
                <Shuffle className="w-12 h-12 text-primary mx-auto mb-4" />
                <CardTitle className="text-center">General Aptitude Mode</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center mb-6">
                  Mixed questions evaluating raw thinking ability across all domains
                </p>
                <div className="text-center">
                  <Badge variant="secondary" className="py-2 px-4">
                    Random Mixed Questions
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Level Selection Modal */}
        <Dialog open={selectedMode && !selectedLevel} onOpenChange={(open) => {
          if (!open && !selectedLevel) {
            // Only reset mode if user closes the modal without selecting a level
            setSelectedMode(null);
          }
        }}>
          <DialogContent className="sm:max-w-md max-w-sm w-full">
            {/* Close button in top-right corner */}
            <div className="absolute top-4 right-4">
              <button 
                onClick={() => setSelectedMode(null)}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <DialogHeader>
              <DialogTitle className="text-center text-2xl pb-4">Select Difficulty Level</DialogTitle>
            </DialogHeader>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {levels.map(level => (
                <Card 
                  key={level.id}
                  className={`cursor-pointer transition-all ${
                    selectedLevel === level.id 
                      ? 'border-2 border-primary ring-2 ring-primary/20 shadow-lg' 
                      : 'hover:border-primary/50'
                  }`}
                  onClick={() => {
                    setSelectedLevel(level.id);
                    // Close the modal after selection
                    if (selectedMode === 'general') {
                      // For general mode, start the test immediately after level selection
                      setTimeout(() => {
                        setCurrentQuestionIndex(0);
                        setAnswers({});
                        setTimeRemaining(1800);
                        setShowResults(false);
                        setCurrentSection(1);
                      }, 300); // Small delay to allow modal to close smoothly
                    }
                  }}
                >
                  <CardHeader>
                    <CardTitle className="text-center text-lg">{level.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-center text-sm text-muted-foreground">{level.description}</p>
                      <div className="text-center text-xs text-muted-foreground bg-muted rounded p-2">
                        Question Structure: 3-3-3 (9 Total)
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Only show Continue button for chapter mode */}
            {selectedMode === 'chapter' && (
              <div className="mt-6 text-center">
                <Button 
                  size="lg"
                  onClick={() => {
                    // For chapter mode, just close the modal and show chapter selection
                  }}
                  disabled={!selectedLevel}
                  className="px-8"
                >
                  Continue
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Chapter Selection (if chapter mode selected and level chosen) */}
        {selectedMode === "chapter" && selectedLevel && selectedChapters.length === 0 && (
          <Dialog open={true}>
            <DialogContent className="sm:max-w-md max-w-sm w-full">
              {/* Close button in top-right corner */}
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setSelectedMode(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
              
              <DialogHeader>
                <DialogTitle className="text-center text-2xl pb-4">Select Chapters</DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {chapters.map(chapter => {
                  const isSelected = selectedChapters.includes(chapter.id);
                  return (
                    <Card 
                      key={chapter.id}
                      className={`cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-2 border-primary ring-2 ring-primary/20 shadow-lg' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => {
                        if (isSelected) {
                          // Remove chapter from selection
                          setSelectedChapters(prev => prev.filter(id => id !== chapter.id));
                        } else {
                          // Add chapter to selection
                          setSelectedChapters(prev => [...prev, chapter.id]);
                        }
                      }}
                    >
                      <CardHeader>
                        <CardTitle className="text-center text-lg">{chapter.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-1">
                          {chapter.topics.slice(0, 2).map(topic => (
                            <Badge key={topic} variant="secondary" className="w-full justify-center text-xs">
                              {topic}
                            </Badge>
                          ))}
                          {chapter.topics.length > 2 && (
                            <Badge variant="outline" className="w-full justify-center text-xs">
                              +{chapter.topics.length - 2} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
                      
              <div className="mt-6 text-center">
                <Button 
                  size="lg"
                  onClick={() => {
                    // Start the test if at least one chapter is selected
                    if (selectedChapters.length > 0) {
                      setTimeout(() => {
                        setCurrentQuestionIndex(0);
                        setAnswers({});
                        setTimeRemaining(1800);
                        setShowResults(false);
                        setCurrentSection(1); // Reset to first section
                      }, 300); // Small delay to allow UI to update
                    }
                  }}
                  disabled={selectedChapters.length === 0}
                  className="px-8"
                >
                  Start Test
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}


      </div>
    </PageWrapper>
  );
}