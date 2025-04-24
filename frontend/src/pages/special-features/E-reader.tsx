import { useState } from 'react';
import { motion } from 'framer-motion';

const SpecializedEReader = () => {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('Arial'); // Default font
  const [bgColor, setBgColor] = useState('#374151'); // Dark background color

  // Array of larger and easy-to-see fonts
  const accessibleFonts = [
    'Arial',
    'Verdana',
    'Tahoma',
    'Trebuchet MS',
    'Century Gothic',
    'Calibri',
    'Segoe UI',
    'Roboto',
    'Open Sans',
    'Georgia',
    'Dyslexie',
    'Comic Sans MS',
  ];

  // Function to handle text input
  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  // Adjust font size dynamically
  const increaseFontSize = () => {
    setFontSize((prev) => prev + 2);
  };
  const decreaseFontSize = () => {
    if (fontSize > 12) setFontSize((prev) => prev - 2);
  };

  // Change font family
  const changeFontFamily = (font) => {
    setFontFamily(font);
  };

  // Adjust background color
  const changeBackgroundColor = (color) => {
    setBgColor(color);
  };

  return (
    <div className="reader-container mt-8 p-6 bg-gray-800 rounded-xl border border-gray-700">
      <motion.h2
        className="text-3xl font-medium text-purple-300"
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
          className="w-full p-4 border-2 border-gray-600 rounded-lg mt-4 text-gray-100 bg-gray-700 focus:ring-purple-500 focus:border-purple-500"
          style={{ fontSize: `${fontSize}px`, fontFamily: fontFamily, backgroundColor: bgColor }}
        />
      </motion.div>

      {/* Controls Section */}
      <motion.div
        className="controls-section mt-6 flex flex-wrap gap-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <button
          onClick={increaseFontSize}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:ring-2 focus:ring-purple-400"
        >
          Increase Font Size
        </button>
        <button
          onClick={decreaseFontSize}
          className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:ring-2 focus:ring-purple-400"
        >
          Decrease Font Size
        </button>
        <div className="flex items-center">
          <label htmlFor="fontSelect" className="mr-2 text-gray-300">
            Font:
          </label>
          <select
            id="fontSelect"
            className="bg-gray-700 text-gray-100 border border-gray-600 rounded-md p-2 focus:ring-purple-500 focus:border-purple-500"
            value={fontFamily}
            onChange={(e) => changeFontFamily(e.target.value)}
          >
            {accessibleFonts.map((font) => (
              <option key={font} value={font}>
                {font}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={() => changeBackgroundColor('#4a5568')} // Slightly lighter dark color
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-400"
        >
          Change Background
        </button>
        <button
          onClick={() => changeBackgroundColor('#374151')} // Original dark color
          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:ring-2 focus:ring-gray-500"
        >
          Reset Background
        </button>
      </motion.div>

      <div className="mt-6 text-gray-500">
        <p>
          <strong>Tip:</strong> Experiment with different text sizes and fonts to find the most comfortable reading experience.
        </p>
      </div>
    </div>
  );
};

export default SpecializedEReader;