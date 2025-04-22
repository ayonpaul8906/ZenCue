import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechUtterance = new SpeechSynthesisUtterance();

  const handleSpeech = () => {
    if (text) {
      speechUtterance.text = text;
      window.speechSynthesis.speak(speechUtterance);
      setIsSpeaking(true);
    }
  };

  useEffect(() => {
    const handleEnd = () => {
      setIsSpeaking(false);
    };

    speechUtterance.onend = handleEnd;

    return () => {
      // This function runs when the component unmounts
      window.speechSynthesis.cancel(); // Stop any ongoing speech
      speechUtterance.onend = null; // Clean up the event listener
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

      <motion.button
        onClick={handleSpeech}
        className="mt-4 p-3 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:ring-2 focus:ring-purple-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        disabled={isSpeaking}
      >
        {isSpeaking ? 'Speaking...' : 'Play Speech'}
      </motion.button>
    </div>
  );
};

export default TextToSpeech;