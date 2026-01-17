import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Radar, Search, Filter, X, Target, Users, Clock, MapPin, GraduationCap, Coins, Star, Globe, CheckCircle2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

// Define types
interface Opportunity {
  id: string;
  title: string;
  skills: string[];
  type: 'Internship' | 'Job' | 'Research';
  deadline?: string;
  duration?: string;
  location: string;
  description: string;
}

// Mock data for opportunities
const mockOpportunities: Opportunity[] = [
  { 
    id: "1", 
    title: "React.js Frontend Developer Internship", 
    skills: ["React.js", "TypeScript", "Tailwind CSS"], 
    type: "Internship", 
    deadline: "2024-02-15", 
    duration: "3 months",
    location: "Remote",
    description: "Build responsive dashboards for financial analytics with real-time data visualization."
  },
  { 
    id: "2", 
    title: "Machine Learning Research Position", 
    skills: ["Python", "PyTorch", "NLP"], 
    type: "Research", 
    deadline: "2024-03-20", 
    duration: "6 months",
    location: "IIT Delhi",
    description: "Develop novel approaches to natural language understanding for academic research."
  },
  { 
    id: "3", 
    title: "UI/UX Design Internship", 
    skills: ["Figma", "User Research", "Prototyping"], 
    type: "Internship", 
    duration: "2 months",
    location: "Bangalore",
    description: "Create user-centered designs for fintech applications following industry best practices."
  },
  { 
    id: "4", 
    title: "Backend Developer Job Opening", 
    skills: ["Node.js", "Express", "MongoDB"], 
    type: "Job", 
    deadline: "2024-01-30", 
    duration: "Full-time",
    location: "Hyderabad",
    description: "Create scalable REST APIs for e-commerce platforms with authentication and payments."
  },
  { 
    id: "5", 
    title: "Data Science Research Assistant", 
    skills: ["Python", "Pandas", "Matplotlib"], 
    type: "Research", 
    duration: "4 months",
    location: "Mumbai",
    description: "Analyze large datasets to develop predictive models for market trends."
  }
];

