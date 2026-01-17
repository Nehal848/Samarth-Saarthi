import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { Navbar } from "./components/layout/Navbar";

// Pages
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import VerifySkills from "./pages/VerifySkills";
import Learning from "./pages/Learning";
import BountyBoard from "./pages/BountyBoard";
import OpportunityRadar from "./pages/OpportunityRadar";
import AlumniPortal from "./pages/AlumniPortal";
import NotFound from "./pages/NotFound";
import NexusFeed from "./pages/NexusFeed";
import AptitudeLab from "./pages/AptitudeLab";

const queryClient = new QueryClient();

// Layout component to conditionally render Navbar
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Define routes where navbar should not be shown
  const noNavbarRoutes = ["/", "/auth"];
  
  const showNavbar = !noNavbarRoutes.includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Layout>
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/verify-skills" element={<VerifySkills />} />
                <Route path="/learning" element={<Learning />} />
                <Route path="/bounty-board" element={<BountyBoard />} />
                <Route path="/opportunity-radar" element={<OpportunityRadar />} />
                <Route path="/alumni-portal" element={<AlumniPortal />} />
                <Route path="/nexus-feed" element={<NexusFeed />} />
                <Route path="/aptitude-lab" element={<AptitudeLab />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;