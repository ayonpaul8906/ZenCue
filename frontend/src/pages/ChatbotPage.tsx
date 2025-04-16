// ChatbotFancy.tsx
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react"
import { Navigation } from '../components/navigation'
import { Footer } from '../components/footer'

export default function ChatbotFancy() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        // Simulate bot reply
        setTimeout(() => {
            const reply = `You said: ${userMsg.text}`;
            const botMsg = { sender: "bot", text: reply };
            setMessages((prev) => [...prev, botMsg]);
            speak(reply);
        }, 1200);
    };

    const speak = (text: string) => {
        const utter = new SpeechSynthesisUtterance(text);
        utter.voice = speechSynthesis.getVoices()[0];
        utter.rate = 1;
        utter.pitch = 1;
        speechSynthesis.speak(utter);
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Speech recognition not supported");

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);
        recognition.onerror = () => setListening(false);
        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    return (
        <div> <Navigation />
            <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-4">
                <motion.div
                    className="w-full max-w-4xl h-[85vh] bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl p-6 flex flex-col"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="flex text-3xl font-bold text-white mb-4 space-x-3"><Bot className="h-10 w-10" /> <span> AI Buddy </span></h1>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: msg.sender === "user" ? 40 : -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                                className={`flex items-start gap-3 max-w-[80%] ${msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                    }`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${msg.sender === "user" ? "from-blue-500 to-purple-500" : "from-yellow-400 to-pink-500"
                                        } shadow-md`}
                                ></div>
                                <div
                                    className={`px-5 py-3 rounded-2xl ${msg.sender === "user"
                                            ? "bg-blue-500 text-white"
                                            : "bg-white/20 text-white border border-white/30"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex items-center mt-6 gap-3">
                        <button
                            onClick={startListening}
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${listening ? "bg-red-600 animate-ping text-white" : "bg-pink-600 hover:bg-pink-700"
                                } text-white transition-all duration-300 shadow-lg`}
                        >
                            🎤
                        </button>

                        <input
                            className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:outline-none"
                            type="text"
                            placeholder="Type your message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button
                            onClick={handleSend}
                            className="bg-gradient-to-br from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-md"
                        >
                            Send
                        </button>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
}



