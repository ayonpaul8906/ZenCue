import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [paused, setPaused] = useState(false);
  const speechUtterance = useRef(new SpeechSynthesisUtterance());

  const handleSpeech = () => {
    if (text && !isSpeaking) {
      speechUtterance.current.text = text;
      window.speechSynthesis.speak(speechUtterance.current);
      setIsSpeaking(true);
      setPaused(false);
    } else if (isSpeaking && paused) {
      window.speechSynthesis.resume();
      setPaused(false);
    }
  };

  const handleStop = () => {
    if (isSpeaking) {
      window.speechSynthesis.pause();
      setPaused(true);
    }
  };

  useEffect(() => {
    const handleEnd = () => {
      setIsSpeaking(false);
      setPaused(false);
    };

    speechUtterance.current.onend = handleEnd;

    return () => {
      // This function runs when the component unmounts
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      speechUtterance.current.onend = null; // Clean up the event listener
    };
  }, []); // Empty dependency array ensures this runs only once on mount and unmount

  return (
    <div className="text-to-speech-container mt-8 p-6 bg-gray-800 rounded-xl border border-gray-700">
      <motion.h2
        className="text-3xl font-medium text-purple-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Text-to-Speech Feature
      </motion.h2>

      <motion.textarea
        className="w-full mt-4 p-4 border-2 border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:ring-purple-500 focus:border-purple-500"
        rows="4"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your text here..."
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      />

      <div className="mt-4 space-x-2">
        <motion.button
          onClick={handleSpeech}
          className="p-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:ring-2 focus:ring-purple-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          disabled={isSpeaking && !paused}
        >
          {isSpeaking && !paused ? 'Speaking...' : paused ? 'Resume Speech' : 'Play Speech'}
        </motion.button>

        <motion.button
          onClick={handleStop}
          className="p-3 bg-red-500 text-white rounded-md hover:bg-red-600 focus:ring-2 focus:ring-red-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          disabled={!isSpeaking}
        >
          Stop Speech
        </motion.button>
      </div>
    </div>
  );
};

export default TextToSpeech;