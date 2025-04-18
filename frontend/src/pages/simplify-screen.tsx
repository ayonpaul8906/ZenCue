import { useState, useRef } from 'react';
import axios from 'axios';
import { Navigation } from '../components/navigation';
import { Footer } from '../components/footer';
import { motion } from 'framer-motion';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { cn } from "../lib/utils";
import { Bot, Image as ImageIcon, StopCircle, Volume2 } from 'lucide-react';

function App() {
    const [responseText, setResponseText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const captureRef = useRef<HTMLDivElement>(null);
    const explanationRef = useRef<HTMLDivElement>(null);

    const stopSpeaking = () => {
        // Just for UI toggle
        setIsSpeaking(false);
    };

    const playGroqAudio = async (text: string) => {
        try {
            setIsSpeaking(true);
            const response = await fetch('http://localhost:5000/speak', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch audio');
            }

            const blob = await response.blob();
            const audioUrl = URL.createObjectURL(blob);
            const audio = new Audio(audioUrl);

            audio.onended = () => setIsSpeaking(false);
            audio.play();
        } catch (error) {
            console.error('Audio playback error:', error);
            setIsSpeaking(false);
        }
    };

    const handleTextExplain = async () => {
        const content = captureRef.current?.innerText || '';
        if (!content.trim()) return;

        stopSpeaking();
        setIsLoading(true);

        try {
            const res = await axios.post('http://localhost:5000/explain', {
                text: content,
            });

            const explanation = res.data.explanation;
            setResponseText(explanation);
            await playGroqAudio(explanation);

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

        stopSpeaking();
        setIsLoading(true);
        setImagePreview(imageUrl);

        try {
            const res = await axios.post('http://localhost:5000/explain-image', {
                image_url: imageUrl,
            });

            const explanation = res.data.explanation;
            setResponseText(explanation);
            const handleUrlSubmit = async () => {
                if (!imageUrl.trim()) return;

                stopSpeaking();
                setIsLoading(true);
                setImagePreview(imageUrl);

                try {
                    const res = await axios.post('http://localhost:5000/explain-image', {
                        image_url: imageUrl,
                    });

                    const explanation = res.data.explanation;
                    setResponseText(explanation);

                    console.log("🎯 Explanation from image:", explanation);


                    if (explanation && explanation.trim()) {
                        await playGroqAudio(explanation);
                    } else {
                        console.warn("⚠️ No explanation returned from /explain-image");
                    }

                    setTimeout(() => {
                        explanationRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                } catch (error) {
                    console.error('Image URL analysis error:', error);
                    setResponseText('❌ Error processing the image URL.');
                } finally {
                    setIsLoading(false);
                }
            };


            if (explanation && explanation.trim()) {
                await playGroqAudio(explanation);
            } else {
                console.warn("⚠️ No explanation returned from /explain-image");
            }

            setTimeout(() => {
                explanationRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } catch (error) {
            console.error('Image URL analysis error:', error);
            setResponseText('❌ Error processing the image URL.');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div>
            <Navigation />
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
                        <motion.h1 className='text-center'

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
                                        Explain Text
                                    </Button>

                                    {isSpeaking && (
                                        <Button
                                            onClick={stopSpeaking}
                                            variant="destructive"
                                            className="flex items-center gap-2"
                                        >
                                            <StopCircle className="w-5 h-5" />
                                            Stop Speaking
                                        </Button>
                                    )}
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
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center justify-center gap-2 p-3 bg-purple-600/90 text-white rounded-full shadow-lg max-w-fit mx-auto backdrop-blur-sm"
                            >
                                {isSpeaking && <Volume2 className="w-5 h-5 animate-pulse" />}
                                <span>{isSpeaking ? '🔊 Speaking...' : '⏳ Analyzing...'}</span>
                            </motion.div>
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
                                    <div className="prose prose-invert prose-purple max-w-none text-gray-300">
                                        {responseText}
                                    </div>
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