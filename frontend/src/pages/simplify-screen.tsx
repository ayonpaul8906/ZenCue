import { useState, useRef, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Navigation } from '../components/navigation';
import { Footer } from '../components/footer';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { cn } from "../lib/utils";
import { Bot, Image as ImageIcon, StopCircle, Volume2 } from 'lucide-react';
import { useAuth } from '../hooks/AuthContext';
import { logActivity, ActivityTypes } from '../lib/activity';
import { getUserUsage, incrementUsage, getPlanLimits } from '../lib/usageService';
import { toast } from "react-hot-toast";


function App() {
    const [responseText, setResponseText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const isSpeechSynthesis = useRef(false);
    const captureRef = useRef<HTMLDivElement>(null);
    const explanationRef = useRef<HTMLDivElement>(null);
    const { user } = useAuth();
    const hasLoggedRef = useRef(false);
    const [usage, setUsage] = useState<any>(null);
    const [planLimits, setPlanLimits] = useState<any>(null);

    const stopSpeaking = useCallback(() => {
        // Stop Groq TTS audio if playing
        if (audioRef.current) {
            audioRef.current.pause();
            URL.revokeObjectURL(audioRef.current.src); // Clean up the blob URL
            audioRef.current = null;
        }

        // Stop browser's Speech Synthesis if active
        if (isSpeechSynthesis.current) {
            window.speechSynthesis.cancel();
            isSpeechSynthesis.current = false;
        }

        setIsSpeaking(false);
    }, []);

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
                action: 'Visited Smart Explain', // Change this for each page
                details: 'Accessed Smart Explain page'
            });
            hasLoggedRef.current = true;
        }
    }, [user]);

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    }, []);

    // Add this near your other useEffect hooks
    useEffect(() => {
        // Cleanup function that runs on unmount or page refresh
        return () => {
            // Stop Groq TTS audio if playing
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }

            // Stop browser's Speech Synthesis if active
            if (isSpeechSynthesis.current) {
                window.speechSynthesis.cancel();
                isSpeechSynthesis.current = false;
            }

            setIsSpeaking(false);
        };
    }, []); // Empty dependency array means this runs on mount and cleanup

    // Also add beforeunload event listener
    useEffect(() => {
        const handleBeforeUnload = () => {
            stopSpeaking();
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        // Cleanup
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
                <div className="animate-spin rounded-full h-14 w-14 border-t-2 border-b-2 border-purple-500"></div>
            </div>
        );
    }

    const formatResponseText = (text: string) => {
        let formattedText = text;

        // Convert markdown to HTML with styling
        formattedText = formattedText
            // Headers (must come before bold since they both use **)
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
    };


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

    // Place this component near the top of your file
    const UsageLimits = ({ usage, planLimits }: { usage: any; planLimits: any }) => {
        const textLimitsLeft = Math.max(0, (planLimits?.textexplanations ?? 0) - (usage?.textexplanations ?? 0));
        const imageLimitsLeft = Math.max(0, (planLimits?.imageexplanations ?? 0) - (usage?.imageexplanations ?? 0));
    
        return (
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="fixed top-20 right-4 z-50"
            >
                <div className="bg-gray-900/90 backdrop-blur-md border border-purple-500/20 rounded-xl p-4 shadow-xl">
                    <h3 className="text-sm font-semibold text-purple-400 mb-2">Limits Left</h3>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Text Explains:</span>
                            <span className="text-sm font-bold text-purple-300">{textLimitsLeft}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">Image Explains:</span>
                            <span className="text-sm font-bold text-purple-300">{imageLimitsLeft}</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        );
    };

    // Update the playGroqAudio function
    const playGroqAudio = async (text: string) => {
        try {
            setIsSpeaking(true);
            const response = await fetch('${import.meta.env.VITE_BACKEND_URL}/chat/speak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            // Handle rate limit or other errors with fallback
            if (response.status === 429 || response.status === 500) {
                const data = await response.json();
                if (data.fallback) {
                    isSpeechSynthesis.current = true;
                    const utterance = new SpeechSynthesisUtterance(data.text);
                    utterance.onend = () => {
                        setIsSpeaking(false);
                        isSpeechSynthesis.current = false;
                    };
                    utterance.onerror = () => {
                        setIsSpeaking(false);
                        isSpeechSynthesis.current = false;
                    };
                    window.speechSynthesis.speak(utterance);
                    return;
                }
            }

            if (!response.ok) {
                throw new Error(`Failed to fetch audio: ${response.status}`);
            }

            const blob = await response.blob();
            if (blob.size === 0) {
                throw new Error('Received empty audio blob');
            }

            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);
            audioRef.current = audio;

            audio.onended = () => {
                setIsSpeaking(false);
                URL.revokeObjectURL(audioUrl);
                audioRef.current = null;
            };

            audio.onerror = (e) => {
                console.error('Audio playback error:', e);
                setIsSpeaking(false);
                URL.revokeObjectURL(audioUrl);
                audioRef.current = null;
            };

            await audio.play();
        } catch (error) {
            console.error('Audio playback error:', error);
            setIsSpeaking(false);
            // Try browser TTS as last resort with clean text
            try {
                isSpeechSynthesis.current = true;
                const utterance = new SpeechSynthesisUtterance(stripMarkdownAndHtml(text));
                utterance.onend = () => {
                    setIsSpeaking(false);
                    isSpeechSynthesis.current = false;
                };
                utterance.onerror = () => {
                    setIsSpeaking(false);
                    isSpeechSynthesis.current = false;
                };
                window.speechSynthesis.speak(utterance);
            } catch (ttsError) {
                console.error('Browser TTS failed:', ttsError);
            }
        }
    };

    // Update the handleTextExplain function to properly handle audio errors
    const handleTextExplain = async () => {
        const content = captureRef.current?.innerText || '';
        if (!content.trim()) return;

        // Usage limit check
        if (!user?.uid) {
            toast.error("You must be logged in to use this feature.");
            return;
        }
        if (usage && planLimits && usage.textexplanations >= planLimits.textexplanations) {
            toast.error(`You have reached your text explanation limit (${planLimits.textexplanations}).`);
            return;
        }

        if (usage && planLimits && usage.imageexplanations >= planLimits.imageexplanations) {
            toast.error(`You have reached your image explanation limit (${planLimits.imageexplanations}).`);
            return;
        }

        stopSpeaking();
        setIsLoading(true);

        try {
            const res = await axios.post('${import.meta.env.VITE_BACKEND_URL}/explain', {
                text: content,
            });

            const explanation = formatResponseText(res.data.explanation);
            setResponseText(explanation);

            // Increment usage count in Firestore
            // After incrementUsage, fetch latest usage from Firestore
            await incrementUsage(user.uid, "textexplanations");
            const updatedUsage = await getUserUsage(user.uid);
            setUsage(updatedUsage);


            // Play audio with clean text
            try {
                await playGroqAudio(stripMarkdownAndHtml(res.data.explanation));// Use original response before HTML formatting
            } catch (audioError) {
                console.error('Failed to play audio:', audioError);
            }

            setTimeout(() => {
                explanationRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error) {
            console.error('Text explanation error:', error);
            setResponseText('❌ Error processing the text.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUrlSubmit = async () => {
        if (!imageUrl.trim()) return;
    
        // Check auth and limits first
        if (!user?.uid) {
            toast.error("You must be logged in to use this feature.");
            return;
        }
        if (usage && planLimits && usage.imageexplanations >= planLimits.imageexplanations) {
            toast.error(`You have reached your image explanation limit (${planLimits.imageexplanations}).`);
            return;
        }
    
        stopSpeaking();
        setIsLoading(true);
        setImagePreview(imageUrl);
    
        try {
            const res = await axios.post('${import.meta.env.VITE_BACKEND_URL}/explain-image', {
                image_url: imageUrl,
            });
    
            if (res.data.error) {
                throw new Error(res.data.error);
            }
    
            const explanation = formatResponseText(res.data.explanation || '');
    
            if (!explanation.trim()) {
                throw new Error('No explanation received');
            }
    
            // Increment usage count and update state
            await incrementUsage(user.uid, "imageexplanations");
            const updatedUsage = await getUserUsage(user.uid);
            setUsage(updatedUsage);
    
            setResponseText(explanation);
            console.log("✅ Image explanation received");
    
            try {
                await playGroqAudio(stripMarkdownAndHtml(res.data.explanation));
            } catch (audioError) {
                console.error('Audio playback failed:', audioError);
            }
    
            setTimeout(() => {
                explanationRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error) {
            console.error('Image analysis error:', error);
            setResponseText('❌ Sorry, I had trouble analyzing that image. Please try another one or check if the URL is correct.');
            setImagePreview(null);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            <Navigation />
            <UsageLimits usage={usage} planLimits={planLimits} />
            <div className="min-h-screen bg-black text-white">
                {/* Purple gradient overlay */}
                <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 to-black pointer-events-none" />

                <main className="container relative mx-auto px-4 py-8 md:py-16 z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="max-w-4xl mx-auto space-y-8"
                    >
                        <motion.h1 className="text-center "
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            <span className="text-4xl md:text-6xl font-bold  bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">Smart Explain</span>
                            <span className="text-4xl md:text-6xl font-bold bg-gradient-to-r bg-clip-text">💡</span>
                        </motion.h1>

                        <motion.p
                            className="text-lg md:text-xl text-center text-gray-400 max-w-2xl mx-auto"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            👋 Need help understanding something? You're in the right place. Upload an image, paste text, or just highlight anything confusing — and we’ll break it down for you.
                        </motion.p>

                        <Card className="p-6 bg-gray-900/50 border-gray-800 backdrop-blur-lg shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="space-y-6"
                            >
                                <div
                                    ref={captureRef}
                                    contentEditable
                                    suppressContentEditableWarning
                                    className={cn(
                                        "min-h-[120px] p-4 rounded-lg",
                                        "bg-gray-800/50 border-2 border-dashed border-purple-500/30",
                                        "focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20",
                                        "outline-none transition-all duration-200",
                                        "text-gray-100 placeholder-gray-500",
                                        "empty:before:content-[attr(data-placeholder)] empty:before:text-gray-500"
                                    )}
                                    data-placeholder="✏️ Type or paste any text or URL here..."
                                />

                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Button
                                        onClick={handleTextExplain}
                                        className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white"
                                    >
                                        <Bot className="w-5 h-5" />
                                        Explain
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <Input
                                        type="text"
                                        placeholder="Paste image URL"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        className="w-full bg-gray-800/50 border-gray-700 text-gray-100 placeholder-gray-500 focus:border-purple-400"
                                    />

                                    <Button
                                        onClick={handleUrlSubmit}
                                        className="w-full sm:w-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <ImageIcon className="w-5 h-5" />
                                        Explain Image from URL
                                    </Button>
                                </div>

                                {imagePreview && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="rounded-lg overflow-hidden shadow-lg bg-gray-800/50"
                                    >
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-full max-h-[300px] object-contain"
                                        />
                                    </motion.div>
                                )}
                            </motion.div>
                        </Card>

                        {(isSpeaking || isLoading) && (
                            <div className="flex items-center justify-center gap-4">
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="flex items-center gap-2 p-3 bg-purple-600/90 text-white rounded-full shadow-lg backdrop-blur-sm"
                                >
                                    {isSpeaking && (
                                        <>
                                            <Volume2 className="w-5 h-5 animate-pulse" />
                                            <span>🔊 Speaking...</span>
                                        </>
                                    )}
                                    {isLoading && !isSpeaking && <span>⏳ Analyzing...</span>}
                                </motion.div>

                                {isSpeaking && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                    >
                                        <Button
                                            onClick={stopSpeaking}
                                            variant="destructive"
                                            size="sm"
                                            className="h-10 px-3 bg-red-600/90 hover:bg-red-700/90 rounded-full shadow-lg"
                                        >
                                            <StopCircle className="w-5 h-5" />
                                            Stop Speaking
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        )}

                        {responseText && (
                            <motion.div
                                ref={explanationRef}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <Card className="p-6 bg-gray-900/50 border-gray-800 backdrop-blur-lg">
                                    <h3 className="text-xl font-semibold mb-4 text-purple-400">Explanation:</h3>
                                    <div
                                        className="prose prose-invert prose-purple max-w-none"
                                        dangerouslySetInnerHTML={{ __html: responseText }}
                                    />
                                </Card>
                            </motion.div>
                        )}
                    </motion.div>
                </main>
            </div>
            <Footer />
        </div>
    );
}

export default App;
