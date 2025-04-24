import { Button } from "./ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useSubscriptionPayment } from "../hooks/useSubscriptionPayment";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../hooks/AuthContext";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getFirestore, doc, setDoc, onSnapshot, getDoc, serverTimestamp } from "firebase/firestore";
import { app } from "../lib/firebase";
import type { SubscriptionPlan } from '../hooks/useSubscriptionPayment';

interface UserData {
  freePlanClaimed?: boolean;
  hasStartedFreePlan?: boolean;
}

interface SubscriptionData {
  planId: number;
  status: 'active' | 'inactive';
}

// Simple icons using SVG for better accessibility
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" className="text-green-600">
    <circle cx="10" cy="10" r="9" strokeWidth="2" />
    <path d="M6.5 10L9 12.5L14 7.5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const PLAN_LIMITS: Record<string, {
  textexplanations: number;
  imageexplanations: number;
  chats: number;
  mindzone: boolean;
}> = {
  free: { textexplanations: 5, imageexplanations: 5, chats: 10, mindzone: false },
  silver: { textexplanations: 10, imageexplanations: 10, chats: 30, mindzone: true },
  gold: { textexplanations: 20, imageexplanations: 20, chats: 60, mindzone: true },
  platinum: { textexplanations: 30, imageexplanations: 30, chats: 100, mindzone: true },
  none: { textexplanations: 0, imageexplanations: 0, chats: 0, mindzone: false }
};

const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 1,
    title: "Free Plan",
    emoji: "🌱",
    color: "bg-blue-50",
    borderColor: "border-blue-200",
    buttonColor: "bg-blue-500 hover:bg-blue-600",
    description: "Get started with basic learning tools",
    features: [
      "Up to 5 text explanations (total)",
      "Up to 5 image explanations (total)",
      "Up to 10 chatbot interactions (total, text-only)",
      "No access to Mind Zone",
      "Basic learning games",
      "Standard support"
    ],
    price: "Free",
    ethValue: "0",
    limits: PLAN_LIMITS.free,
  },
  {
    id: 2,
    title: "Silver Plan",
    emoji: "🌟",
    color: "bg-purple-50",
    borderColor: "border-purple-200",
    buttonColor: "bg-purple-500 hover:bg-purple-600",
    description: "More learning tools and fun games",
    features: [
      "Up to 10 text explanations per day (with sound)",
      "Up to 10 image explanations per day",
      "Up to 30 chatbot interactions per day (text & voice)",
      "Fun games in Mind Zone",
      "Reading timer with highlights",
      "Reading helpers",
      "Join the community"
    ],
    price: "0.005 ETH",
    ethValue: "0.005",
    limits: PLAN_LIMITS.silver,
  },
  {
    id: 3,
    title: "Gold Plan",
    emoji: "✨",
    color: "bg-amber-50",
    borderColor: "border-amber-200",
    buttonColor: "bg-amber-500 hover:bg-amber-600",
    description: "Faster and more personalized learning",
    features: [
      "Up to 20 text explanations per day (fast)",
      "Up to 20 image explanations per day",
      "Up to 60 chatbot interactions per day (customizable)",
      "Special Mind Zone content",
      "Custom study timer",
      "Advanced reading tools",
      "Special learning events"
    ],
    price: "0.015 ETH",
    ethValue: "0.015",
    limits: PLAN_LIMITS.gold,
  },
  {
    id: 4,
    title: "Platinum Plan",
    emoji: "🏆",
    color: "bg-teal-50",
    borderColor: "border-teal-200",
    buttonColor: "bg-teal-500 hover:bg-teal-600",
    description: "The ultimate learning experience",
    features: [
      "Up to 30 text explanations per day (complex content)",
      "Up to 30 image explanations per day",
      "Up to 100 chatbot interactions per day (personalized)",
      "VIP Mind Zone access",
      "All focus tools",
      "Unlimited reading helpers",
      "Special community access"
    ],
    price: "0.08 ETH",
    ethValue: "0.08",
    limits: PLAN_LIMITS.platinum,
  }
];

