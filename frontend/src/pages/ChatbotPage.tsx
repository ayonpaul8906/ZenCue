import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot } from "lucide-react";
import { Navigation } from '../components/navigation';
import { Footer } from '../components/footer';
import { toast } from "react-hot-toast";
import type { Message } from "../components/types/global";

export default function ChatbotFancy() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [listening, setListening] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const recognitionRef = useRef<any>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;
        
        const userMsg: Message = { sender: "user", text: input };
        setMessages(prev => [...prev, userMsg]);
        setInput("");
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/chat/text', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: userMsg.text }),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const botMsg: Message = { sender: "bot", text: data.response };
            setMessages(prev => [...prev, botMsg]);
            speak(data.response);
        } catch (error) {
            console.error('Error:', error);
            toast.error("Failed to get response from chatbot");
        } finally {
            setIsLoading(false);
        }
    };

    const speak = async (text: string) => {
        try {
            console.log("🎙️ Requesting speech for text:", text.substring(0, 100) + "...");
            
            const response = await fetch('http://localhost:5000/chat/speak', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text }),
            });
    
            // Get the error message from the response if available
            let errorMessage = 'Failed to get audio response';
            if (!response.ok) {
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.error || errorMessage;
                } catch {
                    errorMessage = `Server error: ${response.status}`;
                }
                throw new Error(errorMessage);
            }
    
            const blob = await response.blob();
            if (blob.size === 0) {
                throw new Error('Received empty audio response');
            }
    
            console.log(`📥 Received audio blob: ${blob.size} bytes`);
            
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            
            // Set up audio event handlers
            await new Promise((resolve, reject) => {
                audio.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                    resolve(null);
                };
                
                audio.onerror = (e) => {
                    URL.revokeObjectURL(audioUrl);
                    reject(new Error(`Audio playback error: ${e}`));
                };
    
                audio.play().catch(reject);
            });
    
            toast.success('Audio played successfully');
    
        } catch (error) {
            console.error('Error playing audio:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to play audio');
            throw error; // Re-throw to handle in the calling function
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
            
            // Automatically send the voice input
            const userMsg: Message = { sender: "user", text: transcript };
            setMessages(prev => [...prev, userMsg]);
            
            try {
                setIsLoading(true);
                const response = await fetch('http://localhost:5000/chat/text', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ text: transcript }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const botMsg: Message = { sender: "bot", text: data.response };
                setMessages(prev => [...prev, botMsg]);
                speak(data.response);
            } catch (error) {
                console.error('Error:', error);
                toast.error("Failed to get response from chatbot");
            } finally {
                setIsLoading(false);
            }
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div>
            <Navigation />
            <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] flex items-center justify-center p-4">
                <motion.div
                    className="w-full max-w-4xl h-[85vh] bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl p-6 flex flex-col"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="flex text-3xl font-bold text-white mb-4 space-x-3">
                        <Bot className="h-10 w-10" />
                        <span>AI Buddy</span>
                    </h1>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                        {messages.map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: msg.sender === "user" ? 40 : -40 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                                className={`flex items-start gap-3 max-w-[80%] ${
                                    msg.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                                }`}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${
                                        msg.sender === "user" 
                                            ? "from-blue-500 to-purple-500" 
                                            : "from-yellow-400 to-pink-500"
                                    } shadow-md`}
                                />
                                <div
                                    className={`px-5 py-3 rounded-2xl ${
                                        msg.sender === "user"
                                            ? "bg-blue-500 text-white"
                                            : "bg-white/20 text-white border border-white/30"
                                    }`}
                                >
                                    {msg.text}
                                </div>
                            </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="flex items-center mt-6 gap-3">
                        <button
                            onClick={startListening}
                            disabled={isLoading}
                            className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                listening 
                                    ? "bg-red-600 animate-pulse text-white" 
                                    : "bg-pink-600 hover:bg-pink-700"
                            } text-white transition-all duration-300 shadow-lg ${
                                isLoading ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            🎤
                        </button>

                        <input
                            className="flex-1 px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:outline-none disabled:opacity-50"
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
                            className={`bg-gradient-to-br from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-md ${
                                isLoading || !input.trim() ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                        >
                            {isLoading ? "Sending..." : "Send"}
                        </button>
                    </div>
                </motion.div>
            </div>
            <Footer />
        </div>
    );
}