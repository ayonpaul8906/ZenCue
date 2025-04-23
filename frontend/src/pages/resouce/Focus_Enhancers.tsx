// src/pages/FocusEnhancers.tsx
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { extractImportantWords } from '../../hooks/importantWords';
import { FaPlay, FaStop, FaPause } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const FocusEnhancers = () => {
  const [text, setText] = useState('');
  const navigate = useNavigate();
  const [highlightedWords, setHighlightedWords] = useState<string[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utterance = useRef<SpeechSynthesisUtterance | null>(null);

  const speakText = () => {
    if (!text) return;
    if (!isReading) {
      utterance.current = new SpeechSynthesisUtterance(text);
      utterance.current.rate = 0.9;
      speechSynthesis.speak(utterance.current);
      setIsReading(true);
      setIsPaused(false);
      utterance.current.onend = () => {
        setIsReading(false);
        setIsPaused(false);
      };
    } else if (isPaused && utterance.current) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const pauseSpeech = () => {
    if (isReading && speechSynthesis.speaking && !isPaused && utterance.current) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const stopSpeech = () => {
    if (isReading && utterance.current) {
      speechSynthesis.cancel();
      setIsReading(false);
      setIsPaused(false);
    }
  };

  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isReading) {
        speechSynthesis.cancel();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (isReading && utterance.current) {
        speechSynthesis.cancel(); // Keep this in the unmount for component-level cleanup
      }
    };
  }, [isReading]);

  const handleHighlight = () => {
    const words = extractImportantWords(text);
    setHighlightedWords(words);
  };

  const renderHighlightedText = () => {
    return text.split(' ').map((word, index) => {
      const cleanWord = word.replace(/[.,!?]/g, '');
      const isImportant = highlightedWords.includes(cleanWord);
      return (
        <span
          key={index}
          className={isImportant ? 'bg-yellow-400 text-black px-1 py-0.5 rounded-md font-semibold' : 'text-gray-300'}
        >
          {word + ' '}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-900 text-gray-100">
      <motion.button
        onClick={() => navigate('/resources')}
        className="flex items-center gap-2 text-purple-400 hover:text-purple-300 font-semibold mb-8"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <ArrowLeft size={20} />
        Back to Resources
      </motion.button>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-center sm:text-left text-purple-300">
          🧘 Focus Enhancers
        </h1>
      </div>

      <textarea
        rows={6}
        placeholder="Paste or write text to analyze..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="w-full border border-gray-700 rounded-xl p-4 text-lg mb-6 resize-none bg-gray-800 text-gray-100 transition focus:ring-2 focus:ring-purple-500 focus:outline-none"
      />

      <div className="flex gap-4 mb-8">
        <button
          onClick={speakText}
          className="bg-gradient-to-r from-blue-500 to-blue-700 text-white px-6 py-3 rounded-lg transition transform hover:scale-105 shadow-md"
          disabled={isReading && !isPaused}
        >
          <FaPlay className="inline mr-2" /> {isReading && !isPaused ? 'Reading...' : isPaused ? 'Resume' : 'Play'}
        </button>
        <button
          onClick={pauseSpeech}
          className="bg-gradient-to-r from-orange-500 to-orange-700 text-white px-6 py-3 rounded-lg transition transform hover:scale-105 shadow-md"
          disabled={!isReading || isPaused}
        >
          <FaPause className="inline mr-2" /> Pause
        </button>
        <button
          onClick={stopSpeech}
          className="bg-gradient-to-r from-red-500 to-red-700 text-white px-6 py-3 rounded-lg transition transform hover:scale-105 shadow-md"
          disabled={!isReading}
        >
          <FaStop className="inline mr-2" /> Stop
        </button>
        <button
          onClick={handleHighlight}
          className="bg-gradient-to-r from-green-500 to-green-700 text-white px-6 py-3 rounded-lg transition transform hover:scale-105 shadow-md"
          disabled={isReading}
        >
          🎯 Highlight
        </button>
      </div>

      <motion.div
        className="text-lg leading-relaxed p-6 rounded-xl bg-gray-800 border border-gray-700"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {renderHighlightedText()}
      </motion.div>

      <div className="mt-12">
        <h2 className="text-3xl font-semibold mb-6 text-purple-300">⏱ Pomodoro Focus Timer</h2>
        <div className="flex justify-center items-center">
          <div className="relative w-full sm:w-1/2">
            {/* Updated iframe without any overlay */}
            <iframe
              className="rounded-lg shadow-lg border border-gray-700 w-full h-56 sm:h-64"
              src="https://pomofocus.io/"
              title="Pomodoro Timer"
              allow="autoplay; fullscreen"
              frameBorder="0"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusEnhancers;