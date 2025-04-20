import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
  isWalletConnected: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length > 0) {
          setIsWalletConnected(true);
          console.log("Wallet connected:", accounts[0]);
          // You might want to store the connected account in state if needed
        } else {
          setIsWalletConnected(false);
        }
      } catch (error: any) {
        console.error("Error connecting wallet:", error.message);
        setIsWalletConnected(false);
        // Handle connection errors (user rejected, etc.)
      }

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setIsWalletConnected(accounts.length > 0);
        console.log("Accounts changed:", accounts);
        // Update user or account info if needed
      });

      // Listen for chain changes (optional)
      window.ethereum.on('chainChanged', (chainId: string) => {
        console.log("Chain changed:", chainId);
        // Handle chain ID changes if relevant to your app
      });
    } else {
      console.log("No Ethereum provider found. Please install MetaMask or another wallet.");
      setIsWalletConnected(false);
      // Optionally display a message to the user
    }
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    console.log("Wallet disconnected");
    // You might want to clear any stored wallet information
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    const checkPreviousConnection = async () => {
      if (window.ethereum && (await window.ethereum.request({ method: 'eth_accounts' })).length > 0) {
        setIsWalletConnected(true);
        console.log("Wallet previously connected");
      }
    };

    checkPreviousConnection();

    // Cleanup auth subscription
    return () => unsubscribeAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      setIsWalletConnected(false); // Also disconnect wallet on logout
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isWalletConnected,
    connectWallet,
    disconnectWallet,
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};