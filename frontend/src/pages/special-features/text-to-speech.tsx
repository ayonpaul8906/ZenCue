import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TextToSpeech = () => {
  const [text, setText] = useState('');
  
  const handleSpeech = () => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="text-to-speech-container mt-12 p-6 bg-gray-100 rounded-xl">
      <motion.h2
        className="text-3xl font-medium text-purple-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Text-to-Speech Feature
      </motion.h2>

      <motion.textarea
        className="w-full mt-4 p-4 border-2 rounded-md"
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
        className="mt-4 p-3 bg-purple-600 text-white rounded-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        Play Speech
      </motion.button>
    </div>
  );
};

export default TextToSpeech;
