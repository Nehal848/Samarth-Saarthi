import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode
} from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

export type UserRole = "student" | "alumni";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  skillDNA: "Executor" | "Architect" | "Researcher";
  trustScore: number;
  nexusCredits: number;
  alphaCredits: number;
  verifiedBadges: any[];
  whatsapp?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isNewUser: boolean;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  completeStudentProfile: (data: {
    whatsapp: string;
    college: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isNewUser, setIsNewUser] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setIsNewUser(false);
        return;
      }

      const ref = doc(db, "users", firebaseUser.uid);

      // Real-time listener
      const unsubDoc = onSnapshot(ref, (snap) => {
        if (!snap.exists()) {
          setIsNewUser(true);
          return;
        }
        setUser({ id: firebaseUser.uid, ...snap.data() } as User);
        setIsNewUser(false);
      });

      return () => unsubDoc();
    });

    return () => unsub();
  }, []);

  const loginWithGoogle = async (role: UserRole) => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const u = result.user;

    const ref = doc(db, "users", u.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        name: u.displayName,
        email: u.email,
        avatar: u.photoURL,
        role,
        skillDNA: role === "student" ? "Executor" : "Architect",
        trustScore: role === "student" ? 700 : 0,
        nexusCredits: role === "student" ? 500 : 0,
        alphaCredits: 0,
        verifiedBadges: [],
        createdAt: serverTimestamp()
      });
      setIsNewUser(true);
    }
  };

  const completeStudentProfile = async (data: {
    whatsapp: string;
    college: string;
  }) => {
    if (!auth.currentUser) return;

    await updateDoc(doc(db, "users", auth.currentUser.uid), {
      whatsapp: data.whatsapp,
      college: data.college
    });

    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    setUser({ id: auth.currentUser.uid, ...snap.data() } as User);
    setIsNewUser(false);
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isNewUser,
        loginWithGoogle,
        completeStudentProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
