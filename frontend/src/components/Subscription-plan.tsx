import { Button } from "./ui/button";
import { Card, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { useSubscriptionPayment } from "../hooks/useSubscriptionPayment";
import { Toaster, toast } from "react-hot-toast";
import { useAuth } from "../hooks/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";

const featuredPrompts = [
  {
    id: 1,
    title: "Free",
    description: `Limited word/sentence explanation with text & audio (few per day)
Text-only chatbot, 5 queries per day
No access to Mind Zone (articles, videos, focus tools, community)
Basic features only, no advanced personalization`,
    price: "Free",
    ethValue: "0",
  },
  {
    id: 2,
    title: "🐣 1 Month Plan",
    description: `Unlimited word/sentence explanation with text & audio
Full access to chatbot (text & audio, unlimited queries)
Unlimited access to articles and videos in Mind Zone
Pomodoro Timer with sentence highlighting
Full access to Reading Aids (E-Reader, Magnifier, Text-to-Speech)
Full community engagement`,
    price: "0.005 ETH",
    ethValue: "0.005",
  },
  {
    id: 3,
    title: "🌱 3 Month Plan",
    description: `Priority access to word/sentence explanations (faster loading, early content)
Customizable chatbot responses (text & audio)
Exclusive articles and videos in Mind Zone
Customizable Pomodoro Timer
Advanced Text-to-Speech features (speed, voice)
Exclusive events and webinars in the community`,
    price: "0.015 ETH",
    ethValue: "0.015",
  },
  {
    id: 4,
    title: "🌟 6 Month Plan",
    description: `Unlimited access to complex content explanations
Personalized, ongoing chatbot responses
VIP access to exclusive articles and videos in Mind Zone
Full customization of Pomodoro Timer and focus tools
Unlimited access to all Reading Aids with device sync
Priority membership in the community with expert-led sessions`,
    price: "0.08 ETH",
    ethValue: "0.08",
  },
];


export function SubscriptionPlan() {
  const { user } = useAuth();

  const handleRestrictedAccess = () => {
    toast.error("You need to log in to purchase a subscription plan!");
  };

  return (
    <section className="py-20 px-4 sm:px-6 bg-gradient-to-br  from-[#e1f5fe] via-[#fce4ec] to-[#fff3e0] dark:from-zinc-900 dark:to-zinc-800">
      <div className="mx-auto max-w-7xl">
        <Toaster />
        <h2 className="text-4xl font-bold text-center text-purple-800 dark:text-white mb-16">
          Subscription Plans
        </h2>

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {featuredPrompts.map((prompt, index) => {
            const { initiatePayment, isPending } = useSubscriptionPayment(prompt.ethValue);
            const [flipped, setFlipped] = useState(false);

            return (
              <motion.div
                key={prompt.id}
                className="perspective"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
              >
                <div
                  onMouseEnter={() => setFlipped(true)}
                  onMouseLeave={() => setFlipped(false)}
                  className="relative w-full h-96 cursor-pointer transform-style-preserve-3d transition-transform duration-700"
                  style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                >
                  {/* FRONT */}
                  <div className="absolute w-full h-full backface-hidden bg-white dark:bg-zinc-800 border border-purple-300 dark:border-zinc-700 rounded-2xl shadow-lg p-6 flex flex-col justify-between">
                    <div>
                      <CardHeader>
                        <CardTitle className="text-2xl font-semibold text-purple-800 dark:text-purple-300">
                          {prompt.title}
                        </CardTitle>
                      </CardHeader>

                      <div className="text-sm text-gray-700 dark:text-zinc-300 mt-4">
                        Click to see details
                      </div>
                    </div>

                    <CardFooter className="bg-purple-100 dark:bg-zinc-700 rounded-xl py-4 px-5">
                      <span className="text-xl font-bold  text-purple-700 dark:text-purple-300">
                        {prompt.price}
                      </span>
                    </CardFooter>
                  </div>

                  {/* BACK */}
                  <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-purple-100 dark:bg-zinc-700 border border-purple-300 dark:border-zinc-600 rounded-2xl shadow-lg p-6 flex flex-col justify-between">
                    <div className="text-sm text-gray-800 dark:text-zinc-200">
                      <ul className="list-disc pl-6 space-y-2">
                        {prompt.description.split("\n").map((line, index) => (
                          <li key={index} className="text-sm">
                            {line}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {prompt.ethValue !== "0" && (
                      <Button
                        className="mt-6 bg-purple-600 hover:bg-purple-700 text-white shadow-lg"
                        onClick={() => (!user ? handleRestrictedAccess() : initiatePayment())}
                        disabled={isPending}
                      >
                        {isPending ? "Processing..." : "Buy Now"}
                      </Button>
                    )}
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
