import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'student' | 'alumni' | null;

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  skillDNA: 'Executor' | 'Architect' | 'Researcher';
  trustScore: number;
  nexusCredits: number;
  alphaCredits: number;
  verifiedBadges: VerifiedBadge[];
}

export interface VerifiedBadge {
  id: string;
  skill: string;
  score: number;
  verifiedAt: string;
  confidence: 'high' | 'medium' | 'low';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole, customUser?: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demo
const mockStudentUser: User = {
  id: '1',
  name: 'Alex Chen',
  email: 'alex.chen@university.edu',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  role: 'student',
  skillDNA: 'Executor',
  trustScore: 847,
  nexusCredits: 1250,
  alphaCredits: 500,
  verifiedBadges: [
    { id: '1', skill: 'React.js', score: 92, verifiedAt: '2024-01-15', confidence: 'high' },
    { id: '2', skill: 'Python', score: 85, verifiedAt: '2024-01-10', confidence: 'high' },
    { id: '3', skill: 'Machine Learning', score: 78, verifiedAt: '2024-01-08', confidence: 'medium' },
    { id: '4', skill: 'UI/UX Design', score: 88, verifiedAt: '2024-01-05', confidence: 'high' },
  ],
};

const mockAlumniUser: User = {
  id: '2',
  name: 'Sarah Johnson',
  email: 'sarah.johnson@techcorp.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  role: 'alumni',
  skillDNA: 'Architect',
  trustScore: 0,
  nexusCredits: 0,
  alphaCredits: 0,
  verifiedBadges: [],
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole, customUser?: User) => {
    // Clear VerifySkills state from localStorage on login
    localStorage.removeItem("samarthSaarthiVerifySkillsState");
    if (customUser) {
      setUser(customUser);
    } else {
      if (role === 'student') {
        setUser(mockStudentUser);
      } else if (role === 'alumni') {
        setUser(mockAlumniUser);
      }
    }
  };

  const logout = () => {
    setUser(null);
    // Clear VerifySkills state from localStorage on logout
    localStorage.removeItem("samarthSaarthiVerifySkillsState");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}