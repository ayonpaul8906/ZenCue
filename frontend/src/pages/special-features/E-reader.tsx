import React, { useState } from 'react';
import { motion } from 'framer-motion';

const SpecializedEReader = () => {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isReading, setIsReading] = useState(false);

  // Function to handle text input
  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  // Function to handle speech synthesis
  const handleTextToSpeech = () => {
    const speech = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(speech);
    setIsReading(true);
  };

  // Stop speech synthesis if it's currently speaking
  const stopTextToSpeech = () => {
    window.speechSynthesis.cancel();
    setIsReading(false);
  };

  // Adjust font size dynamically
  const increaseFontSize = () => {
    setFontSize((prev) => prev + 2);
  };
  const decreaseFontSize = () => {
    if (fontSize > 12) setFontSize((prev) => prev - 2);
  };

  // Adjust background color
  const changeBackgroundColor = (color) => {
    setBgColor(color);
  };

  return (
    <div className="reader-container mt-12 p-6 bg-gray-100 rounded-xl">
      <motion.h2
        className="text-3xl font-medium text-purple-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Specialized E-Reader for Neurodivergent Users
      </motion.h2>

      <motion.div
        className="text-input-section mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <textarea
          placeholder="Enter your text here..."
          value={text}
          onChange={handleTextChange}
          rows="8"
          className="w-full p-4 border-2 rounded-lg mt-4"
          style={{ fontSize: `${fontSize}px`, backgroundColor: bgColor }}
        />
      </motion.div>

      {/* Controls Section */}
      <motion.div
        className="controls-section mt-6 flex space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <button
          onClick={increaseFontSize}
          className="px-4 py-2 bg-purple-500 text-white rounded-md"
        >
          Increase Font Size
        </button>
        <button
          onClick={decreaseFontSize}
          className="px-4 py-2 bg-purple-500 text-white rounded-md"
        >
          Decrease Font Size
        </button>
        <button
          onClick={() => changeBackgroundColor('#f0f4f8')}
          className="px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          Change Background Color
        </button>
        <button
          onClick={() => changeBackgroundColor('#ffffff')}
          className="px-4 py-2 bg-gray-500 text-white rounded-md"
        >
          Reset Background Color
        </button>
      </motion.div>

      {/* Read Text Button */}
      <motion.div
        className="text-to-speech mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        {isReading ? (
          <button
            onClick={stopTextToSpeech}
            className="px-6 py-2 bg-red-500 text-white rounded-md"
          >
            Stop Reading
          </button>
        ) : (
          <button
            onClick={handleTextToSpeech}
            className="px-6 py-2 bg-green-500 text-white rounded-md"
          >
            Read Text Aloud
          </button>
        )}
      </motion.div>

      <div className="mt-6">
        <p className="text-gray-500">
          <strong>Tip:</strong> You can adjust the text size and background to fit your needs.
        </p>
      </div>
    </div>
  );
};

export default SpecializedEReader;
