import { useState, useRef, useEffect, useCallback } from 'react';
import html2canvas from 'html2canvas';
import Tesseract from 'tesseract.js';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';
import { Navigation } from '../components/navigation';
import { Footer } from '../components/footer';

function App() {
    const [responseText, setResponseText] = useState('');
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
    const [rate, setRate] = useState(1);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const captureRef = useRef<HTMLDivElement>(null);
    const explanationRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loadVoices = () => {
            const allVoices = window.speechSynthesis.getVoices();
            setVoices(allVoices);
            if (allVoices.length) setSelectedVoice(allVoices[0]);
        };

        loadVoices();
        if (typeof window !== 'undefined') {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        window.onbeforeunload = () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const stopSpeaking = () => {
        if (speechSynthesis.speaking || speechSynthesis.pending) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    };

    const speakText = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = rate;
        if (selectedVoice) utterance.voice = selectedVoice;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);

        speechSynthesis.speak(utterance);
    };

    const handleCaptureAndRead = async () => {
        if (captureRef.current) {
            stopSpeaking();
            setIsLoading(true);

            try {
                const canvas = await html2canvas(captureRef.current);
                const dataUrl = canvas.toDataURL();
                const result = await Tesseract.recognize(dataUrl, 'eng');
                const text = result.data.text.trim();

                const res = await axios.post('http://localhost:5000/explain', { text });
                const explanation = res.data.explanation;
                setResponseText(explanation);
                speakText(explanation);

                setTimeout(() => {
                    explanationRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } catch (error) {
                console.error('Scan Error:', error);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (!acceptedFiles.length) return;
        stopSpeaking();
        setIsLoading(true);

        const file = acceptedFiles[0];
        const reader = new FileReader();

        reader.onload = async () => {
            const dataUrl = reader.result as string;
            setImagePreview(dataUrl);

            try {
                const result = await Tesseract.recognize(dataUrl, 'eng');
                const text = result.data.text.trim();

                const res = await axios.post('http://localhost:5000/explain', { text });
                const explanation = res.data.explanation;
                setResponseText(explanation);
                speakText(explanation);

                setTimeout(() => {
                    explanationRef.current?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            } catch (error) {
                console.error('Image scan error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        reader.readAsDataURL(file);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
    });

    return (
        <div> <Navigation />
            <div style={styles.page}>
                <div style={styles.container}>
                    <h1 style={styles.title}>Simpy Screen</h1>

                    <div ref={captureRef} contentEditable suppressContentEditableWarning style={styles.editableBox}>
                        <p>✏️ Type or paste any text here and click "Scan + Explain"</p>
                    </div>

                    {/* Dropzone */}
                    <div
                        {...getRootProps()}
                        style={{
                            ...styles.dropzone,
                            backgroundColor: isDragActive ? '#e0f7fa' : '#fafafa',
                            borderColor: isDragActive ? '#00acc1' : '#ccc',
                        }}
                    >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                            <p>📂 Drop your image here...</p>
                        ) : (
                            <p>📂 Drag & drop an image or click to select</p>
                        )}
                    </div>

                    {imagePreview && (
                        <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                            <img
                                src={imagePreview}
                                alt="Preview"
                                style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                            />
                        </div>
                    )}

                    <button
                        onClick={handleCaptureAndRead}
                        style={{
                            ...styles.button,
                            backgroundColor: isSpeaking ? '#aaa' : '#4caf50',
                            cursor: isSpeaking ? 'not-allowed' : 'pointer',
                        }}
                        disabled={isSpeaking}
                    >
                        🔍 Scan + Explain
                    </button>

                    <button onClick={stopSpeaking} style={styles.stopButton}>
                        🛑 Stop Speaking
                    </button>

                    {isSpeaking && <div style={styles.toast}>🔊 Speaking...</div>}
                    {isLoading && <div style={styles.toast}>⏳ Scanning ...</div>}

                    {/* Voice & Speech Controls */}
                    <div style={styles.controls}>
                        <label>
                            🗣️ Voice:
                            <select
                                value={selectedVoice?.name}
                                onChange={(e) =>
                                    setSelectedVoice(voices.find((v) => v.name === e.target.value) || null)
                                }
                            >
                                {voices.map((voice, idx) => (
                                    <option key={idx} value={voice.name}>
                                        {voice.name}
                                    </option>
                                ))}
                            </select>
                        </label>
                        <label>
                            ⚡ Speed: {rate.toFixed(1)}
                            <input
                                type="range"
                                min="0.5"
                                max="2"
                                step="0.1"
                                value={rate}
                                onChange={(e) => setRate(parseFloat(e.target.value))}
                            />
                        </label>
                    </div>

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
        minHeight: '140px',
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
        animation: 'fadeIn 0.3s ease-in',
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

    dropzone: {
        border: '2px dashed #ccc',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        marginBottom: '15px',
        transition: 'all 0.2s ease-in-out',
    },
};

export default App;
