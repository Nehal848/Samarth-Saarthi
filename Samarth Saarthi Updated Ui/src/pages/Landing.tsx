import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, 
  BadgeCheck, 
  ArrowLeftRight, 
  Target, 
  Users,
  Sparkles,
  Zap,
  Shield,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

const features = [
  {
    icon: BadgeCheck,
    title: "AI-Verified Skills",
    description: "Get your skills verified through AI-powered Lightning Interviews. No resume fluff — real proof.",
  },
  {
    icon: ArrowLeftRight,
    title: "Peer Skill Swap",
    description: "Teach what you know. Learn what you need. Build reputation through dual-rated exchanges.",
  },
  {
    icon: Target,
    title: "Bounty Board",
    description: "Complete micro-tasks, earn credits. Every submission AI-verified before payout.",
  },
  {
    icon: Users,
    title: "Talent Discovery",
    description: "Recruiters find verified talent, not keyword-stuffed resumes. Signal over noise.",
  },
];

const stats = [
  { value: "50K+", label: "Verified Students" },
  { value: "120K+", label: "Skills Verified" },
  { value: "25K+", label: "Skills Learned" },
  { value: "98%", label: "Verification Accuracy" },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#000000]">
      {/* Landing Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))]/80 backdrop-blur-xl shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FCA311] to-[#F77F00] flex items-center justify-center">
              <span className="text-foreground font-bold text-lg">SS</span>
            </div>
            <span className="text-xl font-bold text-foreground">
              Samarth<span className="font-normal">Sarthi</span>
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link to="/auth">
              <Button variant="outline" size="sm" className="border-[#FCA311] text-primary hover:bg-[#FCA311]/10">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="bg-[#FCA311] hover:bg-[#e0920f] text-foreground">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-background">
        
        {/* Floating elements */}
        <motion.div
          className="absolute top-40 left-20 w-20 h-20 rounded-full gradient-bg opacity-20 blur-2xl"
          animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-40 right-20 w-32 h-32 rounded-full bg-accent opacity-20 blur-2xl"
          animate={{ y: [0, 20, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--card))]/80 border border-[#FCA311]/30 shadow-sm mb-8 premium-glass"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Powered by Gemini AI</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-foreground"
            >
              <span className="text-primary">Trust.</span>{" "}
              <span className="text-primary">Skills.</span>{" "}
              <span className="text-foreground">Proof.</span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              An AI-verified peer learning ecosystem for college campuses. 
              Get skills verified. Teach & learn. Earn credentials that matter.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/auth">
                <Button size="lg" className="bg-[#FCA311] hover:bg-[#e0920f] text-foreground px-8 group shadow-card hover:shadow-card-hover transition-all duration-300">
                  Start Learning
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="lg" variant="outline" className="border-[#FCA311] text-primary hover:bg-[#FCA311]/10 px-8 shadow-card hover:shadow-card-hover transition-all duration-300">
                  I'm a Recruiter
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-[hsl(var(--border)/0.3)] bg-surface">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center p-4 bg-[hsl(var(--card))]/50 rounded-xl premium-glass shadow-sm"
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Everything you need to <span className="text-primary">prove your skills</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for students who want more than grades. For recruiters who want real signals.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] hover:shadow-card-hover transition-all duration-300 premium-border premium-card"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FCA311] to-[#F77F00] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-surface">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              How the <span className="text-primary">AI Interview</span> works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              5 questions. 10 minutes. One verified badge that proves you know your stuff.
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", title: "Choose a Skill", desc: "Select from 100+ technical and soft skills" },
              { step: "02", title: "AI Interview", desc: "Gemini asks adaptive questions based on your responses" },
              { step: "03", title: "Get Verified", desc: "Earn a badge with confidence score visible to recruiters" },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex-1 relative bg-[hsl(var(--card))]/50 p-6 rounded-xl premium-glass shadow-sm"
              >
                <div className="text-6xl font-bold text-primary opacity-50 mb-2">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
                {index < 2 && (
                  <ChevronRight className="hidden md:block absolute top-8 -right-4 w-8 h-8 text-primary/30" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-[#000000]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="flex items-center justify-center gap-4 mb-8"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--card))]/80 border border-[#FCA311]/20 shadow-sm">
                <Shield className="w-5 h-5 text-foreground" />
                <span className="text-sm font-medium text-foreground">Trusted & Verified</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--card))]/80 border border-[#6AA2E0]/20 shadow-sm">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered</span>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold mb-6 text-foreground"
            >
              Join the future of <span className="text-primary">verified learning</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Link to="/auth">
                <Button size="lg" className="bg-[#FCA311] hover:bg-[#e0920f] text-foreground px-12 group shadow-card hover:shadow-card-hover transition-all duration-300">
                  Get Started — It's Free
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[hsl(var(--border)/0.3)] bg-[#000000]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#FCA311] to-[#F77F00] flex items-center justify-center">
                <span className="text-foreground font-bold text-xs">SS</span>
              </div>
              <span className="text-sm text-muted-foreground">
                © 2024 SamarthSarthi AI. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="hover:text-foreground cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-foreground cursor-pointer transition-colors">Contact</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}