import { useState, useEffect } from 'react';
import { Navigation } from "../components/navigation";
import { Hero } from "../components/hero";
import { SubscriptionPlan } from "../components/Subscription-plan";
import { Footer } from "../components/footer";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500); 
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <SubscriptionPlan />
      </main>
      <Footer />
    </div>
  );
}