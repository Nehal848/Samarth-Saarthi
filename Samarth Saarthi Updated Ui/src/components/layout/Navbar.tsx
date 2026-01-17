import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "./ThemeToggle";
import { 
  Home, 
  BadgeCheck, 
  Target, 
  ArrowLeftRight, 
  Radar, 
  Users, 
  GraduationCap, 
  Menu, 
  X,
  TrendingUp,
  Coins,
  LogOut,
  Settings,
  Brain
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export const Navbar = () => {
  const { user, logout, updateUserCredits } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isTrustVisibilityOpen, setIsTrustVisibilityOpen] = useState(false);
  const [isCreditConverterOpen, setIsCreditConverterOpen] = useState(false);
  const [conversionDirection, setConversionDirection] = useState<'nexusToAlpha' | 'alphaToNexus'>('nexusToAlpha');
  const [convertAmount, setConvertAmount] = useState('');

  const isActive = (path: string) => location.pathname === path;

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (isUserMenuOpen) setIsUserMenuOpen(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isUserMenuOpen]);

  // Define navigation items based on user role
  const getNavItems = () => {
    if (user && user.role === 'alumni') {
      // For alumni, only show Alumni Portal (not dashboard)
      return [
        { path: "/alumni-portal", label: "Alumni Portal", icon: Users },
      ];
    } else {
      // For students, show all sections except Alumni Portal
      return [
        { path: "/dashboard", label: "Dashboard", icon: Home },
        { path: "/nexus-feed", label: "Nexus Feed", icon: TrendingUp },
        { path: "/verify-skills", label: "Verify Skills", icon: BadgeCheck },
        { path: "/learning", label: "Learning", icon: GraduationCap },
        { path: "/bounty-board", label: "Bounty Board", icon: Target },
        { path: "/opportunity-radar", label: "Opportunity Radar", icon: Radar },
        { path: "/aptitude-lab", label: "Aptitude Lab", icon: Brain },
      ];
    }
  };

  const navItems = getNavItems();

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FCA311] to-[#F77F00] flex items-center justify-center">
                <span className="text-foreground font-bold text-lg">SS</span>
              </div>
              <span className="text-xl font-bold text-foreground">
                Samarth<span className="font-normal">Sarthi</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <div key={item.path} className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all relative ${isActive(item.path) ? 'bg-[#FCA311] text-foreground' : 'text-foreground hover:bg-[#14213D]/50'}`}
                  >
                    <Link to={item.path}>
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  </Button>
                  {isActive(item.path) && (
                    <div className="absolute -bottom-1 left-0 right-0 h-1 bg-[#FCA311] rounded-full"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Right side - Auth/User info */}
            <div className="flex items-center gap-3">
              <ThemeToggle />
              
              {user ? (
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-8 w-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                  
                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 w-56 rounded-md border bg-popover p-2 text-popover-foreground shadow-lg z-50"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="p-2 border-b">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <div className="p-2 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Trust</span>
                            <Badge variant="secondary" className="bg-karma/10 text-karma border-karma/20">
                              {user.trustScore}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Nexus</span>
                            <Badge variant="secondary" className="bg-credits/10 text-credits border-credits/20">
                              {user.nexusCredits}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm">Alpha</span>
                            <Badge variant="secondary" className="bg-[hsl(var(--alpha-credits))]/10 text-[hsl(var(--alpha-credits))] border-[hsl(var(--alpha-credits))]/20">
                              {user.alphaCredits}
                            </Badge>
                          </div>
                        </div>
                        <div className="p-2 pt-0 space-y-2">
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              setIsTrustVisibilityOpen(true);
                              setIsUserMenuOpen(false);
                            }}
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            Trust & Visibility
                          </Button>
                          <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={() => {
                              setIsCreditConverterOpen(true);
                              setIsUserMenuOpen(false);
                            }}
                          >
                            <Coins className="w-4 h-4 mr-2" />
                            Credit Converter
                          </Button>
                          <Button
                            variant="destructive"
                            className="w-full justify-start"
                            onClick={logout}
                          >
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
              )}
              
              {/* Mobile menu button */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="md:hidden" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden overflow-hidden"
              >
                <div className="py-4 space-y-2 border-t">
                  {navItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className={`w-full justify-start rounded-full ${isActive(item.path) ? 'bg-[#FCA311] text-foreground' : 'text-foreground'}`}
                      asChild
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link to={item.path}>
                        {typeof item.icon === 'function' ? <item.icon className="w-4 h-4 mr-2" /> : <div className="mr-2">{item.icon}</div>}
                        {item.label}
                      </Link>
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>
      
      {/* Trust and Visibility Modal */}
      <AnimatePresence>
        {isTrustVisibilityOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setIsTrustVisibilityOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-background rounded-lg w-full max-w-md border"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">Trust & Visibility</h3>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => setIsTrustVisibilityOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Email Address</label>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-sm">{user?.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">WhatsApp</p>
                      <p className="text-sm text-muted-foreground">Allow others to contact you</p>
                    </div>
                    <div className="flex items-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  </div>
                  
                  <Button className="w-full">
                    Request Permission
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Credit Converter Modal */}
      <Dialog open={isCreditConverterOpen} onOpenChange={setIsCreditConverterOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Credit Converter</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Conversion Direction</label>
              <ToggleGroup
                type="single"
                value={conversionDirection}
                onValueChange={(value: 'nexusToAlpha' | 'alphaToNexus') => value && setConversionDirection(value)}
                className="w-full justify-between"
              >
                <ToggleGroupItem value="nexusToAlpha" className="flex-1 data-[state=on]:bg-[#FCA311] data-[state=on]:text-foreground">
                  Nexus → Alpha
                </ToggleGroupItem>
                <ToggleGroupItem value="alphaToNexus" className="flex-1 data-[state=on]:bg-[#FCA311] data-[state=on]:text-foreground">
                  Alpha → Nexus
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Amount to Convert</label>
              <Input
                type="number"
                min="1"
                placeholder="Enter amount"
                value={convertAmount}
                onChange={(e) => setConvertAmount(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Available Source</p>
                <p className="text-lg font-semibold">
                  {conversionDirection === 'nexusToAlpha' ? user?.nexusCredits : user?.alphaCredits}
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Available Destination</p>
                <p className="text-lg font-semibold">
                  {conversionDirection === 'nexusToAlpha' ? user?.alphaCredits : user?.nexusCredits}
                </p>
              </div>
            </div>
            
            <Button 
              className="w-full"
              disabled={!convertAmount || isNaN(parseInt(convertAmount)) || parseInt(convertAmount) <= 0 || parseInt(convertAmount) > (conversionDirection === 'nexusToAlpha' ? user?.nexusCredits || 0 : user?.alphaCredits || 0)}
              onClick={() => {
                // Perform the credit conversion
                const amount = parseInt(convertAmount);
                if (user && convertAmount && !isNaN(amount) && amount > 0) {
                  if (amount <= (conversionDirection === 'nexusToAlpha' ? user.nexusCredits : user.alphaCredits)) {
                    // Calculate the deltas for credit update
                    let nexusDelta = 0;
                    let alphaDelta = 0;
                    
                    if (conversionDirection === 'nexusToAlpha') {
                      nexusDelta = -amount;
                      alphaDelta = amount;
                    } else {
                      nexusDelta = amount;
                      alphaDelta = -amount;
                    }
                    
                    // Update the user credits
                    updateUserCredits(nexusDelta, alphaDelta);
                    
                    // Close the modal and reset the form
                    setIsCreditConverterOpen(false);
                    setConvertAmount('');
                  }
                }
              }}
            >
              Convert Credits
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};