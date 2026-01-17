import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Legend, ReferenceLine, Dot, ReferenceDot 
} from "recharts";
import { 
  GitBranch, Trophy, Target, TrendingUp, Calendar, 
  Star, ExternalLink, Github, Code, Award 
} from "lucide-react";
import { motion } from "framer-motion";

// Define types
type SkillDataPoint = {
  date: string;
  level: number;
  skill: string;
};

// External contribution types
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

type Milestone = {
  id: string;
  date: string;
  title: string;
  description: string;
  type: "project" | "contest" | "certification" | "achievement";
  skill?: string;
  externalLink?: string;
};

type LearningCurveProps = {
  skills: string[];
  overallData: SkillDataPoint[];
  skillData: Record<string, SkillDataPoint[]>;
  milestones: Milestone[];
  externalContributions: ExternalContribution[];
};

// Icon mapping for milestone types
const getMilestoneIcon = (type: string) => {
  switch (type) {
    case "project": return <Github className="w-4 h-4" />;
    case "contest": return <Trophy className="w-4 h-4" />;
    case "certification": return <Award className="w-4 h-4" />;
    case "achievement": return <Target className="w-4 h-4" />;
    default: return <Code className="w-4 h-4" />;
  }
};

// Platform image mapping
const getPlatformImage = (platform: string) => {
  switch (platform) {
    case "github":
      return "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png";
    case "leetcode":
      return "https://leetcode.com/static/images/LeetCode_logo_rvs.png";
    case "codechef":
      return "https://www.codechef.com/sites/all/themes/abessive/logo.svg";
    case "hackerrank":
      return "https://upload.wikimedia.org/wikipedia/commons/4/40/HackerRank_Icon-1000px.png";
    default:
      return "https://via.placeholder.com/16x16/8B5CF6/FFFFFF?text=?";
  }
};

// Color mapping for platforms
const getPlatformColor = (platform: string) => {
  const colors: Record<string, string> = {
    "github": "#181717",
    "leetcode": "#FFA116",
    "codechef": "#5D5D5D",
    "hackerrank": "#2EC866"
  };
  
  return colors[platform] || "#8B5CF6";
};

// Color mapping for skills
const getSkillColor = (skill: string) => {
  const colors: Record<string, string> = {
    "React": "#61DAFB",
    "Python": "#3776AB",
    "Machine Learning": "#FF6F00",
    "Data Structures": "#764ABC",
    "System Design": "#00BFA5",
    "UI/UX Design": "#FF5252",
    "Node.js": "#68A063",
    "TypeScript": "#3178C6",
    "SQL": "#00758F",
    "AWS": "#FF9900",
    "overall": "#8B5CF6"
  };
  
  return colors[skill] || "#8B5CF6";
};

