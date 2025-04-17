import { useState, useRef } from 'react';
import axios from 'axios';
import { Navigation } from '../components/navigation';
import { Footer } from '../components/footer';

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

                    <button onClick={stopSpeaking} style={styles.stopButton}>
                        🛑 Stop Speaking
                    </button>

                    {isSpeaking && <div style={styles.toast}>🔊 Speaking...</div>}
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
        backgroundColor: '#f4f4f4',
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
    },
    title: {
        textAlign: 'center',
        color: '#111',
        fontSize: '2.2rem',
        marginBottom: '20px',
        fontWeight: 'bold',
    },
    editableBox: {
        border: '2px dashed #aaa',
        padding: '20px',
        marginBottom: '20px',
        minHeight: '60px',
        backgroundColor: '#fff',
        color: '#000',
        borderRadius: '8px',
        fontSize: '1rem',
        whiteSpace: 'pre-wrap',
        outline: 'none',
        cursor: 'text',
    },
    button: {
        padding: '12px 24px',
        backgroundColor: '#4caf50',
        color: '#fff',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'block',
        margin: '0 auto 10px',
        fontSize: '1rem',
    },
    stopButton: {
        padding: '10px 22px',
        backgroundColor: '#e53935',
        color: '#fff',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        display: 'block',
        margin: '0 auto 10px',
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
    controls: {
        backgroundColor: '#fff',
        padding: '15px',
        margin: '20px 0',
        borderRadius: '8px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
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
