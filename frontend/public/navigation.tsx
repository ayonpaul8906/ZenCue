"use client"

import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet"
import { Menu, Search, Wallet } from "lucide-react"
import { Link } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { useAccount, useChainId, useSwitchChain } from 'wagmi';
import { sepolia } from 'viem/chains';

import WalletInfo from './WalletInfo';
import SubscriptionPayment from './SubscriptionPayment';
import Transactions from './Transactions';

import '../styles/globals.css';

export function Navigation() {
  const { address, isConnected } = useAccount();
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();

  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

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
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">NeuroAid</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link to="/screen" className="transition-colors hover:text-foreground/80 text-foreground">
              Simplify Screen
            </Link>
            <Link to="/sell" className="transition-colors hover:text-foreground/80 text-foreground">
              Prompt Buddy
            </Link>
            <Link to="/governance" className="transition-colors hover:text-foreground/80 text-foreground">
              Settings
            </Link>
            <Link to="/profile" className="transition-colors hover:text-foreground/80 text-foreground">
              Profile
            </Link>
          </nav>
        </div>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <nav className="grid gap-6 px-2 py-6">
              <Link to="/browse" className="hover:text-foreground/80">
                Simplify Screen
              </Link>
              <Link to="/sell" className="hover:text-foreground/80">
                Prompt Buddy
              </Link>
              <Link to="/governance" className="hover:text-foreground/80">
                Settings
              </Link>
              <Link to="/profile" className="hover:text-foreground/80">
                Profile
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search prompts..." className="pl-8 md:w-[300px] lg:w-[400px]" />
            </div>
          </div>
          <Button variant="outline" className="ml-auto hidden md:flex text-black" onClick={() => setShowPopup((prev) => !prev)}>
            <Wallet className="mr-2 h-5 w-5" />
          </Button>
          <Button variant="outline" className="hidden md:flex bg-black text-white hover:bg-gray-800 hover:text-slate-100">
            <Link to="/login" className="flex items-center">
              SignIn
            </Link>
          </Button>

          {showPopup && (
            <div
              ref={popupRef}
              className="fixed top-20 right-6 w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-700 shadow-2xl z-40 overflow-hidden max-h-[80vh] flex flex-col"
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

                <WalletInfo />
                {isConnected && (
                  <>
                    <SubscriptionPayment />
                    <Transactions address={address!} />
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