export default function OpportunityRadar() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter states
  const [showFilters, setShowFilters] = useState(false);
  
  // Create opportunity modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [opportunityTitle, setOpportunityTitle] = useState("");
  const [opportunityType, setOpportunityType] = useState<"Internship" | "Job" | "Research">("Internship");
  const [opportunitySkills, setOpportunitySkills] = useState("");
  const [opportunityDescription, setOpportunityDescription] = useState("");
  const [opportunityDeadline, setOpportunityDeadline] = useState("");
  const [opportunityDuration, setOpportunityDuration] = useState("");
  const [opportunityLocation, setOpportunityLocation] = useState("");
  const [opportunityUrl, setOpportunityUrl] = useState("");
  
  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
    // Note: Alumni are allowed to view this page to search for talent
  }, [isAuthenticated, user?.role, navigate]);

  // Filter opportunities based on search only (no filters)
  const filteredOpportunities = mockOpportunities.filter(opp => {
    // Search filter
    const matchesSearch = searchQuery === "" || 
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesSearch;
  });

  return (
    <PageWrapper className="bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-foreground">
              <Radar className="w-6 h-6 text-primary" />
              Opportunity Radar
            </h1>
            <p className="text-muted-foreground">Find serious opportunities — not scroll aimlessly.</p>
          </div>
          
          <Button className="flex items-center gap-2 bg-[#FCA311] hover:bg-[#e0920f] text-foreground shadow-card hover:shadow-card-hover transition-all duration-300" onClick={() => setShowCreateModal(true)}>
            <Target className="w-4 h-4" />
            Create Opportunity
          </Button>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground" />
            <Input 
              placeholder="Search for skills, events, keywords..." 
              className="pl-10 py-6 text-lg bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.3)] shadow-sm rounded-xl focus:ring-2 focus:ring-[#6AA2E0]/30 focus:border-[#6AA2E0]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        {/* Results Count */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-muted-foreground">
            {filteredOpportunities.length} of {mockOpportunities.length} opportunities
          </span>
        </div>
        
        {/* Results Section */}
        <div className="space-y-4">
          {filteredOpportunities.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-1">No matching opportunities found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
            </div>
          ) : (
            filteredOpportunities.map((opportunity, index) => (
              <motion.div
                key={opportunity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] hover:shadow-card-hover transition-all duration-300 premium-border premium-card">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-lg text-foreground">{opportunity.title}</h3>
                          <Badge variant="outline">{opportunity.type}</Badge>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {opportunity.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3">
                          {opportunity.description}
                        </p>
                        
                        <div className="flex flex-wrap gap-4 text-sm">
                          {opportunity.deadline && (
                            <span className="flex items-center gap-1 text-muted-foreground">
                              <Clock className="w-4 h-4 text-primary" />
                              Deadline: {opportunity.deadline}
                            </span>
                          )}
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-4 h-4 text-primary" />
                            {opportunity.location}
                          </span>
                          {opportunity.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {opportunity.duration}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button size="sm" className="w-full bg-[#FCA311] hover:bg-[#e0920f] text-foreground shadow-card hover:shadow-card-hover transition-all duration-300">
                          Apply Now
                        </Button>
                        <Button size="sm" variant="outline" className="w-full border-[#FCA311] text-primary hover:bg-[#FCA311]/10">
                          Save for Later
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
      
      {/* Create Opportunity Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-[hsl(var(--card))] rounded-xl w-full max-w-2xl border border-[hsl(var(--border)/0.3)] shadow-card premium-glass max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Create New Opportunity</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowCreateModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Opportunity Title</label>
                  <Input 
                    placeholder="e.g., Frontend Developer Internship" 
                    className="bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.3)] rounded-lg focus:ring-2 focus:ring-[#6AA2E0]/30 focus:border-[#6AA2E0]"
                    value={opportunityTitle}
                    onChange={(e) => setOpportunityTitle(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Opportunity Type</label>
                    <select 
                      className="w-full p-2 border border-[hsl(var(--border)/0.3)] rounded-lg bg-[hsl(var(--card))] focus:outline-none focus:ring-2 focus:ring-[#6AA2E0]/30 focus:border-[#6AA2E0]"
                      value={opportunityType}
                      onChange={(e) => setOpportunityType(e.target.value as "Internship" | "Job" | "Research")}
                    >
                      <option value="Internship">Internship</option>
                      <option value="Job">Job</option>
                      <option value="Research">Research</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Location</label>
                    <Input 
                      placeholder="e.g., Remote, Bangalore" 
                      className="bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.3)] rounded-lg focus:ring-2 focus:ring-[#6AA2E0]/30 focus:border-[#6AA2E0]"
                      value={opportunityLocation}
                      onChange={(e) => setOpportunityLocation(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Required Skills</label>
                  <Input 
                    placeholder="e.g., React, TypeScript, Tailwind CSS" 
                    className="bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.3)] rounded-lg focus:ring-2 focus:ring-[#6AA2E0]/30 focus:border-[#6AA2E0]"
                    value={opportunitySkills}
                    onChange={(e) => setOpportunitySkills(e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Duration</label>
                    <Input 
                      placeholder="e.g., 3 months, 6 months" 
                      className="bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.3)] rounded-lg focus:ring-2 focus:ring-[#6AA2E0]/30 focus:border-[#6AA2E0]"
                      value={opportunityDuration}
                      onChange={(e) => setOpportunityDuration(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Deadline (Optional)</label>
                    <Input 
                      type="date"
                      className="bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.3)] rounded-lg focus:ring-2 focus:ring-[#6AA2E0]/30 focus:border-[#6AA2E0]"
                      value={opportunityDeadline}
                      onChange={(e) => setOpportunityDeadline(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Description</label>
                  <textarea 
                    className="w-full p-2 border border-[hsl(var(--border)/0.3)] rounded-lg bg-[hsl(var(--card))] focus:outline-none focus:ring-2 focus:ring-[#6AA2E0]/30 min-h-[100px]"
                    placeholder="Describe the opportunity..."
                    value={opportunityDescription}
                    onChange={(e) => setOpportunityDescription(e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Opportunity URL</label>
                  <Input 
                    type="url"
                    placeholder="https://example.com/opportunity" 
                    className="bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.3)] rounded-lg focus:ring-2 focus:ring-[#6AA2E0]/30 focus:border-[#6AA2E0]"
                    value={opportunityUrl}
                    onChange={(e) => setOpportunityUrl(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2 pt-4">
                  <Button 
                    className="flex-1 bg-[#FCA311] hover:bg-[#e0920f] text-foreground shadow-card hover:shadow-card-hover transition-all duration-300" 
                    onClick={() => {
                      // Here you would typically submit the form to an API
                      console.log({
                        title: opportunityTitle,
                        type: opportunityType,
                        location: opportunityLocation,
                        skills: opportunitySkills,
                        duration: opportunityDuration,
                        deadline: opportunityDeadline,
                        description: opportunityDescription,
                        url: opportunityUrl
                      });
                      
                      // Reset form
                      setOpportunityTitle("");
                      setOpportunityType("Internship");
                      setOpportunityLocation("");
                      setOpportunitySkills("");
                      setOpportunityDuration("");
                      setOpportunityDeadline("");
                      setOpportunityDescription("");
                      setOpportunityUrl("");
                      
                      setShowCreateModal(false);
                      
                      // In a real app, you would add the new opportunity to the list
                      // For now, just show an alert
                      alert(`Opportunity created: ${opportunityTitle}`);
                    }}
                  >
                    Create Opportunity
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-[#FCA311] text-primary hover:bg-[#FCA311]/10" 
                    onClick={() => setShowCreateModal(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}