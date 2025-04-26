![github-submission-banner](https://github.com/user-attachments/assets/a1493b84-e4e2-456e-a791-ce35ee2bcf2f)

# 🚀 ZenCue

> _Empowering neurodivergent kids through smart, secure, and supportive AI tools._

---

## 📌 Problem Statement
 
**Problem Statement 1 – Weave AI magic with Groq**

## 🎯 Objective

**ZenCue** is a smart, safe, and supportive AI-powered application designed specifically for neurodivergent children.
It addresses the challenges kids face in processing text, images, and audio by using **Groq's multimodal AI** to simplify and explain information, offer assistive voice/text chat, and provide personalized support.

It also gives parents a secure way to manage subscriptions through **OnchainKit (Base)** providing both trust and transparency.

---

## 🧠 Team & Approach

### Team Name:  
`The Eaglites`

### Team Members:  
- **Arnab Ghosh** ([**LinkedIn**](https://linkedin.com/in/tulug559)  / [**GitHub**](https://github.com/tulu-g559)/ Fullstack Dev/ **Team Lead**)
- **Ayon Paul** ([**LinkedIn**](https://www.linkedin.com/in/ayon2407s) / [**GitHub**](https://github.com/ayonpaul8906/) / Frontend Dev)
- **Soumi Das** ([**LinkedIn**](https://www.linkedin.com/in/soumi-das-831105308) / UI/UX Designer)
- **Sudipta Maity** ([**LinkedIn**](https://www.linkedin.com/in/sudipta-maity-099a25302) / Project Management)

### Our Approach:  
We chose this problem to help make learning and interaction easier for neurodivergent kids using safe, responsible AI.
*   Tackled UX for kids with accessibility needs
*   Integrated **Groq** for multimodal understanding (text, image, voice)
*   Simplified blockchain wallet usage with **OnchainKit**
*   Built voice + chat assistant for intuitive interaction
* Enhanced kids' efficiency via **MindZone**

---

## 🛠️ Tech Stack

### Core Technologies Used:
- **Frontend:** React, Vite, Tailwind CSS, TypeScript, Radix UI
- **Backend:** Flask, Groq APIs- Text, Vision, Text-to-Speech  (`meta-llama models` & `playai-tts`), Firebase Authentication
- **Database:** Firebase Datastore
- **APIs:** Groq multimodel APIs
- **Hosting:** Vercel app

### Sponsor Technologies Used (if any):
- [x]  **Groq:**  _Used for smart summarization (text, URL, images), vision explanation, and AI chat._   
- [x]  **Base:** _Used to connect blockchain wallets and securely manage subscription payments via **SepholiaETH**._

---

## ✨ Key Features

| 🔑 Feature        | Description                                                                                                                                                                   | Screenshot |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|
| 🤖 **Prompt Buddy** | An AI-powered **chatbot** (text + voice) that helps neurodivergent kids interact, ask questions, and receive **friendly, simplified responses** using Groq.                | ![Prompt Buddy](https://github.com/user-attachments/assets/189df252-c6b4-45b6-8194-cfdfbb906279) |
| 📱 **Smart Explain** | Allows kids to **paste text, URLs, or images** to get instant, **kid-friendly summaries**, with optional **text-to-speech** for better accessibility.                       | ![Smart Explain](https://github.com/user-attachments/assets/a0ed0b5e-a397-441d-bed5-aaa809d5a836) |
| 🤯 **MindZone**      | A calming space offering **reading tools, neurodivergent-friendly quizzes, forums, and soothing support**, designed to nurture clarity and emotional regulation.            | ![MindZone](https://github.com/user-attachments/assets/6b9787f2-5a09-4a29-96c1-d316e5fd7635) |
| 🔕 **Focus** (within MindZone) | Built-in **Pomodoro timer**, tab switch detection, and gentle nudges help kids **maintain focus**, take breaks, and avoid distractions during tasks. | ![Focus](https://github.com/user-attachments/assets/80c804f5-0250-4156-b87b-30316302efc5) |


---

## 📽️ Demo & Deliverables

- **Demo Video Link:** [**ZenCue**](https://www.youtube.com/watch?v=CCufY1OgUb0)  
- **Pitch Deck / PPT Link:** [**PPT_Zencue**](https://docs.google.com/presentation/d/1v7Ds5ZBGYIcxTWJ6TXUKaeaxeP1pnpUF/edit?usp=sharing&ouid=115095129633022028895&rtpof=true&sd=true)  

---

## ✅ Tasks & Bonus Checklist

- [x]  **All members of the team completed the mandatory task - Followed at least 2 of our social channels and filled the form** (Details in Participant Manual)  
- [x]  **All members of the team completed Bonus Task 1 - Sharing of Badges and filled the form (2 points)**  (Details in Participant Manual)
- [x]  **All members of the team completed Bonus Task 2 - Signing up for Sprint.dev and filled the form (3 points)**  (Details in Participant Manual)


---

## 🧪 How to Run the Project

### Requirements:
- `Node.js` / `Python 3.10` or above
- **API Keys:**
    * Groq API Key
    * Firebase Credentials to be added in the `firebase.tsx`
- **.env file setup:**
    * Frontend: 
    ```
    VITE_COINBASE_APP_ID=
    VITE_ETHERSCAN_API_KEY=
    VITE_RECEIVER_ADDRESS=

    ```
    * Backend:
    ```
    GROQ_API_KEY=your_groq_api_key_here
    GROQ_AUDIO_API_ENDPOINT=https://api.groq.com/openai/v1/audio/speech
    GROQ_VISION_API_ENDPOINT=https://api.groq.co/v1/vision
    ``` 

### Local Setup:
```bash
# Clone the repo
git clone https://github.com/ayonpaul8906/ZenCue/

# Install dependencies
cd frontend
npm install

# Start development server
npm run dev

#Add a new terminal
cd backend
pip install -r requirements.txt

#Start backend server
python app.py
```

---

## 🧬 Future Scope
*   🪙Migrate from SepholiaETH to real/testnet ETH for broader adoption.
*   👨‍👩‍👧 Parent Dashboard & Progress Tracking
*   🌐 Multi-language Support for Broader Reach
*   📱 Mobile App Version
*   🛡️ End-to-End Encryption for Audio Chat
*    🚀 Real-time Browser Extension for Kids via `Screenpipe`

---

## 📎 Resources / Credits

- *Groq APIs*
- *OnchainKit by Base*
- *Radix UI*
- *Ethereum Sepolia Testnet*

---

## 🏁 Final Words

ZenCue has been a heartful project. We learned how to build inclusively, collaborated across AI and blockchain, and stayed focused on the real-world need to support kids who process the world differently.

**A huge shoutout to the community who helped us build something meaningful ❤️**

Shoutout to the entire team for the late-night debugging sessions, spontaneous UI ideas, and shared laughs that made this hackathon more than just code. We’re proud of what we’ve built and excited for where ZenCue can go next. Thanks for checking it out!

---
