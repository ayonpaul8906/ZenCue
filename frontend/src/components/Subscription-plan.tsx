import { Button } from "./ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useSubscriptionPayment } from "../hooks/useSubscriptionPayment";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../hooks/AuthContext"; // Assuming this is your modified AuthContext
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";
import { app } from "../lib/firebase"; // Assuming your Firebase app is initialized here

const featuredPrompts = [
  {
    id: 1,
    title: "Lite ",
    description: [
      "Limited word/sentence explanation with text & audio (few per day)",
      "Text-only chatbot, 5 queries per day",
      "No access to Mind Zone",
      "Basic features only",
    ],
    price: "Free",
    ethValue: "0",
    features: [
      "Limited explanations",
      "Basic chatbot (text only)",
      "No Mind Zone access",
      "Standard support",
    ],
  },
  {
    id: 2,
    title: "Silver",
    description: [
      "Unlimited word/sentence explanation with text & audio",
      "Full access to chatbot (text & audio, unlimited queries)",
      "Unlimited access to articles and videos in Mind Zone",
      "Pomodoro Timer with sentence highlighting",
      "Full access to Reading Aids",
      "Full community engagement",
    ],
    price: "0.005 ETH",
    ethValue: "0.005",
    features: [
      "Unlimited explanations (text & audio)",
      "Full chatbot access",
      "Mind Zone access",
      "Pomodoro Timer",
      "Reading Aids",
      "Community access",
    ],
  },
  {
    id: 3,
    title: "Gold",
    description: [
      "Priority access to word/sentence explanations (faster loading, early content)",
      "Customizable chatbot responses (text & audio)",
      "Exclusive articles and videos in Mind Zone",
      "Customizable Pomodoro Timer",
      "Advanced Text-to-Speech features",
      "Exclusive events and webinars",
    ],
    price: "0.015 ETH",
    ethValue: "0.012",
    features: [
      "Priority explanations",
      "Customizable chatbot",
      "Exclusive Mind Zone content",
      "Customizable Pomodoro Timer",
      "Advanced Text-to-Speech",
      "Exclusive community events",
    ],
  },
  {
    id: 4,
    title: "Platinum",
    description: [
      "Unlimited access to complex content explanations",
      "Personalized, ongoing chatbot responses",
      "VIP access to exclusive articles and videos in Mind Zone",
      "Full customization of Pomodoro Timer and focus tools",
      "Unlimited access to all Reading Aids with device sync",
      "Priority membership in the community with expert-led sessions",
    ],
    price: "0.08 ETH",
    ethValue: "0.020",
    features: [
      "Unlimited complex explanations",
      "Personalized chatbot",
      "VIP Mind Zone access",
      "Full Pomodoro & focus tools",
      "Unlimited Reading Aids (sync)",
      "Priority community membership",
    ],
  },
];

