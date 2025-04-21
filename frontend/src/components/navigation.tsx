"use client";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { Monitor, Cpu, Menu, Search, Wallet, Home, Info, Brain } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useAccount, useChainId, useSwitchChain, useDisconnect } from "wagmi"; // Added useDisconnect
import { sepolia } from "viem/chains";

import WalletInfo from "./WalletInfo";
import SubscriptionPayment from "./SubscriptionPayment";
import Transactions from "./Transactions";

import "../styles/globals.css";
import { useAuth } from "../hooks/AuthContext";
import { toast } from "react-hot-toast"; 

export function Navigation() {
  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  const { disconnect } = useDisconnect(); // Added disconnect function
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const { user, logout } = useAuth(); // Access user and logout from AuthContext

  // Alert sound
  const playAlertSound = () => {
    const audio = new Audio("../../public/alert-sound.mp3"); // Replace with the path to your alert sound file
    audio.play();
  };

  useEffect(() => {
    if (isConnected && currentChainId !== sepolia.id) {
      console.log(`Switching to Sepolia (chainId: ${sepolia.id})...`);
      switchChain({ chainId: sepolia.id });
    }
  }, [isConnected, currentChainId, switchChain]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRestrictedAccess = () => {
    playAlertSound(); // Play alert sound
    toast.error("You need to log in to access this feature!"); // Show toast notification
  };

  const handleLogout = () => {
    logout(); // Log out the user
    disconnect(); // Disconnect the wallet
    toast.success("You have been logged out and wallet disconnected!"); // Show success notification
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo (always visible) */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/Wlogo.png" alt="ZenCue Logo" className="h-12 w-auto pt-[2px]" />
          <span className="font-bold text-base sm:text-lg">ZenCue</span>
        </Link>

        {/* Desktop Nav (hidden on small screens) */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium flex-1 ml-6">
          <Link to="/" className="transition-colors hover:text-foreground/80 text-foreground">
            Home
          </Link>
          <Link to="/about" className="transition-colors hover:text-foreground/80 text-foreground">
            About
          </Link>
          <Link
            to={user ? "/screen" : "#"}
            onClick={!user ? handleRestrictedAccess : undefined}
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            Smart Explain
          </Link>
          <Link
            to={user ? "/chatbot" : "#"}
            onClick={!user ? handleRestrictedAccess : undefined}
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            Prompt Buddy
          </Link>
          <Link
            to={user ? "/profile" : "#"}
            onClick={!user ? handleRestrictedAccess : undefined}
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            Profile
          </Link>
          <Link
            to={user ? "/resources" : "#"}
            onClick={!user ? handleRestrictedAccess : undefined}
            className="transition-colors hover:text-foreground/80 text-foreground"
          >
            MindZone
          </Link>
        </nav>

        {/* Desktop Search + Wallet */}
        <div className="hidden lg:flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={() => {
              if (!user) {
                handleRestrictedAccess();
              } else {
                setShowPopup((prev) => !prev);
              }
            }}
          >
            <Wallet className="mr-2 h-4 w-4" />
            {isConnected ? `${address?.slice(0, 6)}...${address?.slice(-4)}` : "Connect Wallet"}
          </Button>

          {/* Show Logout if logged in, otherwise Sign In */}
          {user ? (
            <Button
              variant="outline"
              onClick={handleLogout} // Call handleLogout function
              className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 hover:text-white"
            >
              Logout
            </Button>
          ) : (
            <Button
              variant="outline"
              className="px-4 py-2 bg-black text-white hover:bg-gray-800 hover:text-white"
            >
              <Link to="/login">Sign In</Link>
            </Button>
          )}
        </div>

        {/* Mobile Section */}
        <div className="flex lg:hidden items-center space-x-2">
          {/* Hamburger */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-[#E6E6FA] p-6">
              <nav className="grid gap-4">
                <Link to="/" className="flex items-center space-x-3 hover:text-purple-700">
                  <Home className="h-5 w-5" />
                  <span>Home</span>
                </Link>
                <Link to="/about" className="flex items-center space-x-3 hover:text-purple-700">
                  <Info className="h-5 w-5" />
                  <span>About</span>
                </Link>
                <Link
                  to={user ? "/screen" : "#"}
                  onClick={!user ? handleRestrictedAccess : undefined}
                  className="flex items-center space-x-3 hover:text-purple-700"
                >
                  <Monitor className="h-5 w-5" />
                  <span>Smart Explain</span>
                </Link>
                <Link
                  to={user ? "/chatbot" : "#"}
                  onClick={!user ? handleRestrictedAccess : undefined}
                  className="flex items-center space-x-3 hover:text-purple-700"
                >
                  <Cpu className="h-5 w-5" />
                  <span>Prompt Buddy</span>
                </Link>
                <Link
                  to={user ? "/profile" : "#"}
                  onClick={!user ? handleRestrictedAccess : undefined}
                  className="flex items-center space-x-3 hover:text-purple-700"
                >
                  <span className="text-lg">👤</span>
                  <span>Profile</span>
                </Link>
                <Link
                  to={user ? "/resources" : "#"}
                  onClick={!user ? handleRestrictedAccess : undefined}
                  className="flex items-center space-x-3 hover:text-purple-700"
                >
                  <Brain className="h-5 w-5" />
                  <span>MindZone</span>
                </Link>
              </nav>
              <Button
                  variant="outline"
                  className="mt-4 flex items-center space-x-2 px-8 py-3 bg-purple-800 text-white hover:bg-purple-900"
                  onClick={() =>{ setShowPopup((prev) => !prev);setSheetOpen(false);}}>
                  <Wallet className="h-5 w-5" />
                </Button>

              {/* Show Logout if logged in, otherwise Sign In */}
              {user ? (
                <Button
                  className="mt-4 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600"
                  onClick={() => {
                    handleLogout(); // Call handleLogout function
                    setSheetOpen(false);
                  }}
                >
                  Logout
                </Button>
              ) : (
                <Button className="mt-4 bg-purple-800 text-white px-6 py-3 rounded-lg hover:bg-purple-900">
                  <Link to="/login">Sign In</Link>
                </Button>
              )}
            </SheetContent>
          </Sheet>
        </div>
        {showPopup && (
          <div
            ref={popupRef}
            className="fixed top-20 right-6 w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl z-100 overflow-hidden max-h-[80vh] flex flex-col"
          >
            <div className="p-6 space-y-6 overflow-y-auto scrollbar">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-white">Wallet Panel</h2>
                <button
                  onClick={() => setShowPopup(false)}
                  className="text-gray-400 hover:text-white text-lg"
                >
                  ✕
                </button>
              </div>

              {/* Wallet Features: Only accessible if logged in */}
              {user ? (
                <>
                  <WalletInfo />
                  {isConnected && (
                    <>
                      <SubscriptionPayment />
                      <Transactions address={address!} />
                    </>
                  )}
                </>
              ) : (
                <p className="text-white text-center">
                  Please <Link to="/login" className="text-blue-400 underline">log in</Link> to access wallet features.
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Search input (toggled by search icon) */}
      {showMobileSearch && (
        <div className="px-4 pb-2 lg:hidden">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              autoFocus
              placeholder="Search keywords..."
              className="pl-8 w-full"
              onBlur={() => setShowMobileSearch(false)}
            />
          </div>
        </div>
      )}
    </header>
  );
}