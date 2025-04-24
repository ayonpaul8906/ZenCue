import { motion } from "framer-motion";
import { Navigation } from '../components/navigation';
import { Footer } from '../components/footer';
import { Sparkles } from "lucide-react";

export default function ZenCueFullDocPage() {
  return (
    <div className="bg-gradient-to-br from-[#e1f5fe] via-[#fce4ec] to-[#fff3e0] text-gray-800 min-h-screen overflow-x-hidden relative">
      {/* Animated floating shapes */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute animate-float-slow top-10 left-10 w-20 h-20 bg-purple-200 rounded-full blur-xl opacity-30" />
        <div className="absolute animate-float-fast top-1/3 right-10 w-32 h-32 bg-pink-200 rounded-full blur-xl opacity-20" />
        <div className="absolute animate-float-med bottom-10 left-1/4 w-24 h-24 bg-yellow-100 rounded-full blur-xl opacity-25" />
      </div>

      <Navigation />

      <main className="relative z-10 px-6 sm:px-12 py-16 max-w-5xl mx-auto">
        <motion.h1
          className="text-5xl font-extrabold text-center text-purple-800 drop-shadow-lg mb-16"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Sparkles className="inline-block w-10 h-10 mr-3 text-pink-500" />
          ZenCue: Documentation & User Guide
        </motion.h1>

        <div className="space-y-24">
          {sections.map((section, i) => (
            <motion.section
              key={i}
              className="w-full max-w-4xl mx-auto"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            >
              <h2 className="text-3xl font-bold text-purple-700 mb-4">{section.title}</h2>
              <div className="prose prose-lg prose-pink max-w-none text-gray-700 text-md space-y-3">
                {section.content}
              </div>
            </motion.section>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}

const sections = [
  {
    title: "🌈 What is ZenCue?",
    content: (
      <>
        <p>ZenCue is your friendly digital buddy — helping you learn, play, and grow in your unique way!</p>
        <p>Built for neurodivergent kids who think, feel, and learn differently.</p>
        <p>Whether reading feels tough or sounds are too loud, ZenCue is here to help.</p>
      </>
    ),
  },
  {
    title: "🌟 Why ZenCue is Your Super Sidekick",
    content: (
      <ul className="list-disc pl-6">
        <li>🧠 Built for ADHD, autism, dyslexia — and proud of it!</li>
        <li>🔊 Reads aloud for easier comprehension</li>
        <li>📖 Explains like a story using AI</li>
        <li>💬 You can talk or type to it — like a friend</li>
        <li>🎮 Brain games & puzzles in MindZone</li>
        <li>🔐 Grown-up friendly payments via MetaMask & Coinbase</li>
      </ul>
    ),
  },
  {
    title: "🧒 You're in Charge (But Never Alone)",
    content: (
      <>
        <p>Use ZenCue by yourself or with a grown-up’s help — you’re in control.</p>
        <p><strong>You are unique. You are bright. You are important.</strong></p>
        <p>ZenCue is here to cheer you on, every single day. 💜</p>
      </>
    ),
  },
  {
    title: "✨ Key Features",
    content: (
      <ul className="list-disc pl-6">
        <li>🔡 <strong>Smart Explain:</strong> Summarize, analyze, speak content</li>
        <li>💬 <strong>Prompt Buddy:</strong> Chat/voice support</li>
        <li>🧘‍♀️ <strong>MindZone:</strong> Interactive neurodivergent assessments</li>
        <li>🏠 <strong>Home:</strong> Login, subscriptions, wallet integration</li>
        <li>👤 <strong>Profile:</strong> Activity tracking, personalization</li>
      </ul>
    ),
  },
  {
    title: "💳 Subscription Plans",
    content: (
      <ul className="list-disc pl-6">
        <li><b>Free:</b> 5 prompts/day, basic tools</li>
        <li><b>Basic:</b> 40 prompts, 30 min audio-to-text</li>
        <li><b>Pro:</b> 100 prompts, 90 min audio, visual aids</li>
        <li><b>Premium:</b> Unlimited, full memory, support</li>
        <li><b>Currency:</b> SepholiaETH for meaningful use (not real money)</li>
      </ul>
    ),
  },
  {
    title: "🧩 Support for Neurodivergent Kids",
    content: (
      <ul className="list-disc pl-6">
        <li>🎨 Minimal, visually calm UI</li>
        <li>🔊 Voice feedback + visual aid</li>
        <li>🧘‍♂️ Reduces cognitive load with soft design</li>
      </ul>
    ),
  },
  {
    title: "🧒 How to Use ZenCue (For Kids)",
    content: (
      <ul className="list-disc pl-6">
        <li>🧠 Use Smart Explain for homework</li>
        <li>🗣️ Talk or chat with Prompt Buddy</li>
        <li>🧩 Play puzzles in MindZone</li>
        <li>👤 Update your profile</li>
      </ul>
    ),
  },
  {
    title: "👨‍👩‍👧 For Parents",
    content: (
      <ul className="list-disc pl-6">
        <li>🔐 Help with signup & tools</li>
        <li>🔒 Parent Lock (coming soon)</li>
        <li>💬 Voice tools for non-readers</li>
        <li>💳 Secure wallet-based payments</li>
        <li>🧑‍🏫 Premium 1-on-1 support</li>
      </ul>
    ),
  },
  {
    title: "🔒 Privacy & Safety",
    content: (
      <p>No personal data is collected. Everything stays private. Parents are encouraged to guide younger kids.</p>
    ),
  },
  {
    title: "🛠 Tech Stack",
    content: (
      <ul className="list-disc pl-6">
        <li><b>Frontend:</b> React + Vite + Tailwind</li>
        <li><b>Backend:</b> Flask</li>
        <li><b>AI:</b> Groq APIs</li>
        <li><b>Wallet:</b> OnchainKit</li>
        <li><b>Auth:</b> Firebase</li>
      </ul>
    ),
  },
  {
    title: "📬 Contact & Support",
    content: (
      <ul className="list-disc pl-6">
        <li>Email: <a href="mailto:garnab559@gmail.com" className="text-blue-600 underline">garnab559@gmail.com</a></li>
        <li>LinkedIn: <a href="https://www.linkedin.com/in/tulug559" target="_blank" className="text-blue-600 underline">tulug559</a></li>
        <li>Twitter / Discord: Coming soon</li>
      </ul>
    ),
  },
];