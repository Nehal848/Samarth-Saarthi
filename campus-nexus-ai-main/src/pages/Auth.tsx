import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Chrome, GraduationCap, Briefcase, ArrowLeft, User as UserIcon, Mail, GraduationCap as GraduationCapIcon, MapPin } from "lucide-react";

// Firebase Imports
import { Auth as firebaseAuth } from "../firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth, UserRole, User } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export default function Auth() {
  const [selectedRole, setSelectedRole] = useState<UserRole>(null);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [studentDetails, setStudentDetails] = useState({
    name: "",
    email: "",
    college: "",
    location: "",
    avatar: ""
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  // --- Real Firebase Logic ---
  const handleStudentLogin = async () => {
    if (studentDetails.name && studentDetails.email) {
      const user_id = firebaseAuth.currentUser?.uid || Date.now().toString();

      // Warrior DNA Object (Matches AuthContext and Firestore)
      const studentUser = {
        id: user_id, 
        uid: user_id,
        name: studentDetails.name,
        email: studentDetails.email,
        role: "student" as UserRole,
        college: studentDetails.college,
        location: studentDetails.location,
        avatar: studentDetails.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentDetails.name}`,
        avatar_url: studentDetails.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentDetails.name}`,
        skillDNA: "Executor",
        trustScore: 750,      // camelCase for Frontend
        trust_score: 750,     // snake_case for DB
        rank: "Bronze",
        nexusCredits: 1000,
        alphaCredits: 250,
        verifiedBadges: []
      };

      try {
        if (firebaseAuth.currentUser?.uid) {
          // Step A: Save Main Profile
          await setDoc(doc(db, "users", user_id), studentUser);

          // Step B: Initialize Skills Sub-collection
          await setDoc(doc(db, "users", user_id, "skills", "onboarding"), {
            level: "Newbie",
            score: 0,
            badges: ["Verified Member"],
            timestamp: new Date()
          });
        }
        
        login("student", studentUser as any);
        navigate("/dashboard");
      } catch (error) {
        console.error("Critical Firestore Error:", error);
        // Bypass for Hackathon: login even if DB fails
        login("student", studentUser as any);
        navigate("/dashboard");
      }
    }
  };

  const handleGoogleSignIn = async () => {
    if (!selectedRole) return;
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(firebaseAuth, provider);
      const user = result.user;

      // --- CHECK IF USER EXISTS IN FIRESTORE ---
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // 1. User pehle se hai! Direct login karein aur form skip karein.
        const existingData = userDocSnap.data() as User;
        console.log("Welcome back, Warrior!");
        
        login(existingData.role, existingData);
        
        // Role ke hisaab se redirect karein
        if (existingData.role === "student") {
          navigate("/dashboard");
        } else {
          navigate("/alumni-portal");
        }
      } else {
        // 2. Naya User hai! Form dikhayein
        if (selectedRole === "student") {
          setStudentDetails({
            name: user.displayName || "",
            email: user.email || "",
            college: "",
            location: "",
            avatar: user.photoURL || ""
          });
          setShowStudentForm(true);
        } else {
          // Alumni direct save (Optional: You can also show form for Alumni)
          const alumniUser = {
            id: user.uid,
            uid: user.uid,
            name: user.displayName || "Alumni",
            email: user.email || "",
            role: "alumni" as UserRole,
            avatar: user.photoURL || "",
            trustScore: 900,
            rank: "Gold",
            skillDNA: "Strategist"
          };
          await setDoc(userDocRef, alumniUser);
          login("alumni", alumniUser as any);
          navigate("/alumni-portal");
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
    }
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />
      
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <Link to="/" className="absolute top-4 left-4">
        <Button variant="ghost" size="sm" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="glass-card border-border/50">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-2xl">SS</span>
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">
              Welcome to Samarth<span className="gradient-text">Saarthi</span>
            </CardTitle>
            <CardDescription className="text-base">
              Trust. Skills. Proof.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!showStudentForm ? (
              <div>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-center text-muted-foreground">
                    Select your role to continue
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRoleSelect("student")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedRole === "student"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <GraduationCap className={`w-8 h-8 mx-auto mb-2 ${
                        selectedRole === "student" ? "text-primary" : "text-muted-foreground"
                      }`} />
                      <p className="font-medium text-sm">Student</p>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleRoleSelect("alumni")}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedRole === "alumni"
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <Briefcase className={`w-8 h-8 mx-auto mb-2 ${
                        selectedRole === "alumni" ? "text-primary" : "text-muted-foreground"
                      }`} />
                      <p className="font-medium text-sm">Alumni</p>
                    </motion.button>
                  </div>
                </div>
                
                <Button
                  onClick={handleGoogleSignIn}
                  disabled={!selectedRole}
                  size="lg"
                  className="w-full gap-3 h-12 mt-6"
                  variant={selectedRole ? "default" : "secondary"}
                >
                  <Chrome className="w-5 h-5" />
                  Sign in with Google
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm font-medium text-center text-muted-foreground">
                  Complete your Warrior Profile
                </p>
                <div className="space-y-3">
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Full Name" 
                      className="pl-10"
                      value={studentDetails.name}
                      onChange={(e) => setStudentDetails({...studentDetails, name: e.target.value})}
                    />
                  </div>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Email" 
                      className="pl-10"
                      readOnly 
                      value={studentDetails.email}
                    />
                  </div>
                  <div className="relative">
                    <GraduationCapIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="College/University" 
                      className="pl-10"
                      value={studentDetails.college}
                      onChange={(e) => setStudentDetails({...studentDetails, college: e.target.value})}
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      placeholder="Location" 
                      className="pl-10"
                      value={studentDetails.location}
                      onChange={(e) => setStudentDetails({...studentDetails, location: e.target.value})}
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleStudentLogin}
                  disabled={!studentDetails.college || !studentDetails.location}
                  size="lg"
                  className="w-full h-12"
                >
                  Enter Command Center
                </Button>
                
                <Button
                  variant="link"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowStudentForm(false)}
                >
                  Change Role
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}