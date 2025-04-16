import { Navigation } from "../components/navigation"
import { Hero } from "../components/hero"
import { SubscriptionPlan } from "../components/Subscription-plan"
import { Footer } from "../components/footer"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero />
        <SubscriptionPlan />
      </main>
      <Footer />
    </div>
  )
}