export function SubscriptionPlan() {
  const { user, isWalletConnected, connectWallet } = useAuth();
  const [currentPlanId, setCurrentPlanId] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [freePlanClaimed, setFreePlanClaimed] = useState<boolean>(false);
  const firestore = getFirestore(app);

  useEffect(() => {
    if (!user?.uid) return;
  
    let userUnsubscribe: (() => void) | undefined;
    let subscriptionUnsubscribe: (() => void) | undefined;
  
    // Check if free plan is claimed
    const checkFreePlan = async () => {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data() as UserData;
          setFreePlanClaimed(!!userData.freePlanClaimed);
        }
      } catch (error) {
        console.error("Error checking free plan:", error);
      }
    };
  
    // Listen for subscription changes
    const setupSubscriptionListener = () => {
      const subscriptionRef = doc(firestore, 'subscriptions', user.uid);
      
      subscriptionUnsubscribe = onSnapshot(subscriptionRef, 
        (docSnapshot) => {
          if (docSnapshot.exists()) {
            const subscriptionData = docSnapshot.data() as SubscriptionData;
            
            if (subscriptionData.status === 'active') {
              setCurrentPlanId(subscriptionData.planId);
            } else {
              setCurrentPlanId(null);
            }
          } else {
            // No subscription found, check for free plan
            const userDocRef = doc(firestore, 'users', user.uid);
            
            userUnsubscribe = onSnapshot(userDocRef, 
              (userDocSnapshot) => {
                if (userDocSnapshot.exists()) {
                  const userData = userDocSnapshot.data() as UserData;
                  
                  if (userData?.hasStartedFreePlan) {
                    setCurrentPlanId(1); // Set free plan as current
                  } else {
                    setCurrentPlanId(null);
                  }
                }
              },
              (error) => {
                console.error("Error listening to user document:", error);
                setCurrentPlanId(null);
              }
            );
          }
        },
        (error) => {
          console.error("Error listening to subscription:", error);
          setCurrentPlanId(null);
        }
      );
    };
  
    // Initial setup
    checkFreePlan();
    setupSubscriptionListener();
  
    // Cleanup function
    return () => {
      if (subscriptionUnsubscribe) subscriptionUnsubscribe();
      if (userUnsubscribe) userUnsubscribe();
    };
  }, [user?.uid, firestore]);

  const handleRestrictedAccess = () => {
    toast.error("Please ask an adult to help you log in!");
  };

  const handleStartFree = async () => {
    if (!user?.uid) {
      handleRestrictedAccess();
      return;
    }
    try {
      // Store in subscriptions collection
      const subscriptionRef = doc(firestore, 'subscriptions', user.uid);
      await setDoc(subscriptionRef, {
        userId: user.uid,
        planId: 1,
        planTitle: 'Free',
        price: '0',
        ethValue: '0',
        purchaseDate: serverTimestamp(),
        status: 'active',
        limits: PLAN_LIMITS.free
      });

      // Also update user document
      const userRef = doc(firestore, 'users', user.uid);
      await setDoc(userRef, {
        hasStartedFreePlan: true,
        freePlanClaimed: true,
        totalTextExplanations: 0,
        totalImageExplanations: 0
      }, { merge: true });

      toast.success("Hooray! You're starting with the free plan!");
      setCurrentPlanId(1);
    } catch (error) {
      console.error("Error starting free plan:", error);
      toast.error("Oops! Something went wrong. Let's try again!");
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Toaster
          toastOptions={{
            style: {
              borderRadius: '10px',
              background: '#333',
              color: '#fff',
              fontSize: '16px',
              padding: '16px'
            }
          }}
        />

        <div className="mb-10 text-center">
          <motion.h2
            className="text-3xl font-bold text-purple-500 sm:text-4xl mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Choose Your Learning Adventure!
          </motion.h2>
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <p className="text-lg text-gray-600">
              Pick the plan that helps you learn best!
            </p>
          </motion.div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {subscriptionPlans.map((plan: SubscriptionPlan, index) => {
            const { initiatePayment, isPending } = useSubscriptionPayment(plan);
            const isCurrentPlan = currentPlanId === plan.id;
            const currentPlanHighlight = isCurrentPlan ?
              'ring-4 ring-green-400 border-green-400' : '';

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.4 }}
                onMouseEnter={() => setHoveredCard(plan.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card className={`${plan.color} border-2 ${isCurrentPlan ? 'border-green-400' : plan.borderColor}
                  rounded-2xl shadow-lg transition-all duration-300 ${currentPlanHighlight}
                  ${hoveredCard === plan.id && !isCurrentPlan ? 'transform translate-y-[-8px] shadow-xl' : ''}`}>

                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-0 right-0 mx-auto w-fit px-3 py-1 bg-green-500 text-white rounded-full text-sm font-bold">
                      Your Current Plan
                    </div>
                  )}

                  <CardHeader className="pb-2 text-center">
                    <div className="text-4xl mb-2">{plan.emoji}</div>
                    <CardTitle className="text-2xl font-bold text-gray-800">
                      {plan.title}
                    </CardTitle>
                    <p className="text-gray-600 font-medium">
                      {plan.description}
                    </p>
                  </CardHeader>

                  <CardContent>
                    <div className="text-center my-2">
                      <span className="text-2xl font-bold text-gray-800">
                        {plan.price === "Free" ? "Free" : plan.price}
                      </span>
                    </div>

                    <ul className="space-y-2 mt-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2 mt-1"><CheckIcon /></span>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>

                  <CardFooter className="pt-2">
                    {plan.ethValue !== "0" ? (
                      user ? (
                        isCurrentPlan ? (
                          <Button
                            className="w-full bg-green-500 text-white font-medium py-3 rounded-xl shadow-md cursor-default"
                            disabled
                          >
                            Your Current Plan
                          </Button>
                        ) : isWalletConnected ? (
                         <Button
                            className={`w-full ${plan.buttonColor} text-white font-medium py-3 rounded-xl shadow-md transition-all duration-200`}
                            onClick={async () => {
                              try {
                                await initiatePayment();
                              } catch (error) {
                                console.error("Payment failed:", error);
                                toast.error("Payment failed. Please try again.");
                              }
                            }}
                            disabled={isPending}
                          >
                            {isPending ? "Processing..." : "Choose Plan"}
                          </Button>
                        ) : (
                          <Button
                            className="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 rounded-xl shadow-md"
                            onClick={connectWallet}
                          >
                            Ask Adult to Connect Wallet
                          </Button>
                        )
                      ) : (
                        <Button
                          className="w-full bg-gray-400 hover:bg-gray-500 text-white font-medium py-3 rounded-xl shadow-md"
                          onClick={handleRestrictedAccess}
                        >
                          Log In First
                        </Button>
                      )
                    ) : (
                      user ? (
                        isCurrentPlan ? (
                          <Button
                            className="w-full bg-green-500 text-white font-medium py-3 rounded-xl shadow-md cursor-default"
                            disabled
                          >
                            Your Current Plan
                          </Button>
                        ) : !freePlanClaimed ? (
                          <Button
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl shadow-md"
                            onClick={handleStartFree}
                          >
                            Start Free Plan
                          </Button>
                        ) : null
                      ) : (
                        <Button
                          className="w-full bg-gray-400 hover:bg-gray-500 text-white font-medium py-3 rounded-xl shadow-md"
                          onClick={handleRestrictedAccess}
                        >
                          Log In First
                        </Button>
                      )
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500">
            Need help choosing? Ask an adult or <button className="text-blue-500 underline">contact our friendly support team</button>
          </p>
        </div>
      </div>
    </section>
  );
}
