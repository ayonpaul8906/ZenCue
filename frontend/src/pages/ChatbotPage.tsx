import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Bot, Mic, MicOff } from "lucide-react";
import { Navigation } from "../components/navigation";
import { Footer } from "../components/footer";
import { toast } from "react-hot-toast";
import type { Message } from "../components/types/global";
import { db } from "../lib/firebase";
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    onSnapshot
} from "firebase/firestore";
import { useAuth } from "../hooks/AuthContext";
import TypewriterText from '../components/ui/TypewriterText';
import { logActivity, ActivityTypes } from '../lib/activity';
import { getUserUsage, incrementUsage, getPlanLimits } from '../lib/usageService';

// Markdown/response formatter
function formatResponseText(text: string) {
    let formattedText = text;

    // Convert markdown to HTML with styling
    formattedText = formattedText
        // Headers
        .replace(/^###\s(.*)$/gm, "<h3 class='text-xl font-bold text-purple-400 mt-4 mb-2'>$1</h3>")
        .replace(/^##\s(.*)$/gm, "<h2 class='text-2xl font-bold text-purple-400 mt-6 mb-3'>$1</h2>")
        .replace(/^#\s(.*)$/gm, "<h1 class='text-3xl font-bold text-purple-400 mt-8 mb-4'>$1</h1>")

        // Bold and Italic
        .replace(/\*\*(.*?)\*\*/g, "<strong class='text-purple-300'>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em class='text-blue-300'>$1</em>")
        .replace(/_(.*?)_/g, "<em class='text-blue-300'>$1</em>")

        // Code blocks
        .replace(/`(.*?)`/g, "<code class='bg-gray-800/80 px-2 py-0.5 rounded text-pink-400'>$1</code>")

        // Links
        .replace(/\[([^\]]+)]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-blue-400 hover:underline">$1</a>')

        // Lists
        .replace(/^[-*•]\s*(.*?)$/gm, "<li class='ml-4 text-gray-300'>$1</li>")
        .replace(/^\d+\.\s*(.*?)$/gm, "<li class='ml-4 text-gray-300'>$1</li>")

        // Blockquotes
        .replace(/^>\s*(.*?)$/gm, "<blockquote class='border-l-4 border-purple-500 pl-4 my-4 italic text-gray-400'>$1</blockquote>")

        // Paragraphs (handle newlines)
        .replace(/\n\n/g, "</p><p class='mb-4 text-gray-300'>")
        .trim();

        const stripMarkdownAndHtml = (text: string) => {
            return text
                // Remove HTML tags
                .replace(/<[^>]*>/g, '')
                // Remove markdown headers
                .replace(/^###\s*(.*?)$/gm, '$1')
                .replace(/^##\s*(.*?)$/gm, '$1')
                .replace(/^#\s*(.*?)$/gm, '$1')
                // Remove bold and italic markers
                .replace(/\*\*(.*?)\*\*/g, '$1')
                .replace(/\*(.*?)\*/g, '$1')
                .replace(/_(.*?)_/g, '$1')
                // Remove code blocks
                .replace(/`(.*?)`/g, '$1')
                // Remove markdown links, keep text
                .replace(/\[([^\]]+)]\(([^)]+)\)/g, '$1')
                // Remove list markers
                .replace(/^[-*•]\s*/gm, '')
                .replace(/^\d+\.\s*/gm, '')
                // Remove blockquote markers
                .replace(/^>\s*/gm, '')
                // Clean up extra whitespace
                .replace(/\s+/g, ' ')
                .trim();
        };

    // Wrap the entire text in a paragraph if it doesn't start with a special element
    if (!formattedText.startsWith('<h') &&
        !formattedText.startsWith('<blockquote') &&
        !formattedText.startsWith('<li')) {
        formattedText = `<p class='mb-4 text-gray-300'>${formattedText}</p>`;
    }

    // Wrap lists in containers
    formattedText = formattedText
        .replace(/(<li[^>]*>.*?<\/li>)\s*<li/g, '$1\n<li') // Add newlines between list items
        .replace(/(<li[^>]*>.*?<\/li>(\n)?)+/g, (match) => {
            if (match.includes('class="numbered"')) {
                return `<ol class="list-decimal list-inside mb-4">${match}</ol>`;
            }
            return `<ul class="list-disc list-inside mb-4">${match}</ul>`;
        });

    return formattedText;
}

export default function ChatbotFancy() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [listening, setListening] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const recognitionRef = useRef<any>(null);
    const { user } = useAuth();
    const unsubscribeRef = useRef<any>(null);
    const hasLoggedRef = useRef(false);
    const [usage, setUsage] = useState<any>(null);
    const [planLimits, setPlanLimits] = useState<any>(null);

    // Scroll state management
    const [isScrollLocked, setIsScrollLocked] = useState(true);
    const chatContainerRef = useRef<HTMLDivElement>(null);

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
        if (user?.uid) {
            getUserUsage(user.uid).then(u => {
                setUsage(u);
                setPlanLimits(getPlanLimits(u.plan));
            });
        }
    }, [user]);

    useEffect(() => {
        if (user?.uid && !hasLoggedRef.current) {
            logActivity(user.uid, {
                type: ActivityTypes.PAGE_VISIT,
                action: 'Visited Prompt Buddy',
                details: 'Accessed Chatbot Feature'
            });
            hasLoggedRef.current = true;
        }
    }, [user]);

    useEffect(() => {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && isScrollLocked) {
            setTimeout(scrollToBottom, 100);
        }
    }, [messages, isScrollLocked]);

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

    // Real-time chat subscription
    useEffect(() => {
        if (unsubscribeRef.current) {
            unsubscribeRef.current();
            unsubscribeRef.current = null;
        }

        if (!user?.uid) {
            setIsLoading(false);
            return;
        }

        try {
            setIsLoading(true);

            const chatQuery = query(
                collection(db, "chats"),
                where("userId", "==", user.uid),
                orderBy("timestamp", "asc"),
                limit(100)
            );

            unsubscribeRef.current = onSnapshot(chatQuery, (snapshot) => {
                const loadedMessages: Message[] = [];

                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    let timestamp = new Date();
                    if (data.timestamp) {
                        timestamp = data.timestamp instanceof Timestamp
                            ? data.timestamp.toDate()
                            : new Date(data.timestamp);
                    }

                    if (data.text && data.sender) {
                        loadedMessages.push({
                            id: doc.id,
                            sender: data.sender,
                            text: data.text,
                            timestamp: timestamp,
                            userId: data.userId,
                            isNew: false
                        });
                    }
                });

                setMessages(loadedMessages);
                setIsLoading(false);

                if (loadedMessages.length > 0) {
                    setTimeout(() => {
                        scrollToBottom();
                        setIsScrollLocked(true);
                    }, 100);
                }
            }, (error) => {
                console.error("Error in chat snapshot listener:", error);
                toast.error("Failed to sync chat history");
                setIsLoading(false);
            });

        } catch (error) {
            console.error("Error setting up chat listener:", error);
            toast.error("Failed to load chat history");
            setIsLoading(false);
        }

        return () => {
            if (unsubscribeRef.current) {
                unsubscribeRef.current();
                unsubscribeRef.current = null;
            }
        };
    }, [user]);


    const saveMessageToFirebase = async (message: Message) => {
        try {
            if (!user?.uid) {
                toast.error("You need to be logged in to send messages");
                return message;
            }

            const messageData = {
                userId: user.uid,
                sender: message.sender,
                text: message.text,
                timestamp: Timestamp.fromDate(new Date())
            };

            const docRef = await addDoc(collection(db, "chats"), messageData);

            return {
                ...message,
                id: docRef.id,
                userId: user.uid,
                timestamp: new Date()
            };
        } catch (error) {
            toast.error("Failed to save message");
            return message;
        }
    };

    const ChatLimits = ({ usage, planLimits }: { usage: any; planLimits: any }) => {
        const chatsLeft = Math.max(0, (planLimits?.chats ?? 0) - (usage?.chatsToday ?? 0));
        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed top-20 right-4 z-50"
            >
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 shadow-xl">
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-purple-400">Daily Chats Left</span>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-2xl font-bold text-white">{chatsLeft}</span>
                                <span className="text-xs text-gray-400">remaining</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        if (!user?.uid) {
            toast.error("You must be logged in to use this feature.");
            return;
        }

        const currentUsage = await getUserUsage(user.uid);
        const currentLimits = getPlanLimits(currentUsage.plan);

        if (currentUsage.chatsToday >= currentLimits.chats) {
            toast.error(`You have reached your daily chat limit (${currentLimits.chats}).`);
            return;
        }

        try {
            setIsLoading(true);
            const userMsg: Message = {
                sender: "user",
                text: input.trim(),
                timestamp: new Date()
            };

            setInput("");
            setIsScrollLocked(true);

            await saveMessageToFirebase(userMsg);

            await incrementUsage(user.uid, "chatsToday");
            const updatedUsage = await getUserUsage(user.uid);
            setUsage(updatedUsage);

            const conversationHistory = messages.concat(userMsg).map(msg => ({
                role: msg.sender === "user" ? "user" : "assistant",
                content: msg.text
            }));

            const response = await fetch("http://localhost:5000/chat/text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: conversationHistory,
                    text: userMsg.text
                }),
            });

            if (!response.ok) throw new Error("Network response was not ok");

            const data = await response.json();
            if (!data.response) throw new Error("No response from server");

            const botMsg: Message = {
                sender: "bot",
                text: data.response,
                timestamp: new Date(),
            };

            await saveMessageToFirebase(botMsg);

            setMessages(prev => prev.map((msg, idx) =>
                idx === prev.length - 1 && msg.sender === "bot"
                    ? { ...msg, isNew: true }
                    : { ...msg, isNew: false }
            ));

            await speak(stripMarkdownAndHtml(data.response));

        } catch (error) {
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

            if (!response.ok) {
                return;
            }

            const blob = await response.blob();
            if (blob.size === 0) return;

            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);

            await new Promise((resolve) => {
                audio.onended = () => {
                    URL.revokeObjectURL(audioUrl);
                    resolve(null);
                };
                audio.onerror = () => {
                    URL.revokeObjectURL(audioUrl);
                    resolve(null);
                };
                audio.play().catch(() => resolve(null));
            });

        } catch (error) {
            // Silent fail
        }
    };

    const startListening = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            toast.error("Speech recognition not supported in this browser");
            return;
        }

        if (!user?.uid) {
            toast.error("You must be logged in to use this feature.");
            return;
        }

        if (usage && planLimits && usage.chatsToday >= planLimits.chats) {
            toast.error(`You have reached your daily chat limit (${planLimits.chats}).`);
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

            const userMsg: Message = {
                sender: "user",
                text: transcript,
                timestamp: new Date()
            };

            try {
                setIsLoading(true);
                const savedUserMsg = await saveMessageToFirebase(userMsg);
                setIsScrollLocked(true);

                const currentMessages = [...messages, savedUserMsg];
                const conversationHistory = currentMessages.map(msg => ({
                    role: msg.sender === "user" ? "user" : "assistant",
                    content: msg.text
                }));

                await incrementUsage(user.uid, "chatsToday");
                const updatedUsage = await getUserUsage(user.uid);
                setUsage(updatedUsage);

                const response = await fetch("http://localhost:5000/chat/text", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        messages: conversationHistory,
                        text: transcript
                    }),
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();

                if (!data.response) {
                    throw new Error("No response from server");
                }

                const botMsg: Message = {
                    sender: "bot",
                    text: data.response,
                    timestamp: new Date()
                };

                await saveMessageToFirebase(botMsg);
                await speak(data.response);

            } catch (error) {
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
            <ChatLimits usage={usage} planLimits={planLimits} />
            <div className="flex-grow bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] p-4 flex items-center justify-center">
                <motion.div
                    className="w-full max-w-5xl h-[85vh] bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl shadow-xl p-4 md:p-6 flex flex-col"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header */}
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="flex items-center text-2xl md:text-3xl font-bold text-white gap-3">
                            <Bot className="w-8 h-8 md:w-10 md:h-10" />
                            <span>AI Buddy</span>
                        </h1>
                        {isLoading && (
                            <div className="text-white/70 text-sm animate-pulse">
                                Syncing...
                            </div>
                        )}
                    </div>

                    {/* Chat Container */}
                    <div className="flex-1 flex flex-col min-h-0">
                        <div
                            ref={chatContainerRef}
                            className="flex-1 overflow-y-auto px-2 space-y-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
                        >
                            {messages.length === 0 && !isLoading && (
                                <div className="flex justify-center items-center h-full">
                                    <p className="text-white/70 text-center">
                                        No messages yet. Start a conversation!
                                    </p>
                                </div>
                            )}

                            {isLoading && messages.length === 0 && (
                                <div className="flex justify-center items-center h-full">
                                    <div className="text-white/70 text-center flex flex-col items-center">
                                        <div className="w-8 h-8 border-4 border-t-purple-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin mb-3"></div>
                                        <p>Loading conversation history...</p>
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={msg.id || `msg-${idx}-${msg.timestamp.getTime()}`}
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
                                            {msg.sender === "bot" && msg.isNew ? (
                                                <TypewriterText
                                                    text={msg.text}
                                                    onComplete={scrollToBottom}
                                                />
                                            ) : (
                                                msg.sender === "bot" ? (
                                                    <div
                                                        className="whitespace-pre-wrap break-words prose prose-invert prose-purple max-w-none"
                                                        dangerouslySetInnerHTML={{ __html: formatResponseText(msg.text) }}
                                                    />
                                                ) : (
                                                    <div className="whitespace-pre-wrap break-words">
                                                        {msg.text}
                                                    </div>
                                                )
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