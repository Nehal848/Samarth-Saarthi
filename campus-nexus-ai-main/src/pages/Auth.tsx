import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Chrome, GraduationCap, Briefcase, ArrowLeft, User as UserIcon, Mail, GraduationCap as GraduationCapIcon, MapPin, Building2 } from "lucide-react";
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

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === "student") {
      setShowStudentForm(true);
    } else {
      // For alumni, we can proceed directly
      login(role);
      navigate(role === "alumni" ? "/alumni-portal" : "/dashboard");
    }
  };

  const handleStudentLogin = () => {
    if (studentDetails.name && studentDetails.email) {
      // Create a mock user object with the student details
      const mockUser: User = {
        id: "1",
        name: studentDetails.name,
        email: studentDetails.email,
        role: "student" as UserRole,
        avatar: studentDetails.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${studentDetails.name}`,
        skillDNA: "Executor",
        trustScore: 750,
        nexusCredits: 1000,
        alphaCredits: 250,
        verifiedBadges: []
      };
      
      // Login with the mock user
      login("student", mockUser);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background effects */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-hero-pattern opacity-30" />
      
      {/* Theme toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Back button */}
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
            {/* Logo */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl gradient-bg flex items-center justify-center shadow-glow">
                <span className="text-white font-bold text-2xl">CN</span>
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
            {/* Role Selection */}
            {!showStudentForm ? (
              <div>
                <div className="space-y-3">
                  <p className="text-sm font-medium text-center text-muted-foreground">
                    Select your role
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
                      <p className="text-xs text-muted-foreground">Learn & Teach</p>
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
                      <p className="font-medium text-sm">Alumni / Recruiter</p>
                      <p className="text-xs text-muted-foreground">Discover Talent</p>
                    </motion.button>
                  </div>
                </div>
                
                {/* Google Sign-In Button - Only shown if not showing student form */}
                <Button
                  onClick={() => {
                    if (selectedRole === 'alumni') {
                      login(selectedRole);
                      navigate(selectedRole === "alumni" ? "/alumni-portal" : "/dashboard");
                    }
                  }}
                  disabled={!selectedRole}
                  size="lg"
                  className="w-full gap-3 h-12 mt-6"
                  variant={selectedRole ? "default" : "secondary"}
                >
                  <Chrome className="w-5 h-5" />
                  Continue with Google
                </Button>
              </div>
            ) : (
              /* Student Details Form */
              <div className="space-y-4">
                <p className="text-sm font-medium text-center text-muted-foreground">
                  Enter your details
                </p>
                
                <div className="space-y-3">
                  <div className="relative">
                    <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="text" 
                      placeholder="Full Name" 
                      className="pl-10"
                      value={studentDetails.name}
                      onChange={(e) => setStudentDetails({...studentDetails, name: e.target.value})}
                    />
                  </div>
                  
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="email" 
                      placeholder="Email" 
                      className="pl-10"
                      value={studentDetails.email}
                      onChange={(e) => setStudentDetails({...studentDetails, email: e.target.value})}
                    />
                  </div>
                  
                  <div className="relative">
                    <GraduationCapIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="text" 
                      placeholder="College/University" 
                      className="pl-10"
                      value={studentDetails.college}
                      onChange={(e) => setStudentDetails({...studentDetails, college: e.target.value})}
                    />
                  </div>
                  
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input 
                      type="text" 
                      placeholder="Location" 
                      className="pl-10"
                      value={studentDetails.location}
                      onChange={(e) => setStudentDetails({...studentDetails, location: e.target.value})}
                    />
                  </div>
                </div>
                
                <Button
                  onClick={handleStudentLogin}
                  disabled={!studentDetails.name || !studentDetails.email}
                  size="lg"
                  className="w-full gap-3 h-12"
                  variant={studentDetails.name && studentDetails.email ? "default" : "secondary"}
                >
                  Continue
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowStudentForm(false)}
                >
                  Back to Role Selection
                </Button>
              </div>
            )}

            {/* Terms */}
            <p className="text-xs text-center text-muted-foreground">
              By continuing, you agree to our{" "}
              <span className="underline cursor-pointer hover:text-foreground">Terms of Service</span>{" "}
              and{" "}
              <span className="underline cursor-pointer hover:text-foreground">Privacy Policy</span>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}