const LearningCurve: React.FC<LearningCurveProps> = ({ 
  skills, 
  overallData, 
  skillData, 
  milestones,
  externalContributions
}) => {
  const [selectedSkill, setSelectedSkill] = useState<string>("overall");
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [activeDrawer, setActiveDrawer] = useState(false);

  const currentData = selectedSkill === "overall" ? overallData : skillData[selectedSkill] || [];

  const handleMilestoneClick = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setActiveDrawer(true);
  };

  // Function to get platform data for the chart
  const getPlatformData = (platform: string) => {
    const platformContribs = externalContributions.filter(c => c.platform === platform);
    const allDates = [...new Set([...currentData.map(d => d.date), ...platformContribs.map(c => c.date)])].sort();
    
    return allDates.map(date => {
      const contrib = platformContribs.find(c => c.date === date);
      const skillDataPoint = currentData.find(d => d.date === date);
      
      return {
        date,
        level: skillDataPoint ? skillDataPoint.level : 0,
        [platform]: contrib ? 1 : 0,
        contrib: contrib || null
      };
    });
  };
  
  const CustomDot = (props: any) => {
    const { cx, cy, payload, dataKey } = props;
    
    // Check if this point has a milestone
    const milestone = milestones.find(m => m.date === payload.date);
    
    // Check if this point has external contributions
    const contribs = externalContributions.filter(c => c.date === payload.date);
    
    if (milestone) {
      return (
        <g>
          <Dot
            {...props}
            r={8}
            fill={getSkillColor(milestone.skill || selectedSkill)}
            stroke="#fff"
            strokeWidth={2}
            onClick={() => handleMilestoneClick(milestone)}
            className="cursor-pointer hover:scale-110 transition-transform"
          />
          <circle
            cx={cx}
            cy={cy}
            r={12}
            fill="none"
            stroke={getSkillColor(milestone.skill || selectedSkill)}
            strokeWidth={2}
            strokeDasharray="4 4"
            className="opacity-50"
          />
        </g>
      );
    }
    
    // If no milestone but has external contributions, show them
    if (contribs.length > 0) {
      const contrib = contribs[0]; // Show first contribution
      return (
        <g>
          <Dot
            {...props}
            r={6}
            fill={getPlatformColor(contrib.platform)}
            stroke="#fff"
            strokeWidth={2}
            className="cursor-pointer hover:scale-110 transition-transform"
          />
          <foreignObject x={cx - 8} y={cy - 8} width="16" height="16">
            <img 
              src={getPlatformImage(contrib.platform)} 
              alt={contrib.platform}
              className="w-full h-full rounded-full border border-white"
            />
          </foreignObject>
        </g>
      );
    }
    
    return (
      <Dot
        {...props}
        r={4}
        fill={getSkillColor(selectedSkill)}
        className="hover:scale-125 transition-transform"
      />
    );
  };
  
  // Custom tooltip for external contributions
  const CustomExternalTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const date = payload[0].payload.date;
      const contribs = externalContributions.filter(c => c.date === date);
      
      if (contribs.length > 0) {
        return (
          <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
            <p className="font-medium mb-1">External Contributions</p>
            {contribs.map((contrib) => (
              <div key={contrib.id} className="text-sm mb-1 last:mb-0">
                <div className="flex items-center gap-2">
                  <img 
                    src={getPlatformImage(contrib.platform)} 
                    alt={contrib.platform}
                    className="w-4 h-4 rounded"
                  />
                  <span className="font-medium">{contrib.platform}</span>
                </div>
                <p className="text-muted-foreground">{contrib.title}</p>
                <p className="text-xs text-muted-foreground">{contrib.skill} • {contrib.date}</p>
                {contrib.details && (
                  <p className="text-xs text-muted-foreground">{contrib.details.commits ? `${contrib.details.commits} commits` : 
                    contrib.details.streak ? `${contrib.details.streak} day streak` : 
                    contrib.details.difficulty ? `Difficulty: ${contrib.details.difficulty}` : 
                    contrib.details.rating ? `Rating: ${contrib.details.rating}` : 
                    ''}</p>
                )}
              </div>
            ))}
          </div>
        );
      }
    }
    
    return null;
  };

  return (
    <Card className="glass-card h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <CardTitle className="text-xl">Learning Curve</CardTitle>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={selectedSkill} onValueChange={setSelectedSkill}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select skill" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overall">Overall Growth</SelectItem>
              {skills.map(skill => (
                <SelectItem key={skill} value={skill}>{skill}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={currentData}
              margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
              <XAxis 
                dataKey="date" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                tick={{ fontSize: 12 }}
              />
              <YAxis 
                domain={[0, 6]} 
                tickCount={7}
                tickFormatter={(value) => `${value}★`}
                tick={{ fontSize: 12 }}
              />
              <Tooltip 
                formatter={(value) => [`${value}★`, "Skill Level"]}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.5rem'
                }}
                content={<CustomExternalTooltip />}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="level"
                stroke={getSkillColor(selectedSkill)}
                strokeWidth={2}
                dot={<CustomDot />}
                activeDot={{ r: 6 }}
                name={`${selectedSkill} Skill Level`}
              />
              
              {/* Platform contribution dots - only show when selectedSkill is 'overall' */}
              {selectedSkill === 'overall' && externalContributions.length > 0 && (
                <>
                  {['github', 'leetcode', 'codechef', 'hackerrank'].map((platform) => {
                    const platformContribs = externalContributions.filter(c => c.platform === platform);
                    if (platformContribs.length === 0) return null;
                    
                    return platformContribs.map((contrib, idx) => {
                      const skillLevel = currentData.find(d => d.date === contrib.date)?.level || 0;
                      
                      return (
                        <ReferenceDot
                          key={`${contrib.id}-${idx}`}
                          x={contrib.date}
                          y={skillLevel + 0.3} // Offset to scatter dots slightly above the skill line
                          r={0} // We'll handle the dot in a custom component
                          className="cursor-pointer"
                        >
                          <g transform={`translate(${0}, ${-10})`}>
                            <foreignObject x={-8} y={-8} width="16" height="16">
                              <img 
                                src={getPlatformImage(contrib.platform)} 
                                alt={contrib.platform}
                                className="w-full h-full rounded-full border border-white"
                              />
                            </foreignObject>
                          </g>
                        </ReferenceDot>
                      );
                    });
                  })}
                </>
              )}
              
              {/* Milestone markers */}
              {milestones
                .filter(m => {
                  if (selectedSkill === "overall") return true;
                  return m.skill === selectedSkill;
                })
                .map((milestone, index) => (
                  <ReferenceDot
                    key={milestone.id}
                    x={milestone.date}
                    y={currentData.find(d => d.date === milestone.date)?.level || 0}
                    r={0} // We're handling the dot in CustomDot
                    onClick={() => handleMilestoneClick(milestone)}
                    className="cursor-pointer"
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-current text-white" />
            <Star className="w-3 h-3 fill-current text-white" />
            <Star className="w-3 h-3 fill-current text-white" />
            <Star className="w-3 h-3 fill-current text-white" />
            <Star className="w-3 h-3 fill-current text-white" />
            <span>5★ = Expert</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-current text-white" />
            <Star className="w-3 h-3 fill-current text-white" />
            <Star className="w-3 h-3 fill-current text-white" />
            <Star className="w-3 h-3 fill-current text-white" />
            <span>4★ = Proficient</span>
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Star className="w-3 h-3 fill-current text-white" />
            <Star className="w-3 h-3 fill-current text-white" />
            <Star className="w-3 h-3 fill-current text-white" />
            <span>3★ = Competent</span>
          </Badge>
        </div>
      </CardContent>
      
      {/* Milestone Drawer */}
      <Drawer open={activeDrawer} onOpenChange={setActiveDrawer}>
        <DrawerContent className="max-h-[80vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center gap-2">
              {selectedMilestone && (
                <>
                  {getMilestoneIcon(selectedMilestone.type)}
                  <span>{selectedMilestone.title}</span>
                </>
              )}
            </DrawerTitle>
          </DrawerHeader>
          <div className="p-6 overflow-y-auto">
            {selectedMilestone && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{selectedMilestone.date}</span>
                  </div>
                  {selectedMilestone.skill && (
                    <Badge variant="outline">{selectedMilestone.skill}</Badge>
                  )}
                </div>
                
                <p className="text-muted-foreground">{selectedMilestone.description}</p>
                
                {selectedMilestone.externalLink && (
                  <div className="pt-4">
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => window.open(selectedMilestone.externalLink, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View on External Platform
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </Card>
  );
};

export default LearningCurve;