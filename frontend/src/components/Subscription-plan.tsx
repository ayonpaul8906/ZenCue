import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "./ui/card"
import { StarIcon } from "lucide-react"
import { useSubscriptionPayment } from "../hooks/useSubscriptionPayment"
import { Toaster } from "react-hot-toast"

const featuredPrompts = [
  {
    id: 1,
    title: "Free",
    description: `• Limited AI access (5 prompts/day)
    • Basic tools: text simplifier, summarizer, focus timer, TTS, and dyslexia-friendly mode
    • No screen reading or visual aids
    • No personalization or memory`,
    price: "Free",
    amount: 0,
    rating: 4.8,
  },
  {
    id: 2,
    title: "Basic",
    description: `•	40 AI prompts/day
•	Access to visual aid (diagram explainer) and 3 screen reads/day
•	Audio-to-text: 30 mins/month
•	Personal theme/font preferences
•	Ideal for light users who need occasional help`,
    price: "$15/month",
    amount: 15,
    rating: 4.9,
  },
  {
    id: 3,
    title: "Pro",
    description: `•	100 AI prompts/day
•	15 screen reads/month + scheduled screen reads
•	Audio-to-text: 90 mins/month
•	AI-generated visual sketches: 50/month
•	Full personalization (AI tone, preferences, interaction history)
•	Ideal for students or professionals needing consistent support`,
    price: "$25/month",
    amount: 25,
    rating: 4.7,
  },
  {
    id: 4,
    title: "Premium",
    description: `•	100 AI prompts/day
•	Unlimited :  screen reads, audio help, sketches
•	Personalized AI memory and tone
•	Priority support + potential 1-on-1 help
•	Perfect for power users or those who rely heavily on accessibility tools`,
    price: "$40/month",
    amount: 40,
    rating: 4.7,
  },
]

export function SubscriptionPlan() {
  return (
    <section className="py-16 px-6">
      <div className="mx-auto max-w-7xl">
        <Toaster />
        <h2 className="text-3xl font-bold tracking-tight text-center mb-12">Subscription Plan</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredPrompts.map((prompt) => {
            const { initiatePayment, isPending, ethValue } = useSubscriptionPayment(prompt.amount);

            return (
              <Card key={prompt.id} className="group relative flex flex-col h-full overflow-hidden transition-all hover:shadow-lg">
                {/* Buy Now Button (Top Right) */}
                {prompt.amount > 0 && (
                  <Button
                    className="absolute top-4 right-4 z-10"
                    onClick={initiatePayment}
                    disabled={isPending}
                  >
                    {isPending ? "Processing..." : `Buy Now`}
                  </Button>
                )}

                <CardHeader className="pt-8">
                  <div className="flex justify-between items-start">
                    <CardTitle>{prompt.title}</CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow">
                  <CardDescription className="mt-2">
                    {prompt.description.split("•").map((line, index) => (
                      line.trim() && (
                        <div key={index} className="mb-1">
                          • {line.trim()}
                        </div>
                      )
                    ))}
                  </CardDescription>
                  <div className="flex items-center gap-1 text-yellow-500 mt-4">
                    <StarIcon className="h-4 w-4 fill-current" />
                    <span className="text-sm font-medium">{prompt.rating}</span>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between items-center">
                  <span className="text-lg font-bold">{prompt.price}</span>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
