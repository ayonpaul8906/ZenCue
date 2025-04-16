# 🧠 ZenCue — Neuro-AI Assistant for Web Clarity

ZenCue is a cutting-edge, neuro-accessible web platform designed to empower neurodivergent users by enhancing their focus, comprehension, and digital interaction using AI, multimodal tools, and blockchain-based subscriptions.

Built with ❤️ for ADHD, dyslexic, and neurodivergent communities.

---


## 🧩 Features

### 🧠 AI Assistant (Groq + Flask)
- **Text Simplifier** — Converts complex content into readable summaries.
- **Visual Aid** — Understand screenshots, diagrams using Groq Vision.
- **Summarizer** — AI-powered summarization of long texts.
- **Prompt Buddy** — Ask natural questions like “Explain this page to me”.
- **Voice Input** — Speak commands to the assistant (Groq Audio).

### 🖥️ Screen Interaction (Screenpi.pe Integration)
- Capture & analyze visible screen content.
- Return voice + text simplification on-demand.
- Accessible explanation using OCR + Groq Vision.

### ♿ Accessibility Tools
- **Text-to-Speech** for any page content.
- **Dyslexia-friendly themes** with toggle.
- **Readable font toggle**.
- **Pomodoro focus timer** to block distractions.
- **AI-generated visual explanations** from paragraphs.

### 🔐 Wallet & Onchain Subscription (Base Network)
- **Coinbase Wallet integration**.
- **Free tier** — Limited AI interactions.
- **Pro tier (NFT/token gated)** — Unlimited queries, memory features, voice assistant.
- **Subscription status via Base Sepolia testnet**.

### 🔥 Personalization & Firebase
- Store user preferences (theme, font, simplification level).
- Log AI interactions and analytics.
- Anonymous or wallet-based user ID.

---

## 🛠️ Tech Stack

| Category              | Tech                         |
|-----------------------|------------------------------|
| Frontend              | React 18, Vite, Tailwind CSS |
| AI Backend            | Flask + Groq APIs            |
| Screen Processing     | [Screenpi.pe](https://screenpi.pe) |
| Wallet & Blockchain   | Coinbase Wallet, Base Network, OnchainKit |
| Auth & Storage        | Firebase + Firestore         |
| Animations/UI         | Three.js, React Three Fiber  |

---

## ⚙️ Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/ayonpaul8906/ZenCue.git
cd ZenCue
```
---

### 2. Install Dependencies
```bash
npm install
# or
yarn
```
---

### 3. Environment Variables
Create a .env file in the root and add:

```env
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_GROQ_API_KEY=your_groq_key
VITE_SCREENPIPE_API_KEY=your_screenpipe_key
VITE_COINBASE_API_KEY=your_cb_key
```
---

### 4. Run the App
```bash
npm run dev
# or
yarn dev
```
---

## 🧪 Future Roadmap
🧬 Multi-language support

🤝 AI Memory (per user)

🌐 Browser extension

🔄 Real-time screen reader agent

🎨 Enhanced personalization settings

## 👥 Team
Ayon Paul — Frontend Developer
Arnab Ghosh — Backend Developer




## 🙏 Support & Feedback
If you love the project, star ⭐ the repo and share feedback via Issues.
 
For contributions or partnership: ayonpaul8906@gmail.com


