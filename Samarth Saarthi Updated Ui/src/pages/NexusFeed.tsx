import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Target, Users, Briefcase, ArrowRight, Code, GraduationCap, Building2, MapPin, Clock, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";

// Define types
type FeedItem = {
  id: string;
  type: "hackathon" | "research" | "general" | "team";
  title: string;
  description: string;
  skills: string[];
  location?: string;
  institution?: string;
  timestamp: string;
  deadline?: string; // Added deadline field
  teacherLevel?: string; // Teacher level for learning sessions
  duration?: string; // Duration for learning sessions
  alphaCredits?: number; // Alpha Credits cost for learning sessions
  user: {
    name: string;
    avatar: string;
  };
};

// Define filter types
type Filters = {
  skills: string[];
  location: string;
  institution: string;
  deadlineProximity: 'any' | 'this-week' | 'this-month' | 'past-due';
  type: 'all' | 'hackathon' | 'research' | 'general' | 'team';
};

export default function NexusFeed() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    skills: [],
    location: '',
    institution: '',
    deadlineProximity: 'any',
    type: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/auth");
  }, [isAuthenticated, navigate]);

  // Load feed items
  useEffect(() => {
    // Mock feed data based on user's skills and interests
    const mockFeedItems: FeedItem[] = [
      {
        id: "1",
        type: "general",
        title: "Looking for Project Partner - Full Stack Development",
        description: "I'm working on a personal project and need a partner to collaborate on a full-stack application. Looking for someone interested in React and Node.js.",
        skills: ["React", "Node.js", "JavaScript"],
        institution: "IIT Delhi",
        timestamp: "2 hours ago",
        user: {
          name: "Rahul Sharma",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
        }
      },
      {
        id: "2",
        type: "hackathon",
        title: "Smart India Hackathon - Backend Developer Needed",
        description: "Looking for a backend developer with Node.js and MongoDB experience to join our team for the Smart India Hackathon competition.",
        skills: ["Node.js", "MongoDB", "Express"],
        institution: "IIT Delhi",
        deadline: "2024-02-15",
        timestamp: "2 hours ago",
        user: {
          name: "Rahul Sharma",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rahul"
        }
      },
      {
        id: "3",
        type: "general",
        title: "Looking for TypeScript Mentor",
        description: "I'm learning TypeScript and need guidance from someone experienced. Looking for a mentor to help me understand advanced concepts.",
        skills: ["TypeScript", "JavaScript", "Type Safety"],
        timestamp: "3 hours ago",
        user: {
          name: "Priya Patel",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
        }
      },
      {
        id: "4",
        type: "team",
        title: "Looking for UI/UX partner from IIT Delhi",
        description: "I'm building a startup and need a UI/UX designer who's passionate about creating beautiful interfaces. Looking for someone from IIT Delhi.",
        skills: ["UI/UX Design", "Figma", "Prototyping"],
        institution: "IIT Delhi",
        deadline: "2024-03-10",
        timestamp: "5 hours ago",
        user: {
          name: "Priya Patel",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya"
        }
      },
      {
        id: "5",
        type: "research",
        title: "System Design Research Partner Needed",
        description: "Looking for a research partner interested in studying scalable SaaS architectures. Need someone with experience in microservices and distributed systems.",
        skills: ["System Design", "Architecture", "Scalability"],
        timestamp: "4 hours ago",
        user: {
          name: "Dr. Ankit Gupta",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ankit"
        }
      },
      {
        id: "6",
        type: "research",
        title: "ML Research Collaboration - NLP Focus",
        description: "Looking for a collaborator for research in natural language processing. Working on open-source ML library with focus on improving NLP models.",
        skills: ["Python", "Machine Learning", "NLP"],
        location: "Remote",
        deadline: "2024-04-20",
        timestamp: "1 day ago",
        user: {
          name: "Dr. Ankit Gupta",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ankit"
        }
      },
      {
        id: "7",
        type: "general",
        title: "Node.js Performance Optimization Partner",
        description: "Looking for a partner to collaborate on Node.js performance optimization. Need someone experienced with profiling and scaling techniques.",
        skills: ["Node.js", "Performance", "Optimization"],
        timestamp: "5 hours ago",
        user: {
          name: "Sneha Verma",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha"
        }
      },
      {
        id: "8",
        type: "hackathon",
        title: "React Native App for Hackathon - Developer Needed",
        description: "Looking for a React Native expert to help complete a cross-platform mobile app for an upcoming hackathon competition.",
        skills: ["React Native", "TypeScript", "Redux"],
        deadline: "2024-02-28",
        timestamp: "2 days ago",
        user: {
          name: "Sneha Verma",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha"
        }
      },
      {
        id: "9",
        type: "general",
        title: "AWS Cloud Architecture Project Partner",
        description: "Looking for a partner to work on AWS cloud architecture projects. Need someone experienced in designing scalable cloud solutions.",
        skills: ["AWS", "Cloud Architecture", "DevOps"],
        timestamp: "6 hours ago",
        user: {
          name: "Amit Kumar",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit"
        }
      },
      {
        id: "10",
        type: "team",
        title: "Looking for Frontend Developer for Startup",
        description: "Early-stage startup seeking a frontend developer with React and TypeScript skills to join our founding team.",
        skills: ["React", "TypeScript", "CSS"],
        institution: "Delhi University",
        deadline: "2024-03-05",
        timestamp: "3 days ago",
        user: {
          name: "Amit Kumar",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit"
        }
      },
      {
        id: "11",
        type: "general",
        title: "DSA Study Group - Interview Prep",
        description: "Looking for people to form a study group for data structures and algorithms. Perfect for interview preparation and competitive programming.",
        skills: ["Data Structures", "Algorithms", "Problem Solving"],
        timestamp: "7 hours ago",
        user: {
          name: "Open Source Team",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=OpenSource"
        }
      },
      {
        id: "12",
        type: "general",
        title: "Open Source Collaboration - React Library",
        description: "Looking for contributors to help improve our popular React component library by fixing bugs and adding new features.",
        skills: ["React", "JavaScript", "TypeScript"],
        location: "Remote",
        deadline: "2024-05-15",
        timestamp: "4 days ago",
        user: {
          name: "Open Source Team",
          avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=OpenSource"
        }
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setFeedItems(mockFeedItems);
      setFilteredItems(mockFeedItems); // Initially show all items
      setLoading(false);
    }, 500);
  }, []);

  // Filter items based on search query and filters
  useEffect(() => {
    let result = [...feedItems];
    
    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.skills.some(skill => skill.toLowerCase().includes(query)) ||
        (item.institution && item.institution.toLowerCase().includes(query)) ||
        (item.location && item.location.toLowerCase().includes(query)) ||
        (item.deadline && item.deadline.toLowerCase().includes(query))
      );
    }
    
    // Apply type filter
    if (filters.type !== 'all') {
      result = result.filter(item => item.type === filters.type);
    }
    
    // Apply skills filter
    if (filters.skills.length > 0) {
      result = result.filter(item => 
        filters.skills.every(filterSkill => 
          item.skills.some(skill => 
            skill.toLowerCase().includes(filterSkill.toLowerCase())
          )
        )
      );
    }
    
    // Apply location filter
    if (filters.location) {
      result = result.filter(item => 
        item.location && item.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }
    
    // Apply institution filter
    if (filters.institution) {
      result = result.filter(item => 
        item.institution && item.institution.toLowerCase().includes(filters.institution.toLowerCase())
      );
    }
    
    // Apply deadline proximity filter
    if (filters.deadlineProximity !== 'any') {
      const now = new Date();
      result = result.filter(item => {
        if (!item.deadline) return true; // If no deadline, include it
        
        const deadline = new Date(item.deadline);
        const diffTime = deadline.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        switch (filters.deadlineProximity) {
          case 'this-week':
            return diffDays >= 0 && diffDays <= 7;
          case 'this-month':
            return diffDays >= 0 && diffDays <= 30;
          case 'past-due':
            return diffDays < 0;
          default:
            return true;
        }
      });
    }
    
    setFilteredItems(result);
  }, [searchQuery, filters, feedItems]);

  const handleApply = (id: string) => {
    console.log(`Applied to feed item: ${id}`);
    // In a real app, this would navigate to the application page
    // navigate(`/apply/${id}`);
  };

  const handlePostRequirement = () => {
    // In a real app, this would navigate to the post requirement page
    // For now, just log
    console.log("Posting a new requirement");
  };

  // Get icon based on feed item type
  const getIcon = (type: string) => {
    switch (type) {
      case "hackathon": return <Target className="w-5 h-5 text-primary" />;
      case "team": return <Users className="w-5 h-5 text-success" />;
      case "research": return <Briefcase className="w-5 h-5 text-warning" />;
      case "general": return <GraduationCap className="w-5 h-5 text-info" />;
      default: return <Code className="w-5 h-5 text-primary" />;
    }
  };

  // Get badge variant based on type
  const getTypeBadge = (type: string) => {
    switch (type) {
      case "hackathon": return <Badge variant="outline" className="bg-primary/10 text-primary">Hackathon</Badge>;
      case "team": return <Badge variant="outline" className="bg-success/10 text-success">Team</Badge>;
      case "research": return <Badge variant="outline" className="bg-warning/10 text-warning">Research</Badge>;
      case "general": return <Badge variant="outline" className="bg-info/10 text-info">General</Badge>;
      default: return <Badge variant="outline">Post</Badge>;
    }
  };

  if (!user) return null;

  return (
    <PageWrapper className="bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Nexus Feed
          </h1>
          <p className="text-muted-foreground">
            Opportunities finding you, not the other way around
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-muted-foreground" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-3 ps-10 border border-[hsl(var(--border)/0.3)] rounded-xl bg-[hsl(var(--card))] focus:outline-none focus:ring-2 focus:ring-[#6AA2E0]/30 focus:border-[#6AA2E0] shadow-sm"
              placeholder="Explore..."
            />
          </div>
          
          {/* Filters Toggle */}
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border-[hsl(var(--border)/0.3)] text-foreground"
            >
              <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 10h12m-6-3V4m0 12v-3m6-6H4m6 3V4m0 12v-3" />
              </svg>
              Filters {showFilters ? 'Hide' : 'Show'}
            </Button>
            
            <span className="text-sm text-muted-foreground">
              {filteredItems.length} of {feedItems.length} opportunities
            </span>
          </div>
          
          {/* Collapsible Filters */}
          {showFilters && (
            <div className="p-4 rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] space-y-4 premium-glass shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Type Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">Explore</label>
                  <select 
                    value={filters.type}
                    onChange={(e) => setFilters({...filters, type: e.target.value as any})}
                    className="w-full p-2 border border-[hsl(var(--border)/0.3)] rounded-lg bg-[hsl(var(--card))] focus:outline-none focus:ring-2 focus:ring-[#6AA2E0]/30 focus:border-[#6AA2E0]"
                  >
                    <option value="all">All Types</option>
                    <option value="hackathon">Hackathon</option>
                    <option value="research">Research</option>
                    <option value="general">General</option>
                    <option value="team">Team</option>
                  </select>
                </div>
                
                {/* Skills Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">Skills</label>
                  <input
                    type="text"
                    value={filters.skills.join(',')}
                    onChange={(e) => setFilters({...filters, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
                    placeholder="e.g., React, Python"
                    className="w-full p-2 border border-[hsl(var(--border)/0.3)] rounded-lg bg-[hsl(var(--card))] focus:outline-none focus:ring-2 focus:ring-[#6AA2E0]/30 focus:border-[#6AA2E0]"
                  />
                </div>
                
                {/* Location Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">Location</label>
                  <input
                    type="text"
                    value={filters.location}
                    onChange={(e) => setFilters({...filters, location: e.target.value})}
                    placeholder="e.g., Remote, Delhi"
                    className="w-full p-2 border border-[hsl(var(--border)/0.3)] rounded-lg bg-[hsl(var(--card))] focus:outline-none focus:ring-2 focus:ring-[#6AA2E0]/30 focus:border-[#6AA2E0]"
                  />
                </div>
                
                {/* Institution Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">Institution</label>
                  <input
                    type="text"
                    value={filters.institution}
                    onChange={(e) => setFilters({...filters, institution: e.target.value})}
                    placeholder="e.g., IIT Delhi"
                    className="w-full p-2 border border-[hsl(var(--border)/0.3)] rounded-lg bg-[hsl(var(--card))] focus:outline-none focus:ring-2 focus:ring-[#6AA2E0]/30 focus:border-[#6AA2E0]"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {/* Deadline Proximity Filter */}
                <div>
                  <label className="block text-sm font-medium mb-1 text-foreground">Deadline</label>
                  <select 
                    value={filters.deadlineProximity}
                    onChange={(e) => setFilters({...filters, deadlineProximity: e.target.value as any})}
                    className="w-full p-2 border border-[hsl(var(--border)/0.3)] rounded-lg bg-[hsl(var(--card))] focus:outline-none focus:ring-2 focus:ring-[#6AA2E0]/30 focus:border-[#6AA2E0]"
                  >
                    <option value="any">Any Deadline</option>
                    <option value="this-week">This Week</option>
                    <option value="this-month">This Month</option>
                    <option value="past-due">Past Due</option>
                  </select>
                </div>
                
                {/* Reset Filters */}
                <div className="flex items-end">
                  <Button 
                    variant="outline" 
                    onClick={() => setFilters({
                      skills: [],
                      location: '',
                      institution: '',
                      deadlineProximity: 'any',
                      type: 'all'
                    })}
                    className="w-full border-[#FCA311] text-primary hover:bg-[#FCA311]/10"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Feed Items */}
        <div className="space-y-4">
          {loading ? (
            // Loading state
            Array.from({ length: 3 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] p-4 shadow-sm premium-card">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <div className="w-5 h-5 bg-muted-foreground/20 rounded animate-pulse" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-1/3"></div>
                      <div className="h-6 bg-muted-foreground/20 rounded animate-pulse w-2/3"></div>
                      <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-full"></div>
                      <div className="h-4 bg-muted-foreground/20 rounded animate-pulse w-4/5"></div>
                      <div className="flex gap-2 mt-3">
                        <div className="h-6 w-16 bg-muted-foreground/20 rounded animate-pulse"></div>
                        <div className="h-6 w-20 bg-muted-foreground/20 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="rounded-xl border border-[hsl(var(--border)/0.3)] bg-[hsl(var(--card))] hover:shadow-card-hover transition-all duration-300 premium-border premium-card">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {getIcon(item.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeBadge(item.type)}
                          <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                          {item.deadline && (
                            <span className="text-xs text-muted-foreground">• Deadline: {item.deadline}</span>
                          )}
                        </div>
                        
                        <h3 className="font-semibold text-lg mb-1 text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{item.description}</p>
                        
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.skills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {item.institution && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1 text-muted-foreground border-[hsl(var(--border)/0.3)]">
                              <GraduationCap className="w-3 h-3 text-primary" />
                              {item.institution}
                            </Badge>
                          )}
                          {item.location && (
                            <Badge variant="outline" className="text-xs flex items-center gap-1 text-muted-foreground border-[hsl(var(--border)/0.3)]">
                              <MapPin className="w-3 h-3 text-primary" />
                              {item.location}
                            </Badge>
                          )}



                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex items-center gap-2 bg-[#FCA311] hover:bg-[#e0920f] text-foreground shadow-card hover:shadow-card-hover transition-all duration-300"
                            onClick={() => handleApply(item.id)}
                          >
                            Apply <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Post Requirement Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Button 
            size="lg"
            className="flex items-center gap-2 bg-[#FCA311] hover:bg-[#e0920f] text-foreground shadow-card hover:shadow-card-hover transition-all duration-300"
            onClick={handlePostRequirement}
          >
            <Target className="w-5 h-5" />
            Post a New Requirement
          </Button>
        </motion.div>
      </div>
    </PageWrapper>
  );
}