export function SubscriptionPlan() {
  const { user, isWalletConnected, connectWallet } = useAuth();
  const [freePlanClicked, setFreePlanClicked] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const firestore = getFirestore(app);

  useEffect(() => {
    if (user?.uid) {
      const userDocRef = doc(firestore, 'users', user.uid);
      const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          setFreePlanClicked(!!userData?.hasStartedFreePlan);
        } else {
          setFreePlanClicked(false);
        }
      });
      return () => unsubscribe();
    }
  }, [user?.uid, firestore]);

  const handleRestrictedAccess = () => {
    toast.error("You need to log in to interact with the plans!");
  };

  const handleStartFree = async () => {
    if (!user?.uid) {
      handleRestrictedAccess();
      return;
    }
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, { hasStartedFreePlan: true }, { merge: true });
      toast.success("You've started with the free plan!");
    } catch (error) {
      console.error("Error starting free plan:", error);
      toast.error("Failed to start the free plan. Please try again.");
    }
  };

  return (
    <section className="py-24 bg-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Toaster />
        <div className="mb-12 sm:mb-16">
          <h2 className="text-3xl font-bold text-center text-purple-400 sm:text-4xl">
            Unlock Your Potential with Our Plans
          </h2>
          <p className="mt-4 text-lg text-zinc-400 text-center">
            Choose the plan that best suits your neurodivergent journey.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {featuredPrompts.map((prompt, index) => {
            const { initiatePayment, isPending } = useSubscriptionPayment(prompt);
            const [flipped, setFlipped] = useState(false);

            return (
              <motion.div
                key={prompt.id}
                className="perspective"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.4 }}
              >
                <div
                  onMouseEnter={() => setFlipped(true)}
                  onMouseLeave={() => setFlipped(false)}
                  className="relative w-full h-auto min-h-[400px] cursor-pointer transform-style-preserve-3d transition-transform duration-500"
                  style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                >
                  {/* FRONT */}
                  <div className="absolute w-full h-full backface-hidden bg-zinc-800 border border-zinc-700 rounded-xl shadow-lg p-6 flex flex-col justify-between">
                    <div className="mb-4">
                      <CardHeader className="pb-0">
                        <CardTitle className="text-3xl text-center font-semibold text-purple-400 tracking-tight">
                          {prompt.title}
                        </CardTitle>
                      </CardHeader>
                      <p className="mt-2 text-center text-sm text-zinc-400">
                        Click for detailed features
                      </p>
                    </div>

                    <div className="flex-grow flex flex-col justify-center items-center py-4">
                      <span className="text-3xl font-bold text-purple-300">
                        {prompt.price === "Free" ? "Free" : `${prompt.price}`}
                      </span>
                      {prompt.price !== "Free" && (
                        <span className="text-sm text-zinc-500 mt-1">
                          (${prompt.ethValue} ETH)
                        </span>
                      )}
                    </div>

                    <CardFooter className="pt-4">
                      {prompt.ethValue !== "0" ? (
                        user ? ( // Check if user is logged in for paid plans
                          isWalletConnected ? (
                            <Button
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                              onClick={() => initiatePayment()}
                              disabled={isPending}
                            >
                              {isPending ? "Processing..." : "Choose Plan"}
                            </Button>
                          ) : (
                            <Button
                              className="w-full bg-purple-400 hover:bg-purple-600 text-white shadow-md"
                              onClick={connectWallet}
                            >
                              Please Connect Wallet
                            </Button>
                          )
                        ) : (
                          <Button
                            className="w-full bg-gray-500 text-white shadow-md cursor-not-allowed"
                            onClick={handleRestrictedAccess}
                          >
                            Login to Choose
                          </Button>
                        )
                      ) : (
                        user ? ( // Check if user is logged in for the free plan
                          !freePlanClicked && (
                            <Button
                              className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md"
                              onClick={handleStartFree}
                              disabled={freePlanClicked}
                            >
                              {freePlanClicked ? "Started" : "Get Started"}
                            </Button>
                          )
                        ) : (
                          <Button
                            className="w-full bg-gray-500 text-white shadow-md cursor-not-allowed"
                            onClick={handleRestrictedAccess}
                          >
                            Login to Start
                          </Button>
                        )
                      )}
                    </CardFooter>
                  </div>

                  {/* BACK */}
                  <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-zinc-700 border border-zinc-600 rounded-xl shadow-lg p-6 flex flex-col">
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">
                      Plan Details:
                    </h3>
                    <ul className="list-none space-y-2 flex-grow">
                      {prompt.features &&
                        prompt.features.map((feature, index) => (
                          <li key={index} className="text-sm text-zinc-300 flex items-center">
                            <CheckCircleIcon className="h-4 w-4 mr-2 text-green-400" />
                            {feature}
                          </li>
                        ))}
                      {!prompt.features &&
                        prompt.description.map((line, index) => (
                          <li key={index} className="text-sm text-zinc-300">
                            {line}
                          </li>
                        ))}
                    </ul>
                    <div className="mt-4">
                      {prompt.ethValue !== "0" ? (
                        user ? ( // Check if user is logged in for paid plans (back of card)
                          isWalletConnected ? (
                            <Button
                              className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-md"
                              onClick={() => initiatePayment()}
                              disabled={isPending}
                            >
                              {isPending ? "Processing..." : "Select This Plan"}
                            </Button>
                          ) : (
                            <Button
                              className="w-full bg-purple-400 hover:bg-purple-600 text-white shadow-md"
                              onClick={connectWallet}
                            >
                              Please Connect Wallet
                            </Button>
                          )
                        ) : (
                          <Button
                            className="w-full bg-gray-500 text-white shadow-md cursor-not-allowed"
                            onClick={handleRestrictedAccess}
                          >
                            Login to Choose
                          </Button>
                        )
                      ) : (
                        user ? ( // Check if user is logged in for the free plan (back of card)
                          !freePlanClicked && (
                            <Button
                              className="w-full bg-green-600 hover:bg-green-700 text-white shadow-md"
                              onClick={handleStartFree}
                              disabled={freePlanClicked}
                            >
                              {freePlanClicked ? "Started" : "Start with Free"}
                            </Button>
                          )
                        ) : (
                          <Button
                            className="w-full bg-gray-500 text-white shadow-md cursor-not-allowed"
                            onClick={handleRestrictedAccess}
                          >
                            Login to Start
                          </Button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}