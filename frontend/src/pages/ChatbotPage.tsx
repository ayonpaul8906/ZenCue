import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Mic, MicOff } from "lucide-react";
import { Navigation } from "../components/navigation";
import { Footer } from "../components/footer";
import { toast } from "react-hot-toast";
import type { Message } from "../components/types/global";
import { db } from "../lib/firebase";
import { collection, addDoc, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "../hooks/AuthContext";
import TypewriterText from '../components/ui/TypewriterText';

export default function ChatbotFancy() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [listening, setListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const recognitionRef = useRef<any>(null);
    const { user } = useAuth();

    // Add these at the top with other state variables
    const [isScrollLocked, setIsScrollLocked] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    // Update the scrollToBottom function
    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            const scrollHeight = chatContainerRef.current.scrollHeight;
            const height = chatContainerRef.current.clientHeight;
            const maxScrollTop = scrollHeight - height;

            chatContainerRef.current.scrollTo({
                top: maxScrollTop,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage) {
            // Add a small delay to ensure content is rendered
            setTimeout(scrollToBottom, 100);
        }
    }, [messages]);

    // Add a scroll handler to detect when user manually scrolls
    useEffect(() => {
        const container = chatContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;
            setIsScrollLocked(isAtBottom);
        };

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, []);

    // Update the loadChatHistory function
    const loadChatHistory = async () => {
        try {
            if (!user?.uid) {
                console.log("No authenticated user");
                setMessages([]);
                return;
            }
    
            console.log("Loading chat history for user:", user.uid);
    
            const chatQuery = query(
                collection(db, "chats"),
                where("userId", "==", user.uid),
                orderBy("timestamp", "asc")
            );
    
            const querySnapshot = await getDocs(chatQuery);
            const loadedMessages: Message[] = [];
    
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.text && data.sender) {
                    loadedMessages.push({
                        sender: data.sender,
                        text: data.text,
                        timestamp: data.timestamp
                    });
                }
            });
    
            setMessages(loadedMessages);
            setTimeout(scrollToBottom, 100);
        } catch (error) {
            console.error("Error loading chat history:", error);
        }
    };

    // Update the useEffect for loading chat history
    useEffect(() => {
        if (user?.uid) {
            loadChatHistory();
        }
    }, [user]);// Only depend on user

    // Save message to Firebase
    const saveMessageToFirebase = async (message: Message) => {
        try {
            if (!user?.uid) {
                console.log("No authenticated user to save message");
                return;
            }
    
            const docRef = await addDoc(collection(db, "chats"), {
                userId: user.uid,
                sender: message.sender,
                text: message.text,
                timestamp: new Date().toISOString(),
                createdAt: new Date()
            });
    
            console.log("Message saved with ID:", docRef.id);
        } catch (error) {
            console.error("Error saving message:", error);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMsg: Message = { sender: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        await saveMessageToFirebase(userMsg);
        setInput("");
        setIsLoading(true);

        try {
            // Create formatted messages array including the new message
            const conversationHistory = [...messages, userMsg];

            const response = await fetch("http://localhost:5000/chat/text", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text: userMsg.text,
                    history: conversationHistory // Send the full conversation history
                }),
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            const botMsg: Message = { sender: "bot", text: data.response };
            setMessages(prev => [...prev, botMsg]);
            await saveMessageToFirebase(botMsg);
            speak(data.response);
        } catch (error) {
            console.error("Error:", error);
            toast.error("Failed to get response from chatbot");
        } finally {
            setIsLoading(false);
        }
    };

    const speak = async (text: string) => {
        try {
            const response = await fetch("http://localhost:5000/chat/speak", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            // If response is not ok, silently fail without showing error toast
            if (!response.ok) {
                console.log("TTS limit exceeded or error occurred - continuing without audio");
                return; // Just return without throwing error or showing toast
            }

            const blob = await response.blob();
            if (blob.size === 0) return; // Silently fail if no audio data

            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);

            await new Promise((resolve, reject) => {
                audio.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                    resolve(null);
                };
                audio.onerror = () => {
                    URL.revokeObjectURL(audioUrl);
                    resolve(null); // Resolve instead of reject to avoid error
                };
                audio.play().catch(() => resolve(null)); // Catch and resolve any play() errors
            });

        } catch (error) {
            // Just log to console without showing toast
            console.log("Audio playback unavailable:", error);
        }
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Speech recognition not supported in this browser");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;

        recognition.onstart = () => setListening(true);
        recognition.onend = () => setListening(false);
        recognition.onerror = (event: any) => {
            setListening(false);
            toast.error(`Error: ${event.error}`);
        };

        recognition.onresult = async (event: any) => {
            const transcript = event.results[0][0].transcript;
            setInput(transcript);

            const userMsg: Message = { sender: "user", text: transcript };
            setMessages(prev => [...prev, userMsg]);
            await saveMessageToFirebase(userMsg);

            try {
                setIsLoading(true);
                // Create formatted messages array including the new message
                const conversationHistory = [...messages, userMsg];

                const response = await fetch("http://localhost:5000/chat/text", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        text: transcript,
                        history: conversationHistory
                    }),
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();
                const botMsg: Message = { sender: "bot", text: data.response };
                setMessages(prev => [...prev, botMsg]);
                await saveMessageToFirebase(botMsg);
                speak(data.response);
            } catch (error) {
                console.error("Error:", error);
                toast.error("Failed to get response from chatbot");
            } finally {
                setIsLoading(false);
            }
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navigation />
            <div className="flex-grow bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-4 flex items-center justify-center">
                <motion.div
                    className="w-full max-w-5xl h-[85vh] bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl p-4 md:p-6 flex flex-col"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="flex items-center text-2xl md:text-3xl font-bold text-white gap-3">
                            <Bot className="w-8 h-8 md:w-10 md:h-10" />
                            <span>AI Buddy</span>
                        </h1>

                    </div>

                    {/* Chat Container */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <div
                            ref={chatContainerRef}
                            className="flex-1 overflow-y-auto px-2 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                        >
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} w-full`}
                                >
                                    <div className={`flex items-start gap-3 max-w-[85%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                                        }`}>
                                        <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center ${msg.sender === "user"
                                                ? "bg-gradient-to-r from-blue-500 to-purple-500"
                                                : "bg-gradient-to-r from-pink-500 to-rose-500"
                                            }`}>
                                            {msg.sender === "user" ? "👤" : "🤖"}
                                        </div>
                                        <div className={`px-4 py-3 rounded-2xl ${msg.sender === "user"
                                                ? "bg-blue-500 text-white"
                                                : "bg-white/20 text-white"
                                            } shadow-md`}>
                                            {msg.sender === "bot" ? (
                                                <TypewriterText
                                                    text={msg.text}
                                                    onComplete={scrollToBottom}
                                                />
                                            ) : (
                                                <div className="whitespace-pre-wrap break-words">
                                                    {msg.text}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Input Container */}
                    <div className="mt-4 pt-2 border-t border-white/10">
                        <div className="flex items-center gap-3">
                            <button
                                onClick={startListening}
                                disabled={isLoading}
                                className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${listening
                                        ? "bg-red-600 animate-pulse"
                                        : "bg-purple-600 hover:bg-purple-700"
                                    } text-white transition-all duration-300 ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {listening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                            </button>

                            <input
                                className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                type="text"
                                placeholder="Type your message..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isLoading}
                            />

                            <button
                                onClick={handleSend}
                                disabled={isLoading || !input.trim()}
                                className={`px-6 py-3 shrink-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:opacity-90 transition-all duration-300 ${isLoading || !input.trim() ? "opacity-50 cursor-not-allowed" : ""
                                    }`}
                            >
                                {isLoading ? "Sending..." : "Send"}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
}