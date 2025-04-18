import { useState, useRef } from 'react';
import { Navigation } from '../components/navigation';
import { Footer } from '../components/footer';
import { motion } from 'framer-motion';

function App() {
    const [responseText, setResponseText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageUrl, setImageUrl] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const captureRef = useRef<HTMLDivElement>(null);
    const explanationRef = useRef<HTMLDivElement>(null);

    const stopSpeaking = () => {
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
            const response = await fetch('http://localhost:5000/explain', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: content }),
            });

            if (!response.ok) {
                throw new Error('Failed to get explanation');
            }

            const res = await response.json();
            const explanation = res.explanation;
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
            const response = await fetch('http://localhost:5000/explain-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image_url: imageUrl }),
            });

            if (!response.ok) {
                throw new Error('Failed to analyze image');
            }

            const res = await response.json();
            const explanation = res.explanation;
            setResponseText(explanation);
            await playGroqAudio(explanation);

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

    const handlePause = () => {
        // Handle pausing audio here (if possible)
        setIsSpeaking(false);
    };

    const handlePlay = () => {
        // Restart or resume audio if needed
        setIsSpeaking(true);
    };

    const handleReplay = () => {
        // Handle replaying the audio
        playGroqAudio(responseText);
    };

    return (
        <div>
            <Navigation />
            <div style={styles.page}>
                <div style={styles.container}>
                    <h1 style={styles.title}>Simpy Screen</h1>

                    <div ref={captureRef} contentEditable suppressContentEditableWarning style={styles.editableBox}>
                        <p>✏️ Type or paste any text here and click "Explain Text"</p>
                    </div>

                    <button onClick={handleTextExplain} style={styles.button}>
                        🧠 Explain Text
                    </button>

                    <input
                        type="text"
                        placeholder="Paste image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        style={{ ...styles.editableBox, fontSize: '1rem', marginBottom: '10px' }}
                    />

                    <button onClick={handleUrlSubmit} style={styles.button}>
                        🌐 Explain Image from URL
                    </button>

                    {imagePreview && (
                        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                            />
                        </div>
                    )}

                    {isSpeaking && (
                        <div style={styles.waveformContainer}>
                            {[...Array(5)].map((_, i) => (
                                <span key={i} style={{ ...styles.bar, animationDelay: `${i * 0.1}s` }} />
                            ))}
                        </div>
                    )}

                    {isSpeaking && (
                        <motion.div
                            style={styles.audioControls}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                        >
                            <motion.button
                                onClick={handlePause}
                                style={styles.audioBtn}
                                whileTap={{ scale: 0.9 }}
                                title="Pause audio"
                            >
                                ⏸ Pause
                            </motion.button>

                            <motion.button
                                onClick={handlePlay}
                                style={styles.audioBtn}
                                whileTap={{ scale: 0.9 }}
                                title="Resume audio"
                            >
                                ▶️ Play
                            </motion.button>

                            <motion.button
                                onClick={handleReplay}
                                style={styles.audioBtn}
                                whileTap={{ scale: 0.9 }}
                                title="Replay from start"
                            >
                                🔁 Replay
                            </motion.button>
                        </motion.div>
                    )}

                    {isLoading && <div style={styles.toast}>⏳ Analyzing...</div>}

                    {responseText && (
                        <div style={styles.section} ref={explanationRef}>
                            <h3>Explanation:</h3>
                            <pre style={styles.pre}>{responseText}</pre>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

const styles: { [key: string]: React.CSSProperties } = {
    page: {
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#f7f4ff',
        color: '#000',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '40px 20px',
        boxSizing: 'border-box',
    },
    container: {
        width: '100%',
        maxWidth: '800px',
        textAlign: 'center',
    },
    title: {
        fontSize: '2.4rem',
        fontWeight: '600',
        marginBottom: '30px',
        color: '#4B3F72',
    },
    editableBox: {
        border: '2px dashed #4B3F72',
        padding: '20px',
        marginBottom: '20px',
        minHeight: '60px',
        backgroundColor: '#fff',
        color: '#4B3F72',
        borderRadius: '8px',
        fontSize: '1rem',
        whiteSpace: 'pre-wrap',
        outline: 'none',
        cursor: 'text',
    },
    button: {
        padding: '12px 24px',
        backgroundColor: '#7b4bc9',
        color: '#fff',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'block',
        margin: '0 auto 20px',
        fontSize: '1rem',
    },
    toast: {
        backgroundColor: '#222',
        color: '#fff',
        padding: '8px 14px',
        borderRadius: '6px',
        textAlign: 'center',
        maxWidth: '200px',
        margin: '10px auto',
        fontSize: '0.95rem',
        fontWeight: 'bold',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    },
    waveformContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        gap: '6px',
        height: '20px',
        marginBottom: '10px',
    },
    bar: {
        width: '4px',
        height: '100%',
        backgroundColor: '#7b4bc9',
        borderRadius: '4px',
        animation: 'bounce 1s infinite ease-in-out',
    },
    audioControls: {
        display: 'flex',
        justifyContent: 'center',
        gap: '12px',
        marginTop: '20px',
    },
    audioBtn: {
        padding: '12px 18px',
        backgroundColor: '#4B3F72',
        color: '#fff',
        borderRadius: '8px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        border: 'none',
        cursor: 'pointer',
        transition: '0.3s',
    },
    section: {
        marginTop: '24px',
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        color: '#000',
    },
    pre: {
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        fontSize: '1rem',
        fontFamily: 'inherit',
        margin: 0,
    },
};

export default App;
